// AT5 Tutor content — MUF0152 Contemporary Issues 2
// Every fact is checked against the assigned readings. Page numbers = "Genocide in Rwanda" chapter.

const SOURCES = {
  R: {
    short: "Genocide in Rwanda",
    full: "\"Genocide in Rwanda\" (Chapter 12). In Prejudice in the Modern World: Almanac, pp. 237–258.",
    oral: "According to the chapter 'Genocide in Rwanda', page",
    case: "RW"
  },
  A: {
    short: "Detector Media (2026)",
    full: "Detector Media. (2026, October 23). Kremlin \"doppelgangers\": How the Russian Doppelganger disinformation network works.",
    oral: "Detector Media reported in October 2026 that",
    case: "UA"
  },
  B: {
    short: "Schrijver (2023)",
    full: "Schrijver, P. (2023, September 12). Ukraine's fight on the front lines of the information environment. Modern War Institute.",
    oral: "Peter Schrijver, writing for the Modern War Institute in 2023, explains that",
    case: "UA"
  },
  C: {
    short: "ISW (2026)",
    full: "Institute for the Study of War. (2026, October 23). The myth of inevitable Russian victory over Ukraine.",
    oral: "According to the Institute for the Study of War, in October 2026,",
    case: "UA"
  },
  D: {
    short: "Iskoujina, Gnatchenko & Bernal",
    full: "Iskoujina, Z., Gnatchenko, Y., & Bernal, P. Social media as an information warfare tool in the Russia-Ukraine war. University of East Anglia.",
    oral: "Iskoujina, Gnatchenko and Bernal from the University of East Anglia explain that",
    case: "UA"
  },
  E: {
    short: "Al Jazeera (2026)",
    full: "Al Jazeera Staff. (2026, September 21). A simple guide to the Yemen conflict. Al Jazeera. https://www.aljazeera.com/news/2026/9/21/a-brief-history-of-the-yemen-conflict",
    oral: "Al Jazeera explained in September 2026 that",
    case: "YE"
  },
  P: {
    short: "Class PPT (Wk 13)",
    full: "MUF0152 Week 13 slides: Preparation for AT5 & Non-Violent Conflict.",
    oral: "As we saw in class,",
    case: "CL"
  }
};

const THEMES = {
  causes: "Causes",
  consequences: "Consequences",
  duration: "Quick vs long",
  media: "Media & bias",
  info: "Information control",
  ending: "Ending conflict",
  people: "Ordinary people",
  intl: "International response",
  lessons: "Lessons"
};

