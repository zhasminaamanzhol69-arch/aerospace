import { useState } from 'react';
import { ProPlans } from './ProPlans';
import { useLanguage, type Language } from '../lib/language';
import './ProPlans.css';

type Props = {
  title: string;
  subtitle: string;
  items: string[];
  note: string;
};

const text: Record<Language, {
  buy: string;
  checkoutTitle: string;
  name: string;
  email: string;
  phone: string;
  demoWarning: string;
  submit: string;
  close: string;
  planTitle: string;
  trial: string;
  bonus: string;
}> = {
  kk: {
    buy: 'Pro сатып алу',
    checkoutTitle: 'Pro тіркеу',
    name: 'Аты-жөні',
    email: 'Email',
    phone: 'Телефон нөмірі',
    demoWarning: 'Демо режим: өтініш сақталмайды және төлем алынбайды.',
    submit: 'Pro-ға өтініш жіберу',
    close: 'Жабу',
    planTitle: 'Тариф таңдаңыз',
    trial: '3 күн тегін сынау',
    bonus: '+1 апта сыйлық',
  },
  ru: {
    buy: 'Купить Pro',
    checkoutTitle: 'Регистрация Pro',
    name: 'Имя',
    email: 'Email',
    phone: 'Номер телефона',
    demoWarning: 'Демо-режим: заявка не сохраняется и оплата не списывается.',
    submit: 'Отправить заявку на Pro',
    close: 'Закрыть',
    planTitle: 'Выберите подписку',
    trial: '3 дня бесплатно',
    bonus: '+1 неделя в подарок',
  },
  en: {
    buy: 'Buy Pro',
    checkoutTitle: 'Pro registration',
    name: 'Name',
    email: 'Email',
    phone: 'Phone number',
    demoWarning: 'Demo mode: the request is not saved and no payment is charged.',
    submit: 'Submit Pro request',
    close: 'Close',
    planTitle: 'Choose a plan',
    trial: '3-day free trial',
    bonus: '+1 bonus week',
  },
};

export function ProContent({ title, subtitle, items, note }: Props) {
  const { language } = useLanguage();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('trial');
  const copy = text[language];

  return (
    <div className="pro-content">
      <div className="pro-content__header">
        <div>
          <p className="eyebrow">Paid Content</p>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <button type="button" onClick={() => setIsCheckoutOpen(true)}>
          {copy.buy}
        </button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="pro-content__note">{note}</p>
      {isCheckoutOpen && (
        <div className="pro-modal" role="dialog" aria-modal="true" aria-labelledby="pro-checkout-title">
          <div className="pro-modal__panel">
            <div className="pro-modal__header">
              <div className="pro-modal__icon" aria-hidden="true">PRO</div>
              <div>
                <p className="eyebrow">Paid Content</p>
                <h4 id="pro-checkout-title">{copy.checkoutTitle}</h4>
              </div>
              <button
                className="ghost small pro-modal__close"
                onClick={() => setIsCheckoutOpen(false)}
                type="button"
              >
                {copy.close}
              </button>
            </div>
            <form className="pro-checkout">
              <ProPlans
                bonus={copy.bonus}
                label={copy.planTitle}
                selectedPlan={selectedPlan}
                trial={copy.trial}
                onChange={setSelectedPlan}
              />
              <label>
                <span>{copy.name}</span>
                <input placeholder="Aerospace Student" type="text" />
              </label>
              <label>
                <span>{copy.email}</span>
                <input placeholder="student@example.com" type="email" />
              </label>
              <label>
                <span>{copy.phone}</span>
                <input inputMode="tel" placeholder="+7 700 000 00 00" type="tel" />
              </label>
              <p>{copy.demoWarning}</p>
              <button type="button">{copy.submit}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
