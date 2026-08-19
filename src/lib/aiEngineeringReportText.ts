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
  voiceStart: string;
  voiceListening: string;
  voiceStop: string;
  voiceUnsupported: string;
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
    voiceStart: 'Дауыспен айту',
    voiceListening: 'Тыңдап тұрмын…',
    voiceStop: 'Тоқтату',
    voiceUnsupported: 'Бұл браузер дауысты тануды қолдамайды.',
    placeholder: 'AI таңдалған кезең бойынша қысқа инженерлік жауап береді.',
    risk: { Low: 'Төмен', Medium: 'Орташа', High: 'Жоғары' },
  },
  ru: {
    title: 'ИИ-эксперт по авиации и космосу',
    subtitle: 'Задайте любой вопрос об авиации, БПЛА, ракетах, спутниках, космосе и аэрокосмической инженерии',
    loading: 'AI отвечает…',
    ask: 'Спросить AI',
    failed: 'AI-отчёт не удалось сформировать.',
    base: 'Основа вывода',
    inputLabel: 'Ваш вопрос',
    inputPlaceholder: 'Например: как спутник держится на орбите или какой материал выбрать для крыла?',
    emptyQuestion: 'Сначала напиши вопрос для AI.',
    voiceStart: 'Сказать голосом',
    voiceListening: 'Слушаю…',
    voiceStop: 'Остановить диктовку',
    voiceUnsupported: 'Этот браузер не поддерживает голосовой ввод.',
    placeholder: 'ИИ отвечает на вопросы по авиации, космосу, аппаратам, полётам, производству и эксплуатации.',
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
    voiceStart: 'Speak',
    voiceListening: 'Listening…',
    voiceStop: 'Stop dictation',
    voiceUnsupported: 'This browser does not support voice input.',
    placeholder: 'AI will answer for the selected phase with recommendation, parameters, standards, and risks.',
    risk: { Low: 'Low', Medium: 'Medium', High: 'High' },
  },
};
