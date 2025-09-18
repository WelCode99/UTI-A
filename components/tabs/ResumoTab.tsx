
import React from 'react';
import type { Patient } from '../../types';
import { FormTextarea, FormGroup } from '../FormControls';
import { ScoreCard } from '../ScoreCard';

interface TabProps {
    patient: Patient;
    onUpdate: (data: Partial<Patient>) => void;
}

export const ResumoTab: React.FC<TabProps> = ({ patient, onUpdate }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScoreCard title="📋 História Clínica" className="h-fit">
                <FormGroup label="História Resumida">
                    <FormTextarea
                        id="history"
                        rows={8}
                        value={patient.history || ''}
                        onChange={(e) => onUpdate({ history: e.target.value })}
                        placeholder="Descreva a história clínica do paciente, diagnósticos prévios, procedimentos realizados..."
                    />
                </FormGroup>
            </ScoreCard>

            <ScoreCard title="🎯 Lista de Problemas" className="h-fit">
                <FormGroup label="Problemas Ativos">
                    <FormTextarea
                        id="problems"
                        rows={8}
                        value={patient.problems || ''}
                        onChange={(e) => onUpdate({ problems: e.target.value })}
                        placeholder="Liste os problemas ativos do paciente, priorizando por gravidade e importância clínica..."
                    />
                </FormGroup>
            </ScoreCard>

            <ScoreCard title="📊 Resumo de Indicadores" className="lg:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass-light p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-medical-info">
                            {patient.icuDay || 0}
                        </div>
                        <div className="text-sm text-secondary font-medium">Dia de UTI</div>
                    </div>
                    <div className="glass-light p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-medical-accent">
                            {patient.age || 0}
                        </div>
                        <div className="text-sm text-secondary font-medium">Anos</div>
                    </div>
                    <div className="glass-light p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-medical-primary">
                            {patient.bed || 'N/A'}
                        </div>
                        <div className="text-sm text-secondary font-medium">Leito</div>
                    </div>
                    <div className="glass-light p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-medical-secondary">
                            {patient.gender || 'N/A'}
                        </div>
                        <div className="text-sm text-secondary font-medium">Sexo</div>
                    </div>
                </div>
            </ScoreCard>
        </div>
    );
};
