
import React from 'react';
import type { Patient } from '../../types';
import { FormTextarea, FormGroup } from '../FormControls';
import { ScoreCard } from '../ScoreCard';

interface TabProps {
    patient: Patient;
    onUpdate: (data: Partial<Patient>) => void;
}

const SystemCard: React.FC<{
    id: keyof Patient,
    label: string,
    icon: string,
    value: string,
    onUpdate: (data: Partial<Patient>) => void,
    placeholder: string
}> = ({ id, label, icon, value, onUpdate, placeholder }) => (
    <ScoreCard title={`${icon} ${label}`} className="h-fit">
        <FormGroup label="Avaliação do Sistema">
            <FormTextarea
                id={id}
                rows={4}
                value={value || ''}
                onChange={(e) => onUpdate({ [id]: e.target.value })}
                placeholder={placeholder}
            />
        </FormGroup>
    </ScoreCard>
);

export const SistemasTab: React.FC<TabProps> = ({ patient, onUpdate }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemCard
                id="neuro"
                label="Neurológico"
                icon="🧠"
                value={patient.neuro}
                onUpdate={onUpdate}
                placeholder="Avalie: Glasgow, pupilas, reflexos, sedação, delirium, movimentos involuntários..."
            />
            <SystemCard
                id="cardio"
                label="Cardiovascular"
                icon="❤️"
                value={patient.cardio}
                onUpdate={onUpdate}
                placeholder="Avalie: PA, FC, ritmo, perfusão, edema, uso de DVA, ECG..."
            />
            <SystemCard
                id="resp"
                label="Respiratório"
                icon="🫁"
                value={patient.resp}
                onUpdate={onUpdate}
                placeholder="Avalie: padrão respiratório, ausculta, VM, PEEP, FiO2, secreções..."
            />
            <SystemCard
                id="renal"
                label="Renal / Metabólico"
                icon="🫘"
                value={patient.renal}
                onUpdate={onUpdate}
                placeholder="Avalie: diurese, creatinina, ureia, eletrólitos, equilíbrio ácido-base..."
            />
        </div>
    );
};
