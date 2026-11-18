"""Build the personal website from the reviewed content registry and approved artwork."""
from pathlib import Path
import json, html, re
from portfolio_links import mark_outbound
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'scripts/site-content.json').read_text())
CASES={c['id']:c for c in DATA['case_plans']}
def e(v):return html.escape(str(v),quote=True)
def clean(v):
    v=re.sub(r'(?<=[a-z])(?=\d{2,})',' ',v)
    return v.replace('14-minute','14-minute').replace('TIBO2012third','TIBO 2012 third').replace('Website2013first','Website 2013 first').replace('TIBO2014second','TIBO 2014 second')
PORT='/downloads/Sergey_Ulyanov_Portfolio.pdf'
CV='/downloads/Sergey_Ulyanov_Resume.pdf'
HEADLINE='Creative Lead & Creative Technologist'
def head(title,description,route='/',image='/assets/work-2026/sergey-green-portrait.webp'):
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#080A08"><meta name="color-scheme" content="dark"><meta name="description" content="{e(description)}"><meta name="author" content="Sergéy Ulyanov"><meta name="robots" content="index,follow,max-image-preview:large"><meta name="google-site-verification" content="koKB_BiwCWkfpYI-QJKp0bZKgwkoBjAumQz3xi5W_uU"><link rel="canonical" href="https://sergey-ulyanov.pro{route}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><title>{e(title)} — Sergéy Ulyanov</title><meta property="og:type" content="website"><meta property="og:url" content="https://sergey-ulyanov.pro{route}"><meta property="og:title" content="{e(title)} — Sergéy Ulyanov"><meta property="og:description" content="{e(description)}"><meta property="og:image" content="https://sergey-ulyanov.pro{image}"><meta property="og:image:alt" content="{e(title)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(title)} — Sergéy Ulyanov"><meta name="twitter:description" content="{e(description)}"><meta name="twitter:image" content="https://sergey-ulyanov.pro{image}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/styles-personal.css?v=20261118-proof-audit-2"><script type="application/ld+json">{json.dumps({'@context':'https://schema.org','@type':'WebPage','name':title,'url':'https://sergey-ulyanov.pro'+route,'dateModified':'2026-11-17','author':{'@type':'Person','name':'Sergéy Ulyanov','url':'https://sergey-ulyanov.pro/','jobTitle':HEADLINE,'sameAs':['https://www.linkedin.com/in/charaunic/']}},ensure_ascii=False)}</script></head><body><a class="skip-link" href="#main">Skip to content</a>'''
def nav(route='/'):
    items=[('/work/','Work'),('/case-studies/community-advocacy/','Community'),('/research/','Research'),('/press/#articles','Articles'),('/hire/','About')]
    current=route if route=='/case-studies/community-advocacy/' else ('/work/' if route.startswith('/case-studies/') else route)
    links=''.join(f'<a href="{url}"'+(' aria-current="page"' if url==current else '')+f'>{label}</a>' for url,label in items)
    return f'''<nav class="personal-nav" aria-label="Primary"><div class="wrap nav-inner"><a class="wordmark" href="/" aria-label="Sergéy Ulyanov home"><span>SERGÉY</span><img src="/assets/sergey-bolt-circle.svg" width="37" height="40" alt=""><span>ULYANOV</span></a><div class="nav-links">{links}<a class="nav-cta" href="{CV}">Résumé ↗</a></div></div></nav>'''
