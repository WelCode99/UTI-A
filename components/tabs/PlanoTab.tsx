
import React from 'react';
import type { Patient } from '../../types';
import { FormTextarea, FormGroup } from '../FormControls';
import { ScoreCard } from '../ScoreCard';

interface TabProps {
    patient: Patient;
    onUpdate: (data: Partial<Patient>) => void;
}

const placeholderText = `## PLANO TERAPÊUTICO

### 🧠 NEUROLÓGICO
- Avaliação de sedação/analgesia (meta RASS: _)
- Protocolo de delirium: CAM-ICU negativo
- Mobilização precoce

### ❤️ CARDIOVASCULAR
- Meta de PAM: ___ mmHg
- Controle de FC
- DVA: ___

### 🫁 RESPIRATÓRIO
- VM: Modo ___, PEEP ___, FiO2 ___
- Meta SpO2: ____%
- Desmame ventilatório: ___

### 🫘 RENAL/METABÓLICO
- Meta de diurese: ___ ml/h
- Balanço hídrico: ___
- Glicemia: meta ___

### 🦠 INFECCIOSO
- ATB atual: ___
- Culturas pendentes: ___
- Duração prevista: ___

## 📋 PENDÊNCIAS IMPORTANTES
- [ ]
- [ ]
- [ ] `;

export const PlanoTab: React.FC<TabProps> = ({ patient, onUpdate }) => {
    return (
        <ScoreCard title="📋 Plano Terapêutico Diário" className="max-w-full">
            <FormGroup label="Plano Estruturado por Sistemas">
                <FormTextarea
                    rows={20}
                    placeholder={placeholderText}
                    value={patient.plano || ''}
                    onChange={(e) => onUpdate({ plano: e.target.value })}
                    className="font-mono text-sm leading-relaxed"
                />
            </FormGroup>

            <div className="mt-6 p-4 bg-medical-info/10 border border-medical-info/30 rounded-xl">
                <h4 className="text-sm font-semibold text-medical-info mb-2">💡 Dicas para um Plano Efetivo</h4>
                <ul className="text-xs text-secondary space-y-1">
                    <li className="flex items-center">
                        <span className="text-medical-accent mr-2">•</span>
                        Use metas objetivas e mensuráveis
                    </li>
                    <li className="flex items-center">
                        <span className="text-medical-accent mr-2">•</span>
                        Priorize segurança e evidências científicas
                    </li>
                    <li className="flex items-center">
                        <span className="text-medical-accent mr-2">•</span>
                        Revise e ajuste conforme evolução clínica
                    </li>
                </ul>
            </div>
        </ScoreCard>
    );
};
