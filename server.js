import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app      = express();
const PORT     = 3000;
const DATA_DIR = join(__dirname, 'data');
const ARTICLES = join(DATA_DIR, 'articles.json');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR);
if (!existsSync(ARTICLES)) writeFileSync(ARTICLES, JSON.stringify({ events: {} }, null, 2));

app.use(express.json());
app.use(express.static(__dirname));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const monthName = MONTHS[month - 1];

  const userPrompt = context
    ? `Generate a Black history article for ${monthName} ${day}. Additional context: ${context}`
    : `Generate the single most historically significant Black history event that occurred on ${monthName} ${day}. If multiple strong candidates exist, prefer the one with the clearest present-day causal chain.`;

  try {
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
    res.status(500).json({ error: err.message });
  }
});

// ── SAVE ARTICLE ───────────────────────────────────────────────────────────────
app.post('/api/save', (req, res) => {
  const { article } = req.body;
  if (!article) return res.status(400).json({ error: 'article required' });

  const db   = JSON.parse(readFileSync(ARTICLES, 'utf8'));
  const key  = `${article.month}-${article.day}`;
  const slot = db.events[key] || [];

  // Replace if same year already exists, otherwise append
  const idx = slot.findIndex(e => e.year === article.year);
  if (idx >= 0) slot[idx] = article;
  else slot.unshift(article);        // new articles lead the day

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
