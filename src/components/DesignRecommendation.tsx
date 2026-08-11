import type { DesignOption } from '../lib/aerospace';
import { useLanguage, type Language } from '../lib/language';

type Props = {
  options: DesignOption[];
};

const text: Record<Language, {
  title: string;
  labels: string[];
  risk: Record<string, string>;
  summaries: Record<string, string>;
}> = {
  kk: {
    title: 'Ұсынылған конфигурация',
    labels: ['Балл', 'Масса', 'Қуат', 'Тәуекел'],
    risk: { Low: 'Төмен', Medium: 'Орташа', High: 'Жоғары' },
    summaries: { 'Quad VTOL UAV': 'Тік ұшу, дәл қону және прототипті сынау үшін қолайлы.', 'Fixed Wing UAV': 'Қашықтық пен ұзақ ұшу үшін ең энергия тиімді нұсқа.', 'Hybrid VTOL Wing': 'Тік старт пен үнемді маршруттық ұшудың теңгерімі.' },
  },
  ru: {
    title: 'Рекомендуемая конфигурация',
    labels: ['Score', 'Mass', 'Power', 'Risk'],
    risk: { Low: 'Low', Medium: 'Medium', High: 'High' },
    summaries: { 'Quad VTOL UAV': 'Лучше для вертикального взлёта, точной посадки и тестов прототипа.', 'Fixed Wing UAV': 'Самый энергоэффективный вариант для дальности и длительного полёта.', 'Hybrid VTOL Wing': 'Компромисс: вертикальный старт плюс экономичный маршрутный полёт.' },
  },
  en: {
    title: 'Recommended configuration',
    labels: ['Score', 'Mass', 'Power', 'Risk'],
    risk: { Low: 'Low', Medium: 'Medium', High: 'High' },
    summaries: { 'Quad VTOL UAV': 'Best for vertical takeoff, precise landing, and prototype testing.', 'Fixed Wing UAV': 'The most energy-efficient option for range and longer flight time.', 'Hybrid VTOL Wing': 'A compromise between vertical launch and efficient cruise flight.' },
  },
};

export function DesignRecommendation({ options }: Props) {
  const { language } = useLanguage();
  const copy = text[language];
  const best = options[0];

  return (
    <section className="card mission-card recommendation-card">
      <p className="eyebrow">{copy.title}</p>
      <h2>{best.name}</h2>
      <p className="recommendation-summary">{copy.summaries[best.name]}</p>
      <div className="metric-row">
        <Metric label={copy.labels[0]} value={`${best.score}%`} />
        <Metric label={copy.labels[1]} value={`${best.massKg} kg`} />
        <Metric label={copy.labels[2]} value={`${best.powerW} W`} />
        <Metric label={copy.labels[3]} value={copy.risk[best.risk]} />
      </div>
      <div className="option-list">
        {options.map((option) => (
          <article className="option-card" key={option.name}>
            <span>{option.name}</span>
            <strong>{option.score}%</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
