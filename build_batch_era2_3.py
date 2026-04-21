exec(open('/home/user/app/build_threads.py').read())

# Era 2/3 colors
acc='#1a6b3a'; acc_lt='#4ab87a'; hero_bg='#040e07'

# ── 1. THE MIDDLE PASSAGE ────────────────────────────────────────────────────
make(
  filename='/home/user/app/thread-middle-passage.html',
  acc=acc, acc_lt=acc_lt, hero_bg=hero_bg,
  kicker='The Rupture · Slavery & Resistance · 1500 – 1808',
  title_html='The Middle Passage:<br /><em>What the Crossing Cost</em>',
  subtitle='12.5 million people were loaded onto ships. 1.8 million died before landfall. The survivors were not the lucky ones — they were the ones forced to build a country that would not recognize their humanity for 400 years.',
  meta_items=[('Era','The Rupture → Slavery'),('Dates','1500 – 1808'),('Scale','12.5 million embarked; 10.7 million survived'),('Duration','Typically 6–12 weeks at sea')],
  central_arg='The Middle Passage was not a byproduct of the slave trade. It was a deliberate system of terror engineered to break human beings before they arrived — to sever every connection to language, community, family, and self so completely that organized resistance would become nearly impossible. Understanding the crossing is prerequisite to understanding everything that came after.',
  entries_html="""
<div class="entry-item" id="e1">
  <div class="entry-item__header"><div class="entry-item__num">1</div>
  <div><div class="entry-item__dates">1500 – 1650</div>
  <h2 class="entry-item__name">The System Is Designed: Fortresses, Ships, and the Logic of the Trade</h2>
  <div class="entry-item__location">West African coast — Cape Verde to Angola</div></div></div>
  <div class="entry-item__body">
    <p>The transatlantic slave trade is not improvised. It is engineered. <strong>Portuguese, Dutch, British, French, and Danish traders</strong> build a chain of fortresses along the West African coast — <strong>Elmina</strong> (1482), <strong>Cape Coast Castle</strong> (1653), <strong>Gorée Island</strong> — designed specifically to hold captive Africans between their seizure inland and their loading onto ships. These are not temporary holding pens. They are permanent infrastructure, stone buildings with dungeons designed to hold hundreds of people, equipped with whipping posts, isolation chambers, and what slavers called the <em>Door of No Return</em> — the portal through which captives walked directly onto the ships.</p>
    <p>The ships are also engineered for the purpose. The <strong>Brooks</strong> — a Liverpool slave ship whose deck plan was published in 1788 as abolitionist evidence — shows 454 people packed into a space where each person was allotted less than a coffin's worth of room: 6 feet by 1 foot 4 inches. The actual loading on most ships exceeded even these appalling specifications. Captives were chained in pairs, right wrist to left wrist, right ankle to left ankle, and arranged in rows so tight they could not sit upright.</p>
    <div class="entry-stats">
      <div><div class="entry-stat__num">12.5M</div><div class="entry-stat__label">People embarked, 1500–1900</div></div>
      <div><div class="entry-stat__num">1.8M</div><div class="entry-stat__label">Died during the crossing</div></div>
      <div><div class="entry-stat__num">40,000+</div><div class="entry-stat__label">Slaving voyages documented</div></div>
    </div>
    <p>The Trans-Atlantic Slave Trade Database — a scholarly project cataloguing every documented voyage — records <strong>more than 40,000 slaving voyages</strong> between 1514 and 1866. The database is incomplete; scholars estimate it captures roughly 80% of the actual trade. The full number of voyages likely exceeded 50,000. This is not a series of crimes. It is an industry, operating at industrial scale, for three and a half centuries.</p>
  </div>
</div>
<div class="entry-item" id="e2">
  <div class="entry-item__header"><div class="entry-item__num">2</div>
  <div><div class="entry-item__dates">1650 – 1808</div>
  <h2 class="entry-item__name">The Crossing: 6–12 Weeks in the Hold</h2>
  <div class="entry-item__location">Atlantic Ocean</div></div></div>
  <div class="entry-item__body">
    <p>The crossing from West Africa to the Americas took between six and twelve weeks depending on the destination and the winds. Captives spent most of this time in the ship's hold — a space so low that adults could not stand upright, so packed that movement was impossible, so dark that day and night became indistinguishable. The hold was not ventilated. In hot weather it reached temperatures that caused heat stroke. Captives were brought on deck periodically — not for their welfare but to be hosed down, inspected, and sometimes forced to dance for "exercise."</p>
    <p><strong>Dysentery</strong> — called "the bloody flux" in slaver records — was the leading cause of death, killing captives and crew alike. The flux spread rapidly in the unventilated hold. Captives chained to dying and dead neighbors could not move away. They lay in waste for days. <strong>Smallpox, measles, and ophthalmia</strong> (an eye infection causing blindness) compounded the dysentery death toll. Ships that left West Africa with 400 captives sometimes arrived in the Caribbean with 250.</p>
    <div class="pullquote"><p>"I was soon put down under the decks, and there I received such a salutation in my nostrils as I had never experienced in my life; so that with the loathsomeness of the stench and crying together, I became so sick and low that I was not able to eat."</p><cite>— Olaudah Equiano, <em>The Interesting Narrative</em>, 1789</cite></div>
    <p>The 14.4% mortality rate during crossing — <strong>1 in 7 people died before landfall</strong> — is an average that conceals enormous variation. Some ships lost 5%. Others lost 50%. The worst voyages were the longest ones, the ones that hit storms, the ones where disease broke out early and swept through the hold before the ship could reach port. Slavers called it "tight packing" versus "loose packing" — more bodies risked more death but yielded more profit even accounting for losses. Human beings were optimized for transport like cargo.</p>
  </div>
</div>
<div class="entry-item" id="e3">
  <div class="entry-item__header"><div class="entry-item__num">3</div>
  <div><div class="entry-item__dates">1700 – 1808</div>
  <h2 class="entry-item__name">Resistance at Sea: Uprisings, Hunger Strikes, and the Zong Massacre</h2>
  <div class="entry-item__location">Atlantic Ocean</div></div></div>
  <div class="entry-item__body">
    <p>Captives did not accept their situation passively. The Trans-Atlantic Slave Trade Database documents <strong>at least 493 shipboard uprisings</strong> — and scholars believe this is a severe undercount, since slavers had strong incentives not to record their failures. Uprisings typically occurred near the African coast, before the ship had traveled far enough that a successful rebellion would leave survivors stranded in mid-ocean. Women captives, who were often kept on deck unchained, sometimes played critical roles — passing weapons, providing intelligence on crew movements, or creating diversions.</p>
    <p>The most documented act of resistance was the <strong>hunger strike</strong>. Captives who refused to eat — choosing death over arrival — were force-fed with a device called the <em>speculum oris</em>, a metal mouth-opener designed to force food down the throat. Slavers understood that death by starvation was preferable to some captives and engineered around it.</p>
    <p>The <strong>Zong massacre of 1781</strong> is the most infamous incident of the crossing. The British slave ship <em>Zong</em>, overcrowded and running low on water, threw <strong>133 sick and dying enslaved people overboard alive</strong> so the owners could claim insurance on them — British insurance law covering cargo lost at sea, but not cargo that died of disease. The owners filed the claim. The underwriters disputed it. The case went to court — not as a murder trial but as an insurance dispute over whether the massacre counted as <em>necessary</em> jettisoning of cargo. The murderers were never prosecuted. The case galvanized the British abolitionist movement.</p>
    <div class="entry-stats">
      <div><div class="entry-stat__num">493+</div><div class="entry-stat__label">Documented shipboard uprisings</div></div>
      <div><div class="entry-stat__num">133</div><div class="entry-stat__label">People thrown overboard alive from the Zong</div></div>
      <div><div class="entry-stat__num">0</div><div class="entry-stat__label">Prosecutions for the Zong massacre</div></div>
    </div>
  </div>
</div>
<div class="entry-item" id="e4">
  <div class="entry-item__header"><div class="entry-item__num">4</div>
  <div><div class="entry-item__dates">1500 – Present</div>
  <h2 class="entry-item__name">The Psychological Architecture of the Crossing</h2>
  <div class="entry-item__location">Atlantic Ocean → American hemisphere</div></div></div>
  <div class="entry-item__body">
    <p>Scholars of the slave trade have argued that the Middle Passage was not merely transportation — it was <strong>deliberate psychological destruction</strong>. Captives from the same community were separated. People who shared a language were split across different ships or different holds. Names were stripped and replaced with numbers or European names. The crossing was designed to produce maximum disorientation: severed from every social connection, unable to communicate with most fellow captives, in a space of total physical suffering, with no knowledge of where they were going or what awaited them.</p>
    <p>The African scholar <strong>Marimba Ani</strong> and others have called this the <em>Maafa</em> — a Swahili word meaning "great disaster" or "terrible occurrence" — arguing that the Middle Passage constitutes a deliberate cultural genocide as well as a physical atrocity. The intent, whether fully articulated by slavers or not, was to produce human beings who arrived in the Americas with no remaining basis for collective identity, cultural memory, or coordinated resistance.</p>
    <div class="pullquote"><p>"They had destroyed everything — language, family, name, religion, community. What they didn't count on was that you can destroy everything a person has without destroying the person."</p><cite>— Toni Morrison, interview, 1993</cite></div>
    <p>That the cultural destruction was incomplete — that African languages survived encoded in creoles, that spiritual systems survived inside Christianity, that family and community structures reconstituted themselves within a generation of arrival — is not a testament to the slave system's mercy. It is a testament to the resilience of the people it tried to destroy.</p>
  </div>
</div>
<div class="entry-item" id="e5">
  <div class="entry-item__header"><div class="entry-item__num">5</div>
  <div><div class="entry-item__dates">Present</div>
  <h2 class="entry-item__name">The Archive: What We Know and What Was Never Recorded</h2>
  <div class="entry-item__location">United States, United Kingdom, Portugal</div></div></div>
  <div class="entry-item__body">
    <p>The Trans-Atlantic Slave Trade Database (slavevoyages.org) is one of the most important digital humanities projects in history — a painstaking reconstruction of the trade from shipping records, customs documents, insurance filings, and merchant account books across archives in a dozen countries. It documents approximately 36,000 voyages carrying roughly 10 million people, and estimates the full trade at 12.5 million embarked.</p>
    <p>But the database records <strong>ships, not people</strong>. It knows approximately where captives embarked (the African coast region) and disembarked (the American port). It does not know their names. It does not know their languages, their families, their communities, their skills, their beliefs. The individual human beings who endured the crossing are, with extraordinarily rare exceptions, <strong>completely anonymous</strong> in the historical record. We have their numbers. We do not have their names.</p>
    <p>The few testimonies that survive — Olaudah Equiano, Venture Smith, Omar ibn Said — are precious precisely because they are so rare. The overwhelming majority of people who crossed the Atlantic in chains left no written record, because enslaved people were legally prohibited from learning to read and write, and because no one who mattered to the record-keepers thought their story was worth preserving. The Middle Passage is a vast, specific, documented atrocity whose individual victims are almost entirely unknown. That anonymity is itself a form of the violence.</p>
  </div>
</div>
""",
  sidebar_html="""<div class="sidebar-card"><div class="sidebar-card__title">The Scale</div><div class="sidebar-card__body"><strong>12.5 million</strong> people embarked<br/><br/><strong>1.8 million</strong> died at sea (14.4%)<br/><br/><strong>10.7 million</strong> arrived in the Americas<br/><br/><strong>40,000+</strong> documented voyages<br/><br/><strong>1514–1866</strong> — 352 years of continuous operation</div></div>
<div class="sidebar-card"><div class="sidebar-card__title">Major Origins</div><div class="sidebar-card__body"><strong>West Central Africa</strong> (modern Congo/Angola) — 45%<br/><br/><strong>Senegambia & Sierra Leone</strong> — 14%<br/><br/><strong>Gold Coast</strong> (modern Ghana) — 11%<br/><br/><strong>Bight of Benin</strong> — 11%<br/><br/><strong>Bight of Biafra</strong> — 14%</div></div>
<div class="sidebar-card"><div class="sidebar-card__title">Primary Source</div><div class="sidebar-card__body"><em>The Interesting Narrative of Olaudah Equiano</em> (1789) — first published autobiography by an enslaved African; describes the crossing firsthand.<br/><br/>slavevoyages.org — Trans-Atlantic Slave Trade Database, the definitive scholarly archive.</div></div>""",
  cta_eyebrow='The Crossing Was the Beginning',
  cta_title='1.8 million people never made it. The 10.7 million who did built a country that denied them everything.',
  cta_sub='The Middle Passage was designed to destroy. It failed. The people who survived it built churches, families, communities, and a 400-year fight for freedom.',
  cta_href='thread-slave-revolts.html', cta_text='Slave Revolts →', context_era='The Rupture'
)
print("thread-middle-passage.html done")
