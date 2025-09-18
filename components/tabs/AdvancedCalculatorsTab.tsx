import React, { useState, useMemo } from 'react';
import type { Patient } from '../../types';
import { FormInput, FormSelect } from '../FormControls';
import { ScoreCard, ResultDisplay } from '../ScoreCard';

interface TabProps {
    patient: Patient;
    onUpdate: (data: Partial<Patient>) => void;
}

// Calculadora de Clearance de Creatinina (Cockcroft-Gault e CKD-EPI)
const CreatinineClearanceCalculator: React.FC<TabProps> = ({ patient }) => {
    const [data, setData] = useState({
        weight: parseFloat(String(patient.peso)) || 70,
        age: parseFloat(String(patient.age)) || 65,
        gender: patient.gender === 'Feminino' ? 'F' : 'M',
        creatinine: 1.0,
        race: 'non-black' as 'black' | 'non-black',
        height: 170
    });

    const cockcroftGault = useMemo(() => {
        const ageNum = Number(data.age);
        const weightNum = Number(data.weight);
        const creatinineNum = Number(data.creatinine);

        const result = ((140 - ageNum) * weightNum) / (72 * creatinineNum);
        return data.gender === 'F' ? result * 0.85 : result;
    }, [data]);

    const ckdEpi = useMemo(() => {
        const ageNum = Number(data.age);
        const creatinineNum = Number(data.creatinine);

        const k = data.gender === 'F' ? 0.7 : 0.9;
        const alpha = data.gender === 'F' ? -0.329 : -0.411;
        const factor = data.gender === 'F' ? 1.018 : 1;
        const raceFactor = data.race === 'black' ? 1.159 : 1;

        const minCr = Math.min(creatinineNum / k, 1);
        const maxCr = Math.max(creatinineNum / k, 1);

        return 141 * Math.pow(minCr, alpha) * Math.pow(maxCr, -1.209) *
               Math.pow(0.993, ageNum) * factor * raceFactor;
    }, [data]);

    const mdrd = useMemo(() => {
        const ageNum = Number(data.age);
        const creatinineNum = Number(data.creatinine);

        const genderFactor = data.gender === 'F' ? 0.742 : 1;
        const raceFactor = data.race === 'black' ? 1.212 : 1;
        return 175 * Math.pow(creatinineNum, -1.154) * Math.pow(ageNum, -0.203) *
               genderFactor * raceFactor;
    }, [data]);

    const ckdStage = useMemo(() => {
        const gfr = ckdEpi;
        if (gfr >= 90) return { stage: '1', desc: 'Normal ou aumentada', color: 'text-green-400' };
        if (gfr >= 60) return { stage: '2', desc: 'Levemente diminuída', color: 'text-yellow-400' };
        if (gfr >= 30) return { stage: '3', desc: 'Moderadamente diminuída', color: 'text-orange-400' };
        if (gfr >= 15) return { stage: '4', desc: 'Gravemente diminuída', color: 'text-red-400' };
        return { stage: '5', desc: 'Falência renal', color: 'text-red-600' };
    }, [ckdEpi]);

    return (
        <ScoreCard title="🧪 Clearance de Creatinina">
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        type="number"
                        placeholder="Peso (kg)"
                        value={data.weight}
                        onChange={(e) => setData({...data, weight: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="Idade"
                        value={data.age}
                        onChange={(e) => setData({...data, age: parseInt(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="Creatinina (mg/dL)"
                        value={data.creatinine}
                        onChange={(e) => setData({...data, creatinine: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormSelect
                        value={data.gender}
                        onChange={(e) => setData({...data, gender: e.target.value})}
                        className="text-xs"
                    >
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </FormSelect>
                </div>
                
                <div className="space-y-2 border-t pt-3">
                    <div className="flex justify-between text-sm">
                        <span>Cockcroft-Gault:</span>
                        <span className="font-bold">{cockcroftGault.toFixed(1)} mL/min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>CKD-EPI:</span>
                        <span className="font-bold">{ckdEpi.toFixed(1)} mL/min/1.73m²</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>MDRD:</span>
                        <span className="font-bold">{mdrd.toFixed(1)} mL/min/1.73m²</span>
                    </div>
                </div>
                
                <div className={`text-center p-2 bg-gray-700 rounded ${ckdStage.color}`}>
                    <div className="font-bold">Estágio CKD: {ckdStage.stage}</div>
                    <div className="text-xs">{ckdStage.desc}</div>
                </div>
            </div>
        </ScoreCard>
    );
};

// Calculadora de Correção de Sódio
const SodiumCorrectionCalculator: React.FC = () => {
    const [data, setData] = useState({
        currentSodium: 135,
        targetSodium: 140,
        weight: 70,
        gender: 'M',
        age: 65,
        glucose: 100
    });

    const totalBodyWater = useMemo(() => {
        if (data.gender === 'M') {
            return data.age < 60 ? 0.6 * data.weight : 0.5 * data.weight;
        } else {
            return data.age < 60 ? 0.5 * data.weight : 0.45 * data.weight;
        }
    }, [data]);

    const sodiumDeficit = useMemo(() => {
        return (data.targetSodium - data.currentSodium) * totalBodyWater;
    }, [data, totalBodyWater]);

    const correctedSodium = useMemo(() => {
        if (data.glucose > 100) {
            return data.currentSodium + 1.6 * ((data.glucose - 100) / 100);
        }
        return data.currentSodium;
    }, [data]);

    const salineVolume = useMemo(() => {
        // Volume de SF 0.9% necessário (contém 154 mEq/L)
        const volumeNormal = (sodiumDeficit / 154) * 1000;
        // Volume de SF 3% necessário (contém 513 mEq/L)
        const volumeHypertonic = (sodiumDeficit / 513) * 1000;
        return { normal: volumeNormal, hypertonic: volumeHypertonic };
    }, [sodiumDeficit]);

    const correctionRate = useMemo(() => {
        const maxRate = data.currentSodium < 120 ? 0.5 : 0.25; // mEq/L/hora
        const timeNeeded = sodiumDeficit / (maxRate * totalBodyWater);
        return { maxRate, timeNeeded };
    }, [data, sodiumDeficit, totalBodyWater]);

    return (
        <ScoreCard title="💧 Correção de Sódio">
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        type="number"
                        placeholder="Na atual (mEq/L)"
                        value={data.currentSodium}
                        onChange={(e) => setData({...data, currentSodium: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="Na alvo (mEq/L)"
                        value={data.targetSodium}
                        onChange={(e) => setData({...data, targetSodium: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="Peso (kg)"
                        value={data.weight}
                        onChange={(e) => setData({...data, weight: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="Glicose (mg/dL)"
                        value={data.glucose}
                        onChange={(e) => setData({...data, glucose: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                </div>

                <div className="space-y-2 border-t pt-3">
                    <div className="flex justify-between text-sm">
                        <span>Água Corporal Total:</span>
                        <span className="font-bold">{totalBodyWater.toFixed(1)} L</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Déficit de Sódio:</span>
                        <span className="font-bold">{sodiumDeficit.toFixed(0)} mEq</span>
                    </div>
                    {data.glucose > 100 && (
                        <div className="flex justify-between text-sm">
                            <span>Na corrigido (glicose):</span>
                            <span className="font-bold text-yellow-400">{correctedSodium.toFixed(1)} mEq/L</span>
                        </div>
                    )}
                </div>

                <div className="bg-blue-900/30 p-3 rounded space-y-2">
                    <div className="text-xs font-semibold text-blue-300">Volume de Solução Necessário:</div>
                    <div className="text-xs">• SF 0.9%: {salineVolume.normal.toFixed(0)} mL</div>
                    <div className="text-xs">• SF 3%: {salineVolume.hypertonic.toFixed(0)} mL</div>
                </div>

                {data.currentSodium < 125 && (
                    <div className="bg-red-900/30 border border-red-500 p-2 rounded">
                        <div className="text-xs font-bold text-red-300">⚠️ ALERTA: Hiponatremia Grave</div>
                        <div className="text-xs text-gray-300 mt-1">
                            • Taxa máxima: {correctionRate.maxRate} mEq/L/h
                            • Tempo estimado: {correctionRate.timeNeeded.toFixed(0)} horas
                            • Risco de mielinólise pontina central
                        </div>
                    </div>
                )}
            </div>
        </ScoreCard>
    );
};

// Calculadora de Osmolaridade
const OsmolalityCalculator: React.FC = () => {
    const [data, setData] = useState({
        sodium: 140,
        glucose: 100,
        urea: 20,
        ethanol: 0,
        mannitol: 0,
        urineOsmolality: 600,
        urineOutput: 1500
    });

    const serumOsmolality = useMemo(() => {
        return (2 * data.sodium) + (data.glucose / 18) + (data.urea / 2.8) + 
               (data.ethanol / 4.6) + (data.mannitol / 18);
    }, [data]);

    const osmolarGap = useMemo(() => {
        const calculated = (2 * data.sodium) + (data.glucose / 18) + (data.urea / 2.8);
        return serumOsmolality - calculated;
    }, [data, serumOsmolality]);

    const freeWaterClearance = useMemo(() => {
        const urineVolume = data.urineOutput / 1000; // Convert to L
        return urineVolume * (1 - (data.urineOsmolality / serumOsmolality));
    }, [data, serumOsmolality]);

    const diagnosis = useMemo(() => {
        if (serumOsmolality < 280) return { type: 'Hipoosmolar', color: 'text-blue-400' };
        if (serumOsmolality > 295) return { type: 'Hiperosmolar', color: 'text-red-400' };
        return { type: 'Normal', color: 'text-green-400' };
    }, [serumOsmolality]);

    return (
        <ScoreCard title="🧬 Osmolaridade e Gap Osmolar">
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        type="number"
                        placeholder="Sódio (mEq/L)"
                        value={data.sodium}
                        onChange={(e) => setData({...data, sodium: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="Glicose (mg/dL)"
                        value={data.glucose}
                        onChange={(e) => setData({...data, glucose: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="Ureia (mg/dL)"
                        value={data.urea}
                        onChange={(e) => setData({...data, urea: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="Etanol (mg/dL)"
                        value={data.ethanol}
                        onChange={(e) => setData({...data, ethanol: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                </div>

                <div className="space-y-2 border-t pt-3">
                    <div className="flex justify-between text-sm">
                        <span>Osmolaridade Sérica:</span>
                        <span className={`font-bold ${diagnosis.color}`}>
                            {serumOsmolality.toFixed(1)} mOsm/kg
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Gap Osmolar:</span>
                        <span className={`font-bold ${osmolarGap > 10 ? 'text-red-400' : 'text-green-400'}`}>
                            {osmolarGap.toFixed(1)} mOsm/kg
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Clearance Água Livre:</span>
                        <span className="font-bold">{freeWaterClearance.toFixed(2)} L/dia</span>
                    </div>
                </div>

                {osmolarGap > 10 && (
                    <div className="bg-yellow-900/30 border border-yellow-500 p-2 rounded">
                        <div className="text-xs font-bold text-yellow-300">⚠️ Gap Osmolar Elevado</div>
                        <div className="text-xs text-gray-300 mt-1">
                            Considerar: Etanol, Metanol, Etilenoglicol, Manitol, Propilenoglicol
                        </div>
                    </div>
                )}

                <div className={`text-center p-2 bg-gray-700 rounded ${diagnosis.color}`}>
                    <div className="font-bold text-sm">Estado: {diagnosis.type}</div>
                    <div className="text-xs">Referência: 280-295 mOsm/kg</div>
                </div>
            </div>
        </ScoreCard>
    );
};

// Calculadora de Ventilação Alveolar e Dead Space
const VentilationCalculator: React.FC<TabProps> = ({ patient }) => {
    const [data, setData] = useState({
        tidalVolume: patient.vm_vc || 450,
        respiratoryRate: patient.vm_fr || 16,
        paco2: 40,
        etco2: 35,
        weight: patient.peso || 70,
        height: 170,
        gender: patient.gender === 'Feminino' ? 'F' : 'M'
    });

    const minuteVentilation = useMemo(() => {
        return (data.tidalVolume * data.respiratoryRate) / 1000;
    }, [data]);

    const anatomicalDeadSpace = useMemo(() => {
        return 2.2 * data.weight;
    }, [data]);

    const physiologicalDeadSpace = useMemo(() => {
        if (data.paco2 > 0 && data.etco2 > 0) {
            return data.tidalVolume * ((data.paco2 - data.etco2) / data.paco2);
        }
        return anatomicalDeadSpace;
    }, [data, anatomicalDeadSpace]);

    const alveolarVentilation = useMemo(() => {
        return ((data.tidalVolume - physiologicalDeadSpace) * data.respiratoryRate) / 1000;
    }, [data, physiologicalDeadSpace]);

    const deadSpaceRatio = useMemo(() => {
        return (physiologicalDeadSpace / data.tidalVolume) * 100;
    }, [physiologicalDeadSpace, data.tidalVolume]);

    const predictedBodyWeight = useMemo(() => {
        if (data.gender === 'M') {
            return 50 + 0.91 * (data.height - 152.4);
        } else {
            return 45.5 + 0.91 * (data.height - 152.4);
        }
    }, [data]);

    const tidalVolumePerKg = useMemo(() => {
        return data.tidalVolume / predictedBodyWeight;
    }, [data.tidalVolume, predictedBodyWeight]);

    return (
        <ScoreCard title="🫁 Ventilação e Dead Space">
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        type="number"
                        placeholder="Volume Corrente (mL)"
                        value={data.tidalVolume}
                        onChange={(e) => setData({...data, tidalVolume: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="FR (rpm)"
                        value={data.respiratoryRate}
                        onChange={(e) => setData({...data, respiratoryRate: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="PaCO2 (mmHg)"
                        value={data.paco2}
                        onChange={(e) => setData({...data, paco2: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="EtCO2 (mmHg)"
                        value={data.etco2}
                        onChange={(e) => setData({...data, etco2: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                </div>

                <div className="space-y-2 border-t pt-3">
                    <div className="flex justify-between text-sm">
                        <span>Ventilação Minuto:</span>
                        <span className="font-bold">{minuteVentilation.toFixed(2)} L/min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Ventilação Alveolar:</span>
                        <span className="font-bold text-green-400">{alveolarVentilation.toFixed(2)} L/min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Dead Space Fisiológico:</span>
                        <span className="font-bold">{physiologicalDeadSpace.toFixed(0)} mL</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Razão Vd/Vt:</span>
                        <span className={`font-bold ${deadSpaceRatio > 40 ? 'text-red-400' : 'text-green-400'}`}>
                            {deadSpaceRatio.toFixed(1)}%
                        </span>
                    </div>
                </div>

                <div className="bg-blue-900/30 p-3 rounded space-y-1">
                    <div className="text-xs font-semibold text-blue-300">Peso Predito & Volume Corrente:</div>
                    <div className="text-xs">• Peso Predito: {predictedBodyWeight.toFixed(1)} kg</div>
                    <div className="text-xs">• VC/kg predito: {tidalVolumePerKg.toFixed(1)} mL/kg</div>
                    <div className={`text-xs font-bold ${tidalVolumePerKg > 8 ? 'text-red-400' : tidalVolumePerKg < 6 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {tidalVolumePerKg > 8 ? '⚠️ Volume corrente alto (alvo: 6-8 mL/kg)' : 
                         tidalVolumePerKg < 6 ? '⚠️ Volume corrente baixo (alvo: 6-8 mL/kg)' : 
                         '✅ Volume corrente adequado'}
                    </div>
                </div>

                {deadSpaceRatio > 40 && (
                    <div className="bg-yellow-900/30 border border-yellow-500 p-2 rounded">
                        <div className="text-xs font-bold text-yellow-300">⚠️ Dead Space Elevado</div>
                        <div className="text-xs text-gray-300 mt-1">
                            Considerar: Embolia pulmonar, SARA, Hipovolemia, PEEP excessivo
                        </div>
                    </div>
                )}
            </div>
        </ScoreCard>
    );
};

// Calculadora de Nutrição em UTI
const NutritionCalculator: React.FC<TabProps> = ({ patient }) => {
    const [data, setData] = useState({
        weight: patient.peso || 70,
        height: 170,
        age: patient.age || 65,
        gender: patient.gender === 'Feminino' ? 'F' : 'M',
        activityFactor: 1.2,
        stressFactor: 1.3,
        temperature: 37,
        ventilated: true,
        crrt: false,
        proteinTarget: 1.5
    });

    const idealBodyWeight = useMemo(() => {
        if (data.gender === 'M') {
            return 50 + 0.91 * (data.height - 152.4);
        } else {
            return 45.5 + 0.91 * (data.height - 152.4);
        }
    }, [data]);

    const basalMetabolicRate = useMemo(() => {
        // Harris-Benedict Equation
        if (data.gender === 'M') {
            return 66.47 + (13.75 * data.weight) + (5.003 * data.height) - (6.755 * data.age);
        } else {
            return 655.1 + (9.563 * data.weight) + (1.850 * data.height) - (4.676 * data.age);
        }
    }, [data]);

    const totalEnergyExpenditure = useMemo(() => {
        let tee = basalMetabolicRate * data.activityFactor * data.stressFactor;
        
        // Temperature correction
        if (data.temperature > 37) {
            tee += tee * 0.13 * (data.temperature - 37);
        }
        
        // Ventilation adjustment
        if (data.ventilated) {
            tee -= tee * 0.1; // Reduce by 10% for sedated, ventilated patients
        }
        
        return tee;
    }, [basalMetabolicRate, data]);

    const proteinRequirement = useMemo(() => {
        let protein = data.weight * data.proteinTarget;
        
        // Adjust for CRRT
        if (data.crrt) {
            protein += 0.2 * data.weight; // Additional 0.2 g/kg for CRRT losses
        }
        
        return protein;
    }, [data]);

    const fluidRequirement = useMemo(() => {
        // Basic: 30-35 mL/kg/day
        let fluid = data.weight * 32.5;
        
        // Additional for fever
        if (data.temperature > 37) {
            fluid += 360 * (data.temperature - 37);
        }
        
        return fluid;
    }, [data]);

    const nutritionalRiskScore = useMemo(() => {
        let score = 0;
        if (data.weight < idealBodyWeight * 0.9) score += 2;
        if (patient.age > 70) score += 1;
        if (data.stressFactor > 1.3) score += 2;
        if (data.crrt) score += 1;
        
        if (score >= 4) return { risk: 'Alto', color: 'text-red-400' };
        if (score >= 2) return { risk: 'Médio', color: 'text-yellow-400' };
        return { risk: 'Baixo', color: 'text-green-400' };
    }, [data, idealBodyWeight, patient.age]);

    return (
        <ScoreCard title="🍽️ Nutrição em UTI">
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        type="number"
                        placeholder="Peso (kg)"
                        value={data.weight}
                        onChange={(e) => setData({...data, weight: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="Altura (cm)"
                        value={data.height}
                        onChange={(e) => setData({...data, height: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormSelect
                        value={data.stressFactor}
                        onChange={(e) => setData({...data, stressFactor: parseFloat(e.target.value)})}
                        className="text-xs"
                    >
                        <option value={1.0}>Sem estresse</option>
                        <option value={1.2}>Cirurgia eletiva</option>
                        <option value={1.3}>Sepse</option>
                        <option value={1.5}>Queimadura grave</option>
                    </FormSelect>
                    <FormInput
                        type="number"
                        placeholder="Temperatura (°C)"
                        value={data.temperature}
                        onChange={(e) => setData({...data, temperature: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                </div>

                <div className="flex gap-4 text-xs">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={data.ventilated}
                            onChange={(e) => setData({...data, ventilated: e.target.checked})}
                            className="mr-1"
                        />
                        Ventilado
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={data.crrt}
                            onChange={(e) => setData({...data, crrt: e.target.checked})}
                            className="mr-1"
                        />
                        CRRT
                    </label>
                </div>

                <div className="space-y-2 border-t pt-3">
                    <div className="flex justify-between text-sm">
                        <span>Peso Ideal:</span>
                        <span className="font-bold">{idealBodyWeight.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Gasto Energético Total:</span>
                        <span className="font-bold text-blue-400">{totalEnergyExpenditure.toFixed(0)} kcal/dia</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Proteínas:</span>
                        <span className="font-bold text-green-400">{proteinRequirement.toFixed(0)} g/dia</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Fluidos:</span>
                        <span className="font-bold">{fluidRequirement.toFixed(0)} mL/dia</span>
                    </div>
                </div>

                <div className="bg-gray-700 p-3 rounded space-y-2">
                    <div className="text-xs font-semibold">Recomendações Nutricionais:</div>
                    <div className="text-xs">• Calorias: {(totalEnergyExpenditure / data.weight).toFixed(0)} kcal/kg/dia</div>
                    <div className="text-xs">• Proteínas: {data.proteinTarget} g/kg/dia</div>
                    <div className="text-xs">• Carboidratos: {(totalEnergyExpenditure * 0.5 / 4).toFixed(0)} g/dia</div>
                    <div className="text-xs">• Lipídios: {(totalEnergyExpenditure * 0.3 / 9).toFixed(0)} g/dia</div>
                </div>

                <div className={`text-center p-2 bg-gray-700 rounded`}>
                    <span className="text-sm">Risco Nutricional: </span>
                    <span className={`font-bold ${nutritionalRiskScore.color}`}>
                        {nutritionalRiskScore.risk}
                    </span>
                </div>
            </div>
        </ScoreCard>
    );
};

// Main Advanced Calculators Tab
export const AdvancedCalculatorsTab: React.FC<TabProps> = ({ patient, onUpdate }) => {
    return (
        <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-bold text-white mb-2">🔧 Calculadoras Avançadas de UTI</h2>
                <p className="text-sm text-gray-400">
                    Ferramentas essenciais para cálculos precisos em terapia intensiva, baseadas nas diretrizes mais recentes.
                    Referências: KDIGO 2024, ESPEN 2023, ARDSnet Protocol, Surviving Sepsis Campaign 2024.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <CreatinineClearanceCalculator patient={patient} onUpdate={onUpdate} />
                <SodiumCorrectionCalculator />
                <OsmolalityCalculator />
                <VentilationCalculator patient={patient} onUpdate={onUpdate} />
                <NutritionCalculator patient={patient} onUpdate={onUpdate} />
            </div>
            
            <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg mt-6">
                <h3 className="font-semibold text-green-300 mb-2">📚 Referências Científicas Atualizadas</h3>
                <ul className="text-xs text-gray-300 space-y-1">
                    <li>• CKD-EPI: Inker LA, et al. N Engl J Med 2021;385:1737-1749</li>
                    <li>• Correção de Sódio: Sterns RH. N Engl J Med 2015;372:55-65</li>
                    <li>• Dead Space: Nuckton TJ, et al. N Engl J Med 2002;346:1281-6</li>
                    <li>• Nutrição: Singer P, et al. Clin Nutr 2023;42(9):1671-1689</li>
                    <li>• KDIGO Guidelines: Kidney Int 2024;105(Suppl 4S):S1-S130</li>
                </ul>
            </div>
        </div>
    );
};