def footer():return '''</main><footer class="footer"><div class="wrap footer-inner"><span>© 2026 SERGÉY ULYANOV · LOS ANGELES</span><span><a href="/press/">SPEAKING &amp; MEDIA</a> · <a href="/evidence/#awards">RECOGNITION</a> · <a href="/#contact">CONTACT</a> · <a href="/privacy/">PRIVACY</a></span></div></footer><div class="consent" id="analytics-consent" hidden><p>Optional analytics help improve this portfolio. No advertising profiles.</p><div><button type="button" data-consent="decline">No thanks</button><button type="button" data-consent="accept">Allow analytics</button></div><a href="/privacy/">Privacy</a></div><script src="/site.js?v=20261113-rails" defer></script></body></html>'''
def orbit():return '''<svg class="orbit-field" viewBox="0 0 600 600" aria-hidden="true"><ellipse class="track" cx="300" cy="300" rx="275" ry="235" transform="rotate(-25 300 300)"/><circle class="track dashed" cx="300" cy="300" r="235"/><circle class="track fine" cx="300" cy="300" r="185"/><ellipse class="track fine" cx="300" cy="300" rx="285" ry="170" transform="rotate(55 300 300)"/><g class="orbit-motion"><circle class="planet" cx="300" cy="65" r="6"/><circle class="planet-outline" cx="65" cy="300" r="12"/><circle class="planet" cx="300" cy="535" r="4"/></g><g class="orbit-motion reverse"><circle class="planet-outline" cx="485" cy="300" r="8"/><circle class="planet" cx="115" cy="300" r="4"/><circle class="planet-outline" cx="300" cy="115" r="5"/></g></svg>'''
SHORT={'calpoly_aws_ehs':'EHS Mentor','mcdonalds_mchappy_day':'McHappy Day','cornetto_together_apart':'Together Apart','nostalgai_music_releases':'Music, from artwork to release','mageworx_commerce':'Make the product benefit visible','volkswagen_tiguan':'One Tiguan, Four Takes','fanta_winter':'Taste This Winter','sony_entertainment':'Artist releases & entertainment','scream7_complex':'SCREAM 7','societe_generale':'A connected banking identity','basf_frandesa':'The Battle for the Harvest','community_campaigns':'Community work'}
OUT={'calpoly_aws_ehs':'Presented workflow prototype · Cal Poly DxHub × AWS','mcdonalds_mchappy_day':'200K registrations · $230K+ donations','cornetto_together_apart':'Campaign → film presented in Cannes → series','nostalgai_music_releases':'Artwork · prepress · launch content · commerce','mageworx_commerce':'Feature-led ads · reusable Figma layouts','volkswagen_tiguan':'TV · digital · outdoor · social','fanta_winter':'Concepts · scripts · storyboards · animation','sony_entertainment':'Release concepts · cover art · PR','scream7_complex':'Official competition winner · Complex LA exhibition','societe_generale':'4× YoY conversions across broader digital work','basf_frandesa':'14-minute film · HR Brand team partner prize','community_campaigns':'Health outreach · youth initiatives · immigrant stories'}
SHORT.update({cid:CASES[cid]['title'] for cid in ('web_design','video_editing','x_factor','collodi_poster','mcdonalds_campaigns')})
OUT.update({
    'web_design':'Four projects · commerce, services and portfolios',
    'video_editing':'Watch four edits · ads, motion and performance',
    'x_factor':'Rehearsals · graphics · backstage video',
    'collodi_poster':'International exhibition and catalogue selection',
    'mcdonalds_campaigns':'Localized campaigns · packaging · restaurants',
})
def card(cid,feature=False):
    c=CASES[cid]
    return f'''<article class="case-card{' feature-case' if feature else ''}"><a href="{c['route']}"><div class="card-art"><img src="{c['preview']}" width="800" height="570" alt="{e(c.get('preview_caption',c['hero_caption']))}" loading="lazy" decoding="async"></div><div class="card-brand"><img src="{c['logo']}" class="brand-logo" alt="" width="110" height="34"><span class="card-context">{e(c['brand'])}</span></div><h3>{e(SHORT[cid])}</h3><p>{e(c['card_summary'])}</p><span class="card-outcome">{e(OUT[cid])}</span><span class="open-case">Explore the case ↗</span></a></article>'''
def section_head(kicker,title,detail='',link=''):
    return f'<div class="section-head"><div><div class="eyebrow">{e(kicker)}</div><h2>{e(title)}</h2></div>'+ (f'<p>{e(detail)}</p>' if detail else '')+(f'<a class="text-link" href="/work/">{e(link)} ↗</a>' if link else '')+'</div>'
def rail_controls(name,label):
    return f'<div class="rail-controls" hidden><button type="button" data-prev="{name}" aria-label="Previous {label}" aria-controls="rail-{name}"><span aria-hidden="true">←</span></button><button type="button" data-next="{name}" aria-label="Next {label}" aria-controls="rail-{name}"><span aria-hidden="true">→</span></button></div>'
def rail_start(name,label,classes=''):
    return f'<div class="card-rail {classes}" id="rail-{name}" data-rail="{name}" role="region" aria-label="{label}" tabindex="0">'
def rail_footer(name,total,link='',label=''):
    return f'<div class="rail-footer"><span class="rail-status" data-rail-status="{name}"><span data-current="{name}">01</span> / {total:02d} <span>· Swipe or use arrows</span></span>'+ (f'<a class="text-link" href="{link}">{label} ↗</a>' if link else '')+'</div>'
def rail_heading(kicker,title,name,label,detail=''):
    return '<div class="section-head rail-heading"><div><div class="eyebrow">'+e(kicker)+'</div><h2>'+e(title)+'</h2>'+('<p>'+e(detail)+'</p>' if detail else '')+'</div>'+rail_controls(name,label)+'</div>'