// ---------- EVIDENCE BANK ----------
// id, src, page (Rwanda only), date, fact (paraphrase), quote (short, optional), themes
const EVIDENCE = [
  // ===== RWANDA =====
  {id:"R1", src:"R", page:"237", date:"Apr–Jun 1994", fact:"The genocide began on 6 April 1994 and continued through June. Best estimates: 800,000–850,000 people murdered, out of a population of 7.5–8 million.", themes:["consequences","duration"]},
  {id:"R2", src:"R", page:"237", fact:"All genocides share six features, including an organised killing plan developed by officials and an international community that turns away and does not intervene.", themes:["lessons","causes","intl"]},
  {id:"R3", src:"R", page:"238", fact:"Tutsi were about 14% of the population; Hutu were 85% and controlled the government. The genocide was organised by factions within the Rwandan government.", themes:["causes"]},
  {id:"R4", src:"R", page:"238", fact:"For centuries Hutu and Tutsi lived side by side and often intermarried. In 1994 neighbours killed neighbours, teachers killed students, husbands killed wives.", themes:["causes","lessons"]},
  {id:"R5", src:"R", page:"238", fact:"The genocide is partly traceable to poverty, land scarcity and overpopulation. 'Most importantly', deeply ingrained ideas of racial difference and prejudice led frustrated Hutu, manipulated by their leaders, to kill.", quote:"manipulated by their Hutu leaders", themes:["causes"]},
  {id:"R6", src:"R", page:"238", fact:"The international community labelled the turmoil a civil war and chose not to step in until it was too late.", themes:["intl","ending","info"]},
  {id:"R7", src:"R", page:"240", fact:"For centuries Rwandans unquestioningly obeyed the king and chiefs. The reading says this habit of strict obedience played a large part in the 1994 genocide.", themes:["causes","people","lessons"]},
  {id:"R8", src:"R", page:"240", fact:"Hutu, Tutsi and Twa were not separate tribes: they shared the same language, gods and culture.", themes:["causes","lessons"]},
  {id:"R9", src:"R", page:"241–242", date:"1863–1890s", fact:"British explorer Speke made up a theory (no factual basis) of a superior ruling race. Germans built on it: the myth of Tutsi superiority. They measured noses, height and heads to sort people, and 'manufactured two racial groups'.", themes:["causes","lessons"]},
  {id:"R10", src:"R", page:"242", fact:"The reading calls the German racial categories the first step, however unintentional, on the path to genocide one hundred years later.", quote:"first step … on the path to genocide", themes:["lessons","causes"]},
  {id:"R11", src:"R", page:"242", fact:"Under German indirect rule, Tutsi got most chief positions and Hutu were deprived of political and economic power. The reading calls it 'a social time bomb'.", quote:"A social time bomb had begun ticking.", themes:["causes"]},
  {id:"R12", src:"R", page:"243", date:"after WWI", fact:"Belgium took control after WWI, put only Tutsi into government jobs, and introduced forced labour. Hutu often gave over 50% of their work time to public projects, with Tutsi enforcing it.", themes:["causes"]},
  {id:"R13", src:"R", page:"244", date:"1950s", fact:"When the Tutsi elite pushed for independence, Belgian officials and European priests felt their power threatened. They raised the Hutu and incited them by blaming Tutsi for Hutu misery.", themes:["causes","info"]},
  {id:"R14", src:"R", page:"244–245", date:"1959–1962", fact:"The 1959 Hutu revolution: Hutu attacked all Tutsi, including the poor. Rwanda became a republic in 1961 (President Kayibanda) and independent on 1 July 1962.", themes:["causes","duration"]},
  {id:"R15", src:"R", page:"245", date:"1961–1964", fact:"About 120,000 Tutsi fled to refugee camps. When refugees attacked, Hutu officials ordered the killing of Tutsi leaders and at least 10,000 other Tutsi. The violence ended in 1964.", themes:["consequences","duration"]},
  {id:"R16", src:"R", page:"246", fact:"Kayibanda's government constantly promoted 'the lofty human worth of being Hutu'.", themes:["media","info"]},
  {id:"R17", src:"R", page:"246", date:"1973–1974", fact:"Habyarimana took power in a 1973 military coup and created a single party, the MRND. Every citizen carried an ID card stating Hutu or Tutsi. Only 2 of 71 MPs were Tutsi.", themes:["causes","info"]},
  {id:"R18", src:"R", page:"247", fact:"Foreign aid was controlled by the Hutu elite (Habyarimana's family and circle) for luxury cars, travel and land. By the mid-1980s aid was 70% of the government budget, but only 4–6% went to rural areas where 95% lived. The World Bank and IMF called the regime a 'model of development'.", themes:["causes","intl","lessons"]},
  {id:"R19", src:"R", page:"247–248", date:"1989–1990", fact:"World coffee prices fell 50% by the end of 1989. By 1990, 50% of Rwanda's population was malnourished.", themes:["causes"]},
  {id:"R20", src:"R", page:"248", date:"1990", fact:"By 1990 moderate Hutu wanted an honest government and radical elite Hutu wanted more money. The Hutu political system seemed about to collapse.", themes:["causes"]},
  {id:"R21", src:"R", page:"248", date:"1964–1990", fact:"Tutsi refugees grew from about 336,000 (1964) to 600,000–700,000 (1990). In 1987 their organisation became the RPF, a military group intent on retaking Rwanda.", themes:["consequences","duration","lessons"]},
  {id:"R22", src:"R", page:"249", date:"1 Oct 1990", fact:"The RPF attacked from Uganda. On national radio the Minister of Defence told people to track down 'Tutsi infiltrators' — in reality an order to kill any Tutsi.", themes:["media","info"]},
  {id:"R23", src:"R", page:"249", fact:"The 1990 RPF advance was the beginning of a four-year conflict.", themes:["duration"]},
  {id:"R24", src:"R", page:"249–250", date:"4 Aug 1993", fact:"The Arusha Accords: disband both armies, let refugees return, share government power with the RPF. Many of the Hutu elite had no intention of abiding by them.", themes:["ending","causes"]},
  {id:"R25", src:"R", page:"250", fact:"The Hutu elite had benefited from forty years of controlling government and money. Extremists planned to take 'absolute control of the country' and kill all Tutsi so they could never be challenged for power again.", quote:"absolute control of the country", themes:["causes","ending"]},
  {id:"R26", src:"R", page:"250", date:"1992", fact:"Extremists formed the CDR, which set up a fiery radio station and radical publications that incited the Hutu masses against all Tutsi.", themes:["media","info"]},
  {id:"R27", src:"R", page:"250", fact:"Hutu peasants had slid from poverty into misery and were 'easily manipulated' by racist hate propaganda to see Tutsi as the source of all their problems.", quote:"easily manipulated", themes:["media","causes"]},
  {id:"R28", src:"R", page:"250", fact:"Extremists used foreign development aid money to set up militias (Interahamwe and Impuzamugambi) of poor Hutu peasants who obeyed orders without question.", themes:["causes","people","intl"]},
  {id:"R29", src:"R", page:"251", fact:"'Sensibilisation': officials told villagers Tutsi were evil beings with horns, tails and glowing red eyes. Killing was presented as a community work project called 'bush clearing'.", quote:"bush clearing", themes:["media","info","people"]},
  {id:"R30", src:"R", page:"251", date:"6 Apr 1994", fact:"Habyarimana's plane was shot down; the genocide began in Kigali within the hour. A plan with names and addresses existed from late 1992. The radio urged Hutu to kill Tutsi before Tutsi killed them. Moderate Hutu were killed in the first hours.", themes:["causes","media","people"]},
  {id:"R31", src:"R", page:"252", fact:"80% of deaths happened between the second week of April and the third week of May. About 930,000 Tutsi lived in Rwanda on 6 April; by late July only about 130,000 survived.", themes:["consequences","duration"]},
  {id:"R32", src:"R", page:"252", fact:"Death toll estimates vary: the UN's final report said 500,000; Prunier (1998) put it at 800,000–850,000, the most widely accepted figure, including 10,000–30,000 moderate Hutu.", themes:["consequences"]},
  {id:"R33", src:"R", page:"252", date:"Apr–Jul 1994", fact:"The disciplined, well-armed RPF marched on Kigali, took the airport on 22 May and swore in a new government on 19 July 1994. Paul Kagame held the real power.", themes:["duration","ending","consequences"]},
  {id:"R34", src:"R", page:"252", fact:"The genocide and war killed 10% of the population and left 30% in refugee camps.", themes:["consequences"]},
  {id:"R35", src:"R", page:"253", date:"late 1993–Jan 1994", fact:"From late 1993 Western governments and the UN had information about an impending genocide. In January 1994 an Interahamwe informant told the UN of plans to exterminate all Tutsi and kill Belgian peacekeepers.", themes:["intl","lessons","ending"]},
  {id:"R36", src:"R", page:"253–254", date:"Oct–Nov 1993", fact:"UNAMIR was created on 5 October 1993, but UN members would not send troops or resources. Rwanda was not politically or economically important enough. Only 2,548 troops arrived — virtually powerless.", themes:["intl","ending"]},
  {id:"R37", src:"R", page:"254", date:"Apr 1994", fact:"Ten Belgian peacekeepers were killed. Belgium and France withdrew all UNAMIR troops by 14 April. Western powers refused to call it genocide.", themes:["intl"]},
  {id:"R38", src:"R", page:"255", fact:"The US blocked UNAMIR reinforcements after the 1993 Mogadishu disaster in Somalia, saying it had no pressing national interest. No US help until a July 1994 humanitarian airdrop.", themes:["intl","ending"]},
  {id:"R39", src:"R", page:"255", fact:"Nations including the US called it a civil war so the 1948 Genocide Convention would not have to be invoked. Clinton apologised in 1998 and later called it his biggest regret.", themes:["intl","info","lessons"]},
  {id:"R40", src:"R", page:"255–256", fact:"The International Criminal Tribunal for Rwanda (ICTR) was slow and cost about $1.2 billion by 2005, but achieved the first-ever international genocide convictions and the first conviction for rape as a war crime.", themes:["consequences","ending"]},
  {id:"R41", src:"R", page:"257", fact:"Kagame's government detained 135,000–140,000 Hutu. Courts were overwhelmed: 7,211 tried between 1997 and June 2002.", themes:["consequences"]},
  {id:"R42", src:"R", page:"257", date:"2004", fact:"Amnesty International (2004): Rwanda was tightly controlled, opposition suppressed, no freedom of the press, journalists harassed and detained.", themes:["consequences","info"]},
  {id:"R43", src:"R", page:"257", date:"2006", fact:"Both Tutsi and Hutu were traumatised. By 2006 it was uncertain whether they could come together as one people to heal.", themes:["consequences","people"]},

  // ===== UKRAINE: Reading A — Detector Media =====
  {id:"A1", src:"A", fact:"The Doppelganger network hides Russian state propaganda behind fake media and accounts of supposedly ordinary users. Its mission: weaken support for Ukraine and influence political sentiment abroad.", themes:["media","info"]},
  {id:"A2", src:"A", date:"21 Oct 2026", fact:"The Insider analysed hacked correspondence between the Russian presidential administration and the 'Agency for Social Planning' (ASP). It revealed how fakes were produced and the personal participation of Kremlin officials.", themes:["info","causes"]},
  {id:"A3", src:"A", fact:"Fake sites copy the design of real publications, down to small details, so readers trust them. Links spread via social media using fake profiles and paid ads.", themes:["media"]},
  {id:"A4", src:"A", fact:"ASP instructions include editing, dubbing, deepfakes, staged filming and AI-made content. Posing as local residents makes Russian messages look like opinions of citizens of other countries.", themes:["media","info"]},
  {id:"A5", src:"A", fact:"Hostility towards Ukrainian refugees was pushed on Europeans: invented stories about refugees' privileges and provocative comments posted 'on behalf of' Ukrainians.", themes:["media","consequences"]},
  {id:"A6", src:"A", date:"early 2023", fact:"A campaign against Ukraine aimed at discrediting the leadership, splitting elites, demoralising the military and disorganising the population — e.g. fake reports that soldiers' widows got canned food and a flag as compensation.", themes:["media","info"]},
  {id:"A7", src:"A", fact:"A screenshot in the reading shows a US politician sharing a link from a site the US government sanctioned as a Russian propaganda arm — and X readers adding context to warn others.", themes:["media","people"]},

  // ===== Reading B — Schrijver =====
  {id:"B1", src:"B", date:"Aug 2023", fact:"Residents of Russian-annexed Crimea got recorded phone calls urging them to avoid military sites. Ukraine is praised for communicating with domestic and international audiences and for strong cybersecurity.", themes:["info"]},
  {id:"B2", src:"B", fact:"Ukraine's information strategy borrowed from Soviet/Russian information-warfare ideas, Western strategic communications, and other countries' experience.", themes:["info","lessons"]},
  {id:"B3", src:"B", fact:"Ukraine's military intelligence (HUR) releases intercepted calls of Russian soldiers to family — choosing clips where soldiers complain about their leaders or confess to (war) crimes.", themes:["media","info"]},
  {id:"B4", src:"B", fact:"Ukrainian researcher Turanskiy: the establishment of an independent Ukraine has been associated with persistent psychological and informational pressure. Experts must expose manipulation.", themes:["causes","duration","lessons"]},
  {id:"B5", src:"B", date:"2015", fact:"After the Minsk agreements (2015), Russia had annexed Crimea and there was only an uneasy ceasefire in the east. Kyiv's National Institute for Strategic Studies concluded Ukraine had lost the battle in the information environment.", themes:["ending","duration"]},
  {id:"B6", src:"B", date:"2022", fact:"#SnakeIslandStrong spotlighted Ukrainian soldiers' bravery defending Snake Island in 2022; Ukraine also uses social media to thank partners for military aid.", themes:["media","info"]},
  {id:"B7", src:"B", fact:"Ukraine grasped the importance of collaboration among government ministries, the military and civil society.", themes:["people","info"]},
  {id:"B8", src:"B", fact:"Despite being outmatched by Russia in 2014, Ukraine became a nation that steadfastly defends itself and rallies Western allies.", themes:["duration","consequences"]},

  // ===== Reading C — ISW =====
  {id:"C1", src:"C", fact:"Russian military victory is not inevitable — 'extraordinarily unlikely' unless Western support for Ukraine collapses.", themes:["duration","ending"]},
  {id:"C2", src:"C", fact:"Ukrainians face an existential war against an adversary that seeks to subjugate them and eliminate their identity and language. The Kremlin wants to annex land far beyond Donetsk and Luhansk and take full control of Ukraine's government.", themes:["causes"]},
  {id:"C3", src:"C", fact:"Ukrainians have fought for more than four and a half years; recent polling still shows determination. They will not surrender as long as they can keep fighting.", themes:["duration","media"]},
  {id:"C4", src:"C", fact:"Ukraine offsets Russia's larger size with technological skill; its military, industrial and technical innovation is compared to Israel's.", themes:["duration"]},
  {id:"C5", src:"C", fact:"Putin is reviving the 'myth of inevitable Russian victory' to persuade the US and Ukraine's supporters to force Kyiv to surrender. ISW calls his claims of gains fictional.", themes:["media","info","ending"]},
  {id:"C6", src:"C", date:"Jan–Oct 2026", fact:"Russian officials claimed ~6,500 sq km seized since 1 January 2026; ISW assesses a net gain of just 73 sq km. Ukraine liberated about 1,080 sq km in the same period.", themes:["media","info","duration"]},
  {id:"C7", src:"C", date:"2026", fact:"Russia made effectively zero net gains in 2026 at a cost of over 40,000 casualties per month since July — about 458 casualties per sq km lost.", themes:["consequences","duration"]},
  {id:"C8", src:"C", date:"2026", fact:"Ukraine has held the initiative in key sectors and decisively defeated the main Russian offensive meant to seize Donetsk Oblast in 2026.", themes:["duration"]},
  {id:"C9", src:"C", fact:"It is unclear if Putin is lying or being lied to: Russian units send 'beautiful reports' claiming gains they never made; leaked maps show phantom gains.", quote:"beautiful reports", themes:["info","media"]},
  {id:"C10", src:"C", date:"2022", fact:"Russia's 2022 reserve callup brought in about 330,000 men, but twice as many fled Russia to avoid fighting.", themes:["consequences"]},
  {id:"C11", src:"C", date:"2026", fact:"Russian recruitment fell to about 29,250 per month (Jan–Aug 2026), 10% lower than 2025, despite rising bonuses and more coercion.", themes:["consequences","duration"]},
  {id:"C12", src:"C", fact:"Putin hesitates to order another callup, fearing unrest in a war-tired country. Ukrainian strikes on Russian energy caused gasoline and diesel shortages.", themes:["consequences","duration","media"]},
  {id:"C13", src:"C", fact:"Ukrainian drones let small forces hold off much larger Russian groups, often at casualty ratios of 10:1 or more, through a 20–40 km 'kill zone'.", themes:["duration"]},
  {id:"C14", src:"C", fact:"Russia's population and wealth let Putin continue a long time — but Ukraine can also keep fighting as long as Western support continues.", themes:["duration","ending","intl"]},
  {id:"C15", src:"C", fact:"A sustainable compromise peace is the stated aim of Zelensky, the Ukrainian government, the US and Ukraine's other supporters.", quote:"It is only Putin who opposes compromise.", themes:["ending","causes"]},
  {id:"C16", src:"C", fact:"The task for Ukraine and partners: raise the cost of Putin's ambitions high enough to convince him to accept a peace he does not dictate — 'very challenging, but feasible'.", themes:["ending","intl"]},

  // ===== Reading D — Iskoujina et al. =====
  {id:"D1", src:"D", date:"Feb 2022", fact:"The February 2022 invasion caused not only a war but a 'social media war'; the CIGI called it the first 'full-blown social media war'.", themes:["media"]},
  {id:"D2", src:"D", fact:"Ukrainians experienced the start of the war through the sound of explosions; the West experienced it through social media.", themes:["media","lessons"]},
  {id:"D3", src:"D", fact:"Journalists and lawyers turned their social media accounts into information hubs, using Twitter/X to bypass journalistic gatekeeping.", themes:["people","info"]},
  {id:"D4", src:"D", fact:"After Twitter's ownership change, its algorithm flagged updates from the Ukrainian war zone as 'sensitive content' and shadow-banned them for English-speaking users (Barr, 2023).", themes:["info","media"]},
  {id:"D5", src:"D", fact:"Russia has a long history of 'active measures'. NewsGuard (2024) debunked over 160 false narratives about the war and identified 461 sites supporting them.", themes:["media"]},
  {id:"D6", src:"D", date:"2021–2022", fact:"Three main Russian disinformation frames: Donbas as the 'victim', Ukrainian political elites and nationalism as the 'enemy', and Ukraine as a symbol of Western aggression against Russia.", themes:["media","causes"]},
  {id:"D7", src:"D", date:"Dec 2023", fact:"Democracies counter disinformation by exposing claims, sharing intelligence, restricting Russian state media and supporting independent outlets (OECD, 2022). The European Commission began proceedings against X over disinformation (Dec 2023).", themes:["info","ending"]},
  {id:"D8", src:"D", date:"2013", fact:"Russia's 2013 military doctrine linked military domination with information — not only broadcast media but blogs, websites and social media (Kreft et al., 2023).", themes:["info","causes"]},
  {id:"D9", src:"D", fact:"For a decade the conflict has featured fake news from all its participants (Kreft et al., 2023).", themes:["media","duration"]},
  {id:"D10", src:"D", fact:"President Zelenskyy successfully used his Twitter account to communicate with a global audience (Nisch, 2024).", themes:["info","media"]},
  {id:"D11", src:"D", fact:"'Citizen chroniclers' sharing real-time updates reshaped the information landscape — e.g. young diarist Yeva Skalietska. Social media is a double-edged sword: it documents reality but also spreads disinformation.", themes:["people","media"]},
  {id:"D12", src:"D", fact:"Ukraine has also used disinformation, such as heroic stories later debunked, to boost morale and win sympathy (Alonso-Martín-Romo et al., 2023).", themes:["media"]},
  {id:"D13", src:"D", fact:"Around 40% of war news articles come from news agencies, 23% from other news media, and only 16% from social media (Udris et al., 2023).", themes:["info","media"]},

  // ===== YEMEN (your AT4 case study — Al Jazeera, 21 Sep 2026; use for Q8 only) =====
  {id:"E1", src:"E", date:"1990s", fact:"The Houthis emerged in Saada, a mountainous region in the north, in the 1990s, demanding a greater share of power. They come from Yemen's Zaidi Shia minority.", themes:["causes","lessons"]},
  {id:"E2", src:"E", date:"2011–2014", fact:"The Houthis used anger at Yemen's weak transitional government after the 2011 Arab Spring forced out long-time President Saleh. They took Sanaa in September 2014 and President Hadi fled.", themes:["causes","duration"]},
  {id:"E3", src:"E", date:"Mar 2015", fact:"Saudi Arabia intervened in March 2015 to support Hadi's government and carried out thousands of attacks. Riyadh sees Iran as a regional threat.", themes:["causes","intl"]},
  {id:"E4", src:"E", fact:"The article calls the Houthis part of the Iran-backed 'axis of resistance', but adds that the group has its own base, its own interests and its own ambitions.", themes:["causes","lessons"]},
  {id:"E5", src:"E", date:"Apr 2022", fact:"A UN-mediated truce took effect in April 2022 after seven years of conflict. It brought a marked de-escalation, but low-intensity fighting continued.", themes:["ending","duration"]},
  {id:"E6", src:"E", date:"2023", fact:"In 2023 Saudi Arabia and the Houthis agreed, after direct talks, to a UN roadmap toward a permanent ceasefire — but the roadmap was never formalised.", quote:"never formalised", themes:["ending","lessons"]},
  {id:"E7", src:"E", date:"Aug–Sep 2026", fact:"In late August 2026 the Houthis launched a major offensive, saying government forces had violated the 2022 truce. On 10 September they seized Mocha, tightening their control of the Red Sea coast.", themes:["duration","ending"]},
  {id:"E8", src:"E", date:"2019 / 2026", fact:"In 2019 the UN said about 24 million people (80% of the population) needed help. The article now cites the IOM: 22 million Yemenis, nearly half the population, need urgent aid.", themes:["consequences"]},
  {id:"E9", src:"E", fact:"Other players: the Saudi-backed Presidential Leadership Council (set up in 2022), the Sunni Islamist Islah party (strongest in Marib) and the National Resistance Forces led by Tareq Saleh.", themes:["causes"]},

  // ===== CLASS =====
  {id:"P1", src:"P", fact:"Causes in our case studies (slide 8): ethnic divisions, power, corruption, greed/resources, acquisition of land.", themes:["causes"]},
  {id:"P2", src:"P", fact:"Pragmatic (strategic) non-violence: objective-driven, can be more effective and less costly than armed rebellion; aims to change hearts and minds and raise an issue's profile.", themes:["people"]},
  {id:"P3", src:"P", fact:"Gandhi's Salt March (1930) and the Nashville sit-ins (grassroots, organised, persistent) show non-violent action changing unjust laws.", themes:["people"]},
  {id:"P4", src:"P", fact:"Extra research should fill gaps, NOT find new examples. You can link to other subjects, like Global Studies.", themes:["lessons"]}
];

