(() => {
  const be = new Map([
    ["BELARUS / CULTURE / SYSTEMS", "БЕЛАРУСЬ / КУЛЬТУРА / СІСТЭМЫ"],
    ["INITIALIZING CULTURAL MEMORY", "ІНІЦЫЯЛІЗАЦЫЯ КУЛЬТУРНАЙ ПАМЯЦІ"],
    ["Skip intro", "Прапусціць уступ"],
    ["Skip to content", "Перайсці да зместу"],
    ["Hire Me", "Наняць мяне"],
    ["Work", "Працы"],
    ["Press", "Прэса"],
    ["Invite / collaborate", "Запрасіць / супрацоўнічаць"],
    ["Working research agenda · 2026", "Рабочая даследчая праграма · 2026"],
    ["Who gets to teach AI", "Хто мае права вучыць ШІ"],
    ["what a culture", "што для культуры"],
    ["means?", "мае значэнне?"],
    ["I am developing a practice-led research agenda on community-governed AI for Belarusian language learning and cultural continuity among adults in exile. The aim is not a synthetic national personality. It is a source-visible learning environment that keeps authority, disagreement, and correction with the community.", "Я распрацоўваю практыка-арыентаваную даследчую праграму пра ШІ пад кіраваннем супольнасці — для вывучэння беларускай мовы і захавання культурнай пераемнасці сярод дарослых у выгнанні. Мэта — не стварыць сінтэтычную «нацыянальную асобу», а пабудаваць навучальнае асяроддзе з бачнымі крыніцамі, дзе паўнамоцтвы, нязгода і права на выпраўленне застаюцца ў супольнасці."],
    ["Question", "Пытанне"],
    ["Can AI expand language practice without flattening identity or accelerating Russification?", "Ці можа ШІ пашырыць моўную практыку, не спрашчаючы ідэнтычнасць і не паскараючы русіфікацыю?"],
    ["Method", "Метад"],
    ["Participatory design · model audit · mixed methods · design-based research", "Партысіпатыўны дызайн · аўдыт мадэляў · змешаныя метады · дызайн-арыентаванае даследаванне"],
    ["Context", "Кантэкст"],
    ["Belarusian adults, artists, and cultural workers living across borders", "Беларускія дарослыя, артысты і дзеячы культуры, якія жывуць па-за межамі краіны"],
    ["Status", "Статус"],
    ["Public protocol v0.1 · 36-prompt bank v0.2 · no findings claimed", "Публічны пратакол v0.1 · банк з 36 запытаў v0.2 · вынікі пакуль не заяўлены"],
    ["01 · System", "01 · Сістэма"],
    ["02 · Protocol", "02 · Пратакол"],
    ["03 · Program", "03 · Праграма"],
    ["04 · Method", "04 · Метад"],
    ["05 · Evidence", "05 · Доказы"],
    ["06 · Sources", "06 · Крыніцы"],
    ["Implemented research infrastructure", "Рэалізаваная даследчая інфраструктура"],
    ["Unmute Belarus turns the agenda into a working research system.", "Unmute Belarus ператварае праграму ў працоўную даследчую сістэму."],
    ["Three connected browser tools now demonstrate provenance, source-visible discovery, local annotation and analytics, and non-destructive audio derivatives. The bounded reviewer corpus shows the workflow without pretending that a comprehensive Belarusian archive already exists.", "Тры звязаныя браўзерныя інструменты ўжо дэманструюць паходжанне матэрыялаў, пошук з бачнымі крыніцамі, лакальнае анатаванне і аналітыку, а таксама неразбуральныя вытворныя аўдыяфайлы. Абмежаваны корпус для рэцэнзавання паказвае працэс, не ствараючы ілюзіі, што поўны беларускі архіў ужо сабраны."],
    ["01 · LIVE", "01 · ПРАЦУЕ"],
    ["Archive Passport", "Архіўны пашпарт"],
    ["02 · LIVE PILOT", "02 · ПРАЦОЎНЫ ПІЛОТ"],
    ["Music Atlas", "Музычны атлас"],
    ["03 · LIVE PILOT", "03 · ПРАЦОЎНЫ ПІЛОТ"],
    ["Restoration Lab", "Лабараторыя рэстаўрацыі"],
    ["Explore the research system ↗", "Адкрыць даследчую сістэму ↗"],
    ["Use the live Archive Passport ↗", "Скарыстацца Архіўным пашпартам ↗"],
    ["Search the Music Atlas ↗", "Шукаць у Музычным атласе ↗"],
    ["Run the Restoration Lab ↗", "Запусціць Лабараторыю рэстаўрацыі ↗"],
    ["NEW · PUBLIC PILOT", "НОВЫ · ПУБЛІЧНЫ ПІЛОТ"],
    ["Living Belarus Atlas", "Living Belarus Atlas"],
    ["Lost Digital Heritage + Belarusian Voices Directory", "Страчаная лічбавая спадчына + каталог беларускіх галасоў"],
    ["Search verified seed records across archives, podcasts, music, video, language learning, museums, and cultural maps.", "Шукайце ў правераных стартавых запісах: архівы, падкасты, музыка, відэа, вывучэнне мовы, музеі і культурныя мапы."],
    ["Explore the living atlas ↗", "Адкрыць жывы атлас ↗"],
    ["Public methods artifact", "Публічны метадалагічны артэфакт"],
    ["The research plan is now inspectable before the results exist.", "Даследчы план можна праверыць яшчэ да з'яўлення вынікаў."],
    ["The public artifact contains the exact 36-prompt Belarusian review bank, eight-dimension codebook, binary error flags, reliability procedure, analysis plan, ethics boundary, schedule, and version history.", "Публічны артэфакт змяшчае дакладны банк з 36 беларускамоўных запытаў, кодбук з васьмю вымярэннямі, бінарныя маркеры памылак, працэдуру праверкі надзейнасці, план аналізу, этычныя межы, графік і гісторыю версій."],
    ["dated system-audit protocol", "датаваны пратакол аўдыту сістэм"],
    ["complete 36-prompt review bank", "поўны банк з 36 запытаў"],
    ["8 + flags", "8 + маркеры"],
    ["predefined scoring dimensions", "загадзя вызначаныя крытэрыі ацэнкі"],
    ["0 findings", "0 вынікаў"],
    ["collection has not started", "збор даных яшчэ не пачаўся"],
    ["Current review gate:", "Бягучы этап праверкі:"],
    ["the prompt bank remains a review draft. A second fluent Belarusian speaker should review naturalness, ambiguity, and neutrality before the instrument is frozen and any scored collection begins. No system responses have been collected for the scored audit and no findings are claimed.", "банк запытаў пакуль застаецца чарнавіком для рэцэнзавання. Перад замацаваннем інструмента і пачаткам ацэначнага збору даных яго павінен праверыць яшчэ адзін чалавек, які свабодна валодае беларускай мовай, — на натуральнасць, неадназначнасць і нейтральнасць. Адказы сістэм для ацэначнага аўдыту яшчэ не збіраліся, вынікі не заяўляюцца."],
    ["Inspect protocol and all 36 prompts ↗", "Прагледзець пратакол і ўсе 36 запытаў ↗"],
    ["Primary research program", "Асноўная даследчая праграма"],
    ["Community-governed AI for cultural continuity.", "ШІ пад кіраваннем супольнасці для культурнай пераемнасці."],
    ["The working question is intentionally bounded: how can a culturally grounded, community-accountable AI system support heritage-language learning and participation among geographically dispersed adults without replacing teachers, artists, or human cultural authority?", "Рабочае пытанне наўмысна абмежаванае: як культурна ўкарэненая і падсправаздачная супольнасці сістэма ШІ можа падтрымліваць вывучэнне спадчыннай мовы і ўдзел геаграфічна раз'яднаных дарослых, не замяняючы выкладчыкаў, артыстаў і чалавечы культурны аўтарытэт?"],
    ["Existing cultural practice is evidence of access and responsibility — not a representative dataset for an entire nation.", "Існуючая культурная практыка сведчыць пра доступ і адказнасць, але не з'яўляецца рэпрэзентатыўным наборам даных для цэлай нацыі."],
    ["Design principle 01", "Прынцып дызайну 01"],
    ["Provenance before authority.", "Паходжанне перад аўтарытэтам."],
    ["Language and cultural claims should show where they came from, what remains uncertain, and who has the right to correct, annotate, or remove them.", "Моўныя і культурныя сцвярджэнні павінны паказваць, адкуль яны паходзяць, што застаецца нявызначаным і хто мае права іх выпраўляць, анатаваць або выдаляць."],
    ["Design principle 02", "Прынцып дызайну 02"],
    ["Many voices, not one synthetic Belarusian.", "Шмат галасоў, а не адзін сінтэтычны беларус."],
    ["Regional variation, political disagreement, queer experience, migration, and generational difference are part of the knowledge — not noise to be averaged away.", "Рэгіянальныя адрозненні, палітычная нязгода, квір-досвед, міграцыя і розніца пакаленняў — частка ведаў, а не шум, які трэба асерадніць."],
    ["Design principle 03", "Прынцып дызайну 03"],
    ["Learning by making.", "Навучанне праз стварэнне."],
    ["Conversation practice can be paired with creative projects: documenting a story, annotating a song, preparing a release, or contributing context under revocable consent.", "Размоўную практыку можна спалучаць з творчымі праектамі: дакументаваць гісторыю, анатаваць песню, рыхтаваць рэліз або дадаваць кантэкст на ўмовах адклікальнай згоды."],
    ["Methods bridge", "Метадалагічны мост"],
    ["A pilot designed to be audited, not admired.", "Пілот створаны для аўдыту, а не для захаплення."],
    ["The first phase is a bounded non-human-subject audit of existing AI systems. It tests the evaluation instrument before any community recruitment and creates a concrete artifact for methodological critique.", "Першы этап — абмежаваны аўдыт існуючых сістэм ШІ без удзелу людзей як суб'ектаў даследавання. Ён правярае інструмент ацэнкі да набору ўдзельнікаў з супольнасці і стварае канкрэтны артэфакт для метадалагічнай крытыкі."],
    ["prompts across language, culture, provenance, uncertainty, and political bias", "запытаў пра мову, культуру, паходжанне, нявызначанасць і палітычную прадузятасць"],
    ["AI systems compared with identical prompts and frozen response records", "сістэмы ШІ параўноўваюцца па аднолькавых запытах і зафіксаваных адказах"],
    ["delayed blind rescore, plus independent Belarusian-language review if available", "адкладзеная сляпая пераацэнка і, калі магчыма, незалежная беларускамоўная праверка"],
    ["transparent codebook for naturalness, specificity, sourcing, and harm", "празрысты кодбук для натуральнасці, канкрэтнасці, працы з крыніцамі і магчымай шкоды"],
    ["Freeze prompts", "Зафіксаваць запыты"],
    ["Record wording, model, date, settings, and output without post-hoc editing.", "Запісаць фармулёўку, мадэль, дату, налады і вынік без наступнага рэдагавання."],
    ["Blind the ratings", "Асляпіць ацэнкі"],
    ["Remove system identity before independent scoring and qualitative notes.", "Выдаліць назву сістэмы перад незалежнай ацэнкай і якаснымі заўвагамі."],
    ["Compare judgments", "Параўнаць меркаванні"],
    ["Calculate agreement and inspect disagreements instead of hiding them.", "Вылічыць узгодненасць і даследаваць рознагалоссі, а не хаваць іх."],
    ["Revise after critique", "Перагледзець пасля крытыкі"],
    ["Document what changed after academic and community methodological review.", "Задакументаваць змены пасля акадэмічнай і супольнаснай метадалагічнай праверкі."],
    ["Research boundary:", "Мяжа даследавання:"],
    ["the workbook, prompt bank, codebook, and scoring template are prepared. Results will not be presented until responses are frozen, the prespecified reliability procedure is completed, and the analysis is reviewed for overclaiming.", "рабочая кніга, банк запытаў, кодбук і шаблон ацэнкі падрыхтаваныя. Вынікі не будуць прадстаўлены, пакуль адказы не зафіксаваныя, загадзя вызначаная працэдура надзейнасці не завершаная, а аналіз не правераны на празмерныя высновы."],
    ["Practice as evidence", "Практыка як доказ"],
    ["The work already supplies the questions.", "Праца ўжо фармулюе пытанні."],
    ["These projects establish lived access, cultural practice, systems-building experience, and testable hypotheses. Scholarly methods and peer review will test them.", "Гэтыя праекты пацвярджаюць асабісты доступ, культурную практыку, досвед пабудовы сістэм і гіпотэзы, якія можна праверыць. Навуковыя метады і экспертнае рэцэнзаванне павінны іх выпрабаваць."],
    ["Archive · curation · public intervention", "Архіў · куратарства · публічная інтэрвенцыя"],
    ["Belarus in Exile", "Belarus in Exile"],
    ["An approximately two-hour, 55-track cultural DJ set built after reviewing Belarusian television, recordings, remixes, performances, and artists across roughly three decades. The next step is a provenance-first dataset documenting sources, language, selection rules, gaps, and rights status.", "Амаль двухгадзінны культурны DJ-сэт з 55 трэкаў, створаны пасля вывучэння беларускага тэлебачання, запісаў, рэміксаў, выступаў і артыстаў прыкладна за тры дзесяцігоддзі. Наступны крок — набор даных, дзе спачатку фіксуюцца крыніцы, мова, правілы адбору, прабелы і статус правоў."],
    ["Watch the public artifact ↗", "Глядзець публічны артэфакт ↗"],
    ["Applied AI · Python · workflow design", "Прыкладны ШІ · Python · дызайн працэсаў"],
    ["From documents to an AI-assisted system", "Ад дакументаў да сістэмы з падтрымкай ШІ"],
    ["At the Cal Poly Digital Transformation Hub × AWS AI Summer Camp, Sergey independently designed and implemented EHS Mentor, a working Python/FastAPI prototype. It turns safety documents into role-based training assignments, question-answer support, dashboards, reporting states, and human-review workflows. Public demos establish the prototype; efficiency estimates remain targets, not audited outcomes.", "У Cal Poly Digital Transformation Hub × AWS AI Summer Camp Сяргей самастойна спраектаваў і рэалізаваў EHS Mentor — працоўны прататып на Python/FastAPI. Ён ператварае дакументы па бяспецы ў навучальныя заданні паводле роляў, падтрымку пытанняў і адказаў, панэлі, станы справаздачнасці і працэсы чалавечай праверкі. Публічныя дэманстрацыі пацвярджаюць прататып; ацэнкі эфектыўнасці застаюцца мэтамі, а не праверанымі вынікамі."],
    ["Open the applied AI case →", "Адкрыць кейс прыкладнога ШІ →"],
    ["Open the working prototype ↗", "Адкрыць працоўны прататып ↗"],
    ["Formal study · ritual · pedagogy", "Фармальная адукацыя · абрад · педагогіка"],
    ["Belarusian traditions studied through directing and performance", "Беларускія традыцыі праз рэжысуру і сцэнічную практыку"],
    ["Sergey holds a higher-education diploma in Directing, specializing in Rituals and Festivals, with the qualification Director, Teacher. His certified coursework spans Belarusian folklore, language, ritual, folk games, ensemble methods, pedagogy, and directing practice. This is formal cultural and pedagogical preparation—not a claim of prior academic research.", "Сяргей мае дыплом аб вышэйшай адукацыі па рэжысуры са спецыялізацыяй «Святы і абрады» і кваліфікацыяй «Рэжысёр, выкладчык». Пацверджаная вучэбная праграма ахоплівае беларускі фальклор, мову, абрады, народныя гульні, ансамблевыя метады, педагогіку і рэжысёрскую практыку. Гэта фармальная культурная і педагагічная падрыхтоўка, але не сцвярджэнне пра ранейшы акадэмічны даследчы досвед."],
    ["Staged ritual practice during Sergey's BSUCA training, Minsk, before 2010. Other participants and faculty are not identified here without independent confirmation.", "Пастаноўка абраду падчас навучання Сяргея ў БДУКМ, Мінск, да 2010 года. Іншыя ўдзельнікі і выкладчыкі тут не называюцца без незалежнага пацверджання."],
    ["Multilingual AI · documented participation · May 2024", "Шматмоўны ШІ · задакументаваны ўдзел · май 2024"],
    ["Belarusian-language expertise in an international AI study", "Беларускамоўная экспертыза ў міжнародным даследаванні ШІ"],
    ["In Los Angeles, Sergey contributed Belarusian-language expertise to an international Ericsson-related AI study and was recorded in a specialized 78-camera booth. A contemporaneous email, the original project photograph, and private contract records establish the date, client, and participation. NDA boundaries remain: no product, dataset, model, or internal method is disclosed.", "У Лос-Анджэлесе Сяргей унёс беларускамоўную экспертызу ў міжнароднае даследаванне ШІ, звязанае з Ericsson, і быў запісаны ў спецыялізаванай студыі з 78 камерамі. Тагачасны ліст, арыгінальная фатаграфія праекта і прыватныя дамоўныя дакументы пацвярджаюць дату, кліента і ўдзел. Межы NDA захоўваюцца: прадукт, набор даных, мадэль і ўнутраныя метады не раскрываюцца."],
    ["Privacy-protected editorial rendering based on Sergey’s on-site documentary photograph. Participant faces and identifiers have been obscured.", "Рэдакцыйная візуалізацыя з абаронай прыватнасці, заснаваная на дакументальнай фатаграфіі Сяргея з месца працы. Твары і ідэнтыфікатары ўдзельнікаў схаваныя."],
    ["Learning-by-doing · artist infrastructure", "Навучанне праз практыку · інфраструктура для артыстаў"],
    ["NostalgAI Recordz", "NostalgAI Recordz"],
    ["An operating label for artists in migration, with releases, physical products, global delivery, and a planned AI-assisted producer that can scaffold the journey from concept to rights-aware release while keeping authorship with the artist.", "Дзейны лэйбл для артыстаў у міграцыі з рэлізамі, фізічнымі выданнямі, сусветнай дастаўкай і запланаваным AI-прадзюсарам, які можа падтрымаць шлях ад ідэі да рэлізу з улікам правоў, пакідаючы аўтарства за артыстам."],
    ["Review the operating case →", "Прагледзець дзейны кейс →"],
    ["Language · songwriting · moving image", "Мова · напісанне песень · відэа"],
    ["Belarusian songs and videos", "Беларускія песні і відэа"],
    ["Original songs, an EP connected to the 2020 democratic movement, and music videos carried Belarusian language and identity into public media beyond Belarus. They provide artifacts for analysis, not proof of national representativeness.", "Арыгінальныя песні, EP, звязаны з дэмакратычным рухам 2020 года, і музычныя відэа вынеслі беларускую мову і ідэнтычнасць у публічныя медыя за межамі Беларусі. Гэта артэфакты для аналізу, а не доказ нацыянальнай рэпрэзентатыўнасці."],
    ["Open selected music and videos ↗", "Адкрыць выбраныя песні і відэа ↗"],
    ["Community work · positionality", "Праца з супольнасцю · пазіцыянальнасць"],
    ["Seven and a half years of LGBTQ+ field work", "Сем з паловай гадоў палявой працы з ЛГБТК+ супольнасцю"],
    ["Long-term community media, events, and outreach provide context for questions of trust, stigma, safety, and representation. They also make conservative consent and data-minimization requirements non-negotiable.", "Шматгадовая праца з супольнаснымі медыя, мерапрыемствамі і інфармацыйным ахопам дае кантэкст для пытанняў даверу, стыгмы, бяспекі і рэпрэзентацыі. Яна таксама робіць асцярожную згоду і мінімізацыю даных абавязковымі."],
    ["Watch a Belarusian community interview ↗", "Глядзець беларускамоўнае інтэрв'ю ↗"],
    ["Commercial localization · public language", "Камерцыйная лакалізацыя · публічная мова"],
    ["Belarusian inside a mass-market experience", "Беларуская мова ў масавым спажывецкім досведзе"],
    ["During Sergey's salaried agency employment, the McDonald’s Duda activation brought Belarusian cultural material into a national digital campaign. Customers could play Belarusian bagpipe music through the campaign app. The public record and employment history establish context; exact creative attribution awaits a verifying project artifact or colleague record.", "Падчас працы Сяргея ў агенцтве актывацыя McDonald’s «Дуда» ўключыла беларускі культурны матэрыял у нацыянальную лічбавую кампанію. Карыстальнікі маглі граць беларускую дударскую музыку праз дадатак кампаніі. Публічныя матэрыялы і працоўная гісторыя пацвярджаюць кантэкст; дакладнае творчае аўтарства патрабуе асобнага праектнага артэфакта або пацверджання калегі."],
    ["Review independent campaign coverage ↗", "Прагледзець незалежнае асвятленне кампаніі ↗"],
    ["Short-form video · cultural circulation", "Кароткае відэа · культурная цыркуляцыя"],
    ["A tricycle, one song, and a dispersed audience", "Трохколавы ровар, адна песня і рассеяная аўдыторыя"],
    ["A spontaneous Belarusian-language performance filmed on a karaoke e-trike in Los Angeles reached about 230,000 views and circulated through major independent Belarusian media. It shows how a short-form artifact can return language and cultural recognition to a dispersed public. Reach is observable; attitude change or language learning is not claimed.", "Спантанны беларускамоўны выступ, зняты на караоке-электратрохколцы ў Лос-Анджэлесе, набраў каля 230 000 праглядаў і разышоўся па буйных незалежных беларускіх медыя. Ён паказвае, як кароткі артэфакт можа вяртаць мову і культурнае пазнаванне рассеянай публіцы. Ахоп назіраецца; змена стаўлення або вывучэнне мовы не заяўляюцца."],
    ["Read the independent account ↗", "Прачытаць незалежны матэрыял ↗"],
    ["Institutions · diaspora · civic continuity", "Інстытуцыі · дыяспара · грамадзянская пераемнасць"],
    ["Belarusian culture carried through exile", "Беларуская культура, захаваная ў выгнанні"],
    ["Creative-worker certification, professional and diaspora memberships, Belarusian-language interviews, public opposition to dictatorship, and support for artists in migration form a record of cultural continuity. Earlier BELAU youth-camp volunteering adds community education and service. This supports positionality—not a claim of formal research training.", "Сертыфікацыя творчага работніка, сяброўства ў прафесійных і дыяспарных арганізацыях, беларускамоўныя інтэрв'ю, публічнае супрацьстаянне дыктатуры і падтрымка артыстаў у міграцыі складаюць сведчанне культурнай пераемнасці. Ранейшае валанцёрства ў моладзевым лагеры BELAU дадае адукацыйную і супольнасную працу. Гэта падтрымлівае пазіцыянальнасць, але не з'яўляецца сцвярджэннем пра фармальную даследчую падрыхтоўку."],
    ["Watch an ABA interview ↗", "Глядзець інтэрв'ю ABA ↗"],
    ["Methods foundation, stated proportionally:", "Метадалагічная аснова, сфармуляваная прапарцыйна:"],
    ["Sergey's certified World Economy transcript records 462 academic hours of Higher Mathematics, 230 of Statistics, 98 of Econometrics and Economic-Mathematical Methods and Models, and 340 of Computer Information Technologies. His Cal Poly prototype establishes practical Python/FastAPI experience. These are foundations for doctoral training, not a claim of current mastery of advanced statistical research.", "У пацверджанай выпісцы Сяргея па спецыяльнасці «Сусветная эканоміка» пазначаныя 462 акадэмічныя гадзіны вышэйшай матэматыкі, 230 — статыстыкі, 98 — эканаметрыкі і эканоміка-матэматычных метадаў і мадэляў, 340 — камп'ютарных інфармацыйных тэхналогій. Прататып Cal Poly пацвярджае практычны досвед Python/FastAPI. Гэта аснова для доктарскай падрыхтоўкі, а не сцвярджэнне пра цяперашняе валоданне прасунутымі статыстычнымі даследаваннямі."],
    ["Research integrity", "Даследчая добрасумленнасць"],
    ["Claims stay proportional to evidence.", "Сцвярджэнні застаюцца прапарцыйнымі доказам."],
    ["A strong founder–research fit is a starting point. This source desk lets a university, lab, or collaborator evaluate both the promise and the work still required.", "Моцная адпаведнасць паміж аўтарам і тэмай — толькі зыходны пункт. Гэты каталог крыніц дазваляе ўніверсітэту, лабараторыі або партнёру ацаніць і патэнцыял, і працу, якую яшчэ неабходна выканаць."],
    ["Belarusian language and cultural systems — complete practice-led case", "Беларуская мова і культурныя сістэмы — поўны практыка-арыентаваны кейс"],
    ["Implemented applied-AI system and evidence trail", "Рэалізаваная прыкладная AI-сістэма і ланцужок доказаў"],
    ["Belarus in Exile — complete public audio set", "Belarus in Exile — поўны публічны аўдыясэт"],
    ["Interdisciplinary creator portfolio — selected video work", "Міждысцыплінарнае творчае партфоліа — выбраныя відэапрацы"],
    ["Zerkalo — independent profile connecting Belarusian-language performance, asylum and public work", "Zerkalo — незалежны профіль пра беларускамоўны выступ, прытулак і публічную працу"],
    ["Nasha Niva — the Los Angeles e-trike performance and 230K-view public response", "Наша Ніва — выступ на электратрохколцы ў Лос-Анджэлесе і грамадскі водгук у 230 тысяч праглядаў"],
    ["Nasha Niva — public record of the McDonald’s Duda Belarusian cultural activation", "Наша Ніва — публічны матэрыял пра беларускую культурную актывацыю McDonald’s «Дуда»"],
    ["TuzinFM — Belarusian-language music video entering Russian television rotation", "TuzinFM — беларускамоўнае музычнае відэа ў ратацыі расійскага тэлебачання"],
    ["Раніцай з Дашай і Васілём — 2026 follow-up on the Ray album and life after asylum (from 36:00)", "«Раніцай з Дашай і Васілём» — размова 2026 года пра альбом Ray і жыццё пасля атрымання прытулку (з 36:00)"],
    ["Public system-audit protocol, full 36-prompt bank, codebook, and reliability plan", "Публічны пратакол аўдыту сістэм, поўны банк з 36 запытаў, кодбук і план надзейнасці"],
    ["Unmute Belarus — modular research system, identity model, pilot boundaries, and live Archive Passport", "Unmute Belarus — модульная даследчая сістэма, мадэль ідэнтычнасці, межы пілота і працоўны Архіўны пашпарт"],
    ["CASE →", "КЕЙС →"],
    ["LISTEN ↗", "СЛУХАЦЬ ↗"],
    ["WATCH ↗", "ГЛЯДЗЕЦЬ ↗"],
    ["READ ↗", "ЧЫТАЦЬ ↗"],
    ["PROTOCOL →", "ПРАТАКОЛ →"],
    ["SYSTEM →", "СІСТЭМА →"],
    ["Interested in language, learning, AI, or culture under pressure?", "Ці цікавіць вас мова, навучанне, ШІ або культура пад ціскам?"],
    ["Propose a collaboration ↗", "Прапанаваць супрацоўніцтва ↗"],
    ["PRIVACY", "ПРЫВАТНАСЦЬ"]
  ]);

  const attributeBe = new Map([
    ["Language", "Мова"],
    ["Research site", "Даследчы сайт"],
    ["Research page sections", "Раздзелы даследчай старонкі"],
    ["Unmute Belarus links", "Спасылкі Unmute Belarus"],
    ["Proposed pilot sequence", "Прапанаваная паслядоўнасць пілота"],
    ["Loading Sergéy Ulyanov's research portfolio", "Загрузка даследчага партфоліа Сяргея Ульянава"],
    ["A green editorial panorama flowing from the Gates of Minsk and the National Library of Belarus into Los Angeles hills, palms, and the Pacific coast", "Зялёная рэдакцыйная панарама ад Брамы Мінска і Нацыянальнай бібліятэкі Беларусі да пагоркаў Лос-Анджэлеса, пальмаў і ўзбярэжжа Ціхага акіяна"],
    ["Belarus in Exile research and cultural DJ-set project presentation", "Прэзентацыя даследчага і культурнага DJ-праекта Belarus in Exile"],
    ["Belarus in Exile DJ-set research and cultural curation project", "Даследчы і куратарскі DJ-праект Belarus in Exile"],
    ["Cal Poly and AWS applied AI compliance platform", "Платформа прыкладнога ШІ для камплаенсу Cal Poly і AWS"],
    ["Staged Belarusian ritual practice during Sergey Ulyanov's university training", "Пастаноўка беларускага абраду падчас універсітэцкага навучання Сяргея Ульянава"],
    ["NostalgAI Recordz release and commerce system", "Сістэма рэлізаў і камерцыі NostalgAI Recordz"],
    ["Sergey Ulyanov in the Belarusian-language music video covered by independent Belarusian media", "Сяргей Ульянаў у беларускамоўным музычным відэа, асветленым незалежнымі беларускімі медыя"],
    ["Belarusian-language ABA interview with Sergey Ulyanov about Belarusian identity and exile", "Беларускамоўнае інтэрв'ю ABA з Сяргеем Ульянавым пра беларускую ідэнтычнасць і выгнанне"]
  ]);

  const textNodes = [];
  const attributes = [];

  const normalize = value => value.replace(/\s+/g, " ").trim();
  const preserveWhitespace = (original, replacement) => {
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    return leading + replacement + trailing;
  };

  const capture = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest("script, style, noscript, .research-language")) return NodeFilter.FILTER_REJECT;
        return normalize(node.nodeValue || "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    while (walker.nextNode()) textNodes.push({ node: walker.currentNode, original: walker.currentNode.nodeValue });

    document.querySelectorAll("[aria-label], img[alt]").forEach(element => {
      ["aria-label", "alt"].forEach(name => {
        if (element.hasAttribute(name)) attributes.push({ element, name, original: element.getAttribute(name) });
      });
    });
  };

  const applyLanguage = (lang, updateUrl = false) => {
    const next = lang === "be" ? "be" : "en";
    document.documentElement.lang = next;
    document.title = next === "be" ? "Даследаванні і выступы — Сяргей Ульянаў" : "Research & Speaking — Sergéy Ulyanov";

    textNodes.forEach(({ node, original }) => {
      const key = normalize(original || "");
      node.nodeValue = next === "be" && be.has(key) ? preserveWhitespace(original, be.get(key)) : original;
    });
    attributes.forEach(({ element, name, original }) => {
      element.setAttribute(name, next === "be" && attributeBe.has(original) ? attributeBe.get(original) : original);
    });

    document.querySelectorAll("[data-research-lang]").forEach(link => {
      const active = link.dataset.researchLang === next;
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
      link.setAttribute("aria-pressed", String(active));
    });

    const description = next === "be"
      ? "Практыка-арыентаванае даследаванне Сяргея Ульянава пра ШІ пад кіраваннем супольнасці, пераемнасць беларускай мовы, культурную ідэнтычнасць у выгнанні і чалавекацэнтрычныя творчыя сістэмы."
      : "Sergéy Ulyanov's practice-led research on community-governed AI, Belarusian language continuity, cultural identity in exile, and human-centered creative systems.";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    localStorage.setItem("research-lang", next);

    if (updateUrl) {
      const url = new URL(location.href);
      if (next === "be") url.searchParams.set("lang", "be");
      else url.searchParams.delete("lang");
      history.pushState({ lang: next }, "", url);
    }
  };

  const selectedLanguage = () => {
    const query = new URLSearchParams(location.search).get("lang");
    if (query === "be" || query === "en") return query;
    return localStorage.getItem("research-lang") === "be" ? "be" : "en";
  };

  capture();
  applyLanguage(selectedLanguage());

  document.querySelectorAll("[data-research-lang]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      applyLanguage(link.dataset.researchLang, true);
    });
  });
  window.addEventListener("popstate", () => applyLanguage(selectedLanguage()));
})();
