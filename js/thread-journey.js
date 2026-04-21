/**
 * thread-journey.js
 * Injects prev/next sequential navigation on every thread page.
 * Defines the full canonical chronological journey through the Chain platform.
 */
(function () {

  // ── Canonical chronological sequence ──────────────────────────────────────
  // Each entry: [href, short title, era label, era number]
  var JOURNEY = [

    // ERA 1 — African Origins
    ['thread-pharaohs.html',              'Black Pharaohs of Egypt',           'African Origins',   1],
    ['thread-african-empires.html',       'African Empires & Civilizations',   'African Origins',   1],
    ['thread-moors.html',                 'The Moors of Europe',               'African Origins',   1],
    ['thread-songhai.html',               'The Songhai Empire',                'African Origins',   1],
    ['thread-arab-slave-trade.html',      'The Arab Slave Trade',              'African Origins',   1],
    ['thread-mansa-musa.html',             'Mansa Musa & the Mali Empire',      'African Origins',   1],
    ['thread-nubia-kush.html',             'Nubia & the Kingdom of Kush',       'African Origins',   1],
    ['thread-great-zimbabwe.html',         'Great Zimbabwe',                    'African Origins',   1],
    ['thread-swahili-coast.html',          'The Swahili Coast',                 'African Origins',   1],
    ['thread-african-spiritual-systems.html','African Spiritual Systems',       'African Origins',   1],
    ['thread-precolonial-governance.html', 'Pre-Colonial African Governance',   'African Origins',   1],

    // ERA 2 — The Rupture
    ['thread-transatlantic-slave-trade.html', 'The Transatlantic Slave Trade', 'The Rupture',       2],
    ['thread-slave-ship-resistance.html', 'Resistance on the Middle Passage',  'The Rupture',       2],
    ['thread-code-noir.html',             'The Code Noir',                     'The Rupture',       2],
    ['thread-invention-of-race.html',     'The Invention of Race',             'The Rupture',       2],
    ['thread-blumenbach.html',            'The Man Who Invented Race',         'The Rupture',       2],
    ['thread-haiti.html',                 'The Haitian Revolution',            'The Rupture',       2],

    // ERA 3 — Slavery & Resistance
    ['thread-stolen-labor.html',          'Stolen Labor',                      'Slavery & Resistance', 3],
    ['thread-abolitionism.html',          'Abolitionism',                      'Slavery & Resistance', 3],
    ['thread-slave-revolts.html',         'Slave Revolts & Uprisings',         'Slavery & Resistance', 3],
    ['thread-mexico-freedom.html',        'Freedom via Mexico',                'Slavery & Resistance', 3],
    ['thread-seneca-village.html',        'Seneca Village',                    'Slavery & Resistance', 3],
    ['thread-weeksville.html',            'Weeksville, Brooklyn',              'Slavery & Resistance', 3],
    ['thread-black-church.html',          'The Black Church',                  'Slavery & Resistance', 3],
    ['thread-black-press.html',           'The Black Press',                   'Slavery & Resistance', 3],
    ['thread-domestic-slave-trade.html',  'The Domestic Slave Trade',          'Slavery & Resistance', 3],

    // ERA 4 — Emancipation & Betrayal
    ['thread-end-of-slavery.html',        'How Slavery Really Ended',          'Emancipation & Betrayal', 4],
    ['thread-thirteenth-amendment.html',  'The 13th Amendment Loophole',       'Emancipation & Betrayal', 4],
    ['thread-freedmens-bureau.html',      "The Freedmen's Bureau",             'Emancipation & Betrayal', 4],
    ['thread-juneteenth.html',            'Juneteenth',                        'Emancipation & Betrayal', 4],
    ['thread-black-codes.html',           'Black Codes',                       'Emancipation & Betrayal', 4],
    ['thread-reconstruction.html',        'Reconstruction',                    'Emancipation & Betrayal', 4],
    ['thread-kkk.html',                   'The Ku Klux Klan',                  'Emancipation & Betrayal', 4],
    ['thread-lynching.html',              'Lynching in America',               'Emancipation & Betrayal', 4],
    ['thread-fear-of-black-assembly.html','Fear of Black Assembly',            'Emancipation & Betrayal', 4],
    ['thread-red-summer.html',            'Red Summer 1919',                   'Emancipation & Betrayal', 4],
    ['thread-emmett-till.html',           'Emmett Till',                       'Emancipation & Betrayal', 4],
    ['thread-buffalo-soldiers.html',      'Buffalo Soldiers',                  'Emancipation & Betrayal', 4],

    // ERA 5 — Jim Crow & Building Community
    ['thread-sharecropping.html',         'Sharecropping',                     'Jim Crow Era',      5],
    ['thread-plessy.html',                'Plessy v. Ferguson',                'Jim Crow Era',      5],
    ['thread-voter-suppression-mechanics.html', 'Voter Suppression Mechanics','Jim Crow Era',      5],
    ['thread-garvey.html',                'Marcus Garvey & Black Nationalism', 'Jim Crow Era',      5],
    ['thread-harlem-renaissance.html',    'The Harlem Renaissance',            'Jim Crow Era',      5],
    ['thread-jazz-blues.html',            'Jazz, Blues & Cultural Theft',      'Jim Crow Era',      5],
    ['thread-great-migration.html',       'The Great Migration',               'Jim Crow Era',      5],
    ['thread-tulsa.html',                 'Black Wall Street, Tulsa',          'Jim Crow Era',      5],
    ['thread-greenwood-pattern.html',     'The Greenwood Pattern',             'Jim Crow Era',      5],
    ['thread-negro-leagues.html',         'The Negro Leagues',                 'Jim Crow Era',      5],
    ['thread-hbcus.html',                 'The HBCUs',                         'Jim Crow Era',      5],
    ['thread-black-women.html',           'Black Women Who Changed History',   'Jim Crow Era',      5],
    ['thread-inventors.html',             'Black Inventors',                   'Jim Crow Era',      5],
    ['thread-bruces-beach.html',          "Bruce's Beach",                     'Jim Crow Era',      5],
    ['thread-oscarville.html',            'Oscarville, Georgia',               'Jim Crow Era',      5],
    ['thread-lake-lanier.html',           'Lake Lanier',                       'Jim Crow Era',      5],
    ['thread-lake-marion.html',           'Lake Marion',                       'Jim Crow Era',      5],
    ['thread-ida-b-wells.html',           'Ida B. Wells',                      'Jim Crow Era',      5],
    ['thread-dubois.html',                'W.E.B. Du Bois',                    'Jim Crow Era',      5],

    // ERA 6 — WWII & Post-War Exclusion
    ['thread-golden-thirteen.html',       'The Golden Thirteen',               'WWII & Post-War',   6],
    ['thread-gi-bill.html',               'The GI Bill',                       'WWII & Post-War',   6],
    ['thread-lily-white.html',            'Lily-White Suburbs',                'WWII & Post-War',   6],
    ['thread-displacement.html',          'Redlining & Displacement',          'WWII & Post-War',   6],
    ['thread-tuskegee.html',              'The Tuskegee Study',                'WWII & Post-War',   6],
    ['thread-brown-v-board.html',         'Brown v. Board of Education',       'WWII & Post-War',   6],
    ['thread-urban-renewal.html',         'Urban Renewal & Displacement',      'WWII & Post-War',   6],
    ['thread-tuskegee-airmen.html',       'The Tuskegee Airmen',               'WWII & Post-War',   6],
    ['thread-redlining.html',             'Redlining',                         'WWII & Post-War',   6],

    // ERA 7 — Civil Rights
    ['thread-civil-rights.html',          'The Civil Rights Movement',         'Civil Rights',      7],
    ['thread-voting-rights.html',         'Voting Rights',                     'Civil Rights',      7],
    ['thread-self-defense.html',          'The Right to Self-Defense',         'Civil Rights',      7],
    ['thread-black-athletes.html',        'Black Athletes & Protest',          'Civil Rights',      7],
    ['thread-hbcu-football.html',         'HBCU Football',                     'Civil Rights',      7],
    ['thread-black-panthers.html',        'The Black Panthers',                'Civil Rights',      7],
    ['thread-statue-of-liberty.html',     'The Statue of Liberty',             'Civil Rights',      7],
    ['thread-cointelpro.html',            'COINTELPRO',                        'Civil Rights',      7],
    ['thread-mlk.html',                  'Martin Luther King Jr.',             'Civil Rights',      7],
    ['thread-malcolm-x.html',             'Malcolm X',                         'Civil Rights',      7],
    ['thread-freedom-riders.html',        'The Freedom Riders',                'Civil Rights',      7],
    ['thread-birmingham.html',            'The Birmingham Campaign',           'Civil Rights',      7],
    ['thread-black-lgbtq.html',           'Black LGBTQ+ History',              'Civil Rights',      7],
    ['thread-black-mayors.html',          'Black Political Power & Mayors',    'Civil Rights',      7],

    // ERA 8 — Backlash & Dismantling
    ['thread-deindustrialization.html',   'Deindustrialization',               'Backlash Era',      8],
    ['thread-war-on-drugs.html',          'The War on Drugs',                  'Backlash Era',      8],
    ['thread-mass-incarceration.html',    'Mass Incarceration',                'Backlash Era',      8],
    ['thread-capital-punishment.html',    'Capital Punishment & Race',         'Backlash Era',      8],
    ['thread-police.html',                'The Invention of Policing',         'Backlash Era',      8],
    ['thread-media.html',                 'Media & Stereotypes',               'Backlash Era',      8],
    ['thread-rap-pipeline.html',          'The Rap-to-Prison Pipeline',        'Backlash Era',      8],
    ['thread-gangs.html',                 'Gangs & the State',                 'Backlash Era',      8],
    ['thread-white-terror-la.html',       'White Terror in L.A.',              'Backlash Era',      8],
    ['thread-subprime.html',              'The Subprime Crash',                'Backlash Era',      8],
    ['thread-racial-capitalism.html',     'Racial Capitalism',                 'Backlash Era',      8],
    ['thread-la-uprising.html',          'The LA Uprising 1992',              'Backlash Era',      8],
    ['thread-welfare-reform.html',        'Welfare Reform 1996',               'Backlash Era',      8],
    ['thread-hiv-aids.html',              'HIV/AIDS & Black America',          'Backlash Era',      8],
    ['thread-attica.html',               'Attica',                             'Backlash Era',      8],
    ['thread-move-bombing.html',         'The MOVE Bombing',                   'Backlash Era',      8],

    // ERA 9 — Present Day
    ['thread-katrina.html',               'Hurricane Katrina',                 'Present Day',       9],
    ['thread-bail-system.html',           'The Bail System',                   'Present Day',       9],
    ['thread-shelby-county.html',         'Shelby County v. Holder',           'Present Day',       9],
    ['thread-health-disparities.html',    'Racial Health Disparities',         'Present Day',       9],
    ['thread-healthcare.html',            'Healthcare & Race',                 'Present Day',       9],
    ['thread-environmental-racism.html',  'Environmental Racism',              'Present Day',       9],
    ['thread-education.html',             'Education & Inequality',            'Present Day',       9],
    ['thread-black-farmers.html',         'Black Farmers',                     'Present Day',       9],
    ['thread-ferguson.html',              'Ferguson & After',                  'Present Day',       9],
    ['thread-dei.html',                   'DEI & Rollback',                    'Present Day',       9],
    ['thread-reparations.html',           'The Reparations Debate',            'Present Day',       9],
    ['thread-diaspora.html',              'The African Diaspora',              'Present Day',       9],
    ['thread-blm.html',                  'Black Lives Matter',                'Present Day',       9],
    ['thread-school-to-prison.html',      'The School-to-Prison Pipeline',     'Present Day',       9],
    ['thread-affirmative-action.html',    'Affirmative Action',                'Present Day',       9],
    ['thread-black-maternal-mortality.html','Black Maternal Mortality',         'Present Day',       9],
    ['thread-stand-your-ground.html',     'Stand Your Ground Laws',            'Present Day',       9],
    ['thread-wealth-gap.html',            'The Racial Wealth Gap',             'Present Day',       9],
  ];

  var ERA_COLORS = {
    1: '#b8972a',  // amber — African Origins
    2: '#c0392b',  // crimson — The Rupture
    3: '#1a6b3a',  // green — Slavery & Resistance
    4: '#7a3e3e',  // deep red — Emancipation & Betrayal
    5: '#5c4a1e',  // dark gold — Jim Crow
    6: '#1a4a6b',  // navy — WWII
    7: '#1a5c3a',  // forest — Civil Rights
    8: '#4a2060',  // purple — Backlash
    9: '#2a4a6b',  // steel — Present Day
  };

  // ── Find current page in sequence ─────────────────────────────────────────
  var page = window.location.pathname.split('/').pop() || 'index.html';
  var idx = -1;
  for (var i = 0; i < JOURNEY.length; i++) {
    if (JOURNEY[i][0] === page) { idx = i; break; }
  }
  if (idx === -1) return; // not a sequenced thread page

  var current = JOURNEY[idx];
  var prev    = idx > 0              ? JOURNEY[idx - 1] : null;
  var next    = idx < JOURNEY.length - 1 ? JOURNEY[idx + 1] : null;
  var color   = ERA_COLORS[current[3]] || '#888';
  var total   = JOURNEY.length;

  // ── Build navigation HTML ──────────────────────────────────────────────────
  function pill(era, color) {
    return '<span style="display:inline-block;font-size:0.62rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;background:' + hexToRgba(color, 0.15) + ';border:1px solid ' + hexToRgba(color, 0.35) + ';color:' + color + ';border-radius:999px;padding:2px 8px;white-space:nowrap">' + era + '</span>';
  }

  function hexToRgba(hex, a) {
    var r = parseInt(hex.slice(1,3),16),
        g = parseInt(hex.slice(3,5),16),
        b = parseInt(hex.slice(5,7),16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  // Progress bar: filled dots for past eras, current, future
  var dots = '';
  var eraNums = [1,2,3,4,5,6,7,8,9];
  var eraLabels = ['African Origins','The Rupture','Slavery & Resistance','Emancipation & Betrayal','Jim Crow Era','WWII & Post-War','Civil Rights','Backlash Era','Present Day'];
  for (var e = 0; e < eraNums.length; e++) {
    var en = eraNums[e];
    var ec = ERA_COLORS[en];
    var isCurrentEra = (en === current[3]);
    var isPastEra    = (en < current[3]);
    var dotStyle = 'display:inline-block;width:8px;height:8px;border-radius:50%;margin:0 3px;transition:transform .15s;' +
      (isCurrentEra ? 'background:' + ec + ';transform:scale(1.5)' :
       isPastEra    ? 'background:' + hexToRgba(ec, 0.55)        :
                      'background:rgba(255,255,255,0.12)');
    dots += '<span title="' + eraLabels[e] + '" style="' + dotStyle + '"></span>';
  }

  var prevHtml = prev
    ? '<a href="' + prev[0] + '" class="journey-nav__link journey-nav__link--prev" title="Previous: ' + prev[1] + '">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><polyline points="15 18 9 12 15 6"/></svg>' +
        '<span class="journey-nav__link-inner">' +
          pill(prev[2], ERA_COLORS[prev[3]]) +
          '<span class="journey-nav__title">' + prev[1] + '</span>' +
        '</span>' +
      '</a>'
    : '<span class="journey-nav__link journey-nav__link--prev journey-nav__link--empty"><span class="journey-nav__title" style="opacity:.35">Beginning of the chain</span></span>';

  var nextHtml = next
    ? '<a href="' + next[0] + '" class="journey-nav__link journey-nav__link--next" title="Next: ' + next[1] + '">' +
        '<span class="journey-nav__link-inner">' +
          pill(next[2], ERA_COLORS[next[3]]) +
          '<span class="journey-nav__title">' + next[1] + '</span>' +
        '</span>' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><polyline points="9 18 15 12 9 6"/></svg>' +
      '</a>'
    : '<span class="journey-nav__link journey-nav__link--next journey-nav__link--empty"><span class="journey-nav__title" style="opacity:.35">End of the chain</span></span>';

  var html =
    '<nav class="journey-nav" aria-label="Thread journey navigation">' +
      '<div class="journey-nav__inner">' +
        prevHtml +
        '<div class="journey-nav__center">' +
          '<div class="journey-nav__dots" aria-hidden="true">' + dots + '</div>' +
          '<div class="journey-nav__pos">' + pill(current[2], color) + '</div>' +
          '<div class="journey-nav__count">' + (idx + 1) + ' of ' + total + '</div>' +
        '</div>' +
        nextHtml +
      '</div>' +
    '</nav>';

  // ── Inject before .thread-bottom-cta or at end of main ───────────────────
  function inject() {
    var target = document.querySelector('.thread-bottom-cta') ||
                 document.querySelector('footer.site-footer');
    if (!target) return;
    var el = document.createElement('div');
    el.innerHTML = html;
    target.parentNode.insertBefore(el.firstChild, target);
  }

  // ── Populate context ribbon with orientation data ──────────────────────────
  function populateRibbon() {
    var ribbon = document.getElementById('contextRibbon');
    if (!ribbon) return;

    // Build era progress dots (small, for the ribbon)
    var ribbonDots = '';
    for (var e = 0; e < eraNums.length; e++) {
      var en = eraNums[e];
      var ec = ERA_COLORS[en];
      var isAct = (en === current[3]);
      var isPast = (en < current[3]);
      var s = 'display:inline-block;width:6px;height:6px;border-radius:50%;margin:0 2px;vertical-align:middle;' +
        (isAct  ? 'background:' + ec + ';transform:scale(1.5);box-shadow:0 0 0 2px ' + hexToRgba(ec, 0.25) :
         isPast ? 'background:' + hexToRgba(ec, 0.5) :
                  'background:rgba(255,255,255,0.15)');
      ribbonDots += '<span aria-hidden="true" title="' + eraLabels[e] + '" style="' + s + '"></span>';
    }

    var statsEl = ribbon.querySelector('#ribbonStats');
    if (statsEl) {
      statsEl.innerHTML =
        '<span class="context-ribbon__era-badge" style="background:' + hexToRgba(color, 0.18) + ';border-color:' + hexToRgba(color, 0.4) + ';color:' + color + '">' +
          'Era ' + current[3] + ' · ' + current[2] +
        '</span>' +
        '<span class="context-ribbon__divider" aria-hidden="true">·</span>' +
        '<span class="context-ribbon__stat" style="white-space:nowrap">' +
          '<strong>' + (idx + 1) + '</strong> of ' + total +
        '</span>' +
        '<span class="context-ribbon__divider" aria-hidden="true">·</span>' +
        '<span aria-hidden="true" style="display:inline-flex;align-items:center;gap:2px">' + ribbonDots + '</span>';
    }
    ribbon.classList.add('context-ribbon--thread');
  }

  function initAll() {
    inject();
    populateRibbon();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})();
