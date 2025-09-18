
import React, { useMemo } from 'react';
import type { Patient } from '../../types';
import { FormSelect, FormInput } from '../FormControls';
import { ScoreCard, ResultDisplay } from '../ScoreCard';

interface TabProps {
    patient: Patient;
    onUpdate: (data: Partial<Patient>) => void;
}

const ScoreSelect: React.FC<{ label: string, id: keyof Patient, value: any, options: {val: number, label: string}[], onUpdate: any }> = ({ label, id, value, options, onUpdate }) => (
    <div className="flex justify-between items-center text-sm">
        <label>{label}</label>
        <FormSelect value={value || 0} onChange={e => onUpdate({[id]: e.target.value})} className="w-1/2 p-1 text-xs">
            {options.map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
        </FormSelect>
    </div>
);

export const ScoresTab: React.FC<TabProps> = ({ patient, onUpdate }) => {
    const sofaTotal = useMemo(() => ['sofa_resp', 'sofa_coag', 'sofa_liver', 'sofa_cardio', 'sofa_gcs', 'sofa_renal'].reduce((acc, key) => acc + (parseInt(String(patient[key as keyof Patient])) || 0), 0), [patient]);
    const gcsTotal = useMemo(() => ['gcs_eyes', 'gcs_verbal', 'gcs_motor'].reduce((acc, key) => acc + (parseInt(String(patient[key as keyof Patient])) || 0), 0), [patient]);
    const qsofaTotal = useMemo(() => ['qsofa_mental', 'qsofa_sbp', 'qsofa_rr'].reduce((acc, key) => acc + (parseInt(String(patient[key as keyof Patient])) || 0), 0), [patient]);
    const curb65Total = useMemo(() => ['curb65_confusion', 'curb65_urea', 'curb65_rr', 'curb65_bp', 'curb65_age'].reduce((acc, key) => acc + (parseInt(String(patient[key as keyof Patient])) || 0), 0), [patient]);
    const mewsTotal = useMemo(() => ['mews_sbp', 'mews_hr', 'mews_rr', 'mews_temp', 'mews_avpu'].reduce((acc, key) => acc + (parseInt(String(patient[key as keyof Patient])) || 0), 0), [patient]);
    const nutricTotal = useMemo(() => ['nutric_age', 'nutric_apache', 'nutric_sofa', 'nutric_comorbid', 'nutric_hospital'].reduce((acc, key) => acc + (parseInt(String(patient[key as keyof Patient])) || 0), 0), [patient]);
    const charlsonTotal = useMemo(() => ['charlson_mi', 'charlson_chf', 'charlson_pvd', 'charlson_dementia', 'charlson_copd', 'charlson_connective', 'charlson_peptic', 'charlson_liver_mild', 'charlson_diabetes', 'charlson_hemiplegia', 'charlson_renal', 'charlson_tumor'].reduce((acc, key) => acc + (parseInt(String(patient[key as keyof Patient])) || 0), 0), [patient]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <ScoreCard title="SOFA Score">
                <ScoreSelect label="PaO2/FiO2" id="sofa_resp" value={patient.sofa_resp} onUpdate={onUpdate} options={[{val:0, label:'>= 400'}, {val:1, label:'< 400'}, {val:2, label:'< 300'}, {val:3, label:'< 200 (suporte)'}, {val:4, label:'< 100 (suporte)'}]} />
                <ScoreSelect label="Plaquetas" id="sofa_coag" value={patient.sofa_coag} onUpdate={onUpdate} options={[{val:0, label:'>= 150k'}, {val:1, label:'< 150k'}, {val:2, label:'< 100k'}, {val:3, label:'< 50k'}, {val:4, label:'< 20k'}]} />
                <ScoreSelect label="Bilirrubina" id="sofa_liver" value={patient.sofa_liver} onUpdate={onUpdate} options={[{val:0, label:'< 1.2'}, {val:1, label:'1.2-1.9'}, {val:2, label:'2.0-5.9'}, {val:3, label:'6.0-11.9'}, {val:4, label:'>= 12.0'}]} />
                <ScoreSelect label="Cardiovascular" id="sofa_cardio" value={patient.sofa_cardio} onUpdate={onUpdate} options={[{val:0, label:'PAM >= 70'}, {val:1, label:'PAM < 70'}, {val:2, label:'Dopa<=5/Dobu'}, {val:3, label:'Dopa>5/Nora<=0.1'}, {val:4, label:'Dopa>15/Nora>0.1'}]} />
                <ScoreSelect label="Glasgow" id="sofa_gcs" value={patient.sofa_gcs} onUpdate={onUpdate} options={[{val:0, label:'15'}, {val:1, label:'13-14'}, {val:2, label:'10-12'}, {val:3, label:'6-9'}, {val:4, label:'< 6'}]} />
                <ScoreSelect label="Creatinina/Diurese" id="sofa_renal" value={patient.sofa_renal} onUpdate={onUpdate} options={[{val:0, label:'< 1.2'}, {val:1, label:'1.2-1.9'}, {val:2, label:'2.0-3.4'}, {val:3, label:'3.5-4.9/<500ml'}, {val:4, label:'>= 5.0/<200ml'}]} />
                <ResultDisplay label="Total" value={sofaTotal} className="mt-3"/>
            </ScoreCard>
            <ScoreCard title="Glasgow Coma Scale">
                <ScoreSelect label="Abertura Ocular" id="gcs_eyes" value={patient.gcs_eyes} onUpdate={onUpdate} options={[{val:4, label:'Espontânea (4)'}, {val:3, label:'Ao chamado (3)'}, {val:2, label:'À dor (2)'}, {val:1, label:'Nenhuma (1)'}]} />
                <ScoreSelect label="Resposta Verbal" id="gcs_verbal" value={patient.gcs_verbal} onUpdate={onUpdate} options={[{val:5, label:'Orientado (5)'}, {val:4, label:'Confuso (4)'}, {val:3, label:'Palavras inaprop. (3)'}, {val:2, label:'Sons incomp. (2)'}, {val:1, label:'Nenhuma (1)'}]} />
                <ScoreSelect label="Resposta Motora" id="gcs_motor" value={patient.gcs_motor} onUpdate={onUpdate} options={[{val:6, label:'Obedece comandos (6)'}, {val:5, label:'Localiza dor (5)'}, {val:4, label:'Retirada à dor (4)'}, {val:3, label:'Flexão anormal (3)'}, {val:2, label:'Extensão anormal (2)'}, {val:1, label:'Nenhuma (1)'}]} />
                <ResultDisplay label="Total" value={gcsTotal} className="mt-3"/>
            </ScoreCard>
            <ScoreCard title="qSOFA Score">
                <ScoreSelect label="Alteração Mental" id="qsofa_mental" value={patient.qsofa_mental} onUpdate={onUpdate} options={[{val:0, label:'Não'}, {val:1, label:'Sim'}]} />
                <ScoreSelect label="PA Sistólica ≤ 100" id="qsofa_sbp" value={patient.qsofa_sbp} onUpdate={onUpdate} options={[{val:0, label:'Não'}, {val:1, label:'Sim'}]} />
                <ScoreSelect label="FR ≥ 22 irpm" id="qsofa_rr" value={patient.qsofa_rr} onUpdate={onUpdate} options={[{val:0, label:'Não'}, {val:1, label:'Sim'}]} />
                <ResultDisplay label="Total" value={qsofaTotal} className="mt-3"/>
                <div className="text-xs text-center"><div className={qsofaTotal >= 2 ? 'text-red-400' : 'text-green-400'}>{qsofaTotal >= 2 ? '⚠️ Alto risco de mortalidade' : '✅ Baixo risco'}</div></div>
            </ScoreCard>
            <ScoreCard title="CURB-65">
                <ScoreSelect label="Confusão" id="curb65_confusion" value={patient.curb65_confusion} onUpdate={onUpdate} options={[{val:0, label:'Não'}, {val:1, label:'Sim'}]} />
                <ScoreSelect label="Ureia > 7 mmol/L" id="curb65_urea" value={patient.curb65_urea} onUpdate={onUpdate} options={[{val:0, label:'Não'}, {val:1, label:'Sim'}]} />
                <ScoreSelect label="FR ≥ 30 irpm" id="curb65_rr" value={patient.curb65_rr} onUpdate={onUpdate} options={[{val:0, label:'Não'}, {val:1, label:'Sim'}]} />
                <ScoreSelect label="PA < 90/60 mmHg" id="curb65_bp" value={patient.curb65_bp} onUpdate={onUpdate} options={[{val:0, label:'Não'}, {val:1, label:'Sim'}]} />
                <ScoreSelect label="Idade ≥ 65 anos" id="curb65_age" value={patient.curb65_age} onUpdate={onUpdate} options={[{val:0, label:'Não'}, {val:1, label:'Sim'}]} />
                <ResultDisplay label="Total" value={curb65Total} className="mt-3"/>
                <div className="text-xs text-center">
                    {curb65Total >= 3 && <div className="text-red-400">🔴 Alto risco - UTI</div>}
                    {curb65Total === 2 && <div className="text-orange-400">🟠 Risco moderado - Internação</div>}
                    {curb65Total <= 1 && <div className="text-green-400">🟢 Baixo risco - Ambulatorial</div>}
                </div>
            </ScoreCard>
            {/* Additional scores can be added here following the same pattern */}
        </div>
    );
};
