import type { EngineeringStage } from '../lib/engineeringStage';
import { useLanguage, type Language } from '../lib/language';
import type { VehicleDomain } from '../lib/vehicleDomain';
import './DomainContextPanel.css';

type Props = {
  stage: EngineeringStage;
  domain: VehicleDomain;
};

const text: Record<Language, Record<VehicleDomain, {
  title: string;
  body: Record<EngineeringStage, string>;
  standards: string;
}>> = {
  kk: {
    aviation: {
      title: 'Атмосфералық аппарат: ұшақ / БПЛА',
      body: {
        design: 'Есеп аэродинамикаға, қанат/винт жүктемесіне, желге, MTOW және энергия қоры бойынша ұшу миссиясына сүйенеді.',
        manufacturing: 'Материал мен жинақтау бағыты жеңіл авиациялық тораптарға, композит қанаттарға және БПЛА фюзеляжына бейімделеді.',
        operations: 'Телеметрия батарея, жел, қозғалтқыш температурасы, байланыс RSSI және RTH қауіпсіздігі бойынша бағаланады.',
      },
      standards: 'FAA Part 107, ICAO, ISO 9001/AS9100, ГОСТ авиациялық бақылау нормалары',
    },
    spacecraft: {
      title: 'Ғарыш аппараты: CubeSat / Satellite',
      body: {
        design: 'Есеп орбитаға, вакуумдағы жылу режиміне, күн панельдеріне, радиацияға және ұшыру жүктемесіне сүйенеді.',
        manufacturing: 'Материал мен процесс вакуумдық дегазация, радиациялық тұрақтылық және ғарыштық сапа бақылауына бейімделеді.',
        operations: 'Телеметрия орбиталық режим, қуат балансы, байланыс, термоцикл және ресурстық болжау бойынша талданады.',
      },
      standards: 'ECSS-E/ST, ECSS-Q-ST-70C, NASA-STD-5001, NASA technical standards',
    },
  },
  ru: {
    aviation: {
      title: 'Атмосферный аппарат: самолёт / БПЛА',
      body: {
        design: 'Расчёт опирается на аэродинамику, нагрузку на крыло/диск, ветер, MTOW и запас энергии для полётной миссии.',
        manufacturing: 'Материалы и сборка подбираются для лёгких авиационных узлов, композитных крыльев и фюзеляжа БПЛА.',
        operations: 'Телеметрия оценивает батарею, ветер, температуру двигателей, RSSI связи и безопасность аварийного возврата RTH.',
      },
      standards: 'FAA Part 107, ICAO, ISO 9001/AS9100, ГОСТ по авиационному контролю',
    },
    spacecraft: {
      title: 'Космический аппарат: CubeSat / Satellite',
      body: {
        design: 'Расчёт опирается на орбиту, терморегулирование в вакууме, солнечные панели, радиационную стойкость и пусковые нагрузки.',
        manufacturing: 'Материалы и процесс подбираются с учётом вакуумного дегазирования, радиации и космического контроля качества.',
        operations: 'Телеметрия анализирует орбитальный режим, энергобаланс, связь, термоциклирование и прогноз остаточного ресурса.',
      },
      standards: 'ECSS-E/ST, ECSS-Q-ST-70C, NASA-STD-5001, NASA technical standards',
    },
  },
  en: {
    aviation: {
      title: 'Atmospheric vehicle: aircraft / UAV',
      body: {
        design: 'The analysis uses aerodynamics, wing/disk loading, wind, MTOW, and energy reserve for the flight mission.',
        manufacturing: 'Materials and assembly are tuned for lightweight aircraft structures, composite wings, and UAV fuselage parts.',
        operations: 'Telemetry focuses on battery state, wind, motor temperature, link RSSI, and RTH safety.',
      },
      standards: 'FAA Part 107, ICAO, ISO 9001/AS9100, aviation inspection GOST references',
    },
    spacecraft: {
      title: 'Spacecraft: CubeSat / Satellite',
      body: {
        design: 'The analysis uses orbit class, vacuum thermal control, solar arrays, radiation tolerance, and launch loads.',
        manufacturing: 'Materials and process are tuned for vacuum outgassing, radiation, and space-grade quality control.',
        operations: 'Telemetry focuses on orbital mode, power balance, link status, thermal cycling, and remaining service life.',
      },
      standards: 'ECSS-E/ST, ECSS-Q-ST-70C, NASA-STD-5001, NASA technical standards',
    },
  },
};

export function DomainContextPanel({ stage, domain }: Props) {
  const { language } = useLanguage();
  const copy = text[language][domain];

  return (
    <section className="domain-context">
      <div>
        <p className="eyebrow">Vehicle Domain Logic</p>
        <h2>{copy.title}</h2>
        <p>{copy.body[stage]}</p>
      </div>
      <strong>{copy.standards}</strong>
    </section>
  );
}
