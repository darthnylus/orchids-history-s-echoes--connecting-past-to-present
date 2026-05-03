exec(open('/home/user/app/build_threads.py').read())

acc='#7a3e3e'; acc_lt='#c97b7b'; hero_bg='#120808'

# ── FREEDMEN'S BANK ─────────────────────────────────────────────────────────
make(
  filename='/home/user/app/thread-freedmens-bank.html',
  acc=acc, acc_lt=acc_lt, hero_bg=hero_bg,
  kicker='Emancipation & Betrayal · 1865 – 1874',
  title_html="The Freedmen's Bank:<br /><em>The First Great Theft of Black Savings</em>",
  subtitle="Congress chartered a bank specifically for formerly enslaved people. 61,000 depositors put their life savings in it. Then Congress let it fail — moving a corrupt financier into management, allowing rampant speculation, and leaving Black depositors to lose everything. It set back Black wealth accumulation by a generation.",
  meta_items=[('Era','Emancipation & Betrayal'),('Dates','1865 – 1874'),('Scale','61,000 depositors; $3 million in deposits'),('Outcome','Collapsed 1874; depositors received 60 cents on the dollar if anything')],
  central_arg="The Freedmen's Savings Bank collapse is one of the most consequential and least taught financial crimes in American history. It destroyed the savings of 61,000 Black depositors at the precise moment when formerly enslaved people were trying to build an economic foundation. The government that chartered the bank, failed to regulate it, and allowed it to be looted never compensated the depositors. The theft compounded across generations.",
  entries_html="""
<div class="entry-item" id="e1">
  <div class="entry-item__header"><div class="entry-item__num">1</div>
  <div><div class="entry-item__dates">1865</div>
  <h2 class="entry-item__name">The Promise: Congress Charters a Bank for the Formerly Enslaved</h2>
  <div class="entry-item__location">Washington, D.C.</div></div></div>
  <div class="entry-item__body">
    <p>On March 3, 1865 — the same day it established the Freedmen's Bureau — Congress charters the <strong>Freedmen's Savings and Trust Company</strong>, a bank specifically designed to encourage thrift and savings among formerly enslaved people. The bank operates under Congressional charter, with government-appointed trustees, and benefits from the implicit belief among Black depositors that its Congressional sponsorship means it is as safe as the government itself. Black soldiers deposit their military pay. Black families deposit their first wages. Black churches deposit their collection funds.</p>
    <p>By 1874, the bank has <strong>37 branches across the South and North</strong>, <strong>61,000 depositors</strong>, and <strong>nearly $3 million in deposits</strong>. It is the largest financial institution serving Black Americans in the country. For a population that had been legally prohibited from owning property or accumulating wealth, it represents an unprecedented concentration of community savings — and an unprecedented vulnerability.</p>
    <div class="entry-stats">
      <div><div class="entry-stat__num">61,000</div><div class="entry-stat__label">Depositors at peak</div></div>
      <div><div class="entry-stat__num">$3M</div><div class="entry-stat__label">Total deposits (≈$75M today)</div></div>
      <div><div class="entry-stat__num">37</div><div class="entry-stat__label">Branches across U.S.</div></div>
    </div>
  </div>
</div>
<div class="entry-item" id="e2">
  <div class="entry-item__header"><div class="entry-item__num">2</div>
  <div><div class="entry-item__dates">1870 – 1874</div>
  <h2 class="entry-item__name">The Looting: Speculation, Insider Loans, and the Appointment of Jay Cooke</h2>
  <div class="entry-item__location">Washington, D.C.</div></div></div>
  <div class="entry-item__body">
    <p>In 1870, Congress amends the bank's charter to allow it to make loans secured by real estate — a change that opens the door to speculation. White trustees immediately begin making <strong>risky loans to politically connected white businessmen</strong>, many of them unsecured or inadequately collateralized. The bank's original mandate — safe savings for Black depositors — is abandoned in favor of using Black depositors' money to fund speculative ventures from which the trustees profit.</p>
    <p>In 1874, facing insolvency, the trustees persuade <strong>Frederick Douglass</strong> — at this point the most famous Black man in America — to become president of the bank, calculating that his name will restore depositor confidence. Douglass invests $10,000 of his own money. He almost immediately discovers that the bank is insolvent — the loans cannot be recovered, the books are a disaster. He goes to Congress to request a government bailout. Congress refuses. In <strong>June 1874</strong>, Douglass closes the bank. Sixty-one thousand depositors lose their savings. Douglass later calls accepting the presidency "one of the greatest mistakes of my life."</p>
    <div class="pullquote"><p>"I was married to a corpse."</p><cite>— Frederick Douglass, on his brief presidency of the Freedmen's Bank, 1874</cite></div>
  </div>
</div>
<div class="entry-item" id="e3">
  <div class="entry-item__header"><div class="entry-item__num">3</div>
  <div><div class="entry-item__dates">1874 – Present</div>
  <h2 class="entry-item__name">The Aftermath: 60 Cents on the Dollar, and a Generational Wound</h2>
  <div class="entry-item__location">United States</div></div></div>
  <div class="entry-item__body">
    <p>After the bank's closure, a commission was appointed to liquidate the assets and repay depositors. The process took years. Most depositors eventually received roughly <strong>60 cents on the dollar</strong> — if they received anything at all. Many depositors, particularly those with smaller accounts, received nothing. No trustee was prosecuted. No government compensation was provided. The congressional charter that had given the bank its air of government safety provided no government backstop when the bank failed.</p>
    <p>The psychological impact on Black financial behavior lasted generations. <strong>Frederick Douglass himself</strong> later wrote that the bank's collapse "was a serious injury to the colored people of the whole country, since it was their first great experiment in saving." The distrust of financial institutions among Black Americans — documented in surveys through the present day — has roots in this specific betrayal. A generation of Black workers who had tried to do what they were told — save money, build wealth, trust institutions — were rewarded with the loss of everything they had saved.</p>
    <p>The deposits lost in 1874 were never restored. The compound effect of that lost capital — had it been preserved and invested over 150 years — is incalculable. The Freedmen's Bank collapse is not an isolated historical event. It is one chapter in a continuous story of Black wealth accumulation being destroyed precisely when it begins to succeed.</p>
  </div>
</div>
""",
  sidebar_html="""<div class="sidebar-card"><div class="sidebar-card__title">The Timeline</div><div class="sidebar-card__body"><strong>March 3, 1865</strong> — Congress charters the Freedmen's Bank<br/><br/><strong>1870</strong> — Charter amended to allow real estate loans; speculation begins<br/><br/><strong>1874</strong> — Frederick Douglass appointed president; discovers insolvency<br/><br/><strong>June 1874</strong> — Bank closed; 61,000 depositors lose savings<br/><br/><strong>1874–1880</strong> — Liquidation; depositors get ~60 cents on dollar<br/><br/><strong>0</strong> — Trustees prosecuted</div></div>
<div class="sidebar-card"><div class="sidebar-card__title">The Pattern</div><div class="sidebar-card__body">The Freedmen's Bank is the first in a long sequence of Black wealth accumulation being destroyed at the moment of success:<br/><br/>• 1874 — Freedmen's Bank collapse<br/>• 1921 — Tulsa massacre / Black Wall Street<br/>• 1923 — Rosewood massacre<br/>• 1930s–40s — HOLC redlining<br/>• 2008 — Subprime targeting of Black homeowners</div></div>""",
  cta_eyebrow='The First Great Theft',
  cta_title='61,000 depositors. Congress chartered the bank, then let it be looted.',
  cta_sub='The Freedmen\'s Bank collapse is not a footnote. It is the template — the first in a sequence of moments when Black wealth accumulation was destroyed precisely when it began to succeed.',
  cta_href='thread-reconstruction.html', cta_text='Reconstruction →', context_era='Emancipation & Betrayal'
)
print("thread-freedmens-bank.html done")

