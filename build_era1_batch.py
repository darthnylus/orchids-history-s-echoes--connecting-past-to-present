exec(open('/home/user/app/build_threads.py').read())

acc   = '#b8972a'
acc_lt= '#f0c84a'
hero_bg='#100e04'

# ── 1. MANSA MUSA & THE MALI EMPIRE ──────────────────────────────────────────
make(
  filename='/home/user/app/thread-mansa-musa.html',
  acc=acc, acc_lt=acc_lt, hero_bg=hero_bg,
  kicker='African Origins · Mali Empire · c. 1280–1337 CE',
  title_html='Mansa Musa:<br /><em>The Richest Person Who Ever Lived</em>',
  subtitle='He ruled an empire producing half the world\'s gold. His 1324 pilgrimage to Mecca crashed the Egyptian economy for a decade. History textbooks give him a footnote.',
  meta_items=[
    ('Era','African Origins'),
    ('Dates','c. 1280 – 1337 CE'),
    ('Empire','Mali Empire, West Africa'),
    ('Significance','Wealthiest individual in recorded history'),
  ],
  central_arg='Mansa Musa\'s Mali Empire was one of the largest, wealthiest, and most sophisticated states on earth. His erasure from Western curricula is not an oversight — it is a deliberate compression of African history into slavery and poverty.',
  entries_html="""
<div class="entry-item" id="e1">
  <div class="entry-item__header">
    <div class="entry-item__num">1</div>
    <div><div class="entry-item__dates">c. 1235 CE</div>
    <h2 class="entry-item__name">Sundiata Keita Founds the Mali Empire on the Ruins of Ghana</h2>
    <div class="entry-item__location">Niani, West Africa</div></div>
  </div>
  <div class="entry-item__body">
    <p>The Mali Empire does not begin with Mansa Musa. It begins with <strong>Sundiata Keita</strong> — the "Lion King," a figure so mythologized that the Mande oral tradition still recites his story in full-night performances called <em>griotic epics</em>. Sundiata defeated the Sosso king Sumanguru Kante at the Battle of Kirina around 1235 CE, uniting the fractured successor states of the Ghana Empire into a centralized federation.</p>
    <p>The empire Sundiata built stretched from the Atlantic coast to the bend of the Niger River — an area roughly the size of Western Europe. It controlled the three pillars of medieval West African wealth: <strong>gold</strong> from the Bambuk and Bure mines, <strong>salt</strong> from the Saharan deposits at Taghaza, and <strong>kola nuts</strong> traded north into the Sahara and east across the continent. Every caravan crossing the western Sahara paid Mali a toll.</p>
    <div class="entry-stats">
      <div><div class="entry-stat__num">400,000+</div><div class="entry-stat__label">Square miles at peak</div></div>
      <div><div class="entry-stat__num">~1235</div><div class="entry-stat__label">Year of founding</div></div>
      <div><div class="entry-stat__num">3</div><div class="entry-stat__label">Commodity monopolies: gold, salt, kola</div></div>
    </div>
    <p>The empire was not a conquest state alone. Sundiata established the <strong>Kouroukan Fouga</strong> — a constitution, an oral charter of governance, rights, and social obligations that predates the Magna Carta by decades. It codified rules on trade, slavery (restricted to prisoners of war), the rights of women, and protections for the environment. It is one of the earliest human rights documents in history.</p>
  </div>
</div>

<div class="entry-item" id="e2">
  <div class="entry-item__header">
    <div class="entry-item__num">2</div>
    <div><div class="entry-item__dates">c. 1280 – 1312 CE</div>
    <h2 class="entry-item__name">Before Musa: Eight Mansas Build the Infrastructure of Empire</h2>
    <div class="entry-item__location">Niani to Timbuktu</div></div>
  </div>
  <div class="entry-item__body">
    <p>Mansa Musa is the ninth ruler of Mali. His predecessors — including the brilliant <strong>Mansa Sakura</strong>, a freed slave who seized the throne and expanded the empire through military genius — built the trade infrastructure, the administrative systems, and the military dominance that Musa inherited. The story of Musa only makes sense against this backdrop.</p>
    <p>By the time Musa takes the throne around 1312, Mali controls an empire of roughly <strong>400,000 to 500,000 square miles</strong>, with a population of perhaps 20 million people. The Niger River serves as its highway. Cities like <strong>Timbuktu, Djenné, and Gao</strong> are not outposts — they are metropolises. Timbuktu alone has a population of 100,000 at a time when London has 50,000.</p>
    <div class="pullquote">
      <p>"There is no king in the whole of the world more powerful, richer, more fortunate, more feared by his enemies, and more able to do good to those around him."</p>
      <cite>— Ibn Khaldun, Arab historian, writing about Mansa Musa, 14th century</cite>
    </div>
    <p>The gold mines of <strong>Bambuk and Bure</strong> produce an estimated 50% of the world's gold supply during this period. Mali doesn't just mine gold — it controls who gets gold. Every gram exported north through the Sahara passes through Mali's customs system. The empire is effectively the Federal Reserve of the medieval world.</p>
  </div>
</div>

<div class="entry-item" id="e3">
  <div class="entry-item__header">
    <div class="entry-item__num">3</div>
    <div><div class="entry-item__dates">1324 CE</div>
    <h2 class="entry-item__name">The Hajj: Mansa Musa Leaves for Mecca and Crashes the Global Economy</h2>
    <div class="entry-item__location">Mali → Egypt → Mecca</div></div>
  </div>
  <div class="entry-item__body">
    <p>In 1324, Mansa Musa undertakes the <em>hajj</em> — the pilgrimage to Mecca required of all Muslims. He does not travel quietly. His entourage numbers somewhere between <strong>60,000 and 100,000 people</strong> — soldiers, officials, enslaved servants, and 12,000 enslaved women. He brings 80 to 100 camels, each carrying 300 pounds of gold. He brings 500 enslaved men, each carrying a gold staff weighing 6 pounds.</p>
    <p>He spends extravagantly at every stop. In Cairo, he gives away so much gold — to officials, beggars, merchants, anyone who approaches him — that he <strong>devalues the Egyptian currency for the next 12 years</strong>. Gold, suddenly superabundant, loses its purchasing power across the Mediterranean economy. Arab historians document the inflation in careful detail. The Cairo markets collapse. Merchants who had stable businesses for decades are ruined.</p>
    <div class="entry-stats">
      <div><div class="entry-stat__num">60,000+</div><div class="entry-stat__label">People in his entourage</div></div>
      <div><div class="entry-stat__num">12</div><div class="entry-stat__label">Years Egyptian economy destabilized</div></div>
      <div><div class="entry-stat__num">~$400B</div><div class="entry-stat__label">Estimated modern equivalent wealth</div></div>
    </div>
    <p>European cartographers take note. A 1375 <strong>Catalan Atlas</strong> — one of the most important maps of the medieval world — depicts Mansa Musa seated on a throne at the center of Africa, holding a gold nugget, with the caption: <em>"This lord of the Blacks is called Musse Melly… so abundant is the gold which is found in his country."</em> For a brief moment, Europe knows exactly who controls the world's wealth.</p>
  </div>
</div>

<div class="entry-item" id="e4">
  <div class="entry-item__header">
    <div class="entry-item__num">4</div>
    <div><div class="entry-item__dates">1324 – 1337 CE</div>
    <h2 class="entry-item__name">Timbuktu: Musa Builds a University City That Rivals Europe's Best</h2>
    <div class="entry-item__location">Timbuktu, Mali</div></div>
  </div>
  <div class="entry-item__body">
    <p>On his return from Mecca, Musa brings back the renowned Andalusian architect <strong>Abu Ishaq al-Sahili</strong> and commissions a building campaign that transforms Timbuktu into the intellectual capital of the known world. He builds the <strong>Djinguereber Mosque</strong> — still standing today — and funds the expansion of the <strong>Sankore Mosque</strong> into a full university.</p>
    <p>At its height, the <strong>University of Sankore</strong> enrolls 25,000 students out of a city population of 100,000 — a higher ratio of students to population than any European university of the era. Scholars come from across the Islamic world — Egypt, Morocco, Persia — to study theology, mathematics, astronomy, history, and law. The university produces works on <strong>surgery, astronomy, and constitutional law</strong> centuries before those fields were formalized in Europe.</p>
    <div class="pullquote">
      <p>"In Timbuktu there are numerous judges, doctors, and clerics, all receiving good salaries from the king. Books and manuscripts are imported from Barbary and sold for more money than any other merchandise."</p>
      <cite>— Leo Africanus, traveler and writer, c. 1526</cite>
    </div>
    <p>The libraries of Timbuktu accumulate between <strong>400,000 and 700,000 manuscripts</strong>. They are still being catalogued today. When jihadists destroyed thousands of them in 2012, scholars scrambled to recover digital copies they had been quietly archiving for years. The manuscripts that survived are stored in family libraries across Mali — a private, distributed archive that outlasted every attempt to erase it.</p>
  </div>
</div>

<div class="entry-item" id="e5">
  <div class="entry-item__header">
    <div class="entry-item__num">5</div>
    <div><div class="entry-item__dates">1337 – 1600 CE</div>
    <h2 class="entry-item__name">The Decline: Succession Wars, Tuareg Raids, and the Songhai Succession</h2>
    <div class="entry-item__location">West Africa</div></div>
  </div>
  <div class="entry-item__body">
    <p>Musa dies around 1337. The empire he leaves is vast but fragile — held together by his personal authority, the prestige of his pilgrimage, and the gold revenues that let him pay for loyalty. His successors are weaker. <strong>Succession disputes</strong> fragment the ruling class. <strong>Tuareg raiders</strong> attack from the north, seizing Timbuktu in 1433. The Mossi kingdoms press from the south and east.</p>
    <p>By 1468, the <strong>Songhai Empire</strong> under Sunni Ali captures Timbuktu. Mali doesn't collapse overnight — it lingers as a regional power for another century — but its dominance is over. The empire that produced the richest person in recorded history is absorbed by its successor without a catastrophic final battle. It simply outgrows its administrative capacity and fractures.</p>
    <p>This matters for the story of the transatlantic slave trade: when Portuguese slavers begin probing the West African coast in the late 15th century, they are not encountering a weak, primitive society easily overwhelmed. They are encountering the fragmented aftermath of one of the most sophisticated civilizations on earth, still adjusting to a century of instability. The chaos of post-Mali succession is part of what made large-scale enslaving raids possible. Weakness was manufactured by history, not inherent.</p>
  </div>
</div>

<div class="entry-item" id="e6">
  <div class="entry-item__header">
    <div class="entry-item__num">6</div>
    <div><div class="entry-item__dates">1700s – Present</div>
    <h2 class="entry-item__name">The Erasure: How the Richest Man in History Became a Footnote</h2>
    <div class="entry-item__location">Europe, United States</div></div>
  </div>
  <div class="entry-item__body">
    <p>The 1375 Catalan Atlas knew who Mansa Musa was. Medieval Arab historians like <strong>Ibn Battuta, Ibn Khaldun, and al-Umari</strong> wrote detailed accounts of his empire. He was not hidden. He was known. The decision to exclude him from Western education is not ignorance — it is a choice made over several centuries as the ideology of white supremacy required Africa to have no history of its own.</p>
    <p>The argument that justified the transatlantic slave trade required that enslaved Africans come from a continent with no civilization, no governance, no intellectual tradition — a continent of savagery that Europeans were, in some readings, rescuing people from. <strong>Mansa Musa directly disproves this argument</strong>. So he was removed. The Catalan Atlas still exists. The Ibn Khaldun texts still exist. The Sankore manuscripts still exist. None of it made it into the standard American history curriculum.</p>
    <div class="pullquote">
      <p>"The history of Africa is the history of the world. Africa is not a footnote to Western civilization — Western civilization is, in many ways, a footnote to Africa."</p>
      <cite>— Cheikh Anta Diop, historian and anthropologist</cite>
    </div>
    <p>In 2019, a viral social media thread about Mansa Musa's wealth — estimating it at the equivalent of $400 billion in today's money — reached millions of people who had never heard his name in school. The response was shock, not curiosity. The shock is the point. The gap between what people know and what the historical record contains is not an accident. It is infrastructure — built to serve a purpose, maintained because the purpose persists.</p>
  </div>
</div>
""",
  sidebar_html="""
<div class="sidebar-card">
  <div class="sidebar-card__title">Key Figures</div>
  <div class="sidebar-card__body">
    <strong>Mansa Musa I</strong> (c. 1280–1337) — Ninth mansa of Mali; hajj of 1324 destabilized Mediterranean gold markets for 12 years.<br/><br/>
    <strong>Sundiata Keita</strong> (c. 1217–1255) — Founded the Mali Empire; author of the Kouroukan Fouga constitution.<br/><br/>
    <strong>Abu Ishaq al-Sahili</strong> — Andalusian architect brought back from Mecca; designed Djinguereber Mosque.<br/><br/>
    <strong>Ibn Battuta</strong> — Moroccan traveler who visited Mali in 1352 and left the most detailed eyewitness account of the empire.
  </div>
</div>
<div class="sidebar-card">
  <div class="sidebar-card__title">The Numbers</div>
  <div class="sidebar-card__body">
    <strong>~$400 billion</strong> — estimated modern equivalent of Musa's wealth (Money magazine, 2012)<br/><br/>
    <strong>50%</strong> — share of world gold supply controlled by Mali<br/><br/>
    <strong>25,000</strong> — students at University of Sankore<br/><br/>
    <strong>700,000</strong> — manuscripts in Timbuktu libraries<br/><br/>
    <strong>12 years</strong> — duration of Egyptian inflation caused by Musa's hajj spending
  </div>
</div>
<div class="sidebar-card">
  <div class="sidebar-card__title">Primary Sources</div>
  <div class="sidebar-card__body">
    Al-Umari's <em>Masalik al-Absar</em> (1337) — Cairo scholar's account of Musa's visit<br/><br/>
    Ibn Battuta's <em>Rihla</em> (1355) — eyewitness travel account of Mali<br/><br/>
    Ibn Khaldun's <em>Muqaddimah</em> (1377) — historical analysis of the Saharan empires<br/><br/>
    The 1375 <em>Catalan Atlas</em> — European cartographic record depicting Musa
  </div>
</div>
""",
  cta_eyebrow='The Wealth Preceded the Wound',
  cta_title='The richest empire on earth. The next thread explains how it was dismantled.',
  cta_sub='Mali\'s gold funded Islamic scholarship, constitutional governance, and a university city. Then the slave trade drained the continent of 12 million people. That transition didn\'t happen by accident.',
  cta_href='thread-arab-slave-trade.html',
  cta_text='The Arab Slave Trade →',
  context_era='African Origins'
)
print("thread-mansa-musa.html done")
