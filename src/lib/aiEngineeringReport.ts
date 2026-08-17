import { isSupabaseConfigured, supabase } from './supabase';
import type { CalculatedParameters, DesignOption, MissionRequirements } from './aerospace';
import { buildEngineeringPrompt } from './aiEngineeringPrompt';
import { buildOutOfScopeAnswer, isAerospaceQuestion } from './aiTopicGuard';
import type { EngineeringStage } from './engineeringStage';
import { buildFallbackEngineeringReport } from './fallbackEngineeringReport';
import type { Language } from './language';

type AiResponse = {
  text?: string;
  error?: string;
};

const languageName: Record<Language, string> = {
  kk: 'казахский',
  ru: 'русский',
  en: 'английский',
};

export async function generateEngineeringReport(
  requirements: MissionRequirements,
  parameters: CalculatedParameters,
  options: DesignOption[],
  language: Language,
  stage: EngineeringStage,
  userQuestion: string,
) {
  if (!isAerospaceQuestion(userQuestion)) {
    return buildOutOfScopeAnswer(language);
  }

  if (!isSupabaseConfigured) {
    return buildFallbackEngineeringReport(requirements, parameters, options, language, stage, userQuestion);
  }

  try {
    const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
      body: {
        system: buildSystemPrompt(language),
        prompt: buildEngineeringPrompt(requirements, parameters, options, language, stage, userQuestion),
      },
    });

    if (error) throw new Error(await getFunctionErrorMessage(error));
    if (data?.error) throw new Error(data.error);
    if (!data?.text) throw new Error('AI не вернул текст отчёта.');

    return data.text;
  } catch {
    return buildFallbackEngineeringReport(requirements, parameters, options, language, stage, userQuestion);
  }
}

function buildSystemPrompt(language: Language) {
  return [
    'Ты Aerospace Engineering Agent: универсальный экспертный ассистент по авиации, аэрокосмической технике и космосу.',
    'Отвечай на любые вопросы по самолётам, вертолётам, двигателям, аэродинамике, БПЛА, ракетам, спутникам, CubeSat, космическим аппаратам, орбитам, миссиям, материалам, производству, испытаниям, эксплуатации, безопасности и истории этих областей.',
    'Также помогай с обучением: объясняй термины, физику и инженерные принципы понятным языком, сравнивай варианты и предлагай безопасные учебные расчёты.',
    `Отвечай на языке: ${languageName[language]}.`,
    'Для элементарных вопросов отвечай как хороший учитель: коротко, ясно, без отчётной структуры, без лишних стандартов и без подстановки параметров текущей миссии.',
    'Вопрос пользователя важнее выбранного в интерфейсе этапа. Используй этап и параметры миссии только тогда, когда они действительно относятся к вопросу.',
    'Если вопрос общий, дай прямой содержательный ответ без навязывания отчёта, текущего аппарата или выбранного этапа.',
    'Если вопрос явно не относится к авиации, космосу или смежной инженерии, вежливо предложи задать тематический вопрос.',
    'Ссылайся только на реальные нормативно-технические документы: ECSS, NASA Technical Standards, ISO, ГОСТ, FAA, ЕСКД или другие релевантные стандарты.',
    'Номера пунктов, разделов, таблиц, коэффициенты, прочность, допуски и лимиты приводи только если они есть в доступном контексте или ты точно знаешь источник.',
    'Фразу об отсутствии точных нормативных данных используй только тогда, когда пользователь действительно спрашивает про стандарт, норму или точное числовое ограничение.',
    'Текущие Mission Requirements используй как дополнительный контекст, только если они подходят к вопросу.',
    'Если вопрос не связан с аэрокосмической тематикой, не отвечай по содержанию вопроса; официально сообщи, что система отвечает только на вопросы по авиации, космосу и аэрокосмической инженерии.',
    'Не обещай реальную сертификацию и не выдавай учебные расчёты за готовый промышленный проект.',
  ].join(' ');
}

async function getFunctionErrorMessage(error: unknown) {
  const fallback = error instanceof Error ? error.message : 'Не получилось обратиться к AI.';

  if (!hasContext(error) || !(error.context instanceof Response)) return fallback;

  try {
    const body = (await error.context.clone().json()) as unknown;
    if (hasStringError(body)) return body.error;
  } catch {
    return fallback;
  }

  return fallback;
}

function hasContext(value: unknown): value is { context: unknown } {
  return typeof value === 'object' && value !== null && 'context' in value;
}

function hasStringError(value: unknown): value is { error: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'string'
  );
}
