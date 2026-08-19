import type { CalculatedParameters, DesignOption, MissionRequirements } from '../lib/aerospace';
import type { EngineeringStage } from '../lib/engineeringStage';
import { AiEngineeringReport } from './AiEngineeringReport';
import { CalculatedParametersPanel } from './CalculatedParametersPanel';
import { DesignRecommendation } from './DesignRecommendation';
import { DigitalTwinPanel } from './DigitalTwinPanel';
import { MissionInputForm } from './MissionInputForm';
import { StageTabs } from './StageTabs';

type Props = {
  options: DesignOption[];
  parameters: CalculatedParameters;
  requirements: MissionRequirements;
  stage: EngineeringStage;
  onRequirementsChange: (requirements: MissionRequirements) => void;
  onStageChange: (stage: EngineeringStage) => void;
};

export function MainEngineeringWorkspace({ options, parameters, requirements, stage, onRequirementsChange, onStageChange }: Props) {
  return (
    <>
      <StageTabs value={stage} onChange={onStageChange} />

      <section className="mission-grid">
        <MissionInputForm stage={stage} requirements={requirements} onChange={onRequirementsChange} />
        <CalculatedParametersPanel stage={stage} parameters={parameters} requirements={requirements} />
      </section>

      {stage === 'operations' ? (
        <section className="mission-grid" id="ai-agent">
          <DigitalTwinPanel parameters={parameters} requirements={requirements} />
          <AiEngineeringReport stage={stage} requirements={requirements} parameters={parameters} options={options} />
        </section>
      ) : (
        <section className="mission-grid" id="ai-agent">
          <DesignRecommendation stage={stage} options={options} requirements={requirements} />
          <AiEngineeringReport stage={stage} requirements={requirements} parameters={parameters} options={options} />
        </section>
      )}
    </>
  );
}
