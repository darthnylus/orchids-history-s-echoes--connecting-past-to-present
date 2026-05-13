import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env file into process.env if present
const envPath = join(__dirname, '.env');
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const eq = line.indexOf('=');
    if (eq > 0) {
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim();
      if (key && !process.env[key]) {
        // Unescape \\n back to real newlines for multi-line vars
        process.env[key] = val.replace(/\\n/g, '\n');
      }
    }
  });
}
const app      = express();
const PORT     = 3000;
const DATA_DIR = join(__dirname, 'data');
const ARTICLES = join(DATA_DIR, 'articles.json');
const CONFIG   = join(DATA_DIR, 'config.json');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR);
if (!existsSync(ARTICLES)) writeFileSync(ARTICLES, JSON.stringify({ events: {} }, null, 2));
if (!existsSync(CONFIG))   writeFileSync(CONFIG,   JSON.stringify({ apiKey: '' }, null, 2));

app.use(express.json());

// Redirect root to homepage — must come before static middleware
app.get('/', (_req, res) => res.redirect(301, '/home.html'));

app.use(express.static(__dirname));

// ── Resolve API key: Orchids proxy token > env var > persisted config ──────────
function getApiKey() {
  if (process.env.ANTHROPIC_AUTH_TOKEN) return process.env.ANTHROPIC_AUTH_TOKEN;
  if (process.env.ANTHROPIC_API_KEY)    return process.env.ANTHROPIC_API_KEY;
  try {
    const cfg = JSON.parse(readFileSync(CONFIG, 'utf8'));
    return cfg.apiKey || '';
  } catch { return ''; }
}

function buildAnthropicClient() {
  // In Orchids, always use the injected proxy — never the user-supplied sk-ant- key
  const orchidsToken = process.env.ANTHROPIC_AUTH_TOKEN;
  const opts = { apiKey: orchidsToken || getApiKey() };
  if (process.env.ANTHROPIC_BASE_URL) opts.baseURL = process.env.ANTHROPIC_BASE_URL;
  if (process.env.ANTHROPIC_CUSTOM_HEADERS) {
    const headers = {};
    process.env.ANTHROPIC_CUSTOM_HEADERS.split('\n').forEach(line => {
      const [k, ...v] = line.split(':');
      if (k && v.length) headers[k.trim()] = v.join(':').trim();
    });
    opts.defaultHeaders = headers;
  }
  console.log('[DEBUG] Client opts:', JSON.stringify({ ...opts, apiKey: opts.apiKey?.slice(0,12) + '...' }));
  return new Anthropic(opts);
}

// ── SAVE / GET API KEY ─────────────────────────────────────────────────────────
app.post('/api/config/key', (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey || !apiKey.startsWith('sk-ant-')) {
    return res.status(400).json({ error: 'Invalid key — must start with sk-ant-' });
  }
  const cfg = JSON.parse(readFileSync(CONFIG, 'utf8'));
  cfg.apiKey = apiKey;
  writeFileSync(CONFIG, JSON.stringify(cfg, null, 2));
  res.json({ success: true });
});

app.get('/api/config/key-status', (_req, res) => {
  const orchidsToken = process.env.ANTHROPIC_AUTH_TOKEN;
  if (orchidsToken) return res.json({ configured: true, preview: 'Orchids proxy (auto)' });
  const key = getApiKey();
  res.json({ configured: !!key, preview: key ? `sk-ant-...${key.slice(-4)}` : null });
});