# ── CONVICT LEASING ───────────────────────────────────────────────────────────
make(
  filename='/home/user/app/thread-convict-leasing.html',
  acc=acc, acc_lt=acc_lt, hero_bg=hero_bg,
  kicker='Emancipation & Betrayal · 1865 – 1942',
  title_html='Convict Leasing:<br /><em>Slavery by Another Name</em>',
  subtitle='The 13th Amendment abolished slavery "except as a punishment for crime." Within months of emancipation, Southern states were arresting Black men for vagrancy and leasing them to coal mines, railroad companies, and plantations. The mortality rate exceeded that of chattel slavery. It ran for 80 years.',
  meta_items=[('Era','Emancipation & Betrayal → Jim Crow'),('Dates','1865 – 1942'),('Scale','Tens of thousands of Black men enslaved through the criminal system'),('End','Alabama — last state to formally abolish it, 1928; federal lands, 1941')],
  central_arg='Convict leasing was not an abuse of the criminal justice system. It was the criminal justice system operating as designed — using the 13th Amendment\'s exception clause to re-enslave Black people within months of emancipation, with state governments as the administrative infrastructure and private corporations as the customers. The mortality rate of leased convicts in some years exceeded that of the Middle Passage.',
  entries_html="""
<div class="entry-item" id="e1">
  <div class="entry-item__header"><div class="entry-item__num">1</div>
  <div><div class="entry-item__dates">1865 – 1866</div>
  <h2 class="entry-item__name">The Loophole: The 13th Amendment Makes Re-Enslavement Legal</h2>
  <div class="entry-item__location">Southern states</div></div></div>
  <div class="entry-item__body">
    <p>The 13th Amendment, ratified December 6, 1865, reads: <em>"Neither slavery nor involuntary servitude, <strong>except as a punishment for crime</strong> whereof the party shall have been duly convicted, shall exist within the United States."</em> Southern legislators immediately understand the exception clause as an opportunity. Within months of emancipation, they pass the <strong>Black Codes</strong> — laws criminalizing unemployment, loitering, and "vagrancy" in terms so broad that virtually any Black person without a labor contract could be arrested. Conviction was followed immediately by lease to a private employer.</p>
    <p>The system is elegant in its legal construction: it does not violate the 13th Amendment because it operates through the criminal justice system. The formerly enslaved person is not a slave — they are a convict, legally stripped of rights, legally subjected to forced labor. The <strong>state profits</strong> from leasing fees. The <strong>employer profits</strong> from free labor. The <strong>Black prisoner</strong> receives nothing, has no recourse, and can be whipped, chained, and worked to death with no legal accountability.</p>
    <div class="entry-stats">
      <div><div class="entry-stat__num">1865</div><div class="entry-stat__label">System begins — same year as emancipation</div></div>
      <div><div class="entry-stat__num">30–40%</div><div class="entry-stat__label">Annual mortality rate in some Alabama coal mines</div></div>
      <div><div class="entry-stat__num">1942</div><div class="entry-stat__label">Federal government ends it on federal lands</div></div>
    </div>
  </div>
</div>
<div class="entry-item" id="e2">
  <div class="entry-item__header"><div class="entry-item__num">2</div>
  <div><div class="entry-item__dates">1870 – 1900</div>
  <h2 class="entry-item__name">The Coal Mines and the Railroads: What Forced Labor Built</h2>
  <div class="entry-item__location">Alabama, Georgia, Mississippi, Florida</div></div></div>
  <div class="entry-item__body">
    <p><strong>Alabama's coal mines</strong> were among the most brutal sites of convict labor in the country. The <strong>Pratt Mines</strong> outside Birmingham leased convicts from the state and worked them in underground shafts with no safety equipment, no ventilation standards, and no medical care. When convicts died — and they died frequently, from accidents, from disease, from beatings — the state simply arrested more Black men to replace them. The <strong>annual mortality rate</strong> in some Alabama convict mines exceeded 30% — higher than the death rate on most slave ships.</p>
    <p>The railroads of the New South were built in significant part by convict labor. The turpentine camps of Florida and Georgia — where convicts were forced to work extracting pine resin — were described by federal investigators in 1907 as conditions of "absolute slavery." Men were chained, beaten, kept in locked stockades, and prevented from leaving under penalty of death. The journalist <strong>Douglas Blackmon</strong> spent years reconstructing individual cases — tracking specific Black men arrested on false charges, sold to specific corporations, worked to death — in his Pulitzer Prize-winning book <em>Slavery by Another Name</em> (2008).</p>
    <div class="pullquote"><p>"The slavery that followed the Civil War was in many ways more cruel than the slavery that preceded it, because the new enslaver had no financial incentive to keep his workers alive."</p><cite>— Douglas Blackmon, <em>Slavery by Another Name</em>, 2008</cite></div>
  </div>
</div>
<div class="entry-item" id="e3">
  <div class="entry-item__header"><div class="entry-item__num">3</div>
  <div><div class="entry-item__dates">1900 – 1942</div>
  <h2 class="entry-item__name">The Slow End: Reform, World War, and the System That Wouldn't Die</h2>
  <div class="entry-item__location">Alabama, Georgia, Florida</div></div></div>
  <div class="entry-item__body">
    <p>Northern journalists and Progressive Era reformers documented convict leasing extensively in the early 1900s. Several states — Georgia (1908), North Carolina (1933) — formally abolished the practice under this pressure. Alabama, the last major holdout, officially ended private convict leasing in <strong>1928</strong>. But the state-operated version — using convict labor on public works, chain gangs building roads and clearing land — continued. <strong>Federal prohibition on federal lands didn't come until 1941</strong>, under pressure from a wartime labor shortage and international embarrassment about American labor practices.</p>
    <p>The end of convict leasing did not end the system. It transformed into the <strong>chain gang</strong>, the <strong>prison plantation</strong>, and eventually the modern prison labor system — in which incarcerated people in the United States earn between $0.00 and $1.15 per hour for labor that generates an estimated $11 billion annually for state and private interests. The 13th Amendment exception clause that enabled convict leasing in 1865 remains in effect. It has never been removed. Several states have recently passed ballot measures adding language to their own constitutions prohibiting prison slavery — an implicit acknowledgment that the federal Constitution still permits it.</p>
  </div>
</div>
""",
  sidebar_html="""<div class="sidebar-card"><div class="sidebar-card__title">The Timeline</div><div class="sidebar-card__body"><strong>1865</strong> — 13th Amendment ratified with exception clause<br/><br/><strong>1865–66</strong> — Black Codes passed; convict leasing begins<br/><br/><strong>1870s–1900s</strong> — System expands across all former Confederate states<br/><br/><strong>1908</strong> — Georgia abolishes convict leasing<br/><br/><strong>1928</strong> — Alabama (last major holdout) officially ends it<br/><br/><strong>1942</strong> — Federal lands prohibition<br/><br/><strong>Present</strong> — Prison labor continues under 13th Amendment exception</div></div>
<div class="sidebar-card"><div class="sidebar-card__title">Key Reading</div><div class="sidebar-card__body"><em>Slavery by Another Name</em> — Douglas Blackmon (2008, Pulitzer Prize)<br/><br/>Documents individual Black men arrested on false charges, sold to corporations, and worked to death between 1865 and 1942. Includes corporate records from U.S. Steel, railway companies, and turpentine operations.</div></div>""",
  cta_eyebrow='Emancipation Was Not Freedom',
  cta_title='The 13th Amendment abolished slavery except as punishment for crime. They used that exception immediately.',
  cta_sub='Convict leasing ran for 80 years after emancipation. It was slavery — enforced by the state, administered through courts, and profitable for corporations. The exception clause that made it legal has never been removed from the Constitution.',
  cta_href='thread-mass-incarceration.html', cta_text='Mass Incarceration →', context_era='Emancipation & Betrayal'
)
print("thread-convict-leasing.html done")

