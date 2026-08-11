import { isSupabaseConfigured, supabase } from './supabase';
import type { CalculatedParameters, DesignOption, MissionRequirements } from './aerospace';
import type { Language } from './language';

type AiResponse = {
  text?: string;
  error?: string;
};

export async function generateEngineeringReport(
  requirements: MissionRequirements,
  parameters: CalculatedParameters,
  options: DesignOption[],
  language: Language,
) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase не настроен, поэтому AI-отчёт пока недоступен.');
  }

  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
    body: {
      system: [
        'Ты инженерный AI-агент для учебного aerospace-приложения.',
        `Отвечай на языке: ${languageName[language]}.`,
        'Пиши кратко, понятно и профессионально.',
        'Не обещай реальную сертификацию и не выдавай расчёты за готовый промышленный проект.',
      ].join(' '),
      prompt: buildPrompt(requirements, parameters, options, language),
    },
  });

  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  if (!data?.text) throw new Error('AI не вернул текст отчёта.');

  return data.text;
}

const languageName: Record<Language, string> = {
  kk: 'казахский',
  ru: 'русский',
  en: 'английский',
};

function buildPrompt(
  requirements: MissionRequirements,
  parameters: CalculatedParameters,
  options: DesignOption[],
  language: Language,
) {
  const best = options[0];
  const optionLines = options
    .map(
      (option) =>
        `- ${option.name}: score ${option.score}%, mass ${option.massKg} kg, power ${option.powerW} W, risk ${option.risk}`,
    )
    .join('\n');

  return `
Задача: сделать инженерный вывод после анализа требований к UAV.
Язык ответа: ${languageName[language]}.

Требования:
- полезная нагрузка: ${requirements.payloadKg} кг
- время полёта: ${requirements.enduranceHours} ч
- дальность: ${requirements.rangeKm} км
- скорость: ${requirements.speedKmh} км/ч
- двигатель: ${requirements.engineType}
- материал: ${requirements.material}
- источник энергии: ${requirements.energySource}
- среда эксплуатации: ${requirements.environment}

Рассчитанные необходимые параметры:
- расчётная взлётная масса: ${parameters.estimatedTakeoffMassKg} кг
- необходимая мощность: ${parameters.requiredPowerW} W
- запас энергии: ${parameters.requiredEnergyWh} Wh
- резерв батареи: ${parameters.batteryReservePercent}%
- расчётная нагрузка: ${parameters.designLoadKg} кг
- уровень риска: ${parameters.riskLevel}
- совет по материалу: ${parameters.materialAdvice}
- совет по источнику энергии: ${parameters.energyAdvice}
- эксплуатационный совет: ${parameters.operationAdvice}

Рассчитанные варианты:
${optionLines}

Лучший вариант по локальному расчёту: ${best.name}.

Сформируй ответ в 4 коротких разделах:
1. Вывод
2. Рассчитанные параметры и что они означают
3. Риски
4. Рекомендуемое инженерное решение
`.trim();
}
