import type { Language } from './language';

export const aiReportText: Record<Language, {
  eyebrow: string;
  title: string;
  subtitle: string;
  loading: string;
  ask: string;
  failed: string;
  inputLabel: string;
  inputPlaceholder: string;
  emptyQuestion: string;
  placeholder: string;
}> = {
  kk: {
    eyebrow: 'AI инженерлік есебі',
    title: 'Аэроғарыш инженерлік агенті',
    subtitle: 'Жобалау, өндіріс немесе пайдалану бойынша сұрақ қойыңыз',
    loading: 'AI жауап беріп жатыр…',
    ask: 'AI-дан сұрау',
    failed: 'AI-қорытындыны жасау мүмкін болмады.',
    inputLabel: 'Инженерлік сұрақ',
    inputPlaceholder: 'Мысалы: осы миссия үшін қандай материал және тексеріс тәртібі керек?',
    emptyQuestion: 'Алдымен AI-ға сұрақ жазыңыз.',
    placeholder: 'Дрондар, ғарыш, материалдар немесе инженерлік құжаттар туралы сұрақ қойыңыз.',
  },
  ru: {
    eyebrow: 'AI-инженерный отчёт',
    title: 'Аэрокосмический инженерный агент',
    subtitle: 'Задайте вопрос по проектированию, производству или эксплуатации',
    loading: 'AI отвечает…',
    ask: 'Спросить AI',
    failed: 'AI-отчёт не удалось сформировать.',
    inputLabel: 'Инженерный запрос',
    inputPlaceholder: 'Например: какой материал и порядок проверки нужны для этой миссии?',
    emptyQuestion: 'Сначала напиши вопрос для AI.',
    placeholder: 'Спросите про дроны, космос, материалы, производство, эксплуатацию или инженерные документы.',
  },
  en: {
    eyebrow: 'AI Engineering Report',
    title: 'Aerospace Engineering Agent',
    subtitle: 'Ask about design, manufacturing, or operations',
    loading: 'AI is answering…',
    ask: 'Ask AI',
    failed: 'Could not generate the AI report.',
    inputLabel: 'Engineering request',
    inputPlaceholder: 'Example: which material and verification flow fit this mission?',
    emptyQuestion: 'Write a question for AI first.',
    placeholder: 'Ask about drones, space, materials, manufacturing, operations, or engineering documents.',
  },
};
