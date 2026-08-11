import { ProContent } from './ProContent';
import { useLanguage, type Language } from '../lib/language';
import './FaqSection.css';

const text: Record<Language, {
  title: string;
  items: Array<{ question: string; answer: string }>;
  proTitle: string;
  proSubtitle: string;
  proItems: string[];
  proNote: string;
}> = {
  kk: {
    title: 'Жиі қойылатын сұрақтар',
    items: [
      { question: 'Бұл агент аппараттарға көмектесе ме?', answer: 'Тікелей емес. Ол летательный аппараттарды жобалайтын инженерлерге, студенттерге және командаларға көмектеседі.' },
      { question: 'Мұндай аппараттар не істейді?', answer: 'Олар жүк жеткізеді, мониторинг жасайды, дерек жинайды, инфрақұрылымды тексереді немесе ғылыми миссияларға қатысады.' },
      { question: 'Бұл аппараттар ғарыш үшін жасалған ба?', answer: 'Aerospace авиацияны да, ғарышты да қамтиды. Қазір есеп UAV арқылы көрсетілген, бірақ логиканы спутниктерге және ғарыш аппараттарына кеңейтуге болады.' },
      { question: 'AI-агенттің мәні неде?', answer: 'Ол бастапқы талаптарды инженерлік талдауға айналдырады: параметрлерді есептейді, нұсқаларды салыстырады, тәуекелдерді көрсетеді және шешім ұсынады.' },
      { question: 'Агент жобалау кезеңінде параметрлерді қалай есептейді?', answer: 'Payload, MTOW, миссия ұзақтығы және аппарат схемасы арқылы масса, қуат, энергия, геометрия, L/D және беріктік қорын бағалайды.' },
      { question: 'Материал таңдауда қандай өндіріс стандарттары ескеріледі?', answer: 'Жауапта ECSS, ISO, ГОСТ және AS9100 сияқты өндіріс пен сапа стандарттарына сүйенетін негіздеме беріледі, бірақ нақты пункттер тек сенімді контексте көрсетіледі.' },
      { question: 'Digital Twin телеметрияны талдауға қалай көмектеседі?', answer: 'Digital Twin SoH, температура, RSSI, latency, vibration және flight hours бойынша аппараттың күйін бақылап, аномалия мен ТО қажеттілігін алдын ала көрсетеді.' },
    ],
    proTitle: 'Pro нұсқасы',
    proSubtitle: 'Ақылы контент кеңейтілген инженерлік талдау үшін қажет.',
    proItems: [
      'ECSS, NASA, ISO, ГОСТ және FAA бойынша кеңейтілген нормативтік іздеу',
      'Беріктік, аэродинамика және орбиталық механика бойынша терең есептер',
      'Қорытпалар, композиттер, өндіріс технологиялары және құрастыру карталары',
      'Сынақ регламенттері, ұшу алдындағы чек-листтер және қауіпсіздік нұсқаулықтары',
    ],
    proNote: 'Бұл оқу прототипіндегі Pro-блок: нақты төлем жүйесі кейін қосылады.',
  },
  ru: {
    title: 'Часто задаваемые вопросы',
    items: [
      { question: 'Этот агент помогает летательным аппаратам?', answer: 'Не напрямую. Он помогает людям: инженерам, студентам и командам, которые проектируют летательные аппараты и выбирают техническое решение.' },
      { question: 'Что делают такие аппараты?', answer: 'Они могут доставлять грузы, проводить мониторинг, собирать данные, проверять инфраструктуру, участвовать в спасательных миссиях или выполнять научные задачи.' },
      { question: 'Эти аппараты созданы для космоса?', answer: 'Aerospace включает и авиацию, и космос. В текущем прототипе расчёт показан на примере UAV, но такую же логику можно расширить для спутников, посадочных модулей и космических аппаратов.' },
      { question: 'В чём суть AI-агента?', answer: 'Он превращает начальные требования в инженерный анализ: рассчитывает параметры, сравнивает варианты, показывает риски и предлагает решение.' },
      { question: 'Как агент рассчитывает параметры на этапе проектирования?', answer: 'Он использует payload, MTOW, длительность миссии, схему аппарата и ограничения, чтобы оценить массу, мощность, энергию, геометрию, L/D и запас прочности.' },
      { question: 'Какие стандарты производства (ECSS, ISO, ГОСТ) учитываются при выборе материалов?', answer: 'Для manufacturing-анализа агент учитывает контекст ECSS-Q-ST-70C, ISO 9001/AS9100, ISO 2768-m, ГОСТ 18353 и связанные нормы контроля качества.' },
      { question: 'Как Digital Twin помогает в эксплуатации и анализе телеметрии?', answer: 'Digital Twin связывает аппарат, поток телеметрии и прогноз AI: отслеживает SoH, температуру, RSSI, задержку, вибрацию и остаточный ресурс до ТО.' },
    ],
    proTitle: 'Pro версия',
    proSubtitle: 'Платный контент для расширенного инженерного анализа.',
    proItems: [
      'Расширенный поиск по ECSS, NASA, ISO, ГОСТ, FAA и ЕСКД',
      'Глубокие расчёты по прочности, аэродинамике и орбитальной механике',
      'База по сплавам, композитам, технологиям производства и сборке',
      'Регламенты испытаний, предполётные чек-листы и инструкции по безопасности',
    ],
    proNote: 'Это демонстрационный Pro-блок в учебном прототипе: реальная оплата подключается отдельно.',
  },
  en: {
    title: 'Frequently asked questions',
    items: [
      { question: 'Does this agent help aircraft directly?', answer: 'Not directly. It helps people: engineers, students, and teams who design aerospace vehicles and choose technical solutions.' },
      { question: 'What do these vehicles do?', answer: 'They can deliver payloads, monitor areas, collect data, inspect infrastructure, support rescue missions, or perform scientific tasks.' },
      { question: 'Are these vehicles made for space?', answer: 'Aerospace includes both aviation and space. This prototype uses a UAV example, but the same logic can be expanded for satellites, landers, and spacecraft.' },
      { question: 'What is the AI agent for?', answer: 'It turns initial requirements into engineering analysis: calculates parameters, compares options, shows risks, and recommends a solution.' },
      { question: 'How does the agent calculate design-stage parameters?', answer: 'It uses payload, MTOW, mission duration, vehicle architecture, and constraints to estimate mass, power, energy, geometry, L/D, and margin of safety.' },
      { question: 'Which manufacturing standards are considered for material selection?', answer: 'The manufacturing analysis is guided by ECSS-Q-ST-70C, ISO 9001/AS9100, ISO 2768-m, GOST 18353, and related quality-control standards when relevant.' },
      { question: 'How does Digital Twin support operations and telemetry analysis?', answer: 'It links the vehicle, telemetry stream, and AI forecast to track SoH, temperature, RSSI, latency, vibration, and remaining service life.' },
    ],
    proTitle: 'Pro version',
    proSubtitle: 'Paid content for advanced engineering analysis.',
    proItems: [
      'Extended search across ECSS, NASA, ISO, GOST, FAA, and ESKD',
      'Deeper calculations for strength, aerodynamics, and orbital mechanics',
      'Knowledge base for alloys, composites, manufacturing processes, and assembly',
      'Test regulations, preflight checklists, and safety instructions',
    ],
    proNote: 'This is a demo Pro block in the learning prototype: real payments can be connected later.',
  },
};

export function FaqSection() {
  const { language } = useLanguage();
  const copy = text[language];

  return (
    <section className="card faq-section">
      <div>
        <p className="eyebrow">FAQ</p>
        <h2>{copy.title}</h2>
      </div>
      <div className="faq-list">
        {copy.items.map((item) => (
          <details className="faq-item" key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
      <ProContent
        items={copy.proItems}
        note={copy.proNote}
        subtitle={copy.proSubtitle}
        title={copy.proTitle}
      />
    </section>
  );
}
