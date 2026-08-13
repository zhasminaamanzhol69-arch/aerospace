import communicationImage from '../assets/space-communication-satellite.png';
import cubesatImage from '../assets/space-cubesat.png';
import earthObservationImage from '../assets/space-earth-observation.png';
import hostedPayloadImage from '../assets/space-hosted-payload.png';
import type { Language } from './language';

type SpacecraftItem = { name: string; image: string; mission: string; payload: string; strength: string; limits: string };
type SpacecraftCopy = {
  heroTitle: string;
  heroBody: string;
  back: string;
  mission: string;
  payload: string;
  strength: string;
  limits: string;
  checklistTitle: string;
  spacecraft: SpacecraftItem[];
  checks: string[];
};

const images = [cubesatImage, earthObservationImage, communicationImage, hostedPayloadImage];

export const spacecraftPageText: Record<Language, SpacecraftCopy> = {
  ru: {
    heroTitle: 'Космический аппарат: CubeSat / Satellite',
    heroBody: 'Раздел посвящён космическим аппаратам: орбита, полезная нагрузка, энергобаланс, терморегулирование, радиационная стойкость и стандарты ECSS/NASA.',
    back: 'Назад',
    mission: 'Миссия',
    payload: 'Полезная нагрузка',
    strength: 'Сильная сторона',
    limits: 'Ограничение',
    checklistTitle: 'Чек-лист космической миссии',
    spacecraft: [
      ['CubeSat 1U/3U/6U', 'Учебные, научные и технологические миссии на LEO', 'Камера, радиомодуль, датчики среды, экспериментальный блок', 'Малый размер, низкая стоимость запуска, быстрый цикл разработки', 'Жёсткие ограничения по мощности, объёму, теплу и радиации'],
      ['Earth Observation Satellite', 'ДЗЗ, мониторинг пожаров, льда, посевов и инфраструктуры', 'Оптическая камера, мультиспектральный сенсор, SAR-модуль', 'Регулярные снимки и аналитика поверхности Земли', 'Нужна точная ориентация, калибровка оптики и большой канал связи'],
      ['Communication Satellite', 'Передача данных, IoT, аварийная связь, ретрансляция сигналов', 'Антенна, транспондер, SDR, усилитель мощности', 'Покрытие удалённых районов и устойчивый канал связи', 'Высокие требования к энергобалансу, теплу и радиочастотной совместимости'],
      ['Hosted Payload / Scientific Payload', 'Размещение научного или технологического прибора на платформе', 'Спектрометр, камера, радиационный датчик, эксперимент', 'Можно сосредоточиться на полезной нагрузке без разработки всей платформы', 'Интерфейсы питания, данных, тепла и механики зависят от платформы'],
    ].map(toItem),
    checks: ['Проверить орбиту: LEO, SSO, MEO или GEO.', 'Свести энергобаланс: панели, аккумулятор, режимы нагрузки.', 'Проверить терморежим: вакуум, радиаторы, термоциклы.', 'Оценить радиационную стойкость компонентов.', 'Подготовить матрицу верификации ECSS/NASA.'],
  },
  kk: {
    heroTitle: 'Ғарыш аппараты: CubeSat / Satellite',
    heroBody: 'Бұл бөлім ғарыш аппараттарына арналған: орбита, пайдалы жүктеме, энергия балансы, терморегтеу, радиациялық тұрақтылық және ECSS/NASA стандарттары.',
    back: 'Артқа',
    mission: 'Миссия',
    payload: 'Пайдалы жүктеме',
    strength: 'Артықшылығы',
    limits: 'Шектеуі',
    checklistTitle: 'Ғарыш миссиясының чек-листі',
    spacecraft: [
      ['CubeSat 1U/3U/6U', 'LEO орбитасындағы оқу, ғылыми және технологиялық миссиялар', 'Камера, радиомодуль, орта датчиктері, эксперимент блогы', 'Шағын өлшем, төмен ұшыру құны, жылдам әзірлеу циклі', 'Қуат, көлем, жылу және радиация бойынша қатаң шектеулер'],
      ['Earth Observation Satellite', 'Жерді қашықтан зондтау, өрт, мұз, егіс мониторингі', 'Оптикалық камера, мультиспектр сенсор, SAR модуль', 'Жер беті бойынша тұрақты сурет және аналитика', 'Дәл бағдарлау, оптика калибрлеуі және үлкен байланыс арнасы қажет'],
      ['Communication Satellite', 'Дерек беру, IoT, апаттық байланыс, сигнал ретрансляциясы', 'Антенна, транспондер, SDR, қуат күшейткіші', 'Алыс аймақтарды қамту және тұрақты байланыс', 'Энергия, жылу және радиожиілік үйлесімділігі талаптары жоғары'],
      ['Hosted Payload / Scientific Payload', 'Ғылыми немесе технологиялық аспапты спутник платформасына орналастыру', 'Спектрометр, камера, радиация датчигі, эксперимент', 'Бүкіл платформаны жасамай пайдалы жүктемеге көңіл бөлуге болады', 'Қуат, дерек, жылу және механика интерфейстері платформаға тәуелді'],
    ].map(toItem),
    checks: ['Орбитаны тексеру: LEO, SSO, MEO немесе GEO.', 'Энергия балансын шығару: панель, аккумулятор, жүктеме режимі.', 'Терморежімді тексеру: вакуум, радиатор, термоцикл.', 'Компоненттердің радиациялық тұрақтылығын бағалау.', 'ECSS/NASA верификация матрицасын дайындау.'],
  },
  en: {
    heroTitle: 'Spacecraft: CubeSat / Satellite',
    heroBody: 'This section covers spacecraft: orbit, payload, power balance, thermal control, radiation tolerance, and ECSS/NASA standards.',
    back: 'Back',
    mission: 'Mission',
    payload: 'Payload',
    strength: 'Strength',
    limits: 'Limit',
    checklistTitle: 'Space Mission Checklist',
    spacecraft: [
      ['CubeSat 1U/3U/6U', 'Educational, scientific, and technology missions in LEO', 'Camera, radio module, environment sensors, experiment unit', 'Small size, lower launch cost, fast development cycle', 'Tight limits on power, volume, heat, and radiation'],
      ['Earth Observation Satellite', 'Remote sensing, wildfire, ice, crop, and infrastructure monitoring', 'Optical camera, multispectral sensor, SAR module', 'Regular imagery and Earth surface analytics', 'Needs precise attitude control, optical calibration, and high data rate'],
      ['Communication Satellite', 'Data relay, IoT, emergency communications, signal retransmission', 'Antenna, transponder, SDR, power amplifier', 'Coverage for remote regions and stable communication link', 'High demands on power, thermal control, and RF compatibility'],
      ['Hosted Payload / Scientific Payload', 'Scientific or technology payload hosted on a spacecraft platform', 'Spectrometer, camera, radiation sensor, experiment', 'Focus on payload without building the full spacecraft bus', 'Power, data, thermal, and mechanical interfaces depend on the host platform'],
    ].map(toItem),
    checks: ['Check orbit: LEO, SSO, MEO, or GEO.', 'Close the power balance: solar arrays, battery, load modes.', 'Check thermal mode: vacuum, radiators, thermal cycling.', 'Assess component radiation tolerance.', 'Prepare ECSS/NASA verification matrix.'],
  },
};

function toItem(row: string[], index: number): SpacecraftItem {
  const [name, mission, payload, strength, limits] = row;
  return { name, image: images[index], mission, payload, strength, limits };
}