def research_block():return '''<section class="section" id="research"><div class="wrap"><div class="research-box"><div class="research-copy"><div class="eyebrow">Independent research / In development</div><h2>Who gets to teach AI what a culture means?</h2><p>Unmute Belarus is an independent project about how AI uses sources on Belarusian culture and language. Joy of Phonetics is a pronunciation practice prototype.</p><p>In a GUCHNA diagnostic, 13 of 28 test requests reached the ranking stage. The technical report explains what the earlier failures revealed about the system.</p><div class="case-links"><a class="text-link" href="/research/">Explore the research ↗</a><a class="text-link" href="/downloads/GUCHNA-Technical-Report-v1.0.pdf">Read the GUCHNA report (PDF) ↗</a></div></div><div class="research-map" aria-label="Research process: sources, interpretation, review"><div><small>01 / SOURCES</small><strong>Archives, language, lived culture</strong></div><div><small>02 / INTERPRETATION</small><strong>Make the reasoning visible</strong></div><div><small>03 / REVIEW</small><strong>Trace, question, test</strong></div></div></div></div></section>'''
def case_mark(c):
    if c['id']=='community_campaigns':
        return '<div class="community-context-marks" aria-label="Separate health, immigrant storytelling and youth contexts"><img class="brand-logo mark-global" src="/assets/work-2026/global-fund.svg" width="150" height="45" alt="The Global Fund"><img class="brand-logo mark-hrf" src="/assets/work-2026/human-rights-first.svg" width="96" height="50" alt="Human Rights First"><img class="brand-logo mark-unicef" src="'+c['logo']+'" width="150" height="45" alt="UNICEF"></div>'
    return '<img class="case-brand-logo brand-logo" src="'+c['logo']+'" alt="'+e(c['brand'])+'" width="150" height="60">'
