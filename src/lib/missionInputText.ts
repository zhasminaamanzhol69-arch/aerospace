import type { Language } from './language';

export const inputNumberFields = [
  'payloadKg',
  'payloadPowerW',
  'rangeKm',
  'enduranceHours',
  'altitudeKm',
  'takeoffMassKg',
  'maxDimensionM',
  'productionVolume',
  'batterySohPercent',
  'motorTempC',
  'flightHours',
  'linkRssiDbm',
  'satelliteCount',
  'telemetryLatencyMs',
  'solarArrayW',
  'radiationToleranceKrad',
  'resourcePercent',
] as const;

export type MissionInputCopy = {
  title: string;
  labels: Record<(typeof inputNumberFields)[number], string>;
  scheme: string;
  material: string;
  method: string;
  environment: string;
  missionMode: string;
  orbit: string;
  thermal: string;
  joint: string;
  scale: string;
  checkType: string;
  checklist: string;
  options: Record<string, string>;
};

export const missionInputText: Record<Language, MissionInputCopy> = {
  kk: {
    title: 'Бастапқы талаптар',
    labels: { payloadKg: 'Пайдалы жүк, кг', payloadPowerW: 'Жүктеме қуаты, Вт', rangeKm: 'Қашықтық, км', enduranceHours: 'Ұшу уақыты, сағ', altitudeKm: 'Биіктік/орбита, км', takeoffMassKg: 'Ұшу массасының лимиті, кг', maxDimensionM: 'Габарит лимиті, м', productionVolume: 'Серия көлемі', batterySohPercent: 'Аккумулятор күйі, %', motorTempC: 'Қозғалтқыш температурасы, °C', flightHours: 'Жұмыс уақыты, сағ', linkRssiDbm: 'Байланыс сигналы, dBm', satelliteCount: 'GPS/Galileo саны', telemetryLatencyMs: 'Телеметрия кідірісі, мс', solarArrayW: 'Күн панелі, Вт', radiationToleranceKrad: 'Радиацияға төзімділік, крад', resourcePercent: 'Аккумулятор/отын ресурсы, %' },
    scheme: 'Аппарат схемасы',
    material: 'Материал',
    method: 'Формалау/өңдеу әдісі',
    environment: 'Пайдалану ортасы',
    missionMode: 'Миссия режимі',
    orbit: 'Орбита',
    thermal: 'Термореттеу',
    joint: 'Қосу әдісі',
    scale: 'Серия түрі',
    checkType: 'Тексеру түрі',
    checklist: 'Ұшу алдындағы чек-лист',
    options: { 'fixed-wing': 'Самолёт схемасы', multirotor: 'Мультиротор', 'hybrid-vtol': 'Гибридті VTOL', 'cubesat-satellite': 'Кубсат / спутник', leo: 'Төмен Жер орбитасы', geo: 'Геостационарлық орбита', sso: 'Күн-синхронды орбита', passive: 'Пассивті термореттеу', active: 'Активті термореттеу', carbon: 'Көмірпластик', 'aluminum-2024': 'Al-Li 2024', 'aluminum-7075': 'Al 7075-T6', titanium: 'Титан ВТ6', petg: '3D PETG', pa12: '3D PA12', 'dmls-metal': 'DMLS металл', cnc: 'ЧПУ-фрезерлеу', autoclave: 'Композитті автоклавта қалыптау', 'vacuum-infusion': 'Вакуумдық инфузия', 'additive-polymer': 'Полимерді 3D-басып шығару', dmls: 'DMLS металл', welding: 'Дәнекерлеу', 'laser-welding': 'Лазерлік дәнекерлеу', 'tig-welding': 'Аргон-доғалы дәнекерлеу', 'friction-welding': 'Үйкеліспен дәнекерлеу', riveting: 'Тойтарма', adhesive: 'Желімді қосылыс', prototype: 'Прототип 1–3 дана', 'small-batch': 'Шағын серия 10–50 дана', serial: 'Сериялық өндіріс', normal: 'Қалыпты жағдай', cold: '−40°C суық', wind: '>12 м/с жел', space: 'Вакуум + радиация', waypoint: 'Нүктелер бойынша автономды миссия', fpv: 'FPV қолмен басқару', orbital: 'Орбиталық маневр', regular: 'Тұрақты техникалық қызмет', 'hard-landing': 'Қатты қонудан кейін', preflight: 'Ұшу алдындағы чек-лист', ready: 'Толық дайын', partial: 'Ішінара дайын', blocked: 'Дайын емес' },
  },
  ru: {
    title: 'Начальные требования',
    labels: { payloadKg: 'Полезная нагрузка, кг', payloadPowerW: 'Потребление полезной нагрузки, Вт', rangeKm: 'Дальность, км', enduranceHours: 'Время в воздухе, ч', altitudeKm: 'Высота или орбита, км', takeoffMassKg: 'Лимит взлётной массы, кг', maxDimensionM: 'Лимит габарита, м', productionVolume: 'Объём серии', batterySohPercent: 'Состояние аккумулятора, %', motorTempC: 'Температура двигателей, °C', flightHours: 'Наработка, ч', linkRssiDbm: 'Сила сигнала связи, dBm', satelliteCount: 'Спутники навигации', telemetryLatencyMs: 'Задержка телеметрии, мс', solarArrayW: 'Солнечные панели, Вт', radiationToleranceKrad: 'Радстойкость, крад', resourcePercent: 'Ресурс аккумулятора/топлива, %' },
    scheme: 'Схема аппарата',
    material: 'Материал',
    method: 'Метод формования/обработки',
    environment: 'Среда эксплуатации',
    missionMode: 'Режим миссии',
    orbit: 'Орбита',
    thermal: 'Терморегулирование',
    joint: 'Метод соединения',
    scale: 'Серийность',
    checkType: 'Тип проверки',
    checklist: 'Предполётный чек-лист',
    options: { 'fixed-wing': 'Самолётная схема', multirotor: 'Мультиротор', 'hybrid-vtol': 'Гибридный вертикальный взлёт', 'cubesat-satellite': 'Кубсат / спутник', leo: 'Низкая околоземная орбита', geo: 'Геостационарная орбита', sso: 'Солнечно-синхронная орбита', passive: 'Пассивное терморегулирование', active: 'Активное терморегулирование', carbon: 'Углепластик', 'aluminum-2024': 'Алюминий-литиевый сплав 2024', 'aluminum-7075': 'Алюминий 7075-Т6', titanium: 'Титан ВТ6', petg: '3D-печать PETG', pa12: '3D-печать PA12', 'dmls-metal': 'Лазерное спекание металла', cnc: 'ЧПУ-фрезерование', autoclave: 'Автоклавное формование композитов', 'vacuum-infusion': 'Вакуумное инфузирование', 'additive-polymer': 'Аддитивное производство', dmls: 'Лазерное спекание металла', welding: 'Сварка', 'laser-welding': 'Лазерная сварка', 'tig-welding': 'Аргонодуговая сварка', 'friction-welding': 'Сварка трением', riveting: 'Клёпка', adhesive: 'Клеевые и адгезивные соединения', prototype: 'Прототип 1–3 шт.', 'small-batch': 'Мелкосерийное 10–50 шт.', serial: 'Серийное производство', normal: 'Нормальные условия', cold: 'Экстремальный холод −40°C', wind: 'Сильный ветер >12 м/с', space: 'Вакуум и радиация', waypoint: 'Автономный маршрут по точкам', fpv: 'Ручное управление от первого лица', orbital: 'Орбитальное маневрирование', regular: 'Регулярное ТО', 'hard-landing': 'После жесткой посадки', preflight: 'Предполётный чек-лист', ready: 'Готов', partial: 'Частично готов', blocked: 'Не готов' },
  },
  en: {
    title: 'Initial requirements',
    labels: { payloadKg: 'Payload, kg', payloadPowerW: 'Payload power, W', rangeKm: 'Range, km', enduranceHours: 'Endurance, h', altitudeKm: 'Altitude/orbit, km', takeoffMassKg: 'MTOW limit, kg', maxDimensionM: 'Size limit, m', productionVolume: 'Series volume', batterySohPercent: 'Battery SoH, %', motorTempC: 'Motor temp, °C', flightHours: 'Flight hours', linkRssiDbm: 'RSSI, dBm', satelliteCount: 'GPS/Galileo satellites', telemetryLatencyMs: 'Telemetry latency, ms', solarArrayW: 'Solar array, W', radiationToleranceKrad: 'Radiation tolerance, krad', resourcePercent: 'Battery/fuel resource, %' },
    scheme: 'Vehicle scheme',
    material: 'Material',
    method: 'Forming/machining method',
    environment: 'Operating environment',
    missionMode: 'Mission mode',
    orbit: 'Orbit',
    thermal: 'Thermal control',
    joint: 'Joining method',
    scale: 'Production scale',
    checkType: 'Check type',
    checklist: 'Preflight checklist',
    options: { 'fixed-wing': 'Aircraft / Fixed Wing', multirotor: 'Multirotor', 'hybrid-vtol': 'Hybrid / VTOL', 'cubesat-satellite': 'CubeSat / Satellite', leo: 'LEO', geo: 'GEO', sso: 'SSO', passive: 'Passive thermal control', active: 'Active thermal control', carbon: 'CFRP', 'aluminum-2024': 'Al-Li 2024', 'aluminum-7075': 'Al 7075-T6', titanium: 'Ti-6Al-4V', petg: '3D PETG', pa12: '3D PA12', 'dmls-metal': 'DMLS metal', cnc: 'CNC milling', autoclave: 'Composite autoclave molding', 'vacuum-infusion': 'Vacuum infusion', 'additive-polymer': 'Additive manufacturing', dmls: 'DMLS metal', welding: 'Welding', 'laser-welding': 'Laser welding', 'tig-welding': 'TIG welding', 'friction-welding': 'Friction welding', riveting: 'Riveting', adhesive: 'Adhesive bonding', prototype: 'Prototype 1–3 pcs', 'small-batch': 'Small batch 10–50 pcs', serial: 'Serial production', normal: 'Normal conditions', cold: 'Extreme cold −40°C', wind: 'Strong wind >12 m/s', space: 'Vacuum and radiation', waypoint: 'Autonomous waypoint mission', fpv: 'Manual FPV control', orbital: 'Orbital maneuvering', regular: 'Regular maintenance', 'hard-landing': 'After hard landing', preflight: 'Pre-flight checklist', ready: 'Ready', partial: 'Partly ready', blocked: 'Blocked' },
  },
};
