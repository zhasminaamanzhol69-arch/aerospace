import type { ReactNode } from 'react';
import type { MissionRequirements } from '../lib/aerospace';
import type { EngineeringStage } from '../lib/engineeringStage';
import { getMissionInputFields } from '../lib/missionInputFields';
import {
  inputNumberFields,
  missionInputText,
  type MissionInputCopy,
} from '../lib/missionInputText';
import { useLanguage } from '../lib/language';

type Props = {
  stage: EngineeringStage;
  requirements: MissionRequirements;
  onChange: (next: MissionRequirements) => void;
};

export function MissionInputForm({ stage, requirements, onChange }: Props) {
  const { language } = useLanguage();
  const copy = missionInputText[language];

  function updateNumber(field: (typeof inputNumberFields)[number], value: string) {
    onChange({ ...requirements, [field]: Number(value) });
  }

  function updateText(field: keyof MissionRequirements, value: string) {
    onChange({ ...requirements, [field]: value });
  }

  return (
    <section className="card mission-card">
      <p className="eyebrow">Mission Requirements</p>
      <h2>{copy.title}</h2>
      <div className="field-grid">
        {getMissionInputFields(stage, requirements.vehicleDomain).map((field) => (
          <label className="field" key={field}>
            <span>{copy.labels[field]}</span>
            <input
              min="0"
              step="0.1"
              type="number"
              value={requirements[field]}
              onChange={(event) => updateNumber(field, event.target.value)}
            />
          </label>
        ))}
        {stage === 'design' && (
          requirements.vehicleDomain === 'spacecraft' ? (
            <>
              <SelectField label={copy.scheme} value={requirements.vehicleScheme} onChange={(value) => updateText('vehicleScheme', value)}>
                <option value="cubesat-satellite">{copy.options['cubesat-satellite']}</option>
              </SelectField>
              <SelectField label={copy.orbit} value={requirements.orbitClass} onChange={(value) => updateText('orbitClass', value)}>
                <option value="leo">{copy.options.leo}</option>
                <option value="sso">{copy.options.sso}</option>
                <option value="geo">{copy.options.geo}</option>
              </SelectField>
              <SelectField label={copy.thermal} value={requirements.thermalControl} onChange={(value) => updateText('thermalControl', value)}>
                <option value="passive">{copy.options.passive}</option>
                <option value="active">{copy.options.active}</option>
              </SelectField>
            </>
          ) : (
            <SelectField label={copy.scheme} value={requirements.vehicleScheme} onChange={(value) => updateText('vehicleScheme', value)}>
              <option value="fixed-wing">{copy.options['fixed-wing']}</option>
              <option value="multirotor">{copy.options.multirotor}</option>
              <option value="hybrid-vtol">{copy.options['hybrid-vtol']}</option>
            </SelectField>
          )
        )}
        {stage === 'manufacturing' && (
          <>
            <MaterialSelect copy={copy} value={requirements.material} onChange={(value) => updateText('material', value)} />
            <SelectField label={copy.method} value={requirements.manufacturingMethod} onChange={(value) => updateText('manufacturingMethod', value)}>
              <option value="cnc">{copy.options.cnc}</option>
              <option value="autoclave">{copy.options.autoclave}</option>
              <option value="vacuum-infusion">{copy.options['vacuum-infusion']}</option>
              <option value="additive-polymer">{copy.options['additive-polymer']}</option>
              <option value="dmls">{copy.options.dmls}</option>
            </SelectField>
            <SelectField label={copy.joint} value={requirements.jointMethod} onChange={(value) => updateText('jointMethod', value)}>
              <option value="riveting">{copy.options.riveting}</option>
              <option value="welding">{copy.options.welding}</option>
              <option value="laser-welding">{copy.options['laser-welding']}</option>
              <option value="tig-welding">{copy.options['tig-welding']}</option>
              <option value="friction-welding">{copy.options['friction-welding']}</option>
              <option value="adhesive">{copy.options.adhesive}</option>
            </SelectField>
            <SelectField label={copy.scale} value={requirements.productionScale} onChange={(value) => updateText('productionScale', value)}>
              <option value="prototype">{copy.options.prototype}</option>
              <option value="small-batch">{copy.options['small-batch']}</option>
              <option value="serial">{copy.options.serial}</option>
            </SelectField>
          </>
        )}
        {stage === 'operations' && (
          <>
            <EnvironmentSelect
              copy={copy}
              domain={requirements.vehicleDomain}
              value={requirements.environment}
              onChange={(value) => updateText('environment', value)}
            />
            <SelectField label={copy.missionMode} value={requirements.missionMode} onChange={(value) => updateText('missionMode', value)}>
              {requirements.vehicleDomain === 'spacecraft' ? (
                <option value="orbital">{copy.options.orbital}</option>
              ) : (
                <>
                  <option value="waypoint">{copy.options.waypoint}</option>
                  <option value="fpv">{copy.options.fpv}</option>
                </>
              )}
            </SelectField>
            <SelectField label={copy.checkType} value={requirements.checkType} onChange={(value) => updateText('checkType', value)}>
              <option value="regular">{copy.options.regular}</option>
              <option value="hard-landing">{copy.options['hard-landing']}</option>
              <option value="preflight">{copy.options.preflight}</option>
            </SelectField>
          </>
        )}
      </div>
    </section>
  );
}

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}

function MaterialSelect({ copy, value, onChange }: { copy: MissionInputCopy; value: string; onChange: (value: string) => void }) {
  return (
    <SelectField label={copy.material} value={value} onChange={onChange}>
      <option value="carbon">{copy.options.carbon}</option>
      <option value="aluminum-2024">{copy.options['aluminum-2024']}</option>
      <option value="aluminum-7075">{copy.options['aluminum-7075']}</option>
      <option value="titanium">{copy.options.titanium}</option>
      <option value="petg">{copy.options.petg}</option>
      <option value="pa12">{copy.options.pa12}</option>
      <option value="dmls-metal">{copy.options['dmls-metal']}</option>
    </SelectField>
  );
}

function EnvironmentSelect({
  copy,
  domain,
  value,
  onChange,
}: {
  copy: MissionInputCopy;
  domain: MissionRequirements['vehicleDomain'];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <SelectField label={copy.environment} value={value} onChange={onChange}>
      {domain === 'spacecraft' ? (
        <>
          <option value="space">{copy.options.space}</option>
          <option value="cold">{copy.options.cold}</option>
        </>
      ) : (
        <>
          <option value="normal">{copy.options.normal}</option>
          <option value="cold">{copy.options.cold}</option>
          <option value="wind">{copy.options.wind}</option>
        </>
      )}
    </SelectField>
  );
}
