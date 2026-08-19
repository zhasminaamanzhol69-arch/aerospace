import type { Language } from './language';

export type TutorialStep = {
  title: string;
  body: string;
  label: string;
  points: Array<{ title: string; detail: string }>;
};

export const tutorialText: Record<Language, {
  title: string;
  subtitle: string;
  tutorial: string;
  continue: string;
  back: string;
  next: string;
  start: string;
  progress: string;
  steps: TutorialStep[];
}> = {
  kk: {
    title: 'Vectori-ді қалай бастаймыз?',
    subtitle: 'Қысқа нұсқаулықты көріңіз немесе бірден жұмысқа өтіңіз.',
    tutorial: 'Туториал',
    continue: 'Пайдалануды жалғастыру',
    back: 'Артқа',
    next: 'Келесі',
    start: 'Пайдалану',
    progress: 'Қадам',
    steps: [
      { title: 'Жоғарғы мәзір', body: 'Жоғарыдағы мәзір батырмасын бассаңыз, сайт бөлімдері ашылады.', label: 'Мәзір', points: [
        { title: 'Дрон түрлері', detail: 'Құтқару дрондары, payload және қолдану сценарийлері бар бет ашылады.' },
        { title: 'Ғарыш аппараттары', detail: 'CubeSat, спутник, орбита және пайдалы жүктеме туралы бетке өтесіз.' },
        { title: 'Құжат талдауы', detail: 'PDF немесе DOCX жүктеп, AI арқылы құжаттан инженерлік ойлар аласыз.' },
      ] },
      { title: 'Профиль батырмасы', body: 'Атыңыздың бірінші әрпі бар батырма профиль мәзірін ашады.', label: 'Профиль', points: [
        { title: 'Менің профилім', detail: 'Профиль бетіне өтеді: аты-жөн, ник, телефон және аватар өзгертуге болады.' },
        { title: 'Аты мен ник', detail: 'Мәзірде аккаунт кімге тиесілі екенін тез көруге болады.' },
        { title: 'Шығу', detail: 'Аккаунттан шығып, қайта кіру экранына қайтарады.' },
      ] },
      { title: 'Жылдам әрекеттер', body: 'Негізгі бөлімдерге бір басумен өтуге болады.', label: 'Әрекет', points: [
        { title: 'AI-ға сұрақ қою', detail: 'Бет AI сұрақ өрісіне төмен түседі.' },
        { title: 'PDF/DOCX талдау', detail: 'Құжат жүктеп, техникалық мазмұнын түсіндіретін бөлім ашылады.' },
        { title: 'Авиация / БПЛА', detail: 'Дрондар мен ұшу аппараттары туралы бөлімге өтеді.' },
      ] },
      { title: 'Инженерлік кезеңдер', body: '01, 02, 03 батырмалары жұмыс кезеңін ауыстырады.', label: 'Кезең', points: [
        { title: 'Жобалау', detail: 'Аэродинамика, масса, қуат және аппарат схемасын есептейді.' },
        { title: 'Дайындау', detail: 'Материал, өндіріс әдісі, қосылыс және құнды салыстырады.' },
        { title: 'Пайдалану', detail: 'Телеметрия, қауіпсіздік және ұшу алдындағы тексерістерді көрсетеді.' },
      ] },
      { title: 'AI және дауыс', body: 'Сұрақты мәтінмен жазыңыз немесе дауыспен айтыңыз.', label: 'AI', points: [
        { title: 'Микрофон', detail: 'Дауыспен айтқан сұрағыңыз мәтін өрісіне жазылады.' },
        { title: 'AI-дан сұрау', detail: 'AI енгізілген сұраққа инженерлік жауап дайындайды.' },
        { title: 'Жауап', detail: 'Нәтижеде ұсыныс, тәуекел және техникалық түсіндіру шығады.' },
      ] },
    ],
  },
  ru: {
    title: 'Как начать работу в Vectori?',
    subtitle: 'Посмотрите короткую инструкцию или сразу продолжите пользоваться.',
    tutorial: 'Туториал',
    continue: 'Продолжить пользоваться',
    back: 'Назад',
    next: 'Дальше',
    start: 'Пользоваться',
    progress: 'Шаг',
    steps: [
      { title: 'Кнопка меню сверху', body: 'Нажми кнопку с тремя линиями сверху: откроется список разделов сайта.', label: 'Меню', points: [
        { title: 'Виды дронов', detail: 'Откроется страница со спасательными БПЛА, их задачами, payload и ограничениями.' },
        { title: 'Космические аппараты', detail: 'Откроется страница про CubeSat, спутники, орбиты и полезную нагрузку.' },
        { title: 'Анализ PDF/DOCX', detail: 'Откроется инструмент, куда можно загрузить документ и получить AI-разбор.' },
      ] },
      { title: 'Кнопка профиля', body: 'Нажми кружок с первой буквой имени: там находится твой профиль.', label: 'Профиль', points: [
        { title: 'Мой профиль', detail: 'Переход на страницу профиля: можно менять имя, ник, телефон и аватар.' },
        { title: 'Имя и ник', detail: 'В меню сразу видно, под каким аккаунтом ты сейчас работаешь.' },
        { title: 'Выйти из аккаунта', detail: 'Выход завершает сессию и возвращает к экрану входа.' },
      ] },
      { title: 'Быстрые действия', body: 'Эти кнопки быстро переводят в нужную часть проекта.', label: 'Кнопки', points: [
        { title: 'Спросить AI', detail: 'Страница прокручивается к блоку, где можно задать вопрос AI.' },
        { title: 'Анализ PDF/DOCX', detail: 'Открывает раздел для загрузки и разбора инженерных документов.' },
        { title: 'Авиация / БПЛА', detail: 'Открывает страницу про типы дронов и сценарии применения.' },
      ] },
      { title: 'Этапы 01, 02, 03', body: 'Нажимай этапы, чтобы менять тип инженерной работы.', label: 'Этапы', points: [
        { title: 'Проектирование', detail: 'Показывает расчёты по массе, аэродинамике, энергии и выбору схемы.' },
        { title: 'Производство', detail: 'Показывает материалы, методы производства, соединения и контроль.' },
        { title: 'Эксплуатация', detail: 'Показывает телеметрию, проверки, безопасность и цифровой двойник.' },
      ] },
      { title: 'Вопрос к AI голосом', body: 'В поле AI можно писать руками или нажать диктовку.', label: 'AI', points: [
        { title: 'Сказать голосом', detail: 'Браузер попросит доступ к микрофону и вставит речь в поле вопроса.' },
        { title: 'Спросить AI', detail: 'AI возьмёт вопрос и текущие параметры миссии, затем подготовит ответ.' },
        { title: 'Ответ AI', detail: 'Ниже появится объяснение, рекомендация, риски и технические детали.' },
      ] },
    ],
  },
  en: {
    title: 'How do you start in Vectori?',
    subtitle: 'Take a short tutorial or continue straight into the app.',
    tutorial: 'Tutorial',
    continue: 'Continue using',
    back: 'Back',
    next: 'Next',
    start: 'Use app',
    progress: 'Step',
    steps: [
      { title: 'Top menu button', body: 'Press the three-line menu button to open site sections.', label: 'Menu', points: [
        { title: 'Drone Types', detail: 'Opens rescue UAV types with missions, payloads, strengths, and limits.' },
        { title: 'Spacecraft', detail: 'Opens CubeSat, satellite, orbit, and payload information.' },
        { title: 'Document Analysis', detail: 'Opens the PDF/DOCX upload tool for AI document review.' },
      ] },
      { title: 'Profile button', body: 'Press the circle with your initial to open profile actions.', label: 'Profile', points: [
        { title: 'My profile', detail: 'Opens profile settings for name, nickname, phone, and avatar.' },
        { title: 'Name and nickname', detail: 'Shows which account is currently active.' },
        { title: 'Log out', detail: 'Ends the session and returns to sign in.' },
      ] },
      { title: 'Quick actions', body: 'These buttons move you to the main tools quickly.', label: 'Actions', points: [
        { title: 'Ask AI', detail: 'Scrolls to the AI question area.' },
        { title: 'Analyze PDF/DOCX', detail: 'Opens the engineering document upload and analysis tool.' },
        { title: 'Aviation / UAV', detail: 'Opens drone types and mission examples.' },
      ] },
      { title: 'Stages 01, 02, 03', body: 'Use stage buttons to switch the engineering workflow.', label: 'Stages', points: [
        { title: 'Design', detail: 'Shows mass, aerodynamics, energy, and configuration calculations.' },
        { title: 'Manufacturing', detail: 'Shows materials, process choices, joining, and inspection logic.' },
        { title: 'Operations', detail: 'Shows telemetry, safety checks, and the digital twin panel.' },
      ] },
      { title: 'Voice AI question', body: 'You can type a question or dictate it.', label: 'AI', points: [
        { title: 'Speak', detail: 'The browser asks for microphone access and writes speech into the question field.' },
        { title: 'Ask AI', detail: 'AI uses your question plus mission parameters to prepare an answer.' },
        { title: 'AI answer', detail: 'The result appears below with explanation, recommendation, risks, and details.' },
      ] },
    ],
  },
};
