import type { Language } from './language';

export type AuthMode = 'login' | 'signup';

export const userGateText: Record<Language, {
  title: Record<AuthMode, string>;
  subtitle: Record<AuthMode, string>;
  name: string;
  surname: string;
  nickname: string;
  email: string;
  phone: string;
  password: string;
  signup: string;
  login: string;
  guest: string;
  google: string;
  divider: string;
  signupError: string;
  loginError: string;
  notRegistered: string;
  googleError: string;
  googleDisabled: string;
}> = {
  kk: {
    title: { login: 'Кіру', signup: 'Тіркелу' },
    subtitle: { login: 'Аккаунтыңыз болса, email және құпиясөз енгізіңіз.', signup: 'Vectori профилін жасау үшін деректерді толтырыңыз.' },
    name: 'Аты', surname: 'Тегі', nickname: 'Ник', email: 'Email', phone: 'Телефон, міндетті емес', password: 'Құпиясөз',
    signup: 'Тіркелу', login: 'Кіру', guest: 'Қонақ ретінде кіру', google: 'Google арқылы кіру', divider: 'немесе',
    signupError: 'Аты, тегі, email, ник және кемінде 6 таңбалы құпиясөз енгізіңіз.',
    loginError: 'Email және кемінде 6 таңбалы құпиясөз енгізіңіз.',
    notRegistered: 'АККАУНТ ТІРКЕЛМЕГЕН',
    googleError: 'Supabase бапталмаған немесе Google Provider қосылмаған.',
    googleDisabled: 'Supabase ішінде Google Provider қосылмаған.',
  },
  ru: {
    title: { login: 'Вход', signup: 'Регистрация' },
    subtitle: { login: 'Если аккаунт уже есть, введите email и пароль.', signup: 'Заполните данные, чтобы создать профиль Vectori.' },
    name: 'Имя', surname: 'Фамилия', nickname: 'Ник', email: 'Email', phone: 'Номер телефона, не обязательно', password: 'Пароль',
    signup: 'Зарегистрироваться', login: 'Войти', guest: 'Войти как гость', google: 'Войти через Google', divider: 'или',
    signupError: 'Заполните имя, фамилию, email, ник и пароль минимум 6 символов.',
    loginError: 'Введите email и пароль минимум 6 символов.',
    notRegistered: 'АККАУНТ НЕ ЗАРЕГАН',
    googleError: 'Supabase не настроен или Google Provider ещё не включён.',
    googleDisabled: 'В Supabase ещё не включён Google Provider.',
  },
  en: {
    title: { login: 'Log In', signup: 'Sign Up' },
    subtitle: { login: 'If you already have an account, enter email and password.', signup: 'Fill in your details to create a Vectori profile.' },
    name: 'Name', surname: 'Surname', nickname: 'Nickname', email: 'Email', phone: 'Phone number, optional', password: 'Password',
    signup: 'Sign up', login: 'Log in', guest: 'Continue as guest', google: 'Continue with Google', divider: 'or',
    signupError: 'Fill in name, surname, email, nickname, and a password of at least 6 characters.',
    loginError: 'Enter email and a password of at least 6 characters.',
    notRegistered: 'ACCOUNT IS NOT REGISTERED',
    googleError: 'Supabase is not configured or Google Provider is not enabled yet.',
    googleDisabled: 'Google Provider is not enabled in Supabase yet.',
  },
};
