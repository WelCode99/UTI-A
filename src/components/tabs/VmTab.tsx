
import React, { useMemo } from 'react';
import type { Patient } from '../../types';
import { FormInput, FormSelect } from '../FormControls';
import { ScoreCard, ResultDisplay } from '../ScoreCard';

interface TabProps {
    patient: Patient;
    onUpdate: (data: Partial<Patient>) => void;
}

// FIX: Changed id from `keyof Patient` to `string` to allow non-patient keys for calculated fields.
const VmInput: React.FC<{ label: string, id: string, value: any, onUpdate: any, type?: string, disabled?: boolean }> = ({ label, id, value, onUpdate, type = 'text', disabled = false }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <FormInput 
            id={id}
            type={type}
            value={value || ''}
            onChange={(e) => onUpdate({ [id]: e.target.value })}
            className="mt-1"
            disabled={disabled}
        />
    </div>
);

export const VmTab: React.FC<TabProps> = ({ patient, onUpdate }) => {
    const p = {
        vm_vc: parseFloat(String(patient.vm_vc)) || 0,
        vm_fr: parseFloat(String(patient.vm_fr)) || 0,
        vm_peep: parseFloat(String(patient.vm_peep)) || 0,
        vm_pip: parseFloat(String(patient.vm_pip)) || 0,
        vm_plato: parseFloat(String(patient.vm_plato)) || 0,
        vm_fio2: parseFloat(String(patient.vm_fio2)) || 0,
        ibw_altura: parseFloat(String(patient.ibw_altura)) || 0,
        pf_pao2: parseFloat(String(patient.pf_pao2)) || 0,
        pf_fio2: parseFloat(String(patient.pf_fio2)) || 0,
        raw_fluxo: parseFloat(String(patient.raw_fluxo)) || 0,
        oi_pma: parseFloat(String(patient.oi_pma)) || 0,
    };
    
    const drivingPressure = useMemo(() => p.vm_plato > p.vm_peep ? p.vm_plato - p.vm_peep : 0, [p.vm_plato, p.vm_peep]);
    
    const ibw = useMemo(() => {
        if (p.ibw_altura > 152.4) {
            return (patient.ibw_sexo === 'M' ? 50 : 45.5) + 0.91 * (p.ibw_altura - 152.4);
        }
        return 0;
    }, [p.ibw_altura, patient.ibw_sexo]);

    const pfRatio = useMemo(() => {
        const fio2 = p.pf_fio2 || p.vm_fio2;
        if (p.pf_pao2 > 0 && fio2 >= 21) {
            return p.pf_pao2 / (fio2 / 100);
        }
        return 0;
    }, [p.pf_pao2, p.pf_fio2, p.vm_fio2]);

    const dynamicCompliance = useMemo(() => (p.vm_vc > 0 && p.vm_pip > p.vm_peep) ? (p.vm_vc / (p.vm_pip - p.vm_peep)) : 0, [p.vm_vc, p.vm_pip, p.vm_peep]);
    const airwayResistance = useMemo(() => (p.raw_fluxo > 0 && p.vm_pip > p.vm_plato) ? ((p.vm_pip - p.vm_plato) / (p.raw_fluxo / 60)) : 0, [p.vm_pip, p.vm_plato, p.raw_fluxo]);
    const minuteVolume = useMemo(() => (p.vm_vc > 0 && p.vm_fr > 0) ? (p.vm_vc * p.vm_fr / 1000) : 0, [p.vm_vc, p.vm_fr]);
    const oxygenationIndex = useMemo(() => {
        const fio2 = p.pf_fio2 || p.vm_fio2;
        return (p.oi_pma > 0 && fio2 > 0 && p.pf_pao2 > 0) ? (p.oi_pma * fio2) / p.pf_pao2 : 0
    }, [p.oi_pma, p.pf_fio2, p.vm_fio2, p.pf_pao2]);
    
    const pfInterpretation = useMemo(() => {
        if (!pfRatio) return { text: '', color: '' };
        if (pfRatio < 100) return { text: '⚫ SARA Grave', color: 'text-red-600' };
        if (pfRatio < 200) return { text: '🔴 SARA Moderada', color: 'text-red-400' };
        if (pfRatio < 300) return { text: '🟠 SARA Leve', color: 'text-orange-400' };
        return { text: '🟢 Normal', color: 'text-green-400' };
    }, [pfRatio]);

    const oiInterpretation = useMemo(() => {
        if (!oxygenationIndex) return { text: '', color: '' };
        if (oxygenationIndex >= 25) return { text: '🔴 Muito Grave (considerar ECMO)', color: 'text-red-500' };
        if (oxygenationIndex >= 16) return { text: '🟠 Grave', color: 'text-orange-400' };
        if (oxygenationIndex >= 8) return { text: '🟡 Moderado', color: 'text-yellow-400' };
        return { text: '🟢 Leve', color: 'text-green-400' };
    }, [oxygenationIndex]);

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <VmInput label="Modo" id="vm_modo" value={patient.vm_modo} onUpdate={onUpdate} />
                <VmInput label="Volume Corrente" id="vm_vc" value={patient.vm_vc} onUpdate={onUpdate} type="number"/>
                <VmInput label="Freq. Resp. (FR)" id="vm_fr" value={patient.vm_fr} onUpdate={onUpdate} type="number"/>
                <VmInput label="PEEP" id="vm_peep" value={patient.vm_peep} onUpdate={onUpdate} type="number"/>
                <VmInput label="Pressão de Pico (PIP)" id="vm_pip" value={patient.vm_pip} onUpdate={onUpdate} type="number"/>
                <VmInput label="Pressão de Platô" id="vm_plato" value={patient.vm_plato} onUpdate={onUpdate} type="number"/>
                <VmInput label="Driving Pressure" id="vm_driving_pressure" value={`${drivingPressure} cmH₂O`} onUpdate={()=>{}} disabled />
                <VmInput label="FiO2 (%)" id="vm_fio2" value={patient.vm_fio2} onUpdate={onUpdate} type="number"/>
            </div>

             <div className="mt-8 border-t border-gray-700 pt-6">
                <h3 className="text-xl font-bold text-white mb-4">🧮 Calculadoras Automáticas</h3>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <ScoreCard title="💪 Peso Corporal Ideal (IBW)">
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-sm">Altura (cm)</label><FormInput type="number" value={patient.ibw_altura} onChange={e => onUpdate({ ibw_altura: e.target.value })} /></div>
                            <div><label className="text-sm">Sexo</label><FormSelect value={patient.ibw_sexo} onChange={e => onUpdate({ ibw_sexo: e.target.value as 'M' | 'F' })}><option value="M">Masculino</option><option value="F">Feminino</option></FormSelect></div>
                        </div>
                        <ResultDisplay label="IBW" value={ibw.toFixed(1)} unit="kg" />
                        <div className="text-xs text-gray-400 text-center">
                            <div>VC protetor (6ml/kg): <span className="text-green-400">{(ibw * 6).toFixed(0)} mL</span></div>
                            <div>VC limite (8ml/kg): <span className="text-yellow-400">{(ibw * 8).toFixed(0)} mL</span></div>
                        </div>
                    </ScoreCard>
                    <ScoreCard title="🫁 Relação P/F (PaO₂/FiO₂)">
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-sm">PaO₂ (mmHg)</label><FormInput type="number" value={patient.pf_pao2} onChange={e => onUpdate({ pf_pao2: e.target.value })} /></div>
                            <div><label className="text-sm">FiO₂ (%)</label><FormInput type="number" value={patient.pf_fio2} onChange={e => onUpdate({ pf_fio2: e.target.value })} min="21" max="100"/></div>
                        </div>
                        <ResultDisplay label="P/F" value={pfRatio > 0 ? pfRatio.toFixed(0) : '--'} />
                        <div className={`text-center font-semibold ${pfInterpretation.color}`}>{pfInterpretation.text}</div>
                    </ScoreCard>
                    <ScoreCard title="💨 Complacência Dinâmica">
                        <p className="text-xs text-gray-400 -mt-2">Reflete a distensibilidade total do sistema (pulmões + parede torácica).</p>
                        <ResultDisplay label="Cдина" value={dynamicCompliance > 0 ? dynamicCompliance.toFixed(1) : '--'} unit="mL/cmH₂O" />
                    </ScoreCard>
                    <ScoreCard title="🚧 Resistência de Vias Aéreas">
                        <div><label className="text-sm">Fluxo (L/min)</label><FormInput type="number" value={patient.raw_fluxo} onChange={e => onUpdate({ raw_fluxo: e.target.value })} /></div>
                        <ResultDisplay label="Raw" value={airwayResistance > 0 ? airwayResistance.toFixed(1) : '--'} unit="cmH₂O/L/s" />
                    </ScoreCard>
                    <ScoreCard title="⏱️ Volume Minuto">
                         <p className="text-xs text-gray-400 -mt-2">Valores {'>'}  10 L/min podem indicar alto drive.</p>
                         <ResultDisplay label="VM" value={minuteVolume > 0 ? minuteVolume.toFixed(1) : '--'} unit="L/min" />
                    </ScoreCard>
                    <ScoreCard title="🅾️ Índice de Oxigenação (IO)">
                        <div><label className="text-sm">P. Média Vias Aéreas (PMA)</label><FormInput type="number" value={patient.oi_pma} onChange={e => onUpdate({ oi_pma: e.target.value })}/></div>
                        <ResultDisplay label="IO" value={oxygenationIndex > 0 ? oxygenationIndex.toFixed(1) : '--'} />
                        <div className={`text-center font-semibold ${oiInterpretation.color}`}>{oiInterpretation.text}</div>
                    </ScoreCard>
                </div>
            </div>
        </div>
    );
};