// ---------- QUESTIONS ----------
const QUESTIONS = [
  {
    n:1,
    q:"What do you think is the most important cause of conflict today? Support your answer with case studies.",
    keywords:[
      ["What do you think","Give YOUR clear opinion — use 'In my view…'"],
      ["the most important","Superlative: pick ONE cause and argue why it beats the others"],
      ["cause","Why conflict STARTS — not its effects"],
      ["of conflict","Broadened beyond war (teacher's clarification)"],
      ["today","Present-day: Ukraine leads. Rwanda shows the pattern isn't new"],
      ["case studies","Plural — use BOTH Rwanda and Ukraine"]
    ],
    trap:"Leading with Rwanda 1994 — it isn't 'today'. Use Ukraine first, Rwanda as the historical pattern.",
    position:"The pursuit of political power and control is the most important cause of conflict today. Prejudice, propaganda and poverty are tools leaders use.",
    evidence:["C2","C15","A2","R25","R24","R13"],
    spoken:"In my view, the most important cause of conflict today is the pursuit of political power — leaders wanting control over land, governments and people. Ukraine is the clearest example happening right now. According to the Institute for the Study of War in October 2026, the Kremlin keeps saying it wants to annex large parts of Ukraine, far beyond Donetsk and Luhansk, and take full control of Ukraine's government. The report says, \"It is only Putin who opposes compromise.\" Even Russia's propaganda comes from the top: Detector Media reports that hacked documents showed Kremlin officials personally involved in producing fake news. And this pattern isn't new. In Rwanda, the 1993 Arusha Accords offered power-sharing, but according to Genocide in Rwanda, page 250, the Hutu elite wanted \"absolute control of the country\" and planned to kill all Tutsi so they could never be challenged again. So prejudice and propaganda matter, but they're tools. Power is what turns tension into conflict.",
    counters:[
      ["\"The reading says prejudice was most important.\" (p. 238)","The same sentence says Hutu were \"manipulated by their Hutu leaders\". Hutu and Tutsi intermarried for centuries (p. 238); the prejudice was manufactured by colonisers (p. 242) and then used by leaders."],
      ["\"Economics/poverty is the main cause.\"","Agree it mattered — 50% of Rwandans were malnourished by 1990 (p. 248). But the elite kept the aid money (p. 247) and poverty made people 'easily manipulated' (p. 250). Poverty made it easier; leaders chose violence."],
      ["\"Identity is the main cause in Ukraine.\"","ISW says Russia wants to eliminate Ukrainian identity and language — but identity is the TARGET. The decision to attack it comes from leaders seeking control."],
      ["\"Media causes conflict.\"","In both cases those in power ran the media — the CDR radio (p. 250) and Kremlin officials behind Doppelganger (Detector Media)."]
    ],
    a4:"Q1 POWER = #1 | ISW 2026: annex beyond Donetsk/Luhansk + control govt; \"only Putin opposes compromise\" | Detector Media: Kremlin officials ran fakes | RW p.250 elite wanted \"absolute control\", rejected Arusha | Counter p.238 prejudice → leaders manipulated it"
  },
  {
    n:2,
    q:"What are the short-term and long-term consequences of war / conflict? Use examples in your response.",
    keywords:[
      ["short-term","Immediate effects: deaths, displacement, destruction"],
      ["AND long-term","You must cover BOTH and clearly separate them"],
      ["consequences","Effects/results — not causes"],
      ["war / conflict","Broadened: include information conflict effects too"],
      ["examples","Specific facts and figures, with sources"]
    ],
    trap:"Drifting into causes, or listing only deaths. Separate timeframes clearly and show how they connect.",
    position:"Short-term consequences are the most visible, but long-term consequences are more dangerous because they can become the cause of the next conflict.",
    evidence:["R1","R34","R31","C7","C10","R15","R21","R41","R43","R42","R40","A5"],
    spoken:"I think the short-term consequences of conflict are the most visible, but the long-term ones are more dangerous, because they can cause the next conflict. In the short term, Rwanda's genocide killed between 800,000 and 850,000 people between April and July 1994. According to Genocide in Rwanda, page 252, the genocide and war killed 10 percent of the population and left 30 percent in refugee camps. In Ukraine, the Institute for the Study of War reports Russia has suffered over 40,000 casualties a month since July 2026, for almost no territory. But long-term consequences last for decades. After the violence of 1959 to 1964, about 120,000 Tutsi fled Rwanda, and by 1990 there were up to 700,000 refugees. Their organisation, the RPF, invaded in 1990 — so one conflict's consequences became the next conflict's cause. After 1994, both Hutu and Tutsi were traumatised and the courts were overwhelmed, with over 135,000 people detained. So I'd argue long-term consequences matter more, because if they aren't dealt with, the cycle continues.",
    counters:[
      ["\"Short-term deaths are obviously worse.\"","Agree they're the most tragic — but the long term decides whether peace lasts. Rwanda's 1960s refugees became the RPF that invaded in 1990 (p. 248–249)."],
      ["\"Some long-term consequences are positive.\"","Fair point (class: 'Can conflict be a good thing?'). The ICTR achieved the first international genocide convictions (p. 256); Ukraine became a nation that rallies allies (Schrijver). But these came at an enormous cost."],
      ["\"Ukraine's consequences are mostly military.\"","Also social: Detector Media shows Russia spreading hostility towards Ukrainian refugees in Europe — a long-term consequence of displacement."]
    ],
    a4:"Q2 SHORT: RW 800–850k killed Apr–Jul 94; 10% dead, 30% refugees (p.252) | UA: >40k RU casualties/month since Jul 2026 (ISW); 2022 callup 330k but 2x fled | LONG: RW refugees 120k→700k → RPF 1990 (p.245,248) = cycle | 135–140k detained, trauma (p.257) | ICTR $1.2b, 1st genocide convictions (p.256)"
  },
  {
    n:3,
    q:"Why do some conflicts end quickly while others last for many years? Use case studies in your response.",
    keywords:[
      ["Why","Explain REASONS, don't just describe events"],
      ["some … end quickly","Need an example of a fast end"],
      ["others last for many years","Need an example of a long conflict — compare them"],
      ["case studies","Rwanda (fast) vs Ukraine (long) fits perfectly"]
    ],
    trap:"Describing what happened without explaining WHY. Also: Rwanda's genocide was quick, but the wider conflict lasted 1990–94.",
    position:"Conflicts end quickly when one side wins decisively; they last for years when power is balanced, outside support sustains both sides, and leaders' goals are incompatible.",
    evidence:["R33","R31","R23","C14","C13","C1","C15","C5","B5","B8"],
    spoken:"I think conflicts end quickly when one side wins decisively, and last for years when power is balanced and outside support keeps both sides going. Rwanda's genocide ended in about three months because, according to Genocide in Rwanda, page 252, the RPF was disciplined and well-armed. It took Kigali and swore in a new government on 19 July 1994. The international community didn't stop the genocide — the RPF's military victory did. Ukraine is the opposite. The Institute for the Study of War says Russia's population and wealth let Putin keep fighting for a long time, but Ukraine can also keep fighting as long as Western support continues. Ukraine's drones let small forces hold off much larger Russian groups, so neither side can easily win. And the goals are incompatible: ISW says \"It is only Putin who opposes compromise.\" However, Rwanda shows it isn't that simple — the wider conflict there lasted four years, from the 1990 RPF invasion. So the genocide ended quickly, but the conflict didn't.",
    counters:[
      ["\"Rwanda ended quickly because the international community intervened.\"","The opposite: UN members refused troops, Belgium and France withdrew by 14 April, and the US blocked reinforcements (p. 254–255). The RPF's military victory ended it."],
      ["\"Ukraine lasts because Russia is stronger.\"","ISW argues Russian victory is 'extraordinarily unlikely' unless Western support collapses, and Russia made a net gain of only 73 sq km in 2026. It's a balance, not dominance."],
      ["\"Peace deals end conflicts.\"","Only if leaders keep them — the Hutu elite ignored Arusha (p. 250), and Minsk (2015) left only an uneasy ceasefire (Schrijver)."]
    ],
    a4:"Q3 QUICK = decisive win: RPF disciplined, took Kigali, new govt 19 Jul 94 (p.252); 80% deaths in ~6 wks | LONG = balance + outside support + incompatible goals: ISW — RU population/wealth vs UA + Western support; drones 10:1; \"only Putin opposes compromise\" | Nuance: RW conflict 1990–94 = 4 yrs (p.249)"
  },
  {
    n:4,
    q:"To what extent can media bias shape public support for war / conflict?",
    keywords:[
      ["To what extent","You MUST give a judgment of degree: 'to a large extent, but…'"],
      ["media bias","Slanted coverage — name the TYPE of bias (class list)"],
      ["shape","Influence/change — not just 'exist'"],
      ["public support","Ordinary people's opinions, not leaders' decisions"],
      ["war / conflict","Broadened"]
    ],
    trap:"Answering 'yes, a lot' with no limits. The marks are in the 'but'.",
    position:"Media bias can shape public support a lot, but mainly for people far from the conflict. People living through it are much harder to fool. (Far away = easy to fool; close up = hard to fool.)",
    evidence:["R26","R27","R29","R7","R22","A1","A3","A5","D6","D4","C3","D2","C12","B6","D12"],
    spoken:"I think media bias can shape public support for conflict to a large extent, but it works best on people who are far away from the fighting or have no other information. Rwanda shows how strong it can be. According to Genocide in Rwanda, page 250, extremists set up a radio station that turned Hutu against all Tutsi. Poor villagers were \"easily manipulated\", partly because they were used to obeying authority. This is emotional manipulation. Russia uses bias in a more modern way. Detector Media reports that its Doppelganger network copies real news websites to weaken support for Ukraine in other countries. This is source bias. However, there is a limit. The Institute for the Study of War says Ukrainians have kept fighting for more than four and a half years. They live through the war every day, so fake news doesn't easily change their minds. So media bias is powerful, but it's strongest on people who can't see the conflict for themselves.",
    counters:[
      ["\"Media bias controls everything.\"","Even Putin, who controls Russian state media, hesitates to order another callup because he fears unrest (ISW). Bias has limits."],
      ["\"Only Russia uses bias.\"","Ukraine does too — #SnakeIslandStrong (Schrijver) and heroic stories later debunked (Iskoujina et al.). Both sides use emotional manipulation."],
      ["\"Bias didn't matter in Rwanda — it was obedience.\"","They worked together: radio and 'sensibilisation' (p. 250–251) gave orders that people were conditioned to obey (p. 240). Bias + obedience = mobilisation."]
    ],
    a4:"Q4 LARGE EXTENT, BUT mainly far away | RW: CDR radio (p.250), \"easily manipulated\", obeyed authority (p.240) = emotional manipulation | UA: Doppelganger copies real news sites to weaken support abroad = source bias (Det. Media) | LIMIT: Ukrainians fighting 4.5+ yrs (ISW) — they live it | Far away = easy to fool; close up = hard to fool"
  },
  {
    n:5,
    q:"Who has the power to control information during conflict, and how does this affect people's understanding of events?",
    keywords:[
      ["Who","Name specific ACTORS: governments, militaries, platforms, news agencies, citizens, international bodies"],
      ["has the power to control","Who decides what people see/hear"],
      ["information","News, propaganda, social media, labels"],
      ["during conflict","While it's happening"],
      ["AND how does this affect","Second half — the EFFECT on understanding. Don't skip it!"],
      ["people's understanding of events","What people believe is true"]
    ],
    trap:"Answering only 'who' and forgetting the effect on understanding.",
    position:"Governments and leaders usually have the most power over information, but in Ukraine social media platforms and ordinary citizens have weakened that control. Whoever controls information controls what people believe is true.",
    evidence:["R22","R26","R29","R39","R6","A2","A4","B3","C9","D4","D3","D11","D13","D10"],
    spoken:"Governments and leaders usually have the most power to control information, but in Ukraine, social media platforms and ordinary citizens have weakened that control. In Rwanda in 1994, information came from the top. According to Genocide in Rwanda, page 249, the Minister of Defence used national radio to tell people to track down Tutsi \"infiltrators\" — really an order to kill. Because people trusted authority, they believed what they were told. Even the international community controlled the story by calling it a civil war, so they didn't have to act — page 255. In Ukraine, Detector Media shows Kremlin officials personally involved in producing fake news. But platforms matter too: Iskoujina, Gnatchenko and Bernal explain that Twitter's algorithm flagged Ukrainian war updates as \"sensitive content\", so many English-speaking users never saw them. And citizens now post real-time updates themselves. So whoever controls information controls what people think is true, but today that power is more spread out than it was in 1994.",
    counters:[
      ["\"Social media gives everyone equal power.\"","Not equal: algorithms decide reach (Twitter shadow-banning, Iskoujina et al.), and about 40% of war news still comes from news agencies (Udris et al.)."],
      ["\"Governments always know the truth.\"","ISW says it's unclear whether Putin is lying or being lied to — units send 'beautiful reports' of gains they never made. Control of information can mislead leaders too."],
      ["\"International bodies are neutral.\"","In Rwanda, calling it a 'civil war' avoided the Genocide Convention (p. 255). Labels are a form of information control."]
    ],
    a4:"Q5 WHO: govts (RW Defence Minister radio p.249; Kremlin officials/ASP – Det. Media) | military (HUR intercepted calls – Schrijver; RU 'beautiful reports' – ISW) | platforms (X shadow-ban – Iskoujina) | intl (\"civil war\" label p.255) | citizens (citizen chroniclers) | EFFECT: shapes what people believe; 1994 top-down vs 2022 spread out"
  },
  {
    n:6,
    q:"What are the biggest challenges in ending a conflict today?",
    keywords:[
      ["biggest","Rank them — say which is #1"],
      ["challenges","Plural: give 2–3 obstacles"],
      ["ending","How conflicts STOP — not how they start"],
      ["a conflict today","Present-day: Ukraine first; Rwanda as supporting pattern"]
    ],
    trap:"Talking about causes instead of obstacles to ending. Keep asking: 'why can't this stop?'",
    position:"The biggest challenge is leaders who refuse to compromise while they believe they can still win; this is made worse by information wars that distort reality and by peace agreements that aren't enforced.",
    evidence:["C15","C5","C6","C9","C14","C16","R24","R25","B5","R36","R38"],
    spoken:"I think the biggest challenge in ending a conflict today is that leaders won't compromise while they believe they can still win. The Institute for the Study of War says Ukraine, the US and Ukraine's supporters all want a compromise peace, and \"It is only Putin who opposes compromise.\" Putin is also spreading the myth that Russian victory is inevitable, to persuade the West to push Ukraine to surrender — even though ISW assesses Russia gained only 73 square kilometres in 2026 while claiming about 6,500. So the information war makes negotiation harder. A second challenge is that peace agreements often fail. In Rwanda, the 1993 Arusha Accords promised power-sharing, but according to Genocide in Rwanda, page 250, the Hutu elite had no intention of following them. Similarly, Schrijver notes that after the 2015 Minsk agreements there was only an uneasy ceasefire in eastern Ukraine. So ending conflict needs leaders who accept compromise, and agreements that are actually enforced.",
    counters:[
      ["\"The biggest challenge is lack of international action.\"","Strong point for Rwanda — UNAMIR had only 2,548 powerless troops and the US blocked reinforcements (p. 254–255). But in Ukraine there IS strong international support, and the war continues — so leaders' unwillingness is the bigger obstacle today."],
      ["\"Just negotiate a ceasefire.\"","Minsk (2015) did that and Russia kept Crimea with only an uneasy ceasefire (Schrijver). A ceasefire without trust or enforcement isn't an ending."],
      ["\"Ending conflict is impossible.\"","ISW calls it 'very challenging, but feasible' if the cost to Putin is raised high enough."]
    ],
    a4:"Q6 #1 NO COMPROMISE: \"only Putin opposes compromise\" (ISW) | INFO WAR: myth of inevitable victory; claims 6,500 vs 73 sq km | FAILED DEALS: Arusha ignored by elite (p.250); Minsk 2015 uneasy ceasefire (Schrijver) | INTL WILL: UNAMIR 2,548 powerless; US blocked (p.254–255) | ISW: \"challenging but feasible\""
  },
  {
    n:7,
    q:"What can ordinary people do to reduce conflict or promote peace?",
    keywords:[
      ["ordinary people","Citizens — NOT governments, armies or the UN"],
      ["can do","Practical actions"],
      ["reduce conflict","Stop it getting worse"],
      ["OR promote peace","Build peace after/around conflict — either counts"]
    ],
    trap:"Listing what governments or the UN should do. Every example must be about citizens.",
    position:"Ordinary people can refuse to spread hate and misinformation, and refuse unjust orders — but they are most effective when organised, and they have limits against armed power.",
    evidence:["R7","R28","R29","R30","D11","D3","A7","B7","B4","R43","P2","P3"],
    spoken:"I think ordinary people can do two important things: refuse to spread hate, and refuse to follow unjust orders. Rwanda shows why this matters. According to Genocide in Rwanda, page 250, the militias obeyed leaders without question, and on page 251, officials described killing as \"bush clearing\", like a community work project. The genocide needed ordinary people to take part. In Ukraine, ordinary people are fighting misinformation. Iskoujina, Gnatchenko and Bernal explain that \"citizen chroniclers\" share real-time updates, and journalists and lawyers turned their social media accounts into information hubs. Schrijver also says Ukraine's success came from collaboration between the government, the military and civil society. However, ordinary people have limits — in Rwanda, moderate Hutu were among the first killed, and the genocide only ended through the RPF's military victory. So individuals can reduce conflict, but they're most effective when they're organised, like the non-violent movements we studied in class.",
    counters:[
      ["\"Ordinary people can't change anything.\"","The Rwandan genocide depended on ordinary people taking part (p. 250–251) — so their choices matter. And class examples (Nashville sit-ins, Salt March) show organised non-violence changing laws."],
      ["\"Social media lets ordinary people fix misinformation.\"","Partly — but it's a double-edged sword (Iskoujina et al.): citizens can also spread disinformation, including Ukraine's heroic stories later debunked."],
      ["\"Ordinary people should just protest.\"","Non-violent action works best when pragmatic and organised (class slides), and linked with institutions — Schrijver: government + military + civil society together."]
    ],
    a4:"Q7 REFUSE HATE + REFUSE ORDERS: RW militias obeyed without question (p.250); \"bush clearing\" (p.251); habit of obedience (p.240) | UA: citizen chroniclers; journalists/lawyers as info hubs (Iskoujina); govt + military + civil society (Schrijver); X readers add context | LIMIT: moderate Hutu killed first (p.251) | Class: organised non-violence (Nashville, Gandhi)"
  },
  {
    n:8,
    q:"What have you learned from your case study that helps you better understand conflict?",
    keywords:[
      ["What have you learned","Personal reflection — 'Before this unit I thought… now I understand…'"],
      ["your case study","Singular — YOUR own case study. Yemen (your AT4 presentation) fits perfectly; link it back to Rwanda and Ukraine"],
      ["helps you better understand","Give a GENERAL lesson about conflict, not a history recap"],
      ["conflict","Apply the lesson beyond your case"]
    ],
    trap:"Retelling Yemen's history. Lead with the lesson, then use the evidence. Also don't say Yemen is 'just Sunni against Shia' — the article shows a fight over power, with religion as the label.",
    position:"My case study, Yemen, taught me two things: religion or ethnicity is often the label while power is the real cause, and a ceasefire is not peace. Rwanda and Ukraine show the same two patterns.",
    evidence:["E1","E4","R4","R10","E5","E6","E7","R24","B5","P1"],
    spoken:"From my own case study, Yemen, I learned two things. First, religion or ethnicity is often just the label, and power is the real cause. The Houthis come from the Zaidi Shia minority, but Al Jazeera explains that they began in the 1990s by demanding a greater share of power. Rwanda shows the same pattern. According to the chapter Genocide in Rwanda, page 238, Hutu and Tutsi lived side by side for centuries, and page 242 says the Germans created the racial categories. Second, a ceasefire is not peace. Yemen's UN truce began in April 2022, but the 2023 roadmap was never formalised, and in late August 2026 the Houthis launched a major offensive. In Rwanda, the Hutu elite ignored the Arusha Accords, and Schrijver says Ukraine's Minsk ceasefire stayed uneasy. So now I ask two questions: who wants power, and will the deal really be kept?",
    counters:[
      ["\"Yemen is just Sunni against Shia.\"","Religion is part of it: the Houthis come from the Zaidi Shia minority and Islah is Sunni Islamist (Al Jazeera). But the article says the Houthis began by demanding a greater share of power and have their own interests, and it also names Saudi–Iran rivalry. So I say religion is the label, power is the driver."],
      ["\"Yemen isn't one of our case studies — Rwanda and Ukraine are.\"","Q8 says 'your case study'. Yemen is my AT4 peer-presentation case from class (Week 13 slides: Religious divisions — Houthis). I use it for the lesson, then link straight back to Rwanda and Ukraine."],
      ["\"A ceasefire is better than nothing.\"","Yes — the April 2022 truce brought a marked de-escalation (Al Jazeera). But low-intensity fighting continued, the 2023 roadmap was never formalised, and fighting escalated in August 2026. A ceasefire helps only if the deal is kept."],
      ["\"Rwanda was genocide, Yemen is a war — you can't compare them.\"","Different types, but the lesson is about patterns: identity labels used in a fight for power (Rwanda p. 238, 242) and peace deals that failed (Arusha p. 250, Minsk, the 2022 truce)."]
    ],
    a4:"Q8 MY CASE = YEMEN (AT4; Al Jazeera, Sep 2026) | LESSON 1 LABEL ≠ CAUSE: Houthis = Zaidi Shia BUT began 1990s Saada demanding 'greater share of power'; own interests (not only Iran) | RW p.238 intermarried for centuries; p.242 Germans made categories | LESSON 2 CEASEFIRE ≠ PEACE: Yemen truce Apr 2022 → 2023 roadmap never formalised → late Aug 2026 Houthi offensive | RW Arusha ignored (p.250) | UA Minsk 2015 uneasy (Schrijver) | Ask: who wants power? will the deal be kept?"
  }
];

