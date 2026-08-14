import type { ProfileAvatarLabels } from '../components/ProfileAvatarUploader';
import type { ProfileDetailsLabels } from '../components/ProfileDetailsForm';
import type { ProfilePasswordLabels } from '../components/ProfilePasswordForm';
import type { ProfileSubscriptionLabels } from '../components/ProfileSubscriptionCard';
import type { Language } from './language';

type ProfilePageText = {
  title: string;
  subtitle: string;
  back: string;
  saved: string;
  avatar: ProfileAvatarLabels;
  details: ProfileDetailsLabels;
  password: ProfilePasswordLabels;
  subscription: ProfileSubscriptionLabels;
};

export const profilePageText: Record<Language, ProfilePageText> = {
  kk: {
    title: 'Менің профилім',
    subtitle: 'Фото, атыңыз, ник, пароль және жазылым түрі осы жерде.',
    back: 'Басты бетке',
    saved: 'Сақталды',
    avatar: { upload: 'Фото қосу', error: 'Фото жүктелмеді.' },
    details: { name: 'Аты', surname: 'Тегі', nickname: 'Ник', phone: 'Телефон', save: 'Сақтау' },
    password: {
      change: 'Парольді өзгерту',
      forgot: 'Парольді ұмыттыңыз ба?',
      restoreEmail: 'Email арқылы қалпына келтіру',
      restorePhone: 'Телефон арқылы қалпына келтіру',
      current: 'Қазіргі пароль',
      next: 'Жаңа пароль',
      repeat: 'Жаңа парольді қайталау',
      save: 'Сақтау',
      locked: 'Парольді тек email арқылы кірген аккаунтта өзгертуге болады.',
      mismatch: 'Жаңа парольдер сәйкес емес.',
      short: 'Пароль кемінде 6 таңба болуы керек.',
      success: 'Пароль өзгертілді.',
      codeEmailSent: 'Қалпына келтіру коды email-ге жіберілді.',
      codePhoneSent: 'Қалпына келтіру коды телефонға жіберілді.',
      noEmail: 'Профильде email жоқ.',
      noPhone: 'Профильде телефон нөмірі жоқ.',
    },
    subscription: { title: 'Жазылым', free: 'Free', trial: 'Trial', pro: 'Pro', note: 'Қазір белсенді тариф осы жерде көрсетіледі.' },
  },
  ru: {
    title: 'Мой профиль',
    subtitle: 'Здесь можно добавить фото, изменить данные, пароль и посмотреть подписку.',
    back: 'На главную',
    saved: 'Сохранено',
    avatar: { upload: 'Добавить фото', error: 'Не получилось загрузить фото.' },
    details: { name: 'Имя', surname: 'Фамилия', nickname: 'Ник', phone: 'Телефон', save: 'Сохранить' },
    password: {
      change: 'Изменить пароль',
      forgot: 'Забыли пароль?',
      restoreEmail: 'Восстановить через email',
      restorePhone: 'Восстановить через телефон',
      current: 'Прежний пароль',
      next: 'Новый пароль',
      repeat: 'Повтори новый пароль',
      save: 'Сохранить пароль',
      locked: 'Пароль можно менять только у аккаунта с email и паролем.',
      mismatch: 'Новые пароли не совпадают.',
      short: 'Пароль должен быть не короче 6 символов.',
      success: 'Пароль изменён.',
      codeEmailSent: 'Код восстановления якобы отправлен на email.',
      codePhoneSent: 'Код восстановления якобы отправлен на телефон.',
      noEmail: 'В профиле нет email.',
      noPhone: 'В профиле нет телефона.',
    },
    subscription: { title: 'Подписка', free: 'Бесплатная версия', trial: 'Trial', pro: 'Pro', note: 'Активный тариф показывается здесь.' },
  },
  en: {
    title: 'My Profile',
    subtitle: 'Add a photo, update account details, change password, and view the subscription.',
    back: 'Back home',
    saved: 'Saved',
    avatar: { upload: 'Add photo', error: 'Could not upload photo.' },
    details: { name: 'Name', surname: 'Surname', nickname: 'Nickname', phone: 'Phone', save: 'Save' },
    password: {
      change: 'Change password',
      forgot: 'Forgot password?',
      restoreEmail: 'Recover by email',
      restorePhone: 'Recover by phone',
      current: 'Current password',
      next: 'New password',
      repeat: 'Repeat new password',
      save: 'Save password',
      locked: 'Password changes are available only for email accounts.',
      mismatch: 'New passwords do not match.',
      short: 'Password must be at least 6 characters.',
      success: 'Password changed.',
      codeEmailSent: 'Recovery code was sent to your email.',
      codePhoneSent: 'Recovery code was sent to your phone.',
      noEmail: 'There is no email in this profile.',
      noPhone: 'There is no phone number in this profile.',
    },
    subscription: { title: 'Subscription', free: 'Free plan', trial: 'Trial', pro: 'Pro', note: 'Your active plan is shown here.' },
  },
};
