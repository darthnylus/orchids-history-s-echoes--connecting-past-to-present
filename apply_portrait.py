import os, re, glob

# Step 1: Add portrait CSS to thread-page.css
portrait_css = """
/* Full-width portrait image (Imhotep layout) */
.thread-hero__portrait {
  width: 100%;
  max-height: 520px;
  object-fit: cover;
  object-position: center top;
  display: block;
  border-bottom: 3px solid rgba(184,151,42,.35);
}
"""

css_path = 'css/thread-page.css'
with open(css_path, encoding='utf-8') as f:
    css = f.read()

if 'thread-hero__portrait' not in css:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write(portrait_css)
    print('Added portrait CSS to thread-page.css')
else:
    print('Portrait CSS already present')

# ── Step 2: Available images ────────────────────────────────
all_images = set(os.listdir('images'))

def img_exists(name):
    return name in all_images

def score_image(fname):
    score = 0
    if fname.endswith('.webp'): score += 3
    elif fname.endswith('.jpg') or fname.endswith('.png'): score += 1
    if '-800' in fname: score -= 2
    if fname.startswith('card-'): score -= 1
    if fname.startswith('hero-'): score -= 1
    if fname.startswith('explore-'): score -= 1
    return score

# ── Explicit slug -> image map ──────────────────────────────
explicit_map = {
    'redlining':           'holc-redlining-philadelphia.jpg',
    'tulsa':               'built-by-black-hands.webp',
    'cointelpro':          'cointelpro-fbi-doc.jpg',
    'mansa-musa':          'mansa-musa-catalan-atlas.jpg',
    'gi-bill':             'march-on-washington-wide.jpg',
    'great-migration':     'march-on-washington-wide.jpg',
    'black-panthers':      'fred-hampton-portrait.jpg',
    'fred-hampton':        'fred-hampton-portrait.jpg',
    'civil-rights':        'march-on-washington-wide.jpg',
    'brown-v-board':       'march-on-washington-wide.jpg',
    'rosa-parks':          'rosa-parks.webp',
    'malcolm-x':           'malcolm-x-portrait.webp',
    'harriet-tubman':      'harriet-tubman.webp',
    'ida-wells':           'ida-b-wells.webp',
    'bayard-rustin':       'bayard-rustin-march.webp',
    'slave-trade':         'slave-ship-brookes.jpg',
    'domestic-slave-trade':'slave-ship-brookes.jpg',
    'end-of-slavery':      'slave-ship-brookes.jpg',
    'jim-crow':            'plessy-segregated-fountains.webp',
    'black-codes':         'plessy-segregated-fountains.webp',
    'convict-leasing':     'plessy-segregated-fountains.webp',
    'negro-league':        'negro-league-allstar-1936.jpg',
    'jackie-robinson':     'jackie-robinson-dodgers.jpg',
    'hbcu':                'hbcu-football-virginia.jpg',
    'aksum':               'axum-obelisk.webp',
    'great-zimbabwe':      'axum-obelisk.jpg',
    'nzinga':              'nzinga-christening.jpg',
    'moors':               'moors-riders.png',
    'african-empires':     'great-mosque-djenne.jpg',
    'african-mathematics': 'sankore-mosque.jpg',
    'pharaohs':            'black-pharaohs.webp',
    'nubia':               'meroe-pyramids.webp',
    'mali':                'great-mosque-djenne.jpg',
    'songhai':             'songhai-djenne-mosque.webp',
    'timbuktu':            'timbuktu-manuscripts.jpg',
    'benin':               'benin-bronze-oba.jpg',
    'askia':               'askia-tomb.jpg',
    'sundiata':            'explore-person-sundiata.jpg',
    'human-migration':     'pangeaworldmap.png',
    'african-origins-humanity': 'meroe-pyramids.webp',
    'haitian-revolution':  'built-by-black-hands.webp',
    'haiti':               'built-by-black-hands.webp',
    'crack-epidemic':      'southern-strategy.png',
    'george-floyd':        'march-on-washington-wide.jpg',
    'blm':                 'march-on-washington-wide.jpg',
    'ferguson':            'march-on-washington-wide.jpg',
    'march-on-washington': 'march-on-washington-wide.jpg',
    'birmingham':          'march-on-washington-wide.jpg',
    'smith-carlos':        'smith-carlos-1968-olympics.jpg',
    'black-athletes':      'smith-carlos-1968-olympics.jpg',
    'harlem-renaissance':  'harlem-renaissance-liberty.png',
    'gordon-parks':        'harlem-renaissance-liberty.png',
    'black-film':          'harlem-renaissance-liberty.png',
    'black-arts':          'harlem-renaissance-liberty.png',
    'black-press':         'harlem-renaissance-liberty.png',
    'black-culture':       'harlem-renaissance-liberty.png',
    'gentrification':      'holc-redlining-philadelphia.jpg',
    'displacement':        'holc-redlining-philadelphia.jpg',
    'environmental':       'holc-redlining-philadelphia.jpg',
    'blumenbach':          'blumenbach-portrait.webp',
    'what-racism':         'blumenbach-portrait.webp',
    'beverly-tatum':       'blumenbach-portrait.webp',
    'green-sahara':        'great-mosque-djenne.jpg',
    'predynastic':         'meroe-pyramids.webp',
    'maya-angelou':        'maya-angelou.webp',
    'garvey':              'explore-person-garvey.jpg',
    'before-mayflower':    'slave-ship-brookes.jpg',
    'arab-slave-trade':    'slave-ship-brookes.jpg',
    'code-noir':           'slave-ship-brookes.jpg',
    'cotton':              'slave-ship-brookes.jpg',
    'abolitionism':        'slave-ship-brookes.jpg',
    'banjo-blues':         'harlem-renaissance-liberty.png',
    'jazz-blues':          'harlem-renaissance-liberty.png',
    'gangsta-rap':         'harlem-renaissance-liberty.png',
    'graffiti':            'harlem-renaissance-liberty.png',
    'claudette-colvin':    'rosa-parks.webp',
    'george-stinney':      'southern-strategy.png',
    'lake-lanier':         'lake-lanier-underwater-graves.png',
    'southern-strategy':   'southern-strategy.png',
    'george-wallace':      'southern-strategy.png',
    'greenwood':           'built-by-black-hands.webp',
    'blaxploitation':      'harlem-renaissance-liberty.png',
    'fried-chicken':       'harlem-renaissance-liberty.png',
    'black-church':        'march-on-washington-wide.jpg',
    'hidden-figures':      'march-on-washington-wide.jpg',
    'baldwin':             'harlem-renaissance-liberty.png',
    'dubois':              'march-on-washington-wide.jpg',
    'frederick-douglass':  'march-on-washington-wide.jpg',
    'fannie-lou-hamer':    'march-on-washington-wide.jpg',
    'education':           'hbcu-football-virginia.jpg',
    'freedom-riders':      'march-on-washington-wide.jpg',
    'emmett-till':         'march-on-washington-wide.jpg',
    'chicago':             'holc-redlining-philadelphia.jpg',
    'detroit':             'holc-redlining-philadelphia.jpg',
    'greek-philosophy':    'sankore-mosque.jpg',
    'dahomey':             'great-mosque-djenne.jpg',
    'african-spiritual':   'sankore-mosque.jpg',
    'foia':                'cointelpro-fbi-doc.jpg',
    'france-neocolonialism':'built-by-black-hands.webp',
    'attica':              'southern-strategy.png',
    'bail-system':         'southern-strategy.png',
    'capital-punishment':  'southern-strategy.png',
    'mass-incarceration':  'southern-strategy.png',
    'algorithmic':         'southern-strategy.png',
    'gangs':               'southern-strategy.png',
    'colfax':              'march-on-washington-wide.jpg',
    'ebenezer-creek':      'slave-ship-brookes.jpg',
    'core':                'march-on-washington-wide.jpg',
    'buffalo-soldiers':    'march-on-washington-wide.jpg',
    'golden-thirteen':     'march-on-washington-wide.jpg',
    'double-v':            'march-on-washington-wide.jpg',
    'exodusters':          'march-on-washington-wide.jpg',
    'freedmens-bureau':    'march-on-washington-wide.jpg',
    'freedmens-bank':      'march-on-washington-wide.jpg',
    'black-mayors':        'march-on-washington-wide.jpg',
    'black-women':         'march-on-washington-wide.jpg',
    'black-feminism':      'march-on-washington-wide.jpg',
    'black-lgbtq':         'march-on-washington-wide.jpg',
    'black-mental-health': 'march-on-washington-wide.jpg',
    'black-maternal':      'march-on-washington-wide.jpg',
    'dei':                 'march-on-washington-wide.jpg',
    'affirmative-action':  'march-on-washington-wide.jpg',
    'deindustrialization': 'holc-redlining-philadelphia.jpg',
    'guatemala':           'southern-strategy.png',
    'medical-apartheid':   'march-on-washington-wide.jpg',
    'bruces-beach':        'holc-redlining-philadelphia.jpg',
    'corbin':              'march-on-washington-wide.jpg',
    'fear-of-assembly':    'march-on-washington-wide.jpg',
    'greensboro-massacre': 'march-on-washington-wide.jpg',
    'detroit-1943':        'march-on-washington-wide.jpg',
    'black-farmers':       'march-on-washington-wide.jpg',
    'booker-t':            'march-on-washington-wide.jpg',
    'eo8802':              'march-on-washington-wide.jpg',
    # person pages
    'tubman':              'harriet-tubman.webp',
    'wells':               'ida-b-wells.webp',
    'rustin':              'bayard-rustin-march.webp',
    'parks':               'rosa-parks.webp',
    'hamer':               'march-on-washington-wide.jpg',
    'angelou':             'maya-angelou.webp',
    'malcolm':             'malcolm-x-portrait.webp',
    'hampton':             'fred-hampton-portrait.jpg',
    'douglas':             'march-on-washington-wide.jpg',
    'douglass':            'march-on-washington-wide.jpg',
    'du-bois':             'march-on-washington-wide.jpg',
    'marshall':            'explore-person-marshall.jpg',
    'houston':             'explore-person-houston.jpg',
    'medgar':              'explore-person-medgar.jpg',
    'queen-nzinga':        'nzinga-portrait-lithograph.jpg',
    'john-brown':          'explore-person-john-brown.jpg',
    'sojourner':           'explore-person-sojourner-truth.jpg',
    'sundiata-keita':      'explore-person-sundiata.jpg',
    'askia-mohammed':      'askia-mohammed-portrait.webp',
}