// ── SYSTEM PROMPT ──────────────────────────────────────────────────────────────
const SYSTEM = `You are a historian and editor for Chain, a digital platform tracing African and Black history through causal threads from ancient Africa to present-day America. Your writing is rigorous, primary-source-grounded, and always answers: what caused this? what did it cause?

When asked to generate a historical event article, respond ONLY with valid JSON — no markdown fences, no commentary. Follow this exact schema:

{
  "year": 1965,
  "type": "Policy · Federal Law",
  "cat": "policy",
  "title": "Short, direct title (max 90 chars) — no clickbait",
  "summary": "2–3 sentences. What happened, who was involved, primary-source detail. Precise, not padded.",
  "chain": "1–2 sentences. The direct causal consequence traceable to the present day.",
  "thread": "thread-slug.html or null if no matching thread exists"
}

Categories for "cat": event | policy | person | document
Categories for "type": follow the pattern "Category · Subcategory" e.g. "Event · Massacre", "Policy · Amendment", "Person · Birth", "Document · Letter"

Valid thread slugs (only use these exact values or null):
thread-end-of-slavery.html, thread-reconstruction.html, thread-redlining.html, thread-mlk.html,
thread-cointelpro.html, thread-voting-rights.html, thread-great-migration.html, thread-gi-bill.html,
thread-freedom-riders.html, thread-convict-leasing.html, thread-slave-revolts.html,
thread-we-refuse.html, thread-george-floyd.html, thread-abolitionism.html, thread-police.html,
thread-fear-of-black-assembly.html, thread-mexico-freedom.html, thread-slave-ship-resistance.html

If you are unsure of a date's history, still generate the single most historically significant Black history event you can confirm occurred on that date. Never fabricate citations or invent events — only use documented history.`;

// ── GENERATE ARTICLE ───────────────────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  const { month, day, context } = req.body;
  if (!month || !day) return res.status(400).json({ error: 'month and day required' });

  const key = process.env.ANTHROPIC_AUTH_TOKEN || getApiKey();
  if (!key) return res.status(401).json({ error: 'NO_API_KEY', message: 'Anthropic API key not configured. Add it in Settings.' });

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const monthName = MONTHS[month - 1];

  const userPrompt = context
    ? `Generate a Black history article for ${monthName} ${day}. Additional context: ${context}`
    : `Generate the single most historically significant Black history event that occurred on ${monthName} ${day}. If multiple strong candidates exist, prefer the one with the clearest present-day causal chain.`;

  try {
    const anthropic = buildAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const raw = message.content[0].text.trim();
    const article = JSON.parse(raw);
    article.month = month;
    article.day   = day;

    res.json({ success: true, article });
  } catch (err) {
    console.error('Generate error:', err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
});

// ── SAVE ARTICLE ───────────────────────────────────────────────────────────────
app.post('/api/save', (req, res) => {
  const { article } = req.body;
  if (!article) return res.status(400).json({ error: 'article required' });

  const db   = JSON.parse(readFileSync(ARTICLES, 'utf8'));
  const key  = `${article.month}-${article.day}`;
  const slot = db.events[key] || [];

  const idx = slot.findIndex(e => e.year === article.year);
  if (idx >= 0) slot[idx] = article;
  else slot.unshift(article);

  db.events[key] = slot;
  db.lastUpdated  = new Date().toISOString();

  writeFileSync(ARTICLES, JSON.stringify(db, null, 2));
  res.json({ success: true, key });
});

// ── DELETE ARTICLE ─────────────────────────────────────────────────────────────
app.delete('/api/article', (req, res) => {
  const { month, day, year } = req.body;
  const db  = JSON.parse(readFileSync(ARTICLES, 'utf8'));
  const key = `${month}-${day}`;
  if (db.events[key]) {
    db.events[key] = db.events[key].filter(e => e.year !== year);
    if (!db.events[key].length) delete db.events[key];
    writeFileSync(ARTICLES, JSON.stringify(db, null, 2));
  }
  res.json({ success: true });
});

// ── GET ALL ARTICLES ───────────────────────────────────────────────────────────
app.get('/api/articles', (_req, res) => {
  const db = JSON.parse(readFileSync(ARTICLES, 'utf8'));
  res.json(db);
});

// ── GET TODAY'S ARTICLES ───────────────────────────────────────────────────────
app.get('/api/today', (_req, res) => {
  const db    = JSON.parse(readFileSync(ARTICLES, 'utf8'));
  const now   = new Date();
  const key   = `${now.getMonth() + 1}-${now.getDate()}`;
  const events = db.events[key] || [];
  res.json({ key, events });
});

app.listen(PORT, () => console.log(`Chain server running on http://localhost:${PORT}`));