# ── EXODUSTERS ───────────────────────────────────────────────────────────────
make(
  filename='/home/user/app/thread-exodusters.html',
  acc=acc, acc_lt=acc_lt, hero_bg=hero_bg,
  kicker='Emancipation & Betrayal · 1879 – 1880',
  title_html='The Exodusters:<br /><em>40,000 Black People Flee to Kansas</em>',
  subtitle="In 1879, 40,000 Black people left the South in a matter of months — walking, taking riverboats, traveling any way they could — to reach Kansas and the promise of land and safety. It was the largest spontaneous migration of Black Americans before the Great Migration. Mississippi tried to stop them at gunpoint.",
  meta_items=[('Era','Emancipation & Betrayal'),('Dates','1879 – 1880'),('Scale','~40,000 people migrated to Kansas'),('Name','Exodusters — from the Biblical Exodus')],
  central_arg="The Exoduster migration of 1879 is one of the most dramatic acts of collective self-determination in American history — a mass refusal by 40,000 Black Southerners to accept the re-enslavement conditions of Reconstruction's aftermath, expressed not as rebellion but as departure. The Mississippi River steamboat companies that tried to stop them, and the Southern states that deployed militia to prevent migration, reveal exactly what the post-Reconstruction South was: a system of coerced labor that could not function if Black people were allowed to leave.",
  entries_html="""
<div class="entry-item" id="e1">
  <div class="entry-item__header"><div class="entry-item__num">1</div>
  <div><div class="entry-item__dates">1877 – 1879</div>
  <h2 class="entry-item__name">The Conditions: Why 40,000 People Decided to Leave Everything</h2>
  <div class="entry-item__location">Mississippi, Louisiana, Tennessee</div></div></div>
  <div class="entry-item__body">
    <p>After the Compromise of 1877 — when federal troops withdrew from the South and Reconstruction governments collapsed under Klan terror — the conditions for Black Southerners deteriorated rapidly. <strong>Sharecropping contracts</strong> kept workers perpetually indebted. <strong>Convict leasing</strong> criminalized unemployment. <strong>Political rights</strong> purchased by the 15th Amendment were stripped through violence and fraud. The freedoms of emancipation were being systematically dismantled.</p>
    <p>The movement crystallizes around the figure of <strong>"Pap" Singleton</strong>, a Tennessee freedman who had been working for years to organize Black migration to Kansas — which still had Homestead Act land available. He prints circulars and distributes them across the South: Kansas offers free land, protection from violence, and distance from the plantation system. The circulars spread through Black churches and social networks. By early 1879, a spontaneous mass movement is building that Singleton and other organizers can barely keep up with.</p>
    <div class="entry-stats">
      <div><div class="entry-stat__num">~40,000</div><div class="entry-stat__label">Migrants to Kansas in 1879</div></div>
      <div><div class="entry-stat__num">1877</div><div class="entry-stat__label">Federal troops withdraw; conditions collapse</div></div>
      <div><div class="entry-stat__num">6,000</div><div class="entry-stat__label">Arrived destitute; needed emergency relief</div></div>
    </div>
  </div>
</div>
<div class="entry-item" id="e2">
  <div class="entry-item__header"><div class="entry-item__num">2</div>
  <div><div class="entry-item__dates">Spring 1879</div>
  <h2 class="entry-item__name">The Crossing: Mississippi Tries to Stop Them at Gunpoint</h2>
  <div class="entry-item__location">Mississippi River</div></div></div>
  <div class="entry-item__body">
    <p>The peak of the Exodus comes in spring 1879, when tens of thousands of Black people converge on the banks of the Mississippi River seeking passage north. The sight — crowds of Black migrants with their belongings waiting for steamboats — terrifies Southern planters and state governments. <strong>Mississippi deployed militia to the riverbanks</strong> to prevent embarkation. Steamboat captains were pressured not to carry Black passengers. Some boats were turned back. Some migrants were arrested.</p>
    <p>The Southern response reveals the essential contradiction of the post-Reconstruction order: it claimed to be a free labor system, but it could not allow Black workers to leave. If the labor was free, it had to be free to go. Southern planters' frantic efforts to prevent the Exodus — including lobbying Congress for restrictions on the movement of Black people — showed what the system actually was: a coerced labor regime that depended on captive workers. <strong>Senator Blanche Bruce</strong>, the Black senator from Mississippi, testified before Congress about the conditions driving the migration, in one of the most striking confrontations of the era.</p>
    <div class="pullquote"><p>"The Exodus is not caused by poverty, nor by a desire for change, but by a sense of insecurity and a fear of re-enslavement."</p><cite>— Frederick Douglass, 1879 (who initially opposed the Exodus, fearing it would reduce Black political pressure in the South)</cite></div>
  </div>
</div>
<div class="entry-item" id="e3">
  <div class="entry-item__header"><div class="entry-item__num">3</div>
  <div><div class="entry-item__dates">1879 – 1900</div>
  <h2 class="entry-item__name">Kansas: Hardship, Achievement, and the Limits of Migration as Liberation</h2>
  <div class="entry-item__location">Kansas — Nicodemus, Dunlap, other freedman towns</div></div></div>
  <div class="entry-item__body">
    <p>Kansas was not the promised land. Many Exodusters arrived destitute — having sold or abandoned everything to make the journey — in a state ill-prepared to receive 40,000 migrants simultaneously. The winter of 1879–80 was harsh. Aid organizations, both Black and white, scrambled to provide food, shelter, and supplies. Thousands suffered. Some returned south. Many stayed and built communities.</p>
    <p>The most famous Exoduster community is <strong>Nicodemus, Kansas</strong> — founded in 1877 on the high plains of Graham County. By the mid-1880s it has a newspaper, churches, a school, businesses, and a baseball team. It becomes the first incorporated Black town west of the Mississippi. When the railroads bypass Nicodemus in the 1880s — a decision the community believes was deliberate — it begins a slow decline. It survives. Today it is a National Historic Site, the only remaining example of the Exoduster towns that dotted the Kansas plains.</p>
    <p>The Exoduster movement is important for what it shows about Black agency in the Reconstruction era: rather than simply enduring deteriorating conditions, tens of thousands of people made rational calculations and moved. The same impulse — leave the South, find somewhere better — would drive the Great Migration of 1910–1970. The Exodusters were the first wave.</p>
  </div>
</div>
""",
  sidebar_html="""<div class="sidebar-card"><div class="sidebar-card__title">Key Figures</div><div class="sidebar-card__body"><strong>"Pap" Singleton</strong> — Tennessee freedman who organized the migration; printed and distributed circulars across the South<br/><br/><strong>Blanche Bruce</strong> — Black senator from Mississippi who testified about conditions driving the Exodus<br/><br/><strong>Nicodemus, Kansas</strong> — Most famous Exoduster community; National Historic Site today</div></div>
<div class="sidebar-card"><div class="sidebar-card__title">Nicodemus Today</div><div class="sidebar-card__body">Founded 1877. First incorporated Black town west of the Mississippi. Survived railroad bypass, drought, and 140 years of rural decline. Designated a National Historic Site in 1996. Population today: approximately 17 people — but the town still holds an annual homecoming drawing thousands of descendants.</div></div>""",
  cta_eyebrow='They Voted With Their Feet',
  cta_title='40,000 people left the South in months. Mississippi tried to stop them at gunpoint.',
  cta_sub='The Exodusters are the first wave of the Black freedom migration — 30 years before the Great Migration began. Their story is a test of what freedom means when you have to fight to leave.',
  cta_href='thread-great-migration.html', cta_text='The Great Migration →', context_era='Emancipation & Betrayal'
)
print("thread-exodusters.html done")
