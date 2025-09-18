
import React, { useMemo } from 'react';
import type { Patient } from '../../types';
import { FormTextarea, FormInput, FormGroup } from '../FormControls';
import { ScoreCard, ResultDisplay, MetricDisplay } from '../ScoreCard';

interface TabProps {
    patient: Patient;
    onUpdate: (data: Partial<Patient>) => void;
}

export const BalancoTab: React.FC<TabProps> = ({ patient, onUpdate }) => {
    const { totalBalance24h, entradas, saidas } = useMemo(() => {
        const sum = (text: string) => (text?.match(/[\d.]+/g) || []).reduce((a: number, b: string) => a + parseFloat(b), 0);
        const entradas = sum(patient.balanco_entradas || '');
        const saidas = sum(patient.balanco_saidas || '');
        return {
            entradas,
            saidas,
            totalBalance24h: entradas - saidas
        };
    }, [patient.balanco_entradas, patient.balanco_saidas]);

    const getBalanceColor = (balance: number) => {
        if (Math.abs(balance) < 500) return 'success';
        if (Math.abs(balance) < 1000) return 'warning';
        return 'danger';
    };

    const getBalanceTrend = (balance: number) => {
        if (balance > 100) return 'up';
        if (balance < -100) return 'down';
        return 'stable';
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricDisplay
                    label="Entradas 24h"
                    value={entradas.toFixed(0)}
                    unit="ml"
                    trend="up"
                />
                <MetricDisplay
                    label="Saídas 24h"
                    value={saidas.toFixed(0)}
                    unit="ml"
                    trend="down"
                />
                <MetricDisplay
                    label="Balanço 24h"
                    value={totalBalance24h.toFixed(0)}
                    unit="ml"
                    trend={getBalanceTrend(totalBalance24h)}
                />
                <div className="glass-light p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-secondary font-medium">Balanço Acumulado</span>
                    </div>
                    <div className="mt-1">
                        <FormInput
                            className="text-lg font-bold text-center h-8 bg-transparent border-none p-0 text-medical-info"
                            value={patient.balanco_acumulado || ''}
                            onChange={e => onUpdate({ balanco_acumulado: e.target.value })}
                            placeholder="0 ml"
                        />
                    </div>
                </div>
            </div>

            {/* Balance Result Display */}
            <ScoreCard title="📊 Resultado do Balanço Hídrico">
                <div className="text-center">
                    <ResultDisplay
                        label="Balanço Total em 24 horas"
                        value={totalBalance24h.toFixed(0)}
                        unit="ml"
                        color={getBalanceColor(totalBalance24h)}
                    />
                    <div className="mt-4 text-sm text-secondary">
                        {totalBalance24h > 0 ? (
                            <span className="text-medical-info">🔄 Balanço positivo - Retenção hídrica</span>
                        ) : totalBalance24h < 0 ? (
                            <span className="text-medical-accent">📉 Balanço negativo - Perda hídrica</span>
                        ) : (
                            <span className="text-medical-success">⚖️ Balanço equilibrado</span>
                        )}
                    </div>
                </div>
            </ScoreCard>

            {/* Input/Output Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScoreCard title="💧 Entradas" className="h-fit">
                    <FormGroup label="Registrar Entradas (em ml)">
                        <FormTextarea
                            rows={8}
                            value={patient.balanco_entradas || ''}
                            onChange={e => onUpdate({ balanco_entradas: e.target.value })}
                            placeholder="Exemplo:
SF 0,9% - 500ml
NaCl 20% - 250ml
Dieta enteral - 300ml
Medicações - 150ml"
                        />
                    </FormGroup>
                    <div className="mt-3 p-3 bg-medical-success/10 border border-medical-success/30 rounded-lg">
                        <div className="text-sm font-semibold text-medical-success">
                            Total de Entradas: {entradas.toFixed(0)} ml
                        </div>
                    </div>
                </ScoreCard>

                <ScoreCard title="🚰 Saídas" className="h-fit">
                    <FormGroup label="Registrar Saídas (em ml)">
                        <FormTextarea
                            rows={8}
                            value={patient.balanco_saidas || ''}
                            onChange={e => onUpdate({ balanco_saidas: e.target.value })}
                            placeholder="Exemplo:
Diurese espontânea - 800ml
Perdas GI - 100ml
Dreno - 50ml
Perdas insensíveis - 500ml"
                        />
                    </FormGroup>
                    <div className="mt-3 p-3 bg-medical-info/10 border border-medical-info/30 rounded-lg">
                        <div className="text-sm font-semibold text-medical-info">
                            Total de Saídas: {saidas.toFixed(0)} ml
                        </div>
                    </div>
                </ScoreCard>
            </div>

            {/* Clinical Guidelines */}
            <ScoreCard title="📚 Orientações Clínicas" className="bg-medical-primary/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-semibold text-medical-accent mb-2">🎯 Metas de Balanço</h4>
                        <ul className="space-y-1 text-secondary">
                            <li>• Paciente estável: -500 a +500 ml/dia</li>
                            <li>• Sobrecarga hídrica: meta negativa</li>
                            <li>• Choque/desidratação: meta positiva</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-medical-warning mb-2">⚠️ Alertas Importantes</h4>
                        <ul className="space-y-1 text-secondary">
                            <li>• Balanço maior que 1000ml: risco de edema</li>
                            <li>• Balanço menor que -1000ml: risco de hipovolemia</li>
                            <li>• Monitorar peso e sinais vitais</li>
                        </ul>
                    </div>
                </div>
            </ScoreCard>
        </div>
    );
};