DEFAULT_IMAGE = 'hieroglyphics-bg.png'

def find_image(slug):
    # 1. Exact explicit match
    for key, img in explicit_map.items():
        if slug == key and img_exists(img):
            return img
    # 2. Partial explicit match
    for key, img in explicit_map.items():
        if key in slug and img_exists(img):
            return img
    # 3. Fuzzy filename match
    candidates = []
    slug_words = [w for w in slug.replace('-', ' ').split() if len(w) > 3]
    for img in all_images:
        img_lower = img.lower().replace('-', ' ').replace('_', ' ')
        if any(w in img_lower for w in slug_words):
            candidates.append(img)
    if candidates:
        candidates.sort(key=lambda x: -score_image(x))
        return candidates[0]
    return DEFAULT_IMAGE

# ── Step 3: Inject portrait into all thread/person pages ────
html_files = glob.glob('thread-*.html') + glob.glob('person-*.html')
updated, already_done, skipped = [], [], []

for fpath in sorted(html_files):
    with open(fpath, encoding='utf-8') as f:
        content = f.read()

    if 'thread-hero__portrait' in content:
        already_done.append(fpath)
        continue

    slug = fpath.replace('thread-', '').replace('person-', '').replace('.html', '')
    img_file = find_image(slug)
    alt = slug.replace('-', ' ').title()

    img_tag = f'\n<img src="images/{img_file}" alt="{alt}" class="thread-hero__portrait" loading="eager" />'

    new_content = re.sub(
        r'(</section>)\s*\n(<div class="argument-bar")',
        r'\1' + img_tag + '\n' + r'\2',
        content,
        count=1
    )

    if new_content == content:
        # Person-page pattern A: </header> before <div class="person-body">
        new_content = re.sub(
            r'(</header>)\s*\n(<div class="person-body")',
            r'\1' + img_tag + '\n' + r'\2',
            content,
            count=1
        )

    if new_content == content:
        # Person-page pattern B: </section> before <div class="stat-bar">
        new_content = re.sub(
            r'(</section>)\s*\n\n(<div class="stat-bar")',
            r'\1' + img_tag + '\n\n' + r'\2',
            content,
            count=1
        )

    if new_content == content:
        # Person-page pattern C: second </header> before <div class="stat-bar">
        new_content = re.sub(
            r'(</header>)\s*\n\n(<div class="stat-bar")',
            r'\1' + img_tag + '\n\n' + r'\2',
            content,
            count=1
        )

    if new_content == content:
        skipped.append(fpath)
        continue

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    updated.append((fpath, img_file))

print(f'Updated:      {len(updated)}')
print(f'Already done: {len(already_done)}')
print(f'Skipped:      {len(skipped)}')
if skipped:
    print('Skipped:', skipped[:10])
print('\nSample:')
for f, img in updated[:12]:
    print(f'  {f} -> {img}')