// ---------- MOCK EXAM LINES ----------
const MOCK = {
  follow: {1:"Why is that more important than the other causes?",2:"Which matters more: short-term or long-term, and why?",3:"Which case study best proves your point?",4:"Does it depend on whether people are close to the conflict or far away?",5:"Has social media changed who controls information since 1994?",6:"Which challenge do you think is overrated?",7:"What could one student realistically do?",8:"How would that lesson help you read the news about a new conflict?"},
  followUnseen: ["Which case study best proves your point?","What would change your mind?","How is that different today compared with 1994?","Is that always true, or only sometimes?"],
  challenge: ["I see it differently. What is your evidence for that?","But could the opposite also be true?","That sounds like one source only. Do you have another one?","Why do you think that matters more than the other reasons?"],
  source: ["Which reading says that, and which page?","Can you give the source and the year for that?","Who published that, and when?"],
  clarity: ["Can you explain that more simply?","What do you mean by that, exactly?"],
  compare: ["Can you compare that with the other case study?","Does that also happen in Ukraine? Or in Rwanda?"]
};

// ---------- MEDIA BIAS TYPES ----------
const BIAS = [
  {name:"Selection bias (cherry picking)", def:"Selecting facts or arguments that support one view; contradictory views ignored.", ex:"Ukraine's HUR releases chosen clips of Russian soldiers complaining about their leaders (Schrijver).", src:"B"},
  {name:"Omission bias", def:"Important facts or perspectives excluded — deliberately or by not seeking them.", ex:"Twitter/X flagged Ukrainian war-zone updates as 'sensitive' and shadow-banned them for English-speaking users (Iskoujina et al., citing Barr 2023).", src:"D"},
  {name:"Sensationalism", def:"Exaggerating an issue; shocking images and emotional language.", ex:"Russian officials claimed ~6,500 sq km seized in 2026; ISW assessed a 73 sq km net gain.", src:"C"},
  {name:"False balance", def:"Presenting a clearly evidenced issue as having 'two sides' to create confusion.", ex:"Arguably: Western powers framed the genocide as a 'civil war' — two warring sides — avoiding the Genocide Convention (p. 255).", src:"R"},
  {name:"Source bias", def:"Using information only from those who share a viewpoint — or faking a trusted source.", ex:"Doppelganger sites copy the design of real publications so readers trust them (Detector Media).", src:"A"},
  {name:"Headline bias (clickbait)", def:"Headlines that exaggerate, oversimplify or misrepresent the content.", ex:"Fake 'news' posts about riots in France (30 June 2024) shown in the Doppelganger reading (Detector Media).", src:"A"},
  {name:"Commercial / corporate bias", def:"Favouring stories that benefit owners, sponsors or business interests.", ex:"Arguably: after Twitter's change of ownership, altered algorithms limited the reach of Ukrainian content (Iskoujina et al.).", src:"D"},
  {name:"Political / ideological bias", def:"Promoting particular policies, ideologies or values.", ex:"Kayibanda's government promoted 'the lofty human worth of being Hutu' (p. 246); Russia framed Ukraine's elites as 'the enemy' (Iskoujina et al.).", src:"R"},
  {name:"Emotional manipulation", def:"Emotionally charged images or stories that hide facts; generates fear, sympathy or anger.", ex:"'Sensibilisation': Tutsi described as having horns and tails (p. 251); invented stories about Ukrainian refugees' privileges (Detector Media).", src:"R"}
];

