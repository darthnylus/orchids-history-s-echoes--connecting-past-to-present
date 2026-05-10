import express from 'express';
import Database from 'better-sqlite3';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3001;
const DB_PATH = join(__dirname, 'data', 'cms.db');

if (!existsSync(join(__dirname, 'data'))) mkdirSync(join(__dirname, 'data'));

// ── Load .env ──────────────────────────────────────────────────────────────────
const envPath = join(__dirname, '.env');
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const eq = line.indexOf('=');
    if (eq > 0) {
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim();
      if (key && !process.env[key]) process.env[key] = val.replace(/\\n/g, '\n');
    }
  });
}

// ── Anthropic client ───────────────────────────────────────────────────────────
function buildAnthropicClient() {
  const orchidsToken = process.env.ANTHROPIC_AUTH_TOKEN;
  const opts = { apiKey: orchidsToken || process.env.ANTHROPIC_API_KEY || '' };
  if (process.env.ANTHROPIC_BASE_URL) opts.baseURL = process.env.ANTHROPIC_BASE_URL;
  if (process.env.ANTHROPIC_CUSTOM_HEADERS) {
    const headers = {};
    process.env.ANTHROPIC_CUSTOM_HEADERS.split('\n').forEach(line => {
      const [k, ...v] = line.split(':');
      if (k && v.length) headers[k.trim()] = v.join(':').trim();
    });
    opts.defaultHeaders = headers;
  }
  return new Anthropic(opts);
}

// ── Database setup ─────────────────────────────────────────────────────────────
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS historical_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  civilization TEXT,
  time_period TEXT,
  location TEXT,
  short_summary TEXT,
  long_summary TEXT,
  key_figures TEXT,
  historical_significance TEXT,
  truth_vs_narrative TEXT,
  source_url TEXT,
  tags TEXT,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter_issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issue_title TEXT NOT NULL,
  main_topic_id INTEGER REFERENCES historical_topics(id),
  opening_hook TEXT,
  main_story TEXT,
  truth_vs_narrative_section TEXT,
  quote_section TEXT,
  call_to_action TEXT,
  publish_status TEXT DEFAULT 'draft',
  scheduled_date TEXT,
  published_date TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS twitter_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER REFERENCES historical_topics(id),
  post_type TEXT NOT NULL,
  hook TEXT,
  post_body TEXT,
  thread_content TEXT,
  hashtags TEXT,
  image_prompt TEXT,
  status TEXT DEFAULT 'draft',
  scheduled_date TEXT,
  published_date TEXT,
  engagement_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_text TEXT NOT NULL,
  attributed_to TEXT,
  historical_context TEXT,
  topic_id INTEGER REFERENCES historical_topics(id),
  image_prompt TEXT,
  tags TEXT,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS image_prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER REFERENCES historical_topics(id),
  prompt_title TEXT NOT NULL,
  image_prompt TEXT NOT NULL,
  style TEXT,
  mood TEXT,
  aspect_ratio TEXT DEFAULT '16:9',
  usage_type TEXT,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT,
  publication TEXT,
  source_url TEXT,
  source_type TEXT,
  related_topic_id INTEGER REFERENCES historical_topics(id),
  credibility_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_calendar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL,
  related_content_id INTEGER,
  platform TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// ── Seed sample data if empty ─────────────────────────────────────────────────
