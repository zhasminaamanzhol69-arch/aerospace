import type { Language } from './language';

export const reviewsText: Record<Language, {
  eyebrow: string;
  title: string;
  subtitle: string;
  comment: string;
  submit: string;
  empty: string;
  otherTitle: string;
  login: string;
  guest: string;
  success: string;
  short: string;
}> = {
  kk: {
    eyebrow: 'Пікірлер',
    title: 'Өз пікіріңізді қалдырыңыз',
    subtitle: 'Жұлдызбен бағалап, қысқа комментарий жазыңыз.',
    comment: 'Комментарий',
    submit: 'Пікір қосу',
    empty: 'Әзірге пікір жоқ.',
    otherTitle: 'Басқа қолданушылардың пікірлері',
    login: 'Пікір қалдыру үшін email немесе Google арқылы кіріңіз.',
    guest: 'Сіз қонақ ретінде кірдіңіз. Пікір қалдыру үшін тіркеліңіз немесе аккаунтқа кіріңіз.',
    success: 'Пікір қосылды.',
    short: 'Комментарий кемінде 2 таңба болуы керек.',
  },
  ru: {
    eyebrow: 'Отзывы',
    title: 'Оцените проект',
    subtitle: 'Поставьте звёзды и добавьте короткий комментарий.',
    comment: 'Комментарий',
    submit: 'Добавить отзыв',
    empty: 'Пока отзывов нет.',
    otherTitle: 'Отзывы других пользователей',
    login: 'Чтобы оставить отзыв, войдите через email или Google.',
    guest: 'Вы зашли как гость. Зарегистрируйтесь или войдите в аккаунт, чтобы оставить отзыв.',
    success: 'Отзыв добавлен.',
    short: 'Комментарий должен быть минимум 2 символа.',
  },
  en: {
    eyebrow: 'Reviews',
    title: 'Rate the project',
    subtitle: 'Choose stars and add a short comment.',
    comment: 'Comment',
    submit: 'Add review',
    empty: 'No reviews yet.',
    otherTitle: 'Reviews from other users',
    login: 'Sign in with email or Google to leave a review.',
    guest: 'You are browsing as a guest. Register or sign in to leave a review.',
    success: 'Review added.',
    short: 'Comment must be at least 2 characters.',
  },
};
