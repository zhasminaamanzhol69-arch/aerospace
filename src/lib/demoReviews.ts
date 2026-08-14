import type { Language } from './language';

export type DemoReview = {
  name: string;
  rating: number;
  comment: string;
};

export const demoReviews: Record<Language, DemoReview[]> = {
  kk: [
    { name: 'Аружан', rating: 5, comment: 'AI есебі миссия параметрлерін тез түсінуге көмектесті.' },
    { name: 'Данияр', rating: 4, comment: 'Дрон түрлері бөлімі ұнады, бәрі нақты және көрнекі.' },
    { name: 'Мадина', rating: 5, comment: 'Құжат талдау функциясы оқу жобасына пайдалы болды.' },
    { name: 'Ерасыл', rating: 5, comment: 'Интерфейс таза, инженерлік есептер қызық жасалған.' },
    { name: 'Айша', rating: 4, comment: 'FAQ пен Pro бөлімдері жобаның идеясын жақсы ашады.' },
    { name: 'Нұрбек', rating: 5, comment: 'Ғарыш аппараттары беті өте пайдалы және әдемі.' },
    { name: 'Санжар', rating: 4, comment: 'Профиль мен пікір қосу бөлімі ыңғайлы жасалған.' },
    { name: 'Ләйлә', rating: 5, comment: 'Жоба оқу үшін де, презентация үшін де мықты көрінеді.' },
    { name: 'Әлихан', rating: 5, comment: 'Digital Twin блогы ерекше ұнады.' },
    { name: 'Камила', rating: 4, comment: 'Түсінікті мәтіндер және жақсы құрылым.' },
  ],
  ru: [
    { name: 'Алина', rating: 5, comment: 'Очень удобно смотреть расчёты миссии и рекомендации AI.' },
    { name: 'Марк', rating: 4, comment: 'Понравился блок про дроны и понятные инженерные параметры.' },
    { name: 'София', rating: 5, comment: 'Pro-блок выглядит серьёзно, будто настоящий инженерный сервис.' },
    { name: 'Тимур', rating: 5, comment: 'Классно, что есть документы, профиль и оценки проекта.' },
    { name: 'Диана', rating: 4, comment: 'Отзывы и FAQ делают страницу более живой.' },
    { name: 'Арсен', rating: 5, comment: 'Калькулятор миссии выглядит реально полезным.' },
    { name: 'Ева', rating: 5, comment: 'Очень нравится, что можно выбрать направление: дроны или космос.' },
    { name: 'Никита', rating: 4, comment: 'Хороший учебный проект с понятной навигацией.' },
    { name: 'Милана', rating: 5, comment: 'Профиль, аватар и подписка смотрятся как в настоящем продукте.' },
    { name: 'Илья', rating: 4, comment: 'AI-отчёт помогает быстро понять слабые места миссии.' },
  ],
  en: [
    { name: 'Mia', rating: 5, comment: 'The mission calculations are clear and easy to scan.' },
    { name: 'Leo', rating: 4, comment: 'Drone scenarios and AI recommendations feel useful.' },
    { name: 'Sara', rating: 5, comment: 'The document analysis section makes the project feel real.' },
    { name: 'Daniel', rating: 5, comment: 'Clean interface with strong aerospace details.' },
    { name: 'Emma', rating: 4, comment: 'The reviews and FAQ make the page feel more complete.' },
    { name: 'Noah', rating: 5, comment: 'The spacecraft section has a strong project vibe.' },
    { name: 'Olivia', rating: 5, comment: 'Profile, avatar, and plans are nicely connected.' },
    { name: 'Adam', rating: 4, comment: 'The mission form is detailed but still easy to use.' },
    { name: 'Sofia', rating: 5, comment: 'AI reports make the engineering flow much clearer.' },
    { name: 'Max', rating: 4, comment: 'Good balance between visuals and technical content.' },
  ],
};