// ---------- DISCUSSION PHRASES ----------
const PHRASES = {
  "Giving your view": ["In my view, …","I'd argue that … because …","The way I see it, the most important factor is …","I'm fairly convinced that …"],
  "Citing a source (attribution)": ["According to the Institute for the Study of War, in October 2026, …","On page 250 of 'Genocide in Rwanda', it says that …","Iskoujina, Gnatchenko and Bernal point out that …","Detector Media reported in 2026 that …","Schrijver, writing for the Modern War Institute, explains that …"],
  "Agreeing and building": ["I agree with [name], and I'd add that …","That's a good point — it links to Ukraine as well, because …","Building on what [name] said, …"],
  "Disagreeing politely": ["I see your point, but I'd look at it differently …","That's true to some extent, however …","I'm not sure I agree — the reading actually suggests …","That might apply to Rwanda, but in Ukraine …"],
  "Sustaining your view": ["I still think … because …","Even if that's true, it doesn't change the fact that …","Coming back to my main point, …"],
  "Inviting others (turn-taking)": ["What do you think, [name]?","[Name], did you find anything different in your readings?","We haven't heard from [name] yet — what's your view?"],
  "Asking for clarification": ["Could you explain what you mean by …?","Do you mean that …?","Which source was that from?"],
  "Comparing the case studies": ["Similarly, in Ukraine …","Whereas in Rwanda …, in Ukraine …","Both cases show that …","The key difference is …"],
  "Buying time (unseen question)": ["That's an interesting question — I think it depends on …","Let me connect that to what we said earlier about …"]
};

