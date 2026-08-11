type Plan = {
  id: string;
  title: string;
  price: string;
  period: string;
  hasBonus: boolean;
};

type Props = {
  bonus: string;
  label: string;
  selectedPlan: string;
  trial: string;
  onChange: (plan: string) => void;
};

const plans: Plan[] = [
  { id: 'trial', title: 'Trial', price: '$0', period: '3 days', hasBonus: false },
  { id: 'month', title: '1 month', price: '$3', period: '1 month', hasBonus: false },
  { id: 'quarter', title: '3 months', price: '$8', period: '3 months', hasBonus: false },
  { id: 'half-year', title: '6 months', price: '$16.5', period: '6 months', hasBonus: true },
  { id: 'year', title: '1 year', price: '$30', period: '12 months', hasBonus: true },
];

export function ProPlans({ bonus, label, selectedPlan, trial, onChange }: Props) {
  return (
    <div className="pro-plans">
      <span>{label}</span>
      <div className="pro-plans__grid">
        {plans.map((plan) => (
          <button
            className={selectedPlan === plan.id ? 'is-selected' : ''}
            key={plan.id}
            onClick={() => onChange(plan.id)}
            type="button"
          >
            <strong>{plan.id === 'trial' ? trial : plan.title}</strong>
            <b>{plan.price}</b>
            <small>{plan.period}</small>
            {plan.hasBonus && <em>{bonus}</em>}
          </button>
        ))}
      </div>
    </div>
  );
}