const topicCount = db.prepare('SELECT COUNT(*) as c FROM historical_topics').get();
if (topicCount.c === 0) {
  const insertTopic = db.prepare(`
    INSERT INTO historical_topics (title, category, civilization, time_period, location, short_summary, long_summary, key_figures, historical_significance, truth_vs_narrative, tags, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMany = db.transaction((topics) => {
    topics.forEach(t => insertTopic.run(...t));
  });
  insertMany([
    [
      'The Kingdom of Kush: Africa\'s First Superpower',
      'Ancient African Civilizations',
      'Kushite / Nubian',
      '785 BCE – 350 CE',
      'Meroe, modern Sudan',
      'The Kingdom of Kush preceded and outlasted several Egyptian dynasties, producing warrior queens, iron technology, and monumental architecture that rivaled anything in the ancient world.',
      'Kush, centered at Meroe in present-day Sudan, was one of the most powerful civilizations of the ancient world. The Kushites conquered Egypt and ruled as the 25th Dynasty (747–656 BCE). Their iron smelting technology spread across sub-Saharan Africa. The Meroitic script they developed remains only partially deciphered.',
      'King Piye, Taharqa, Amanirenas (warrior queen)',
      'The first African civilization to rule Egypt. Iron smelting hub of Africa. Matrilineal succession that produced warrior queens who fought Rome.',
      'Standard narratives place Kush as peripheral to Egyptian history. In reality, Kushite pharaohs ruled Egypt for nearly a century and built more pyramids than Egypt. The narrative of African civilization as derivative of Egyptian civilization ignores that Kush predates and outlasted it.',
      'Kush,Nubia,African Civilizations,Ancient History,Kings and Queens',
      'published'
    ],
    [
      'Mansa Musa\'s Pilgrimage: The Richest Man in History',
      'Kings and Queens',
      'Mali Empire',
      '1324 CE',
      'Mali to Mecca',
      'When Mansa Musa made his hajj in 1324, he brought so much gold that he crashed the Mediterranean economy. His empire controlled more than half the world\'s gold and salt supply.',
      'Mansa Musa I ruled the Mali Empire from 1312 to 1337. His pilgrimage to Mecca in 1324 included 60,000 people and 12,000 enslaved men each carrying 4 pounds of gold bars. He gave away so much gold in Cairo that he caused 12 years of inflation across North Africa and the Middle East.',
      'Mansa Musa, Sundiata Keita (empire founder)',
      'Mali Empire was the largest empire in West African history. Musa\'s wealth — estimated at $400 billion in today\'s terms — demonstrates the scale of pre-colonial African economic power.',
      'Western curricula present Africa before colonialism as impoverished and stateless. The Mali Empire at its height was larger than Western Europe and controlled global commodity markets.',
      'Mali Empire,Mansa Musa,Wealth,Gold,Pre-Colonial Africa',
      'published'
    ],
    [
      'The Dogon Astronomical Knowledge: Ancient Science Before Telescopes',
      'Hidden History',
      'Dogon People',
      'Unknown – documented 1931',
      'Mali, West Africa',
      'The Dogon of Mali possessed detailed knowledge of the Sirius star system — including Sirius B, a white dwarf invisible to the naked eye — centuries before Western astronomers confirmed its existence with telescopes.',
      'Anthropologists Marcel Griaule and Germaine Dieterlen documented in 1931 that the Dogon people of Mali possessed detailed knowledge of Sirius B (Po Tolo), including its 50-year orbital period, its density, and that it is the "smallest and heaviest of stars." Sirius B was not photographed until 1970.',
      'Griaule, Dieterlen (documenters), Dogon elder Ogotemmêli',
      'Demonstrates sophisticated astronomical knowledge in an African society without written records, challenging assumptions about the origins of scientific knowledge.',
      'Mainstream science struggled to explain Dogon knowledge of Sirius B. Attempts to dismiss it include claiming the knowledge was transmitted by European contact — ignoring that the Dogon\'s oral traditions describe knowledge passed down for generations.',
      'Dogon,Astronomy,Hidden History,Science,West Africa',
      'reviewed'
    ]
  ]);

  // Seed a newsletter
  db.prepare(`
    INSERT INTO newsletter_issues (issue_title, main_topic_id, opening_hook, main_story, call_to_action, publish_status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    'The Empire They Never Taught You About',
    2,
    'In 1324, one man\'s vacation crashed the global economy. His name was Mansa Musa, and he was the richest human being who has ever lived.',
    'The Mali Empire at its height stretched from the Atlantic coast to the bend of the Niger River — larger than Western Europe, richer than any kingdom in Europe or Asia at the time...',
    'Share this issue with someone who still thinks African history starts with slavery.',
    'draft'
  );

  // Seed a quote
  db.prepare(`
    INSERT INTO quotes (quote_text, attributed_to, historical_context, topic_id, tags, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    'I descended from the conquerors of Egypt. My people built the pyramids they now tell me to marvel at.',
    'Unknown — Composite of Kushite historical record',
    'The Kushite 25th Dynasty ruled Egypt from 747-656 BCE, building their own pyramid complexes at Meroe.',
    1,
    'Kush,Egypt,Identity,Reclamation',
    'draft'
  );
}

// ── Express app ────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// CORS for same-machine requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── STATS ──────────────────────────────────────────────────────────────────────
app.get('/cms/api/stats', (req, res) => {
  const stats = {
    topics: db.prepare('SELECT COUNT(*) as c FROM historical_topics').get().c,
    topics_published: db.prepare("SELECT COUNT(*) as c FROM historical_topics WHERE status='published'").get().c,
    newsletters: db.prepare('SELECT COUNT(*) as c FROM newsletter_issues').get().c,
    newsletters_draft: db.prepare("SELECT COUNT(*) as c FROM newsletter_issues WHERE publish_status='draft'").get().c,
    twitter_posts: db.prepare('SELECT COUNT(*) as c FROM twitter_posts').get().c,
    quotes: db.prepare('SELECT COUNT(*) as c FROM quotes').get().c,
    image_prompts: db.prepare('SELECT COUNT(*) as c FROM image_prompts').get().c,
    sources: db.prepare('SELECT COUNT(*) as c FROM sources').get().c,
    calendar_upcoming: db.prepare("SELECT COUNT(*) as c FROM content_calendar WHERE status='scheduled' AND scheduled_date >= date('now')").get().c,
  };
  res.json(stats);
});

// ── HISTORICAL TOPICS ──────────────────────────────────────────────────────────
app.get('/cms/api/topics', (req, res) => {
  const { category, status, search, civilization } = req.query;
  let sql = 'SELECT * FROM historical_topics WHERE 1=1';
  const params = [];
  if (category) { sql += ' AND category=?'; params.push(category); }
  if (status)   { sql += ' AND status=?'; params.push(status); }
  if (civilization) { sql += ' AND civilization LIKE ?'; params.push(`%${civilization}%`); }
  if (search)   {
    sql += ' AND (title LIKE ? OR short_summary LIKE ? OR tags LIKE ? OR key_figures LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  sql += ' ORDER BY updated_at DESC';
  res.json(db.prepare(sql).all(...params));
});

app.get('/cms/api/topics/:id', (req, res) => {
  const topic = db.prepare('SELECT * FROM historical_topics WHERE id=?').get(req.params.id);
  if (!topic) return res.status(404).json({ error: 'Not found' });
  res.json(topic);
});

app.post('/cms/api/topics', (req, res) => {
  const { title, category, civilization, time_period, location, short_summary, long_summary,
    key_figures, historical_significance, truth_vs_narrative, source_url, tags, status } = req.body;
  if (!title || !category) return res.status(400).json({ error: 'title and category required' });
  const r = db.prepare(`
    INSERT INTO historical_topics (title,category,civilization,time_period,location,short_summary,long_summary,key_figures,historical_significance,truth_vs_narrative,source_url,tags,status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(title,category,civilization,time_period,location,short_summary,long_summary,key_figures,historical_significance,truth_vs_narrative,source_url,tags,status||'draft');
  res.json({ success: true, id: r.lastInsertRowid });
});

app.put('/cms/api/topics/:id', (req, res) => {
  const { title, category, civilization, time_period, location, short_summary, long_summary,
    key_figures, historical_significance, truth_vs_narrative, source_url, tags, status } = req.body;
  db.prepare(`
    UPDATE historical_topics SET title=?,category=?,civilization=?,time_period=?,location=?,short_summary=?,long_summary=?,key_figures=?,historical_significance=?,truth_vs_narrative=?,source_url=?,tags=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?
  `).run(title,category,civilization,time_period,location,short_summary,long_summary,key_figures,historical_significance,truth_vs_narrative,source_url,tags,status,req.params.id);
  res.json({ success: true });
});

app.delete('/cms/api/topics/:id', (req, res) => {
  db.prepare('DELETE FROM historical_topics WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ── NEWSLETTER ISSUES ─────────────────────────────────────────────────────────
app.get('/cms/api/newsletters', (req, res) => {
  const { status } = req.query;
  let sql = `SELECT n.*, t.title as topic_title FROM newsletter_issues n LEFT JOIN historical_topics t ON n.main_topic_id=t.id WHERE 1=1`;
  const params = [];
  if (status) { sql += ' AND n.publish_status=?'; params.push(status); }
  sql += ' ORDER BY n.updated_at DESC';
  res.json(db.prepare(sql).all(...params));
});

app.get('/cms/api/newsletters/:id', (req, res) => {
  const n = db.prepare(`SELECT n.*, t.title as topic_title FROM newsletter_issues n LEFT JOIN historical_topics t ON n.main_topic_id=t.id WHERE n.id=?`).get(req.params.id);
  if (!n) return res.status(404).json({ error: 'Not found' });
  res.json(n);
});

app.post('/cms/api/newsletters', (req, res) => {
  const { issue_title, main_topic_id, opening_hook, main_story, truth_vs_narrative_section,
    quote_section, call_to_action, publish_status, scheduled_date } = req.body;
  if (!issue_title) return res.status(400).json({ error: 'issue_title required' });
  const r = db.prepare(`
    INSERT INTO newsletter_issues (issue_title,main_topic_id,opening_hook,main_story,truth_vs_narrative_section,quote_section,call_to_action,publish_status,scheduled_date)
    VALUES (?,?,?,?,?,?,?,?,?)
  `).run(issue_title,main_topic_id||null,opening_hook,main_story,truth_vs_narrative_section,quote_section,call_to_action,publish_status||'draft',scheduled_date||null);
  res.json({ success: true, id: r.lastInsertRowid });
});

app.put('/cms/api/newsletters/:id', (req, res) => {
  const { issue_title, main_topic_id, opening_hook, main_story, truth_vs_narrative_section,
    quote_section, call_to_action, publish_status, scheduled_date, published_date } = req.body;
  db.prepare(`
    UPDATE newsletter_issues SET issue_title=?,main_topic_id=?,opening_hook=?,main_story=?,truth_vs_narrative_section=?,quote_section=?,call_to_action=?,publish_status=?,scheduled_date=?,published_date=?,updated_at=CURRENT_TIMESTAMP WHERE id=?
  `).run(issue_title,main_topic_id||null,opening_hook,main_story,truth_vs_narrative_section,quote_section,call_to_action,publish_status,scheduled_date||null,published_date||null,req.params.id);
  res.json({ success: true });
});

app.delete('/cms/api/newsletters/:id', (req, res) => {
  db.prepare('DELETE FROM newsletter_issues WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ── TWITTER POSTS ─────────────────────────────────────────────────────────────
app.get('/cms/api/twitter', (req, res) => {
  const { status, post_type } = req.query;
  let sql = `SELECT p.*, t.title as topic_title FROM twitter_posts p LEFT JOIN historical_topics t ON p.topic_id=t.id WHERE 1=1`;
  const params = [];
  if (status)    { sql += ' AND p.status=?'; params.push(status); }
  if (post_type) { sql += ' AND p.post_type=?'; params.push(post_type); }
  sql += ' ORDER BY p.updated_at DESC';
  res.json(db.prepare(sql).all(...params));
});

app.get('/cms/api/twitter/:id', (req, res) => {
  const p = db.prepare(`SELECT p.*, t.title as topic_title FROM twitter_posts p LEFT JOIN historical_topics t ON p.topic_id=t.id WHERE p.id=?`).get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

app.post('/cms/api/twitter', (req, res) => {
  const { topic_id, post_type, hook, post_body, thread_content, hashtags, image_prompt,
    status, scheduled_date } = req.body;
  if (!post_type) return res.status(400).json({ error: 'post_type required' });
  const r = db.prepare(`
    INSERT INTO twitter_posts (topic_id,post_type,hook,post_body,thread_content,hashtags,image_prompt,status,scheduled_date)
    VALUES (?,?,?,?,?,?,?,?,?)
  `).run(topic_id||null,post_type,hook,post_body,thread_content,hashtags,image_prompt,status||'draft',scheduled_date||null);
  res.json({ success: true, id: r.lastInsertRowid });
});

app.put('/cms/api/twitter/:id', (req, res) => {
  const { topic_id, post_type, hook, post_body, thread_content, hashtags, image_prompt,
    status, scheduled_date, published_date, engagement_notes } = req.body;
  db.prepare(`
    UPDATE twitter_posts SET topic_id=?,post_type=?,hook=?,post_body=?,thread_content=?,hashtags=?,image_prompt=?,status=?,scheduled_date=?,published_date=?,engagement_notes=?,updated_at=CURRENT_TIMESTAMP WHERE id=?
  `).run(topic_id||null,post_type,hook,post_body,thread_content,hashtags,image_prompt,status,scheduled_date||null,published_date||null,engagement_notes,req.params.id);
  res.json({ success: true });
});

app.delete('/cms/api/twitter/:id', (req, res) => {
  db.prepare('DELETE FROM twitter_posts WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ── QUOTES ────────────────────────────────────────────────────────────────────
app.get('/cms/api/quotes', (req, res) => {
  const { status } = req.query;
  let sql = `SELECT q.*, t.title as topic_title FROM quotes q LEFT JOIN historical_topics t ON q.topic_id=t.id WHERE 1=1`;
  const params = [];
  if (status) { sql += ' AND q.status=?'; params.push(status); }
  sql += ' ORDER BY q.created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

app.get('/cms/api/quotes/:id', (req, res) => {
  const q = db.prepare('SELECT * FROM quotes WHERE id=?').get(req.params.id);
  if (!q) return res.status(404).json({ error: 'Not found' });
  res.json(q);
});

app.post('/cms/api/quotes', (req, res) => {
  const { quote_text, attributed_to, historical_context, topic_id, image_prompt, tags, status } = req.body;
  if (!quote_text) return res.status(400).json({ error: 'quote_text required' });
  const r = db.prepare(`
    INSERT INTO quotes (quote_text,attributed_to,historical_context,topic_id,image_prompt,tags,status)
    VALUES (?,?,?,?,?,?,?)
  `).run(quote_text,attributed_to,historical_context,topic_id||null,image_prompt,tags,status||'draft');
  res.json({ success: true, id: r.lastInsertRowid });
});

app.put('/cms/api/quotes/:id', (req, res) => {
  const { quote_text, attributed_to, historical_context, topic_id, image_prompt, tags, status } = req.body;
  db.prepare(`
    UPDATE quotes SET quote_text=?,attributed_to=?,historical_context=?,topic_id=?,image_prompt=?,tags=?,status=? WHERE id=?
  `).run(quote_text,attributed_to,historical_context,topic_id||null,image_prompt,tags,status,req.params.id);
  res.json({ success: true });
});

app.delete('/cms/api/quotes/:id', (req, res) => {
  db.prepare('DELETE FROM quotes WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ── IMAGE PROMPTS ─────────────────────────────────────────────────────────────
app.get('/cms/api/image-prompts', (req, res) => {
  const { status, style } = req.query;
  let sql = `SELECT p.*, t.title as topic_title FROM image_prompts p LEFT JOIN historical_topics t ON p.topic_id=t.id WHERE 1=1`;
  const params = [];
  if (status) { sql += ' AND p.status=?'; params.push(status); }
  if (style)  { sql += ' AND p.style=?'; params.push(style); }
  sql += ' ORDER BY p.created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

app.get('/cms/api/image-prompts/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM image_prompts WHERE id=?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

app.post('/cms/api/image-prompts', (req, res) => {
  const { topic_id, prompt_title, image_prompt, style, mood, aspect_ratio, usage_type, status } = req.body;
  if (!prompt_title || !image_prompt) return res.status(400).json({ error: 'prompt_title and image_prompt required' });
  const r = db.prepare(`
    INSERT INTO image_prompts (topic_id,prompt_title,image_prompt,style,mood,aspect_ratio,usage_type,status)
    VALUES (?,?,?,?,?,?,?,?)
  `).run(topic_id||null,prompt_title,image_prompt,style,mood,aspect_ratio||'16:9',usage_type,status||'draft');
  res.json({ success: true, id: r.lastInsertRowid });
});

app.put('/cms/api/image-prompts/:id', (req, res) => {
  const { topic_id, prompt_title, image_prompt, style, mood, aspect_ratio, usage_type, status } = req.body;
  db.prepare(`
    UPDATE image_prompts SET topic_id=?,prompt_title=?,image_prompt=?,style=?,mood=?,aspect_ratio=?,usage_type=?,status=? WHERE id=?
  `).run(topic_id||null,prompt_title,image_prompt,style,mood,aspect_ratio,usage_type,status,req.params.id);
  res.json({ success: true });
});

app.delete('/cms/api/image-prompts/:id', (req, res) => {
  db.prepare('DELETE FROM image_prompts WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ── SOURCES ───────────────────────────────────────────────────────────────────
app.get('/cms/api/sources', (req, res) => {
  const { source_type } = req.query;
  let sql = `SELECT s.*, t.title as topic_title FROM sources s LEFT JOIN historical_topics t ON s.related_topic_id=t.id WHERE 1=1`;
  const params = [];
  if (source_type) { sql += ' AND s.source_type=?'; params.push(source_type); }
  sql += ' ORDER BY s.created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

app.post('/cms/api/sources', (req, res) => {
  const { title, author, publication, source_url, source_type, related_topic_id, credibility_notes } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const r = db.prepare(`
    INSERT INTO sources (title,author,publication,source_url,source_type,related_topic_id,credibility_notes)
    VALUES (?,?,?,?,?,?,?)
  `).run(title,author,publication,source_url,source_type,related_topic_id||null,credibility_notes);
  res.json({ success: true, id: r.lastInsertRowid });
});

app.put('/cms/api/sources/:id', (req, res) => {
  const { title, author, publication, source_url, source_type, related_topic_id, credibility_notes } = req.body;
  db.prepare(`
    UPDATE sources SET title=?,author=?,publication=?,source_url=?,source_type=?,related_topic_id=?,credibility_notes=? WHERE id=?
  `).run(title,author,publication,source_url,source_type,related_topic_id||null,credibility_notes,req.params.id);
  res.json({ success: true });
});

app.delete('/cms/api/sources/:id', (req, res) => {
  db.prepare('DELETE FROM sources WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ── CONTENT CALENDAR ──────────────────────────────────────────────────────────
app.get('/cms/api/calendar', (req, res) => {
  const { platform, status, from, to } = req.query;
  let sql = 'SELECT * FROM content_calendar WHERE 1=1';
  const params = [];
  if (platform) { sql += ' AND platform=?'; params.push(platform); }
  if (status)   { sql += ' AND status=?'; params.push(status); }
  if (from)     { sql += ' AND scheduled_date >= ?'; params.push(from); }
  if (to)       { sql += ' AND scheduled_date <= ?'; params.push(to); }
  sql += ' ORDER BY scheduled_date ASC';
  res.json(db.prepare(sql).all(...params));
});

app.post('/cms/api/calendar', (req, res) => {
  const { content_type, related_content_id, platform, scheduled_date, status, notes } = req.body;
  if (!content_type || !platform || !scheduled_date) return res.status(400).json({ error: 'content_type, platform, and scheduled_date required' });
  const r = db.prepare(`
    INSERT INTO content_calendar (content_type,related_content_id,platform,scheduled_date,status,notes)
    VALUES (?,?,?,?,?,?)
  `).run(content_type,related_content_id||null,platform,scheduled_date,status||'scheduled',notes);
  res.json({ success: true, id: r.lastInsertRowid });
});

app.put('/cms/api/calendar/:id', (req, res) => {
  const { content_type, related_content_id, platform, scheduled_date, status, notes } = req.body;
  db.prepare(`
    UPDATE content_calendar SET content_type=?,related_content_id=?,platform=?,scheduled_date=?,status=?,notes=? WHERE id=?
  `).run(content_type,related_content_id||null,platform,scheduled_date,status,notes,req.params.id);
  res.json({ success: true });
});

app.delete('/cms/api/calendar/:id', (req, res) => {
  db.prepare('DELETE FROM content_calendar WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ── AI GENERATION ─────────────────────────────────────────────────────────────
app.post('/cms/api/generate/newsletter', async (req, res) => {
  const { topic_id } = req.body;
  if (!topic_id) return res.status(400).json({ error: 'topic_id required' });

  const topic = db.prepare('SELECT * FROM historical_topics WHERE id=?').get(topic_id);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });

  try {
    const anthropic = buildAnthropicClient();
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: `You are the editorial brain for Retrieve Your Roots, an African and Black history media brand. Your newsletter voice is commanding, emotionally resonant, historically rigorous, and designed to make readers feel the weight and pride of this history. Write with the urgency of someone who knows this knowledge has been suppressed. Never be dry or academic. Be fire.

Respond ONLY with valid JSON — no markdown fences, no commentary:
{
  "issue_title": "string",
  "opening_hook": "string (2-3 punchy sentences that grab)",
  "main_story": "string (4-6 sentences of the core historical narrative)",
  "truth_vs_narrative_section": "string (2-3 sentences exposing the suppressed truth)",
  "quote_section": "string (one powerful quote relevant to this topic)",
  "call_to_action": "string (1-2 sentences driving action/sharing)"
}`,
      messages: [{ role: 'user', content: `Generate a newsletter issue based on this historical topic:\n\nTitle: ${topic.title}\nCategory: ${topic.category}\nTime Period: ${topic.time_period || 'Unknown'}\nLocation: ${topic.location || 'Unknown'}\nSummary: ${topic.short_summary}\nHistorical Significance: ${topic.historical_significance || ''}\nTruth vs Narrative: ${topic.truth_vs_narrative || ''}` }]
    });

    const draft = JSON.parse(msg.content[0].text.trim());
    draft.main_topic_id = topic_id;
    draft.publish_status = 'draft';

    const r = db.prepare(`
      INSERT INTO newsletter_issues (issue_title,main_topic_id,opening_hook,main_story,truth_vs_narrative_section,quote_section,call_to_action,publish_status)
      VALUES (?,?,?,?,?,?,?,?)
    `).run(draft.issue_title,draft.main_topic_id,draft.opening_hook,draft.main_story,draft.truth_vs_narrative_section,draft.quote_section,draft.call_to_action,'draft');

    res.json({ success: true, id: r.lastInsertRowid, draft });
  } catch (err) {
    console.error('Newsletter gen error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/cms/api/generate/twitter', async (req, res) => {
  const { topic_id, post_type } = req.body;
  if (!topic_id) return res.status(400).json({ error: 'topic_id required' });

  const topic = db.prepare('SELECT * FROM historical_topics WHERE id=?').get(topic_id);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });

  const type = post_type || 'thread';

  try {
    const anthropic = buildAnthropicClient();
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: `You are the social media voice for Retrieve Your Roots, an African and Black history brand on X/Twitter. Your posts are punchy, historically precise, and designed to go viral by making people feel the weight of suppressed history. Use plain text, no hashtag spam, maximum 3 hashtags. Make every word count.

Respond ONLY with valid JSON — no markdown fences:
{
  "hook": "string (the first sentence that stops the scroll)",
  "post_body": "string (the full post body, max 280 chars for single post)",
  "thread_content": "string (for threads: numbered tweets separated by \\n\\n, each under 280 chars)",
  "hashtags": "string (2-3 hashtags separated by spaces)",
  "image_prompt": "string (cinematic image generation prompt for this post)"
}`,
      messages: [{ role: 'user', content: `Generate a ${type} X/Twitter post about this topic:\n\nTitle: ${topic.title}\nCategory: ${topic.category}\nSummary: ${topic.short_summary}\nSignificance: ${topic.historical_significance || ''}\nTruth vs Narrative: ${topic.truth_vs_narrative || ''}` }]
    });

    const draft = JSON.parse(msg.content[0].text.trim());

    const r = db.prepare(`
      INSERT INTO twitter_posts (topic_id,post_type,hook,post_body,thread_content,hashtags,image_prompt,status)
      VALUES (?,?,?,?,?,?,?,?)
    `).run(topic_id,type,draft.hook,draft.post_body,draft.thread_content,draft.hashtags,draft.image_prompt,'draft');

    res.json({ success: true, id: r.lastInsertRowid, draft });
  } catch (err) {
    console.error('Twitter gen error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[CMS] Running on http://localhost:${PORT}`);
  console.log(`[CMS] Dashboard: http://localhost:${PORT}/cms-dashboard.html`);
});