// ---------- UNSEEN QUESTION PRACTICE ----------
const UNSEEN = [
  {q:"Can conflict ever be a good thing?", angle:"Distinguish violent vs non-violent conflict. Positive outcomes: ICTR's first genocide convictions (p. 256); Ukraine's innovation and civil-society collaboration (Schrijver); class — Australian rights won through non-violent conflict. But violent conflict's cost (10% of Rwanda killed, p. 252) is never 'worth it'."},
  {q:"Is international intervention always helpful?", angle:"Rwanda: lack of intervention — UNAMIR powerless, US blocked reinforcements (p. 254–255); foreign aid even funded militias (p. 250). Ukraine: Western support keeps Ukraine fighting (ISW). Help depends on timing and political will."},
  {q:"Should social media companies be responsible for disinformation in conflict?", angle:"X shadow-banned Ukrainian updates; EU proceedings against X (Iskoujina et al.); Doppelganger uses paid ads and fake profiles (Detector Media). Balance: free expression vs harm."},
  {q:"Which is more powerful in conflict: weapons or information?", angle:"Rwanda: radio + sensibilisation mobilised killers (p. 250–251), but the RPF's weapons ended it (p. 252). Ukraine: 'social media war' (Iskoujina) but drones hold the line (ISW). They work together."},
  {q:"Who is responsible when ordinary people commit violence?", angle:"Leaders planned it (names/addresses from 1992, p. 251), but ordinary people took part; obedience culture (p. 240). Both — with leaders most responsible. ICTR targeted leaders (p. 256)."},
  {q:"Can there be peace without justice?", angle:"Rwanda: 135–140k detained, courts overwhelmed, trauma (p. 257); ICTR slow and costly (p. 256). Ukraine: compromise peace vs Russia's aims (ISW). Peace without justice risks the cycle repeating."},
  {q:"How does history influence conflict today?", angle:"Colonial myth → genocide 100 years later (p. 242); Ukraine: persistent pressure since independence (Turanskiy, Schrijver); Putin evokes Soviet/Red Army images (ISW)."},
  {q:"Can non-violent action work in today's conflicts?", angle:"Class: pragmatic non-violence, Nashville, Gandhi. Ukraine: citizen chroniclers, civil society. Limit: against armies and genocide, non-violence alone wasn't enough (RPF victory, p. 252)."},
  {q:"Why do people believe propaganda?", angle:"Poverty/misery made peasants 'easily manipulated' (p. 250); habit of obedience (p. 240); fakes copy trusted sites (Detector Media). People believe what fits fear and comes from 'trusted' sources."},
  {q:"Is the media more responsible for ending or prolonging conflict?", angle:"Prolonging: Putin's myth of inevitable victory (ISW); RTLM-style radio (p. 250). Ending: Ukraine's strategic communications rally allies (Schrijver); independent media (OECD via Iskoujina)."},
  {q:"Is it ever acceptable for a government to restrict information during a conflict?", angle:"Rwanda: government-run radio was used to incite killing (p. 249–250); Amnesty (2004) found no press freedom and journalists detained (p. 257). Ukraine: democracies counter disinformation by restricting Russian state media (OECD, in Iskoujina et al.); X shadow-banned Ukrainian updates (Iskoujina et al.). Balance: protecting people from propaganda vs the risk that those in power abuse censorship.", fresh:true},
  {q:"What role do refugees play in conflict?", angle:"Rwanda: about 120,000 Tutsi fled in 1961–64 (p. 245); refugees grew to 600,000–700,000 by 1990 and the RPF formed in 1987 (p. 248); 30% of Rwandans were in camps after 1994 (p. 252). Ukraine: a Russian campaign pushed hostility toward Ukrainian refugees in Europe (Detector Media). Refugees are a consequence of conflict AND can become a cause of the next one.", fresh:true},
  {q:"What is the best way to prevent conflict before it starts?", angle:"Rwanda: the West and UN had warnings from late 1993 (p. 253); UNAMIR was only 2,548 troops (p. 253–254); the Arusha Accords were ignored (p. 250). Ukraine: Minsk (2015) left only an uneasy ceasefire (Schrijver); Turanskiy says experts must expose manipulation. Prevention needs early action, political will and deals that are enforced.", fresh:true},
  {q:"Do economic conditions make conflict more likely?", angle:"Rwanda: poverty, land scarcity and overpopulation (p. 238); aid was 70% of the budget but only 4–6% reached rural areas (p. 247); poor peasants were 'easily manipulated' (p. 250). But the elite used aid money to set up militias (p. 250) — leaders choose violence. Ukraine: Russia's wealth lets Putin continue (ISW). Class slide: greed/resources and land. Poverty makes it easier; it is not the whole cause.", fresh:true},
  {q:"How reliable are the sources we use to learn about conflicts?", angle:"Doppelganger copies real news sites (Detector Media); NewsGuard debunked 160+ false narratives and 461 sites (Iskoujina et al.); ISW calls Putin's claimed gains fictional (6,500 vs 73 sq km); Ukraine also used heroic stories later debunked (Iskoujina et al.); Rwanda had no press freedom (p. 257). Check author, date, evidence and cross-check.", fresh:true},
  {q:"How has technology changed the way conflicts are fought and reported?", angle:"Ukraine: drones hold off larger forces at 10:1 or better (ISW); the first 'social media war' (Iskoujina et al.); AI and deepfakes (Detector Media); citizen chroniclers. Rwanda: radio and village meetings did the same job of mobilising people (p. 250–251). New tools, same purposes.", fresh:true},
  {q:"Is a long war ever better than a bad peace?", angle:"Minsk (2015) gave only an uneasy ceasefire (Schrijver); ISW says supporters want a sustainable compromise peace, and Ukraine has fought 4.5+ years with 40,000+ Russian casualties a month. Rwanda: the Arusha deal was ignored and genocide followed (p. 250); the war ended by RPF victory (p. 252). A peace that is not enforced may only delay the fighting.", fresh:true},
  {q:"What do Rwanda and Ukraine have in common, and what is different?", angle:"Common: leaders seeking power and control (p. 250; ISW); information used as a weapon; failed deals (Arusha, Minsk); international will shaped outcomes. Different: genocide inside a state vs inter-state war; radio vs social media; about 3 months (p. 252) vs 4.5+ years (ISW); abandoned by the world (p. 254–255) vs strong Western support (ISW).", fresh:true},
  {q:"Does the media have a duty to stay neutral during a conflict?", angle:"Rwanda: radio incited killing (p. 250); Western governments used the 'civil war' label (p. 255) — a form of false balance (class). Ukraine: strategic communications rally allies (Schrijver), but some heroic stories were later debunked (Iskoujina et al.). Neutral is not the same as truthful: separate balance from accuracy.", fresh:true},
  {q:"Why do conflicts return after a ceasefire or peace deal?", angle:"Rwanda: Arusha ignored by the Hutu elite (p. 250); refugees became the RPF (p. 248). Ukraine: Minsk (2015) only an uneasy ceasefire (Schrijver), then the full-scale invasion in Feb 2022 (Iskoujina et al.). Deals fail without trust, enforcement or leaders willing to compromise (ISW).", fresh:true}
];