def downloads():return f'''<div class="downloads"><a class="download-card" href="{PORT}"><span><strong>Selected portfolio</strong><small>SELECTED WORK · PDF</small></span><b>↓</b></a><a class="download-card" href="{CV}"><span><strong>Résumé</strong><small>CREATIVE LEADERSHIP · PRODUCTION · APPLIED AI</small></span><b>↓</b></a></div>'''
# Main homepage source remains readable in canonical ordered fragments.
frag=ROOT/'site-fragments'
(frag/'00-head.html').write_text(head(HEADLINE,'Campaigns, video, product storytelling and AI-assisted workflows. Selected work and independent cultural research by Los Angeles-based creative lead Sergéy Ulyanov.')+nav()+'<main id="main">')
(frag/'01-hero.html').write_text(f'''<section class="hero" id="top"><div class="wrap hero-grid"><div class="hero-text"><div class="eyebrow">CREATIVE LEADERSHIP × APPLIED AI × CULTURE</div><h1>Creative ideas.<br><span>Working systems.</span></h1><p class="hero-copy">I connect strategy, storytelling and hands-on production — from brand campaigns and video to digital products and AI-assisted workflows.</p><div class="status">Los Angeles · U.S. work authorized · Open to roles and selected collaborations</div><div class="hero-actions"><a class="btn primary" href="#work">Explore the work ↗</a><a class="btn" href="{PORT}">Portfolio PDF ↓</a><a class="btn" href="{CV}">Résumé ↓</a></div></div><div class="portrait-universe"><img src="/assets/work-2026/sergey-green-portrait.webp" alt="Sergéy Ulyanov in a black shirt with green light and orbital lines" width="960" height="1200" fetchpriority="high" decoding="async">{orbit()}<span class="portrait-caption">STRATEGY · CREATIVE · SYSTEMS</span></div></div></section>''')
(frag/'01b-routes.html').write_text('')
brandids=['mcdonalds_mchappy_day','volkswagen_tiguan','fanta_winter','scream7_complex','sony_entertainment','calpoly_aws_ehs','basf_frandesa','community_campaigns']
(frag/'02-metrics-brands.html').write_text('<section class="brand-section"><div class="wrap"><div class="brand-grid" aria-label="Selected project contexts">'+''.join(f'<a href="{CASES[k]["route"]}"><img class="brand-logo" src="{CASES[k]["logo"]}" alt="{e(CASES[k]["brand"])}" width="140" height="55"></a>' for k in brandids)+'</div><p class="brand-note">Selected agency, employer, partner and independent-project contexts. See each case for my role.</p></div></section>')
(frag/'03-work.html').write_text('<section class="section" id="work"><div class="wrap">'+rail_heading('Selected work','A clear idea. A real thing made.','work','projects')+rail_start('work','Selected projects','project-rail')+''.join(card(k,True) for k in DATA['home_case_priority'])+'</div>'+rail_footer('work',len(DATA['home_case_priority']),'/work/','View every case')+'</div></section>')
(frag/'04-capabilities-manifesto.html').write_text('''<section class="section" id="approach"><div class="wrap">'''+rail_heading('How I work','From the first question to the final file.','approach','work stages')+'''<div class="capability-grid card-rail mobile-rail" id="rail-approach" data-rail="approach" role="region" aria-label="Work stages" tabindex="0"><article><span>01 / DEFINE</span><h3>Find the idea.</h3><p>Audience insight, creative strategy, concepts, messaging and scripts grounded in the task.</p></article><article><span>02 / MAKE</span><h3>Get hands-on.</h3><p>Shoots, talent direction, editing, motion and digital layouts. Creative judgment through production.</p></article><article><span>03 / CONNECT</span><h3>Build the system.</h3><p>Campaign toolkits, product storytelling, reusable templates and AI-assisted workflow prototypes.</p></article><article><span>04 / DELIVER</span><h3>Keep it moving.</h3><p>Partner coordination, reviews and approvals, channel adaptations and a useful next iteration.</p></article></div>'''+rail_footer('approach',4)+'''</div></section>''')
# Community before research, then recognition. File names retain deterministic sorting.
community=CASES['community_campaigns']
community_cards=[
    ('health','Community health','Booklets, posters, websites and outreach for Vstrecha, a Global Fund partner in Belarus.','/case-studies/community-advocacy/#health',{'src':'/assets/work-2026/community-0.webp','caption':'Illustrative cover for community health outreach'},'/assets/work-2026/global-fund.svg','The Global Fund','See the outreach work'),
    ('migration','Immigrant stories','A Human Rights First profile, podcast interviews and the Refugee Storytellers Collective.','/case-studies/community-advocacy/#migration',{'src':'/assets/work-2026/community-1.webp','caption':'Symbolic portfolio cover based on Sergéy’s photograph'},'/assets/work-2026/human-rights-first.svg','Human Rights First','Read and listen'),
    ('youth','Youth & mentoring','Media, mentoring and volunteer work in BELAU and UNICEF contexts.','/case-studies/community-advocacy/#youth',{'src':'/assets/work-2026/community-2.webp','caption':'Illustrative cover for youth media and mentoring'},community['logo'],'UNICEF','See the youth work'),
    ('culture','Language & culture','Unmute Belarus: an independent project exploring archives, language and AI.','https://research.sergey-ulyanov.pro/system/?lang=en',{'src':'/assets/portfolio/belarus-zubr-emblem.webp','caption':'Zubr illustration for Unmute Belarus'},None,'Unmute Belarus','Explore the research')
]
def community_section():
    section='<section class="community-band" id="community"><div class="wrap">'+rail_heading('Community and advocacy','Creativity with purpose.','community','community projects','Stories, tools and practical work that help people stay informed, connected and heard.')+rail_start('community','Community projects','community-rail')
    for key,title,description,url,visual,logo,context,cta in community_cards:
        mark=f'<img class="community-mark" src="{logo}" alt="{e(context)}" width="140" height="42">' if logo else '<span class="community-wordmark">UNMUTE<br>BELARUS</span>'
        section+=f'<a href="{url}" class="community-item community-{key}"><img class="community-image" src="{visual["src"]}" alt="{e(visual["caption"])}" width="600" height="800" loading="lazy" decoding="async"><div class="community-context">{mark}</div><div class="community-copy"><h3>{e(title)}</h3><p>{e(description)}</p><span class="community-cta">{e(cta)} ↗</span></div></a>'
    return section+'</div>'+rail_footer('community',len(community_cards),'/case-studies/community-advocacy/','Read about the community work')+'</div></section>'
comm=community_section()
(frag/'05-recognition.html').write_text(comm)
(frag/'05b-public-work.html').write_text(research_block())
recognitions=DATA['recognition']
def recognition_card(record):
    tag='a'
    href=f' href="{e(record.get("href", "/evidence/#award-"+record["id"]))}"'
    image=record.get('image')
    if record.get('inset'):
        visual=f'<div class="recognition-art recognition-art-scream"><img src="{record["image"]}" alt="{e(record["alt"])}" loading="lazy" width="1024" height="1280"><img src="{record["inset"]}" alt="{e(record["inset_alt"])}" loading="lazy" width="1024" height="576"></div>'
    elif image:
        visual=f'<div class="recognition-art"><img src="{image}" alt="{e(record["alt"])}" loading="lazy" width="1200" height="750"></div>'
    else:
        visual=f'<div class="recognition-art recognition-type" aria-hidden="true"><span>{e(record["year"])}</span></div>'
    credit=e(record['issuer']+' · '+record['year'])
    return f'<{tag} class="recognition-card"{href}>{visual}<div class="recognition-copy"><span class="detail-label">{credit}</span><h3>{e(record["title"])}</h3><p>{e(record["description"])}</p></div></{tag}>'
