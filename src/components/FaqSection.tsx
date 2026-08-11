import { useLanguage, type Language } from '../lib/language';
import './FaqSection.css';

const text: Record<Language, { title: string; items: Array<{ question: string; answer: string }> }> = {
  kk: {
    title: 'Жиі қойылатын сұрақтар',
    items: [
      { question: 'Бұл агент аппараттарға көмектесе ме?', answer: 'Тікелей емес. Ол летательный аппараттарды жобалайтын инженерлерге, студенттерге және командаларға көмектеседі.' },
      { question: 'Мұндай аппараттар не істейді?', answer: 'Олар жүк жеткізеді, мониторинг жасайды, дерек жинайды, инфрақұрылымды тексереді немесе ғылыми миссияларға қатысады.' },
      { question: 'Бұл аппараттар ғарыш үшін жасалған ба?', answer: 'Aerospace авиацияны да, ғарышты да қамтиды. Қазір есеп UAV арқылы көрсетілген, бірақ логиканы спутниктерге және ғарыш аппараттарына кеңейтуге болады.' },
      { question: 'AI-агенттің мәні неде?', answer: 'Ол бастапқы талаптарды инженерлік талдауға айналдырады: параметрлерді есептейді, нұсқаларды салыстырады, тәуекелдерді көрсетеді және шешім ұсынады.' },
    ],
  },
  ru: {
    title: 'Часто задаваемые вопросы',
    items: [
      { question: 'Этот агент помогает летательным аппаратам?', answer: 'Не напрямую. Он помогает людям: инженерам, студентам и командам, которые проектируют летательные аппараты и выбирают техническое решение.' },
      { question: 'Что делают такие аппараты?', answer: 'Они могут доставлять грузы, проводить мониторинг, собирать данные, проверять инфраструктуру, участвовать в спасательных миссиях или выполнять научные задачи.' },
      { question: 'Эти аппараты созданы для космоса?', answer: 'Aerospace включает и авиацию, и космос. В текущем прототипе расчёт показан на примере UAV, но такую же логику можно расширить для спутников, посадочных модулей и космических аппаратов.' },
      { question: 'В чём суть AI-агента?', answer: 'Он превращает начальные требования в инженерный анализ: рассчитывает параметры, сравнивает варианты, показывает риски и предлагает решение.' },
    ],
  },
  en: {
    title: 'Frequently asked questions',
    items: [
      { question: 'Does this agent help aircraft directly?', answer: 'Not directly. It helps people: engineers, students, and teams who design aerospace vehicles and choose technical solutions.' },
      { question: 'What do these vehicles do?', answer: 'They can deliver payloads, monitor areas, collect data, inspect infrastructure, support rescue missions, or perform scientific tasks.' },
      { question: 'Are these vehicles made for space?', answer: 'Aerospace includes both aviation and space. This prototype uses a UAV example, but the same logic can be expanded for satellites, landers, and spacecraft.' },
      { question: 'What is the AI agent for?', answer: 'It turns initial requirements into engineering analysis: calculates parameters, compares options, shows risks, and recommends a solution.' },
    ],
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
    </section>
  );
}
