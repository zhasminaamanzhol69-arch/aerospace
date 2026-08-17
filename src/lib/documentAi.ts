import { buildLocalDocumentAnswer } from './documentAnalysis';
import type { ExtractedDocument } from './documentExtraction';
import { buildOutOfScopeDocumentAnswer, isAerospaceDocument } from './aiTopicGuard';
import type { Language } from './language';
import { isSupabaseConfigured, supabase } from './supabase';

type AiResponse = { text?: string; error?: string };

export async function answerDocumentQuestion(
  current: ExtractedDocument,
  question: string,
  previous?: ExtractedDocument | null,
  language: Language = 'ru',
) {
  if (!isAerospaceDocument(current.name, current.text)) {
    return buildOutOfScopeDocumentAnswer(language);
  }

  if (!isSupabaseConfigured) return buildLocalDocumentAnswer(current, question, previous);

  try {
    const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
      body: {
        system: buildSystemPrompt(),
        prompt: buildPrompt(current, question, previous),
      },
    });

    if (error || data?.error || !data?.text) {
      return buildLocalDocumentAnswer(current, question, previous);
    }

    return data.text;
  } catch {
    return buildLocalDocumentAnswer(current, question, previous);
  }
}

function buildSystemPrompt() {
  return [
    'Ты Aerospace Engineering Agent для анализа инженерных документов.',
    'Отвечай на русском языке.',
    'Работай только по тексту загруженного документа.',
    'Если точного пункта нет в тексте, прямо напиши, что точная информация не найдена.',
    'Структура ответа: краткий вывод, найденные требования/пункты, риски и ограничения.',
    'Не придумывай номера пунктов, таблицы, допуски и нормативные значения.',
  ].join(' ');
}

function buildPrompt(current: ExtractedDocument, question: string, previous?: ExtractedDocument | null) {
  return [
    `Вопрос пользователя: ${question}`,
    `Текущий документ: ${current.name}`,
    trimForAi(current.text),
    previous ? `Предыдущая редакция: ${previous.name}\n${trimForAi(previous.text, 3500)}` : '',
  ].join('\n\n').trim();
}

function trimForAi(text: string, limit = 7500) {
  return text.length > limit ? `${text.slice(0, limit)}\n[Текст обрезан для AI-запроса]` : text;
}
