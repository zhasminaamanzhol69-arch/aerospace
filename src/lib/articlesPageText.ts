import aviationImage from '../assets/aviation-domain-hero.png';
import earthObservationImage from '../assets/space-earth-observation.png';
import fireDroneImage from '../assets/rescue-fire-drone.png';
import medicalDroneImage from '../assets/rescue-medical-drone.png';
import relayDroneImage from '../assets/rescue-relay-drone.png';
import satelliteImage from '../assets/space-communication-satellite.png';
import spaceCubesatImage from '../assets/space-cubesat.png';
import hostedPayloadImage from '../assets/space-hosted-payload.png';
import spacecraftImage from '../assets/spacecraft-domain-hero.png';
import type { Language } from './language';

type ArticleItem = { title: string; image: string; tag: string; body: string };
type FactItem = { value: string; label: string };
type ArticlesCopy = {
  back: string;
  heroBody: string;
  heroEyebrow: string;
  heroTitle: string;
  factsTitle: string;
  articlesTitle: string;
  facts: FactItem[];
  articles: ArticleItem[];
};

export const articlesPageText: Record<Language, ArticlesCopy> = {
  kk: {
    back: 'Артқа',
    heroEyebrow: 'Білім және шабыт',
    heroTitle: 'Қызықты фактілер мен мақалалар',
    heroBody: 'Аэроғарыш инженериясын қысқа, түсінікті және практикалық түрде зертте.',
    factsTitle: 'Жылдам фактілер',
    articlesTitle: 'Қысқа мақалалар',
    facts: [
      { value: '7.8 км/с', label: 'LEO орбитасындағы шамамен жылдамдық' },
      { value: '4 күш', label: 'Ұшуға әсер етеді: lift, weight, thrust, drag' },
      { value: '30-60 мин', label: 'Көп мультироторлардың типтік ұшу уақыты' },
      { value: '11 км/с', label: 'Жерден қашу жылдамдығына жақын мән' },
      { value: '250-500 км', label: 'Көп CubeSat жұмыс істейтін төмен орбита биіктігі' },
      { value: '1U', label: 'CubeSat базалық модулі: 10 x 10 x 10 см' },
    ],
    articles: [
      { title: 'Дрон неге ауада қалықтайды?', image: medicalDroneImage, tag: 'БПЛА', body: 'Мультиротор әр мотордың тартуын өзгертіп, биіктік пен бұрылуды басқарады.' },
      { title: 'Спутник неге құлап кетпейді?', image: satelliteImage, tag: 'Орбита', body: 'Спутник Жерге құлайды, бірақ көлденең жылдамдығы үлкен болғандықтан орбита бойымен қозғалады.' },
      { title: 'Пайдалы жүктеме деген не?', image: hostedPayloadImage, tag: 'Миссия', body: 'Бұл аппараттың негізгі жұмысына керек камера, сенсор, жүк немесе ғылыми құрал.' },
      { title: 'Қанат не үшін керек?', image: aviationImage, tag: 'Аэродинамика', body: 'Қанат ауа ағынын өзгертіп, аппарат массасын көтеретін көтергіш күш жасайды.' },
      { title: 'Неге дронға резерв батарея керек?', image: fireDroneImage, tag: 'Қауіпсіздік', body: 'Резерв жел, маневр, байланыс жоғалуы немесе авариялық қайту кезінде миссияны қауіпсіз аяқтауға көмектеседі.' },
      { title: 'CubeSat нені өлшей алады?', image: spaceCubesatImage, tag: 'Ғарыш', body: 'Шағын спутник камера, радиация датчигі, байланыс модулі немесе ғылыми эксперимент алып жүре алады.' },
      { title: 'Материал таңдауы неге маңызды?', image: spacecraftImage, tag: 'Материалдар', body: 'Көмірпластик жеңіл, алюминий өңдеуге ыңғайлы, титан берік, бірақ қымбат және күрделі.' },
      { title: 'Телеметрия инженерге не береді?', image: earthObservationImage, tag: 'Телеметрия', body: 'Температура, сигнал, қуат және діріл деректері аппараттың жағдайын нақты уақытта түсінуге көмектеседі.' },
      { title: 'Ұшу алдындағы тексеріс не үшін қажет?', image: relayDroneImage, tag: 'Эксплуатация', body: 'Чек-лист аккумулятор, бекітпе, байланыс және сенсор қателерін ұшудан бұрын табуға көмектеседі.' },
    ],
  },
  ru: {
    back: 'Назад',
    heroEyebrow: 'Знания и вдохновение',
    heroTitle: 'Интересные факты и статьи',
    heroBody: 'Короткие материалы про авиацию, БПЛА, спутники и инженерные решения.',
    factsTitle: 'Быстрые факты',
    articlesTitle: 'Короткие статьи',
    facts: [
      { value: '7.8 км/с', label: 'примерная скорость аппарата на низкой орбите' },
      { value: '4 силы', label: 'держат полёт: подъёмная сила, вес, тяга, сопротивление' },
      { value: '30-60 мин', label: 'типичное время полёта многих мультироторных дронов' },
      { value: '11 км/с', label: 'примерная скорость убегания от Земли' },
      { value: '250-500 км', label: 'частая высота работы малых спутников на низкой орбите' },
      { value: '1U', label: 'базовый модуль CubeSat размером 10 x 10 x 10 см' },
    ],
    articles: [
      { title: 'Почему дрон держится в воздухе?', image: medicalDroneImage, tag: 'БПЛА', body: 'Мультиротор меняет тягу моторов, чтобы управлять высотой, креном и поворотом.' },
      { title: 'Почему спутник не падает?', image: satelliteImage, tag: 'Орбита', body: 'Он постоянно падает к Земле, но движется вперёд так быстро, что остаётся на орбите.' },
      { title: 'Что такое полезная нагрузка?', image: hostedPayloadImage, tag: 'Миссия', body: 'Это камера, датчик, груз или научный прибор, ради которого создаётся аппарат.' },
      { title: 'Зачем аппарату крыло?', image: aviationImage, tag: 'Аэродинамика', body: 'Крыло меняет поток воздуха и создаёт подъёмную силу, которая помогает аппарату нести массу в полёте.' },
      { title: 'Почему нужен запас батареи?', image: fireDroneImage, tag: 'Безопасность', body: 'Резерв помогает пережить ветер, манёвр, потерю связи и аварийный возврат без резкой посадки.' },
      { title: 'Что может измерять CubeSat?', image: spaceCubesatImage, tag: 'Космос', body: 'Малый спутник может нести камеру, датчик радиации, связь, эксперимент или научный прибор.' },
      { title: 'Почему материал решает многое?', image: spacecraftImage, tag: 'Материалы', body: 'Углепластик лёгкий, алюминий удобен в обработке, титан прочный, но дороже и сложнее в производстве.' },
      { title: 'Зачем инженеру телеметрия?', image: earthObservationImage, tag: 'Телеметрия', body: 'Температура, сигнал, энергия и вибрации показывают состояние аппарата во время миссии.' },
      { title: 'Что проверяют перед полётом?', image: relayDroneImage, tag: 'Эксплуатация', body: 'Чек-лист помогает заранее найти проблемы с батареей, креплениями, связью и датчиками.' },
    ],
  },
  en: {
    back: 'Back',
    heroEyebrow: 'Knowledge and inspiration',
    heroTitle: 'Interesting facts and articles',
    heroBody: 'Short reads about aviation, UAVs, satellites, and engineering decisions.',
    factsTitle: 'Quick facts',
    articlesTitle: 'Short articles',
    facts: [
      { value: '7.8 km/s', label: 'typical speed in low Earth orbit' },
      { value: '4 forces', label: 'shape flight: lift, weight, thrust, and drag' },
      { value: '30-60 min', label: 'common endurance for many multirotor drones' },
      { value: '11 km/s', label: 'approximate escape velocity from Earth' },
      { value: '250-500 km', label: 'common low-orbit range for small satellites' },
      { value: '1U', label: 'basic CubeSat unit: 10 x 10 x 10 cm' },
    ],
    articles: [
      { title: 'How does a drone hover?', image: medicalDroneImage, tag: 'UAV', body: 'A multirotor changes motor thrust to control altitude, roll, and yaw.' },
      { title: 'Why does a satellite stay up?', image: satelliteImage, tag: 'Orbit', body: 'It falls toward Earth while moving forward fast enough to keep missing it.' },
      { title: 'What is payload?', image: hostedPayloadImage, tag: 'Mission', body: 'It is the camera, sensor, cargo, or science instrument the vehicle is built to carry.' },
      { title: 'Why does an aircraft need a wing?', image: aviationImage, tag: 'Aerodynamics', body: 'A wing redirects airflow and creates lift, helping the vehicle carry mass through the air.' },
      { title: 'Why keep battery reserve?', image: fireDroneImage, tag: 'Safety', body: 'Reserve energy helps handle wind, maneuvers, link loss, and emergency return without a hard landing.' },
      { title: 'What can a CubeSat measure?', image: spaceCubesatImage, tag: 'Space', body: 'A small satellite can carry a camera, radiation sensor, communication module, experiment, or science instrument.' },
      { title: 'Why does material choice matter?', image: spacecraftImage, tag: 'Materials', body: 'CFRP is light, aluminum is easy to machine, and titanium is strong but costlier and harder to process.' },
      { title: 'Why telemetry matters', image: earthObservationImage, tag: 'Telemetry', body: 'Temperature, signal, power, and vibration data reveal vehicle health during a mission.' },
      { title: 'What is checked before flight?', image: relayDroneImage, tag: 'Operations', body: 'A checklist catches battery, fastener, link, and sensor issues before launch.' },
    ],
  },
};
