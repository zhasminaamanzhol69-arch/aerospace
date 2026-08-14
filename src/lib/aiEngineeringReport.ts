import { isSupabaseConfigured, supabase } from './supabase';
import type { CalculatedParameters, DesignOption, MissionRequirements } from './aerospace';
import { buildEngineeringPrompt } from './aiEngineeringPrompt';
import type { EngineeringStage } from './engineeringStage';
import { buildFallbackEngineeringReport } from './fallbackEngineeringReport';
import type { Language } from './language';
import { detectAnswerLanguage } from './questionIntent';

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
  const answerLanguage = detectAnswerLanguage(userQuestion, language);

  if (!isSupabaseConfigured) {
    return buildFallbackEngineeringReport(requirements, parameters, options, answerLanguage, stage, userQuestion);
  }

  try {
    const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
      body: {
        system: buildSystemPrompt(answerLanguage),
        prompt: buildEngineeringPrompt(requirements, parameters, options, answerLanguage, stage, userQuestion),
      },
    });

    if (error) throw new Error(await getFunctionErrorMessage(error));
    if (data?.error) throw new Error(data.error);
    if (!data?.text) throw new Error('AI не вернул текст отчёта.');

    return data.text;
  } catch {
    return buildFallbackEngineeringReport(requirements, parameters, options, answerLanguage, stage, userQuestion);
  }
}

function buildSystemPrompt(language: Language) {
  return [
    'Ты Aerospace Engineering Agent: экспертный инженерный ассистент для авиации, UAV и космических аппаратов.',
    'Работай на этапах Жобалау / Проектирование, Дайындау / Производство, Пайдалану / Эксплуатация.',
    `Отвечай строго на одном языке: ${languageName[language]}. Не смешивай русский, казахский и английский в одном ответе без необходимости.`,
    'Отвечай только по тематике сайта: космос, дроны/авиация, космические аппараты, материалы, производство, испытания, эксплуатация, телеметрия и инженерные документы.',
    'Если вопрос не относится к этой тематике, коротко откажись и предложи задать вопрос по аэрокосмической инженерии.',
    'Если вопрос общий, не инженерный, ответь коротко как справочник и не притягивай его к аббревиатурам, MTOW, MOS, Fixed Wing или стандартам.',
    'Отвечай по выбранному этапу и вопросу пользователя; не выводи три этапа сразу без прямой просьбы.',
    'Ссылайся только на реальные нормативно-технические документы: ECSS, NASA Technical Standards, ISO, ГОСТ, FAA, ЕСКД или другие релевантные стандарты.',
    'Номера пунктов, разделов, таблиц, коэффициенты, прочность, допуски и лимиты приводи только если они есть в доступном контексте или ты точно знаешь источник.',
    'Если точных нормативных данных нет, напиши: "В имеющихся нормативных документах нет точной информации по данному запросу."',
    'Текущие Mission Requirements используй как дополнительный контекст, только если они подходят к вопросу.',
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