// ---------- KEY TERMS (flashcards) ----------
const TERMS = [
  ["Arusha Accords (1993)","Peace deal (4 Aug 1993) between Habyarimana and the RPF: disband armies, refugees return, share power. The Hutu elite ignored it (p. 249–250)."],
  ["RPF","Rwandese Patriotic Front — Tutsi refugee military organisation (from 1987) that invaded in 1990 and ended the genocide by winning militarily in July 1994 (p. 248, 252)."],
  ["CDR","Coalition pour la Défense de la République — extremist anti-Tutsi group (1992) that ran a fiery radio station and radical publications (p. 250)."],
  ["Interahamwe / Impuzamugambi","Hutu militias of poor peasants, funded with foreign aid money, who obeyed orders without question (p. 250)."],
  ["Sensibilisation","Officials' method to motivate killing: dehumanising tales (horns, tails) and calling murder 'bush clearing' (p. 251)."],
  ["UNAMIR","UN Assistance Mission for Rwanda (5 Oct 1993) — only 2,548 troops, virtually powerless (p. 253–254)."],
  ["ICTR","International Criminal Tribunal for Rwanda — slow, ~$1.2bn by 2005, but first-ever international genocide convictions (p. 255–256)."],
  ["Indirect rule","German system ruling through Tutsi chiefs, so Hutu resented Tutsi, not the Germans (p. 242)."],
  ["MRND","Habyarimana's single party (1974); every citizen had to join and carry an ID card stating Hutu or Tutsi (p. 246)."],
  ["Genocide","A planned, systematic attempt to eliminate an entire targeted group; term coined by Raphael Lemkin in the 1940s (p. 237)."],
  ["Doppelganger network","Russian disinformation network using fake copies of real news sites and fake 'ordinary' accounts (Detector Media)."],
  ["ASP","'Agency for Social Planning' — produced fakes for the Russian presidential administration (Detector Media / The Insider)."],
  ["HUR","Ukraine's military intelligence service; releases intercepted Russian soldiers' calls (Schrijver)."],
  ["Minsk agreements (2015)","Left Crimea annexed and an uneasy ceasefire in eastern Ukraine (Schrijver)."],
  ["Kill zone","20–40 km area saturated by Ukrainian reconnaissance and strike drones (ISW)."],
  ["'Beautiful reports'","Russian units' false reports of gains — leaked maps show phantom advances (ISW)."],
  ["Citizen chroniclers","Ordinary people sharing real-time updates from the war on social media (Iskoujina et al.)."],
  ["Shadow-banning","Hiding content from feeds without removing it — done to Ukrainian war updates on X (Iskoujina et al.)."],
  ["Active measures","Russia's long tradition of spreading disinformation as a tool of war (Iskoujina et al.)."],
  ["Pragmatic non-violence","Strategic, objective-driven non-violent action; can be more effective and less costly than armed rebellion (class)."],
  ["Principled non-violence","Rejecting violence on moral, ethical or spiritual grounds (class)."],
  ["Houthis (Ansar Allah)","Armed movement from Yemen's Zaidi Shia minority. Emerged in Saada in the 1990s demanding a greater share of power; took Sanaa in September 2014 (Al Jazeera)."],
  ["Zaidi Shia","The Shia minority the Houthis come from (Al Jazeera)."],
  ["Yemen truce (April 2022)","UN-mediated truce after seven years of war: marked de-escalation, but low-intensity fighting continued. The Houthis said government forces violated it in August 2026 (Al Jazeera)."],
  ["Presidential Leadership Council (PLC)","Saudi-backed council set up in 2022 when Hadi transferred his powers; tasked with steering talks toward a permanent ceasefire (Al Jazeera)."]
];

