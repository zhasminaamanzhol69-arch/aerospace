import type { Language } from './language';

export const aiReportText: Record<Language, {
  title: string;
  subtitle: string;
  loading: string;
  ask: string;
  failed: string;
  base: string;
  inputLabel: string;
  inputPlaceholder: string;
  emptyQuestion: string;
  placeholder: string;
  risk: Record<string, string>;
}> = {
  kk: {
    title: 'Aerospace Engineering Agent',
    subtitle: 'Жобалау, өндіріс немесе пайдалану бойынша сұрақ қойыңыз',
    loading: 'AI жауап беріп жатыр…',
    ask: 'AI-дан сұрау',
    failed: 'AI-қорытындыны жасау мүмкін болмады.',
    base: 'Қорытынды негізі',
    inputLabel: 'Инженерлік сұрақ',
    inputPlaceholder: 'Мысалы: осы миссия үшін қандай материал және тексеріс тәртібі керек?',
    emptyQuestion: 'Алдымен AI-ға сұрақ жазыңыз.',
    placeholder: 'AI таңдалған кезең бойынша қысқа инженерлік жауап береді.',
    risk: { Low: 'Төмен', Medium: 'Орташа', High: 'Жоғары' },
  },
  ru: {
    title: 'Aerospace Engineering Agent',
    subtitle: 'Задайте вопрос по проектированию, производству или эксплуатации',
    loading: 'AI отвечает…',
    ask: 'Спросить AI',
    failed: 'AI-отчёт не удалось сформировать.',
    base: 'Основа вывода',
    inputLabel: 'Инженерный запрос',
    inputPlaceholder: 'Например: какой материал и порядок проверки нужны для этой миссии?',
    emptyQuestion: 'Сначала напиши вопрос для AI.',
    placeholder: 'AI ответит по выбранному этапу: краткий вывод, рекомендация, параметры, стандарты и риски.',
    risk: { Low: 'Low', Medium: 'Medium', High: 'High' },
  },
  en: {
    title: 'Aerospace Engineering Agent',
    subtitle: 'Ask about design, manufacturing, or operations',
    loading: 'AI is answering…',
    ask: 'Ask AI',
    failed: 'Could not generate the AI report.',
    base: 'Report basis',
    inputLabel: 'Engineering request',
    inputPlaceholder: 'Example: which material and verification flow fit this mission?',
    emptyQuestion: 'Write a question for AI first.',
    placeholder: 'AI will answer for the selected phase with recommendation, parameters, standards, and risks.',
    risk: { Low: 'Low', Medium: 'Medium', High: 'High' },
  },
};