recognition='<section class="section" id="recognition"><div class="wrap">'+rail_heading('Recognition','Awards, exhibitions and selections.','recognition','recognition')+rail_start('recognition','Awards and recognition','recognition-rail')
recognition+=''.join(recognition_card(record) for record in recognitions)
recognition+='</div>'+rail_footer('recognition',len(recognitions),'/evidence/#awards','Full recognition record')+'</div></section>'
# Preserve the existing working inquiry form; no new contact service or data collection.
old=(frag/'06-contact-tail.html').read_text();form=re.search(r'<details class="inquiry-disclosure">.*?</details>',old,re.S)
contact=f'''<section class="contact-section" id="contact"><div class="wrap"><div class="contact-grid"><div><div class="eyebrow">Let’s connect</div><h2>Have a role or project<br>in mind?</h2><p>Tell me what you’re hiring for or what you’d like to make.</p><div class="contact-actions"><a class="btn primary" href="mailto:ulyanoow@gmail.com">Email me ↗</a><a class="btn" href="https://www.linkedin.com/in/charaunic/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div></div>{downloads()}</div>{form.group(0) if form else ''}</div></section>'''
(frag/'06-contact-tail.html').write_text(recognition+contact+footer())
# Case groups set both the navigation order and the route back from each case.
groups=[
    ('campaigns','Campaigns, film and entertainment',['mcdonalds_mchappy_day','cornetto_together_apart','volkswagen_tiguan','scream7_complex','sony_entertainment','nostalgai_music_releases','fanta_winter','mcdonalds_campaigns','basf_frandesa','video_editing','x_factor','collodi_poster']),
    ('products','Digital products, commerce and AI',['calpoly_aws_ehs','web_design','societe_generale','mageworx_commerce']),
]
trails={cid:(anchor,title,ids[(n+1) % len(ids)]) for anchor,title,ids in groups for n,cid in enumerate(ids)}
def links(items):
    if not items:
        return ''
    return '<ul class="case-links">'+''.join(f'<li><a class="text-link" href="{e(item["href"])}">{e(item["label"])} ↗</a></li>' for item in items)+'</ul>'

