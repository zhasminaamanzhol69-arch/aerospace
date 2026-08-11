import type { EngineeringStage } from '../lib/engineeringStage';
import { useLanguage, type Language } from '../lib/language';

type Props = {
  value: EngineeringStage;
  onChange: (stage: EngineeringStage) => void;
};

type StageOption = {
  value: EngineeringStage;
  label: Record<Language, string>;
  hint: Record<Language, string>;
};

const options: StageOption[] = [
  {
    value: 'design',
    label: { kk: 'Жобалау', ru: 'Проектирование', en: 'Design' },
    hint: {
      kk: 'Беріктік, аэродинамика, орбиталық механика',
      ru: 'Прочность, аэродинамика, орбитальная механика',
      en: 'Strength, aerodynamics, orbital mechanics',
    },
  },
  {
    value: 'manufacturing',
    label: { kk: 'Дайындау', ru: 'Производство', en: 'Manufacturing' },
    hint: {
      kk: 'Технология, қорытпа, композит, құрастыру',
      ru: 'Технологии, сплавы, композиты, сборка',
      en: 'Processes, alloys, composites, assembly',
    },
  },
  {
    value: 'operations',
    label: { kk: 'Пайдалану', ru: 'Эксплуатация', en: 'Operations' },
    hint: {
      kk: 'Сынақ, ұшу алдындағы чек-лист, қауіпсіздік',
      ru: 'Испытания, предполётные чек-листы, безопасность',
      en: 'Testing, preflight checklists, safety',
    },
  },
];

const text: Record<Language, { label: string }> = {
  kk: { label: 'Іздеу кезеңі' },
  ru: { label: 'Фильтр поиска' },
  en: { label: 'Search filter' },
};

export function EngineeringStageFilter({ value, onChange }: Props) {
  const { language } = useLanguage();

  return (
    <div className="stage-filter" aria-label={text[language].label}>
      <span className="stage-filter__label">{text[language].label}</span>
      <div className="stage-filter__options">
        {options.map((option) => (
          <button
            className={option.value === value ? 'stage-filter__option is-active' : 'stage-filter__option'}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <span>{option.label[language]}</span>
            <small>{option.hint[language]}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
