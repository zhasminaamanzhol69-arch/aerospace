import fixedWingImage from '../assets/rescue-fixed-wing-drone.png';
import fireDroneImage from '../assets/rescue-fire-drone.png';
import medicalDroneImage from '../assets/rescue-medical-drone.png';
import relayDroneImage from '../assets/rescue-relay-drone.png';
import urbanDroneImage from '../assets/rescue-urban-drone.png';
import type { Language } from './language';

type DroneItem = { name: string; image: string; mission: string; payload: string; strength: string; limits: string };
type DroneCopy = {
  heroTitle: string;
  heroEyebrow: string;
  heroBody: string;
  back: string;
  mission: string;
  payload: string;
  strength: string;
  limits: string;
  checklistTitle: string;
  checklistEyebrow: string;
  drones: DroneItem[];
  checks: string[];
};

const images = [fixedWingImage, urbanDroneImage, fixedWingImage, medicalDroneImage, fireDroneImage, relayDroneImage];

export const dronesPageText: Record<Language, DroneCopy> = {
  ru: {
    heroTitle: 'Виды спасательных дронов',
    heroEyebrow: 'Системы спасательных БПЛА',
    heroBody: 'Раздел посвящён сценариям для БПЛА: поиск, доставка, мониторинг пожаров и восстановление связи при чрезвычайных ситуациях.',
    back: 'Назад',
    mission: 'Миссия',
    payload: 'Полезная нагрузка',
    strength: 'Сильная сторона',
    limits: 'Ограничение',
    checklistTitle: 'Чек-лист спасательной миссии',
    checklistEyebrow: 'Проверка спасательной миссии',
    drones: [
      ['Поисково-спасательный БПЛА самолётной схемы', 'Большой район поиска, лес, степь, горы', 'Тепловизор, обычная камера, радиомаяк', 'Дальность и длительное патрулирование', 'Нужна площадка или катапульта для старта'],
      ['Мультиротор для городской операции', 'Осмотр зданий, завалов, мостов и крыш', 'Прожектор, громкоговоритель, камера', 'Точное зависание и вертикальная посадка', 'Меньше время полёта и чувствительность к ветру'],
      ['Спасательный гибрид с вертикальным взлётом', 'Смешанный маршрут: дальний перелёт и точная посадка', 'Аптечка, маяк, камера, малый груз', 'Компромисс дальности и вертикального старта', 'Сложнее конструкция и обслуживание'],
      ['Медицинский доставочный дрон', 'Доставка крови, лекарств, анализов', 'Термоконтейнер, GPS-трекер, датчик температуры', 'Быстрая доставка в труднодоступные точки', 'Нужен контроль температуры и вибрации груза'],
      ['Пожарный мониторинговый дрон', 'Контур пожара, дым, горячие точки', 'Тепловизор, газовый датчик, ретранслятор', 'Работа там, где опасно отправлять человека', 'Высокая температура, дым и турбулентность'],
      ['Дрон-ретранслятор связи', 'Восстановление связи после ЧС', 'LTE/радио ретранслятор, направленная антенна', 'Создаёт временный канал связи для спасателей', 'Нужен расчёт энергопотребления и зоны покрытия'],
    ].map(toDrone),
    checks: ['Проверить ветер, осадки и видимость.', 'Подтвердить заряд и резерв возврата.', 'Проверить крепление нагрузки и центр масс.', 'Настроить аварийный режим: возврат домой, посадка или удержание точки.', 'Записать телеметрию миссии.'],
  },
  kk: {
    heroTitle: 'Құтқару дрондарының түрлері',
    heroEyebrow: 'Құтқару БПЛА жүйелері',
    heroBody: 'Бұл бөлім іздеу, жеткізу, өрт мониторингі және төтенше жағдайда байланысты қалпына келтіру UAV сценарийлеріне арналған.',
    back: 'Артқа',
    mission: 'Миссия',
    payload: 'Пайдалы жүктеме',
    strength: 'Артықшылығы',
    limits: 'Шектеуі',
    checklistTitle: 'Құтқару миссиясының чек-листі',
    checklistEyebrow: 'Құтқару миссиясын тексеру',
    drones: [
      ['Іздеу-құтқару Fixed Wing', 'Орман, дала, тау сияқты үлкен аумақты іздеу', 'Жылу камерасы, RGB камера, радиомаяк', 'Ұзақ қашықтық және ұзақ патрульдеу', 'Ұшу үшін алаң немесе катапульта қажет'],
      ['Қалалық операцияға арналған мультиротор', 'Ғимарат, үйінді, көпір және шатырларды тексеру', 'Прожектор, дауыс зорайтқыш, камера', 'Дәл қалықтау және тік қону', 'Ұшу уақыты аз және желге сезімтал'],
      ['VTOL Rescue Hybrid', 'Алыс ұшу және дәл қону қажет аралас маршрут', 'Дәрі қобдишасы, маяк, камера, шағын жүк', 'Қашықтық пен тік старттың теңгерімі', 'Конструкциясы күрделірек'],
      ['Медициналық жеткізу дроны', 'Қан, дәрі және талдау үлгілерін жеткізу', 'Термоконтейнер, GPS трекер, температура датчигі', 'Қиын жететін жерге жылдам жеткізу', 'Температура мен вибрацияны бақылау қажет'],
      ['Өрт мониторингі дроны', 'Өрт шекарасы, түтін және ыстық нүктелер', 'Жылу камерасы, газ датчигі, ретранслятор', 'Адамға қауіпті аймақта жұмыс істей алады', 'Жоғары температура, түтін және турбуленттілік'],
      ['Байланыс ретранслятор дроны', 'ТЖ кейін байланысты қалпына келтіру', 'LTE/радио ретранслятор, бағытталған антенна', 'Құтқарушыларға уақытша байланыс береді', 'Энергия және қамту аймағы есебі қажет'],
    ].map(toDrone),
    checks: ['Жел, жауын-шашын және көрінуді тексеру.', 'Аккумулятор және қайту резервін растау.', 'Жүк бекітілуі мен центр массасын тексеру.', 'Fail-safe баптау: RTH, қону немесе нүктені ұстау.', 'Миссия телеметриясын сақтау.'],
  },
  en: {
    heroTitle: 'Rescue Drone Types',
    heroEyebrow: 'Rescue UAV Systems',
    heroBody: 'This section focuses on rescue UAV scenarios: search, delivery, wildfire monitoring, and emergency communications.',
    back: 'Back',
    mission: 'Mission',
    payload: 'Payload',
    strength: 'Strength',
    limits: 'Limit',
    checklistTitle: 'Rescue Mission Checklist',
    checklistEyebrow: 'Rescue Mission Checklist',
    drones: [
      ['Search-and-Rescue Fixed Wing', 'Wide-area search over forests, steppe, and mountains', 'Thermal camera, RGB camera, radio beacon', 'Long range and extended patrol time', 'Needs a launch area or catapult'],
      ['Urban Operation Multirotor', 'Inspection of buildings, debris, bridges, and rooftops', 'Searchlight, loudspeaker, camera', 'Precise hover and vertical landing', 'Shorter endurance and wind sensitivity'],
      ['VTOL Rescue Hybrid', 'Mixed route with long transit and precise landing', 'First-aid kit, beacon, camera, small cargo', 'Balance of range and vertical takeoff', 'More complex structure and maintenance'],
      ['Medical Delivery Drone', 'Delivery of blood, medicine, and lab samples', 'Thermal container, GPS tracker, temperature sensor', 'Fast delivery to hard-to-reach areas', 'Requires cargo temperature and vibration control'],
      ['Wildfire Monitoring Drone', 'Fire perimeter, smoke, and hot-spot monitoring', 'Thermal camera, gas sensor, relay module', 'Works where it is unsafe for people', 'High temperature, smoke, and turbulence'],
      ['Communication Relay Drone', 'Restore communications after emergencies', 'LTE/radio relay, directional antenna', 'Creates a temporary channel for rescuers', 'Needs power and coverage calculations'],
    ].map(toDrone),
    checks: ['Check wind, precipitation, and visibility.', 'Confirm battery charge and return reserve.', 'Check payload attachment and center of gravity.', 'Configure fail-safe: RTH, landing, or position hold.', 'Record mission telemetry.'],
  },
};

function toDrone(row: string[], index: number): DroneItem {
  const [name, mission, payload, strength, limits] = row;
  return { name, image: images[index], mission, payload, strength, limits };
}