# Standalone case pages, with clear roles and sources.
for cid,c in CASES.items():
    path=ROOT/c['route'].strip('/')/'index.html';path.parent.mkdir(parents=True,exist_ok=True)
    anchor,group,next_id=trails.get(cid,('community','Community',None))
    next_link=f'<a class="btn primary" href="{CASES[next_id]["route"]}">Next: {e(SHORT[next_id])} →</a>' if next_id else ''
    hero=c['hero']
    hw,hh=c.get('hero_dimensions',(1600,1000))
    hero_attrs=f'width="{hw}" height="{hh}" fetchpriority="high"'
    if c.get('hero_srcset'):
        hero_attrs+=f' srcset="{e(c["hero_srcset"])}" sizes="(max-width: 900px) 94vw, 1180px"'
    hero_img=f'<img src="{hero}" alt="{e(c["hero_caption"])}" {hero_attrs}>'
    if c.get('hero_full'):
        hero_img=f'<a class="case-image-link" href="{e(c["hero_full"])}" target="_blank" rel="noopener" aria-label="View full image: {e(c["hero_caption"])}">{hero_img}<span aria-hidden="true">View full image ↗</span></a>'
    body=f"""<main id="main"><nav class="wrap case-trail" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/work/#{anchor}">{e(group)}</a><span aria-hidden="true">/</span><span aria-current="page">{e(SHORT[cid])}</span></nav><section class="case-hero"><div class="wrap"><div class="case-heading">{case_mark(c)}<div class="eyebrow">{e(c['brand'])}</div><h1>{e(SHORT[cid])}</h1><p class="deck">{e(c['card_summary'])}</p></div><div class="case-meta"><div><div class="detail-label">The task</div><p>{e(clean(c['task']))}</p></div><div><div class="detail-label">My role</div><p>{e(clean(c['role']))}</p></div></div></div></section>"""
    body+=f'<div class="wrap"><figure class="case-feature">{hero_img}<figcaption>{e(c["hero_caption"])}</figcaption></figure></div>'
    if cid=='community_campaigns':
        body+='<nav class="wrap library-tabs case-jumps" aria-label="Community topics"><a href="#health">Health outreach</a><a href="#youth">Youth media</a><a href="#migration">Refugee storytelling</a><a href="#charity">Charity events</a></nav>'
    if c['images']:
        body+='<section class="section case-gallery"><div class="wrap">'+section_head('Project gallery','Watch the edits' if cid=='video_editing' else ('Explore the sites' if cid=='web_design' else 'Selected work'))+f'<div class="gallery-grid{" portraits" if cid=="scream7_complex" else ""}{" interface-gallery" if cid=="calpoly_aws_ehs" else ""}">'
        for g in c['images']:
            title=g.get('title',g['caption'])
            action=g.get('action','Open full image' if g.get('full') else 'Open project')
            target=g.get('full',g.get('href'))
            framing={'poster':' class="gallery-poster"','native':' class="native-art"'}.get(g.get('framing'),'')
            gw,gh=g.get('dimensions',(1000,750))
            img_attrs=f'width="{gw}" height="{gh}" loading="lazy" decoding="async"'
            if g.get('srcset'):
                img_attrs+=f' srcset="{e(g["srcset"])}" sizes="(max-width: 720px) 94vw, (max-width: 1100px) 46vw, 560px"'
            image=f'<img src="{g["src"]}" alt="{e(title)}" {img_attrs}>'
            if target:
                ext=' target="_blank" rel="noopener"' if g.get('full') else ''
                image=f'<a class="case-image-link" href="{e(target)}"{ext} aria-label="{e(action if title in action else action+": "+title)}">{image}<span aria-hidden="true">{e(action)} ↗</span></a>'
            caption=f'<strong>{e(title)}</strong><span>{e(g["caption"])}</span>' if g.get('title') else e(g['caption'])
            body+=f'<figure{framing}>{image}<figcaption>{caption}</figcaption></figure>'
        body+='</div></div></section>'
    body+='<section class="section"><div class="wrap case-process"><div><div class="eyebrow">The work</div><h2>What I did.</h2></div><div class="process-list">'
    for n,step in enumerate(c['stages'],1):
        step_anchor=f' id="{e(step["anchor"])}"' if step.get('anchor') else ''
        visual=step.get('visual')
        art=''
        if visual:
            vw,vh=visual['dimensions']
            art=f'<figure class="step-art"><a class="case-image-link" href="{e(visual["src"])}" target="_blank" rel="noopener" aria-label="View full image: {e(visual["caption"])}"><img src="{e(visual["src"])}" alt="{e(visual["caption"])}" width="{vw}" height="{vh}" loading="lazy" decoding="async"><span aria-hidden="true">View full image ↗</span></a><figcaption>{e(visual["caption"])}</figcaption></figure>'
        body+=f'<article class="process-step"{step_anchor}><span>{n:02d}</span><div><h3>{e(step["title"])}</h3><p>{e(clean(step["text"]))}</p>{links(step.get("links"))}{art}</div></article>'
    sources=c.get('sources') or ([c['source']] if c.get('source') else [])
    body+=f'<section class="result-panel"><div class="eyebrow">Result / Project status</div><h2>{e(clean(c["result"]))}</h2><p class="scope">{e(clean(c["scope_note"]))}</p>{links(sources)}</section></div></div></section>'
    body+=f'<section class="cta-strip"><div class="wrap cta-box case-end"><a class="btn" href="/work/#{anchor}">← Back to {e(group.lower())}</a>{next_link}<a class="btn" href="{PORT}">Portfolio PDF ↗</a></div></section>'
    path.write_text(mark_outbound(head(c['title'],c['card_summary'],c['route'],c['hero'])+nav(c['route'])+body+footer()))
# Full library: ordered by strongest evidence and most distinct contributions.
body='<main id="main"><section class="library-hero"><div class="wrap"><div class="eyebrow">Case library</div><h1>Selected work</h1><p>Campaigns, film and digital products. See what each project asked for, what I made and where the work went.</p><nav class="library-tabs" aria-label="Work categories"><a href="#campaigns">Campaigns &amp; entertainment</a><a href="#products">Products &amp; AI</a><a href="#community">Community</a><a href="#research">Research</a></nav></div></section>'
for anchor,title,ids in groups:
    name='library-'+anchor
    gallery=rail_heading('Case library',title,name,title.lower())+rail_start(name,title,'case-grid mobile-library-rail')
    gallery+=''.join(card(cid) for cid in ids)+'</div>'+rail_footer(name,len(ids))
    body+=f'<section class="section" id="{anchor}"><div class="wrap">{gallery}</div></section>'