// ---------- QUIZ ----------
const QUIZ = [
  {q:"Q1 asks for the most important cause of conflict 'today'. Which case should LEAD your answer?", o:["Rwanda 1994","Ukraine","Neither — use a new case","Both equally, Rwanda first"], a:1, why:"'Today' = present day. Ukraine is ongoing; Rwanda supports the pattern."},
  {q:"According to the Rwanda reading, when did the genocide begin?", o:["1 October 1990","4 August 1993","6 April 1994","19 July 1994"], a:2, why:"6 April 1994, within the hour of Habyarimana's plane being shot down (p. 251)."},
  {q:"What did the Arusha Accords (1993) agree?", o:["Independence from Belgium","Power-sharing with the RPF","A UN takeover","Splitting Rwanda in two"], a:1, why:"Disband armies, refugees return, power-sharing (p. 250)."},
  {q:"Who first 'manufactured two racial groups' in Rwanda, according to the reading?", o:["Belgians","German colonisers","The RPF","The Catholic Church"], a:1, why:"Germans set physical standards and created the categories (p. 242). Belgians deepened them (p. 243)."},
  {q:"What did the CDR set up in 1992?", o:["A peacekeeping force","A radio station and radical publications","A refugee charity","The Arusha talks"], a:1, why:"A fiery radio station and radical publications to incite Hutu (p. 250)."},
  {q:"What was killing called during 'sensibilisation'?", o:["Clean-up","Bush clearing","Self-defence","Harvest"], a:1, why:"Presented as a community work project called 'bush clearing' (p. 251)."},
  {q:"How many UNAMIR troops arrived?", o:["250","2,548","25,000","None"], a:1, why:"Only 2,548 — virtually powerless (p. 254)."},
  {q:"Why did nations call Rwanda a 'civil war'?", o:["It was accurate","To avoid invoking the 1948 Genocide Convention","The RPF asked them to","The UN had no word for genocide"], a:1, why:"So the treaty wouldn't have to be invoked (p. 255)."},
  {q:"What % of Rwanda's population was malnourished by 1990?", o:["10%","25%","50%","85%"], a:2, why:"Coffee prices fell 50%; by 1990, 50% malnourished (p. 248)."},
  {q:"ISW assesses Russia's NET territorial gain in 2026 (to Oct) as about…", o:["6,500 sq km","1,800 sq km","73 sq km","0 — total loss"], a:2, why:"Russian officials claimed ~6,500; ISW assessed 73 sq km net gain."},
  {q:"According to ISW, who opposes a compromise peace?", o:["Zelensky","The US","Only Putin","The EU"], a:2, why:"'It is only Putin who opposes compromise.'"},
  {q:"What does the Doppelganger network do?", o:["Hacks Ukrainian banks","Copies real news sites to spread propaganda","Fact-checks Russian claims","Runs Ukrainian TV"], a:1, why:"Fake copies of real publications + fake 'ordinary' accounts (Detector Media)."},
  {q:"What did The Insider's investigation (Oct 2026) reveal?", o:["Ukraine faked drone footage","Personal participation of Kremlin officials in producing fakes","NATO funded Doppelganger","Twitter was hacked"], a:1, why:"Hacked ASP–presidential administration correspondence (Detector Media)."},
  {q:"What happened to Ukrainian war updates on Twitter/X?", o:["Promoted to the top","Flagged as 'sensitive' and shadow-banned for English users","Translated automatically","Removed by Ukraine"], a:1, why:"Iskoujina et al., citing Barr (2023)."},
  {q:"Which is an example of OMISSION bias?", o:["Fake sites copying real outlets","X hiding Ukrainian war updates from feeds","Claiming 6,500 sq km","#SnakeIslandStrong"], a:1, why:"Important information excluded from audiences."},
  {q:"Copying the design of a trusted news site is mainly…", o:["Source bias","False balance","Headline bias","Omission bias"], a:0, why:"Faking a trusted source so readers believe the message."},
  {q:"'Tutsi have horns and tails' is mainly…", o:["Commercial bias","Emotional manipulation","False balance","Selection bias"], a:1, why:"Dehumanising, fear-generating imagery (p. 251)."},
  {q:"Why did Rwanda's genocide end in about three months?", o:["UN troops stopped it","The RPF won militarily","A peace deal","The killers gave up"], a:1, why:"Disciplined, well-armed RPF took Kigali; new govt 19 July 1994 (p. 252)."},
  {q:"Which best explains why the Ukraine war lasts so long (ISW)?", o:["Russia is winning fast","Balance: Russia's size/wealth vs Ukraine + Western support","No one is fighting","The UN banned peace talks"], a:1, why:"Both can continue; neither can easily win."},
  {q:"How did Ukrainians and the West experience the start of the war differently (Iskoujina et al.)?", o:["Both via TV","Ukrainians via explosions, the West via social media","Ukrainians via radio, the West via newspapers","No difference"], a:1, why:"This is your key LIMIT for Q4 (media bias)."},
  {q:"A long-term consequence that became a CAUSE of later conflict in Rwanda:", o:["Coffee exports","Tutsi refugees forming the RPF","The Salt March","The ICTR"], a:1, why:"120,000 refugees (1960s) → 600–700k by 1990 → RPF invasion (p. 245, 248)."},
  {q:"Q7 asks about 'ordinary people'. Which example DOESN'T fit?", o:["Citizen chroniclers","Journalists turning accounts into info hubs","UN Security Council creating the ICTR","Nashville sit-in students"], a:2, why:"The UN is an institution, not ordinary people."},
  {q:"Q5 has two parts. The second part asks…", o:["Who controls information","How this affects people's understanding","Which source is best","How to stop disinformation"], a:1, why:"Always answer the 'and how does this affect…' part."},
  {q:"'To what extent' (Q4) requires you to…", o:["List examples only","Give a judgment of degree with limits","Say yes or no","Only discuss Rwanda"], a:1, why:"'To a large extent, but…' — the marks are in the 'but'."},
  {q:"According to the PPT, extra research should…", o:["Find new case studies","Fill gaps, not find new examples","Replace the readings","Be avoided entirely"], a:1, why:"Slide 4: fill gaps NOT find new examples."},
  {q:"After the 2015 Minsk agreements, Schrijver says…", o:["The war ended","There was only an uneasy ceasefire and Crimea stayed annexed","Ukraine joined NATO","Russia withdrew"], a:1, why:"Shows that ceasefires aren't endings (Q6)."},
  {q:"Russia's 2022 reserve callup brought in ~330,000 men. How many fled Russia (ISW)?", o:["About half as many","About the same","About twice as many","None"], a:2, why:"Twice as many fled to avoid fighting."},
  {q:"What did the World Bank and IMF call Habyarimana's regime?", o:["A dictatorship","A model of development","A failed state","A threat to peace"], a:1, why:"They didn't look beneath the surface (p. 247) — a good lesson for Q8."},
  {q:"Q8 (Yemen): According to Al Jazeera, what did the Houthis demand when they emerged in Saada in the 1990s?", o:["A greater share of power","A Sunni caliphate","Saudi troops to leave","Independence for Saada"], a:0, why:"A greater share of power — the label (Zaidi Shia) is not the whole cause (Al Jazeera, 2026)."},
  {q:"What happened to the 2023 Saudi–Houthi UN roadmap toward a permanent ceasefire?", o:["It ended the war","It was never formalised","The UN cancelled it in 2022","It created the PLC"], a:1, why:"Agreed after direct talks but never formalised; the Houthis launched a major offensive in late August 2026 (Al Jazeera)."},
  {q:"Which three examples best show 'a ceasefire or peace deal is not peace' (Q8)?", o:["Yemen 2022 truce, Rwanda's Arusha Accords, Ukraine's Minsk agreements","Yemen 2014, Rwanda 1990, Ukraine 2013","Yemen 2015, Rwanda 1994, Ukraine 2022","Only Rwanda's Arusha Accords"], a:0, why:"Yemen's truce didn't hold (E5–E7), the Hutu elite ignored Arusha (p. 250), and Minsk left only an uneasy ceasefire (Schrijver)."}
];

// ---------- TIMELINES ----------
const TIMELINE = {
  RW: [
    ["1858–1863","Speke's made-up theory of a superior 'ruling race' (p. 241)"],
    ["1894","First German arrives; Rwanda claimed by Germany (p. 240)"],
    ["1890s+","German myth of Tutsi superiority; indirect rule (p. 242)"],
    ["After WWI","Belgian control: only Tutsi in government; forced labour (p. 243)"],
    ["Late 1920s","Tutsi convert to Christianity; Church favours Tutsi education (p. 243)"],
    ["1950s","Belgians and priests switch support to Hutu when Tutsi elite seek independence (p. 244)"],
    ["Nov 1959","Hutu revolution — attacks on all Tutsi (p. 244–245)"],
    ["1 Jul 1962","Independence; Kayibanda president (p. 245)"],
    ["1961–1964","~120,000 Tutsi flee; killings until 1964 (p. 245)"],
    ["Jul 1973","Habyarimana's military coup (p. 246)"],
    ["1974","MRND single party; ID cards state Hutu/Tutsi (p. 246)"],
    ["Mid-1980s","Foreign aid = 70% of budget, captured by elite (p. 247)"],
    ["Dec 1987","RPF formed by Tutsi refugees (p. 248)"],
    ["1989–1990","Coffee prices −50%; 50% malnourished (p. 248)"],
    ["1 Oct 1990","RPF invades; radio order to 'track down infiltrators' (p. 249)"],
    ["1992","CDR + radio station; militias formed; genocide plan drafted (p. 250–251)"],
    ["4 Aug 1993","Arusha Accords signed (p. 250)"],
    ["5 Oct 1993","UNAMIR created (p. 253)"],
    ["Jan 1994","Informant warns UN of extermination plan (p. 253)"],
    ["6 Apr 1994","President's plane shot down; genocide begins (p. 251)"],
    ["14 Apr 1994","Belgium & France withdraw UNAMIR troops (p. 254)"],
    ["22 May 1994","RPF takes Kigali airport (p. 252)"],
    ["19 Jul 1994","RPF government sworn in; Kagame in power (p. 252)"],
    ["1994–2004","ICTR; first international genocide convictions (p. 255–256)"],
    ["1998","Clinton apologises (p. 255)"],
    ["2004–2006","Amnesty: no press freedom; trauma, uncertain healing (p. 257)"]
  ],
  UA: [
    ["Since independence","'Persistent psychological and informational pressure' (Turanskiy, in Schrijver)"],
    ["2013","Russian military doctrine links military domination with information (Iskoujina et al.)"],
    ["2014","Crimea occupied/annexed; Ukraine 'outmatched' (Schrijver; Iskoujina et al.)"],
    ["2015","Minsk agreements — uneasy ceasefire; Ukraine 'lost' the information battle (Schrijver)"],
    ["Feb 2022","Full-scale invasion — the first 'full-blown social media war' (Iskoujina et al.)"],
    ["2022","#SnakeIslandStrong; Russian callup — 330k in, twice as many flee (Schrijver; ISW)"],
    ["Early 2023","Doppelganger campaign to discredit Ukraine's leadership (Detector Media)"],
    ["Aug 2023","Ukraine's warning calls to Crimea residents (Schrijver)"],
    ["Dec 2023","European Commission proceedings against X (Iskoujina et al.)"],
    ["30 Jun 2024","Example Doppelganger fake news post (Detector Media)"],
    ["2026","Ukraine defeats main Russian Donetsk offensive; Russia's net gain ~73 sq km (ISW)"],
    ["Jul–Oct 2026","Over 40,000 Russian casualties per month (ISW)"],
    ["21 Oct 2026","The Insider exposes Kremlin officials behind fakes (Detector Media)"],
    ["23 Oct 2026","ISW: Russian victory 'extraordinarily unlikely' unless Western support collapses"]
  ]  ,
  YE: [
    ["1990s","Houthis emerge in Saada, demanding a greater share of power (Al Jazeera)"],
    ["2011","Arab Spring forces out President Saleh; weak transitional government"],
    ["Sep 2014","Houthis take Sanaa; President Hadi flees"],
    ["Mar 2015","Saudi Arabia intervenes to support Hadi's government"],
    ["Apr 2022","UN-mediated truce — marked de-escalation, but low-intensity fighting continues"],
    ["2023","Saudi–Houthi UN roadmap to a permanent ceasefire — never formalised"],
    ["Late Aug 2026","Houthis launch a major offensive, saying the truce was violated"],
    ["10 Sep 2026","Houthis seize Mocha; tighter control of the Red Sea coast"]
  ]
};

// ---------- RUBRIC ----------
const RUBRIC = [
  ["Content & evidence","Selects course content to explain and analyse; accurate; clear links between evidence and argument; multiple links between materials."],
  ["Sustained view","Holds a clear position and defends it when challenged."],
  ["Listening & responding","Responds directly to what others say — agree, build, challenge."],
  ["Turn-taking","Contributes regularly without dominating; invites others in."],
  ["Oral expression","Clear, natural, academic spoken English."],
  ["Academic attribution","Names sources out loud: author/organisation, year, page where possible."]
];
