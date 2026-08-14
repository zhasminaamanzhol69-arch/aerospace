import type { SubscriptionPlan } from '../lib/userProfile';

export type ProfileSubscriptionLabels = Record<SubscriptionPlan, string> & {
  title: string;
  note: string;
};

type Props = {
  labels: ProfileSubscriptionLabels;
  plan: SubscriptionPlan;
};

export function ProfileSubscriptionCard({ labels, plan }: Props) {
  return (
    <section className="profile-card profile-card--subscription">
      <span>{labels.title}</span>
      <strong>{labels[plan]}</strong>
      <p>{labels.note}</p>
    </section>
  );
}