body+=community_section()
body+=research_block()+'''<section class="section"><div class="wrap">'''+section_head('Design and learning prototypes','Independent ideas in development.')+'''<div class="compact-experience"><article><div class="detail-label">Joy of Phonetics</div><h3>Recording to the next practice task.</h3><p>An ongoing pronunciation-learning prototype, with practitioner-led feedback and iteration.</p><p style="margin-top:16px"><a class="text-link" href="/joyofphonetics/">Explore the prototype ↗</a></p></article><article><div class="detail-label">Palacio / Design study</div><h3>An artist page, through review.</h3><p>A sanitized brand and artist-page design case, with feedback and iterations documented.</p><p style="margin-top:16px"><a class="text-link" href="/palacio-study/">Explore the design study ↗</a></p></article><article><div class="detail-label">Insight Cards / March 2026</div><h3>Reflection, one question at a time.</h3><p>A Gemini hackathon prototype for reflection and journaling, hosted in Google AI Studio.</p><p style="margin-top:16px"><a class="text-link" href="/insight-cards/">Explore the prototype ↗</a></p></article></div></div></section><section class="section"><div class="wrap">'''+section_head('Additional work','Experience beyond the case gallery.')+'''<div class="compact-experience"><article><div class="detail-label">LinkedIn / AI evaluation contribution</div><h3>Creative and multilingual judgment.</h3><p>Evaluate creative and multilingual AI responses, with scored, actionable feedback. Work is described at contribution level; confidential prompts and internal systems are not published.</p></article><article><div class="detail-label">Google via Cara Casting</div><h3>Speech data for AI training.</h3><p>Contribute Eastern European-accented English speech data through Cara Casting, connecting language awareness with voice performance.</p></article><article><div class="detail-label">AURORA / Retail strategy</div><h3>Useful communication under disruption.</h3><p>Wartime anti-crisis strategy and promotional creative for the Horizon Capital-backed retail network, adapting offers and messages to changing stock availability.</p></article><article><div class="detail-label">Ericsson-related language study</div><h3>Belarusian language expertise.</h3><p>Contributed Belarusian-language expertise to AI speech work. The public description preserves project confidentiality.</p></article></div></div></section><section class="cta-strip"><div class="wrap">'''+downloads()+'</div></section>'
(ROOT/'work/index.html').write_text(head('Selected work','Campaigns, film, music, product creative and applied AI — the task, my role, the work and the result.','/work/')+nav('/work/')+body+footer())
body='''<main id="main"><section class="library-hero"><div class="wrap"><div class="eyebrow">About / For hiring teams</div><h1>Creative judgment.<br>Hands-on follow-through.</h1><p>I’m a Los Angeles-based creative lead and creative technologist with more than 10 years across advertising, entertainment, production and marketing. I turn briefs into concepts, content and practical systems, with applied AI as one part of the toolkit.</p><p>My work moves between campaign strategy, shoots and editing, motion, product storytelling and workflow prototyping. I’m authorized to work in the U.S. and open to full-time roles and selected collaborations.</p></div></section><section class="section"><div class="wrap">'''+section_head('Selected experience','Range with a practical center.')+'<div class="case-grid">'+''.join(card(k) for k in ['mcdonalds_mchappy_day','calpoly_aws_ehs','cornetto_together_apart'])+'''</div></div></section><section class="section"><div class="wrap"><div class="compact-experience"><article><div class="detail-label">Creative leadership</div><h3>Keep the idea clear.</h3><p>Concepts, audience insight, scripts, messaging, creative direction and multi-channel campaign toolkits.</p></article><article><div class="detail-label">Video and motion</div><h3>Carry the idea into production.</h3><p>Shooting, talent direction, editing, motion and interface animation. Premiere, CapCut, After Effects, DaVinci Resolve and Figma.</p></article><article><div class="detail-label">Products and workflows</div><h3>Make complexity usable.</h3><p>Product-benefit copy, reusable layouts, commerce presentation and AI-assisted workflow prototypes.</p></article><article><div class="detail-label">Delivery</div><h3>Connect the people and the pieces.</h3><p>Production partners, stakeholder reviews, approvals and format adaptations — with responsibility for the final work.</p></article></div></div></section><section class="contact-section"><div class="wrap contact-grid"><div><div class="eyebrow">Current materials</div><h2>One person.<br>A connected body of work.</h2><p>The general résumé and portfolio bring together creative leadership, hands-on production and applied AI.</p><a class="btn primary" href="mailto:ulyanoow@gmail.com">Discuss an opportunity ↗</a></div>'''+downloads()+'</div></section>'
recommendations='''<section class="section collaborator-section" id="recommendations"><div class="wrap">'+section_head('Recommendations','What collaborators say.')+'<div class="collaborator-grid"><figure><blockquote>“I’ve known Sergéy for several years and have been impressed by his ability to bring structure, clarity, and momentum to complex creative projects.”</blockquote><figcaption><strong>Lisa Insana</strong><span>Executive in Charge of Production, Codega Media</span></figcaption></figure><figure><blockquote>“One of the things I've always appreciated about Sergéy is his curiosity and his ability to quickly connect ideas across different disciplines.”</blockquote><figcaption><strong>Paul Rysiavets</strong><span>Solutions Architect and Senior Cloud Engineer, CoVadem</span></figcaption></figure></div><a class="text-link" href="https://www.linkedin.com/in/charaunic/details/recommendations/">Read recommendations on LinkedIn ↗</a></div></section>'''
body=body.replace('<section class="contact-section">',recommendations+'<section class="contact-section">',1)
(ROOT/'hire/index.html').write_text(head('About / Hire','Creative leadership, campaigns, video production, product storytelling and applied AI. Los Angeles; U.S. work authorized.','/hire/')+nav('/hire/')+body+footer())
# Sitemap: preserve legitimate published destinations and include the expanded case library.
import xml.etree.ElementTree as ET
sp=ROOT/'sitemap.xml';tree=ET.parse(sp);ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
known={el.text for el in tree.findall('.//s:loc',ns)}
refreshed={CASES[cid]['route'] for cid in ('web_design','video_editing','x_factor','collodi_poster','calpoly_aws_ehs','volkswagen_tiguan','nostalgai_music_releases','community_campaigns','scream7_complex','mcdonalds_mchappy_day','mcdonalds_campaigns','x_factor')}
refreshed.update(('/', '/work/', '/evidence/', '/hire/', '/press/'))
for c in CASES.values():
    url='https://sergey-ulyanov.pro'+c['route']
    if url not in known:
        node=ET.SubElement(tree.getroot(),'{'+ns['s']+'}url');ET.SubElement(node,'{'+ns['s']+'}loc').text=url;ET.SubElement(node,'{'+ns['s']+'}lastmod').text='2026-11-17'
