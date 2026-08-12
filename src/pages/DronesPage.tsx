import { Link } from 'wouter';
import { SiteMenu } from '../components/SiteMenu';
import { loadUserProfile } from '../lib/userProfile';
import fixedWingImage from '../assets/rescue-fixed-wing-drone.png';
import fireDroneImage from '../assets/rescue-fire-drone.png';
import medicalDroneImage from '../assets/rescue-medical-drone.png';
import relayDroneImage from '../assets/rescue-relay-drone.png';
import urbanDroneImage from '../assets/rescue-urban-drone.png';
import './DronesPage.css';

const drones = [
  {
    name: 'Поисково-спасательный Fixed Wing',
    image: fixedWingImage,
    mission: 'Большой район поиска, лес, степь, горы',
    payload: 'Тепловизор, RGB-камера, радиомаяк',
    strength: 'Дальность и длительное патрулирование',
    limits: 'Нужна площадка или катапульта для старта',
  },
  {
    name: 'Мультиротор для городской операции',
    image: urbanDroneImage,
    mission: 'Осмотр зданий, завалов, мостов и крыш',
    payload: 'Прожектор, громкоговоритель, камера',
    strength: 'Точное зависание и вертикальная посадка',
    limits: 'Меньше время полёта и чувствительность к ветру',
  },
  {
    name: 'VTOL Rescue Hybrid',
    image: fixedWingImage,
    mission: 'Смешанный маршрут: дальний перелёт и точная посадка',
    payload: 'Аптечка, маяк, камера, малый груз',
    strength: 'Компромисс дальности и вертикального старта',
    limits: 'Сложнее конструкция и обслуживание',
  },
  {
    name: 'Медицинский доставочный дрон',
    image: medicalDroneImage,
    mission: 'Доставка крови, лекарств, анализов',
    payload: 'Термоконтейнер, GPS-трекер, датчик температуры',
    strength: 'Быстрая доставка в труднодоступные точки',
    limits: 'Требуется контроль температуры и вибрации груза',
  },
  {
    name: 'Пожарный мониторинговый дрон',
    image: fireDroneImage,
    mission: 'Контур пожара, дым, горячие точки',
    payload: 'Тепловизор, газовый датчик, ретранслятор',
    strength: 'Работа там, где опасно отправлять человека',
    limits: 'Высокая температура, дым и турбулентность',
  },
  {
    name: 'Дрон-ретранслятор связи',
    image: relayDroneImage,
    mission: 'Восстановление связи после ЧС',
    payload: 'LTE/радио ретранслятор, направленная антенна',
    strength: 'Создаёт временный канал связи для спасателей',
    limits: 'Нужен расчёт энергопотребления и зоны покрытия',
  },
];

const checks = [
  'Проверить ветер, осадки и видимость перед вылетом.',
  'Подтвердить заряд аккумулятора и резерв на возврат.',
  'Проверить крепление спасательной нагрузки и центр масс.',
  'Настроить fail-safe: RTH, посадка или удержание точки.',
  'Записать телеметрию миссии для анализа после операции.',
];

export function DronesPage() {
  const profile = loadUserProfile();

  return (
    <main className="container drone-page">
      <div className="top-bar">
        <Link href="/">
          <button className="ghost" type="button">Назад</button>
        </Link>
        {profile && <SiteMenu />}
      </div>

      <section className="drone-hero">
        <p className="eyebrow">Rescue UAV Systems</p>
        <h1>Виды спасательных дронов</h1>
        <p>
          Раздел посвящён не общему проектированию, а конкретным UAV-сценариям для поиска,
          доставки, мониторинга пожаров и восстановления связи при чрезвычайных ситуациях.
        </p>
      </section>

      <section className="drone-grid">
        {drones.map((drone) => (
          <article className="drone-card" key={drone.name}>
            <img src={drone.image} alt={drone.name} />
            <h2>{drone.name}</h2>
            <p><span>Миссия:</span> {drone.mission}</p>
            <p><span>Полезная нагрузка:</span> {drone.payload}</p>
            <p><span>Сильная сторона:</span> {drone.strength}</p>
            <p><span>Ограничение:</span> {drone.limits}</p>
          </article>
        ))}
      </section>

      <section className="card rescue-checklist">
        <p className="eyebrow">Rescue Mission Checklist</p>
        <h2>Чек-лист спасательной миссии</h2>
        <ol>
          {checks.map((check) => <li key={check}>{check}</li>)}
        </ol>
      </section>
    </main>
  );
}