for node in tree.getroot().findall('s:url',ns):
    url=node.find('s:loc',ns).text
    date=node.find('s:lastmod',ns)
    if url.removeprefix('https://sergey-ulyanov.pro') in refreshed and date is not None:date.text='2026-11-17'
ET.register_namespace('',ns['s']);tree.write(sp,encoding='utf-8',xml_declaration=True)
print(f'Built homepage fragments, work library, hire page and {len(CASES)} detailed case studies.')
# Compact current source guide. No obsolete targets are retained as performance claims.
body='<main id="main"><section class="library-hero"><div class="wrap"><div class="eyebrow">Project records</div><h1>Recognition &amp; credits</h1><p>A record of awards, selections, funding and project credits.</p><nav class="library-tabs" aria-label="Record categories"><a href="#awards">Recognition</a><a href="#credits">Project credits</a><a href="#affiliations">Affiliations</a></nav></div></section>'
body+='<section class="section" id="awards"><div class="wrap">'+section_head('Recognition','Awards, exhibitions and selections')+'<div class="compact-experience recognition-records">'
for record in recognitions:
    items=record.get('sources') or ([{'href':record['href'],'label':'Read the related case'}] if record.get('href') else [])
    proof_image=record.get('proof_image',record.get('image'))
    proof_alt=record.get('proof_alt',record.get('alt',''))
    proof_class=" proof-document" if record.get('document') else ""
    proof_width,proof_height=record.get('proof_dimensions',(960,600))
    proof=f'<a class="record-proof-link" href="{e(proof_image)}" target="_blank" rel="noopener" aria-label="View full image: {e(proof_alt)}"><img class="record-proof{proof_class}" src="{e(proof_image)}" alt="{e(proof_alt)}" width="{proof_width}" height="{proof_height}" loading="lazy" decoding="async"><span>View full image ↗</span></a>' if proof_image else ''
    if record['id']=='collodi':
        proof+='<p class="source-caption">Selected poster artwork: VERIFY YOU ARE HUMAN.</p>'
    if record['id']=='complex':
        proof+='<p class="source-caption">Sergéy with the selected poster, IN PROGRESS, at Complex LA.</p>'
    body+=f'<article class="record-card" id="award-{record["id"]}">{proof}<span class="detail-label">{e(record["kind"]+" · "+record["year"])}</span><h3>{e(record["title"])}</h3><p><strong>{e(record["issuer"])}</strong></p><p>{e(record["description"])}</p>{links(items)}</article>'
body+='</div></div></section><section class="section" id="credits"><div class="wrap">'+section_head('Project credits','Roles and attribution')+'<div class="compact-experience">'
for cid,c in CASES.items():
    body+=f'<article><div class="detail-label">{e(c["brand"])}</div><h3>{e(SHORT[cid])}</h3><p>{e(clean(c["scope_note"]))}</p><p style="margin-top:18px"><a class="text-link" href="{c["route"]}">Open the full case ↗</a></p></article>'
body+='</div></div></section><section class="section" id="affiliations"><div class="wrap">'+section_head('Other professional credits','Affiliations and project history')+'<div class="compact-experience">'+(ROOT/'scripts/retained-recognition.html').read_text()+'</div></div></section>'
(ROOT/'evidence/index.html').write_text(head('Project context','Role and attribution notes for the current case library.','/evidence/')+nav('/evidence/')+body+footer())
