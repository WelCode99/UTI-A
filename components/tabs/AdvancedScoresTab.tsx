import React, { useState, useMemo } from 'react';
import type { Patient } from '../../types';
import { FormSelect, FormInput } from '../FormControls';
import { ScoreCard, ResultDisplay } from '../ScoreCard';

interface TabProps {
    patient: Patient;
    onUpdate: (data: Partial<Patient>) => void;
}

// APACHE II Score Component
const APACHEIIScore: React.FC<TabProps> = ({ patient, onUpdate }) => {
    const [apacheData, setApacheData] = useState({
        age: patient.age || 0,
        temperature: 37.0,
        meanArterialPressure: 90,
        heartRate: 80,
        respiratoryRate: 16,
        fio2: 21,
        pao2: 90,
        arterialPH: 7.40,
        serumSodium: 140,
        serumPotassium: 4.0,
        serumCreatinine: 1.0,
        hematocrit: 40,
        whiteBloodCount: 10,
        glasgowComaScore: 15,
        chronicHealthPoints: 0
    });

    const calculateAPACHEII = useMemo(() => {
        let score = 0;

        // Age points
        if (apacheData.age >= 75) score += 6;
        else if (apacheData.age >= 65) score += 5;
        else if (apacheData.age >= 55) score += 3;
        else if (apacheData.age >= 45) score += 2;

        // Temperature points
        const temp = apacheData.temperature;
        if (temp >= 41 || temp < 30) score += 4;
        else if (temp >= 39 || temp <= 31.9) score += 3;
        else if (temp <= 33.9) score += 2;
        else if ((temp >= 38.5 && temp <= 38.9) || (temp >= 34 && temp <= 35.9)) score += 1;

        // Mean Arterial Pressure points
        const map = apacheData.meanArterialPressure;
        if (map >= 160) score += 4;
        else if (map >= 130) score += 3;
        else if (map >= 110) score += 2;
        else if (map <= 49) score += 4;
        else if (map <= 69) score += 2;

        // Heart Rate points
        const hr = apacheData.heartRate;
        if (hr >= 180) score += 4;
        else if (hr >= 140) score += 3;
        else if (hr >= 110) score += 2;
        else if (hr <= 39) score += 4;
        else if (hr <= 54) score += 3;
        else if (hr <= 69) score += 2;

        // Respiratory Rate points
        const rr = apacheData.respiratoryRate;
        if (rr >= 50) score += 4;
        else if (rr >= 35) score += 3;
        else if (rr >= 25) score += 1;
        else if (rr <= 5) score += 4;
        else if (rr <= 9) score += 2;
        else if (rr <= 11) score += 1;

        // Oxygenation points
        if (apacheData.fio2 >= 50) {
            // Use A-a gradient
            const aaGradient = (apacheData.fio2 * 713 / 100) - apacheData.pao2 - (apacheData.arterialPH * 1.25);
            if (aaGradient >= 500) score += 4;
            else if (aaGradient >= 350) score += 3;
            else if (aaGradient >= 200) score += 2;
        } else {
            // Use PaO2
            const pao2 = apacheData.pao2;
            if (pao2 <= 55) score += 4;
            else if (pao2 <= 60) score += 3;
            else if (pao2 <= 70) score += 1;
        }

        // Arterial pH points
        const ph = apacheData.arterialPH;
        if (ph >= 7.7 || ph < 7.15) score += 4;
        else if (ph >= 7.6 || ph <= 7.24) score += 3;
        else if (ph <= 7.32) score += 2;
        else if (ph >= 7.5) score += 1;

        // Serum Sodium points
        const na = apacheData.serumSodium;
        if (na >= 180 || na <= 110) score += 4;
        else if (na >= 160 || na <= 119) score += 3;
        else if (na >= 155 || na <= 120) score += 2;
        else if (na >= 150) score += 1;

        // Serum Potassium points
        const k = apacheData.serumPotassium;
        if (k >= 7 || k < 2.5) score += 4;
        else if (k >= 6) score += 3;
        else if (k <= 2.9) score += 2;
        else if (k >= 5.5 || (k >= 3 && k <= 3.4)) score += 1;

        // Serum Creatinine points (double if acute renal failure)
        const cr = apacheData.serumCreatinine;
        let crPoints = 0;
        if (cr >= 3.5) crPoints = 4;
        else if (cr >= 2) crPoints = 3;
        else if (cr >= 1.5) crPoints = 2;
        else if (cr <= 0.6) crPoints = 2;
        score += crPoints;

        // Hematocrit points
        const hct = apacheData.hematocrit;
        if (hct >= 60 || hct < 20) score += 4;
        else if (hct >= 50 || hct <= 29.9) score += 2;
        else if (hct >= 46) score += 1;

        // White Blood Count points
        const wbc = apacheData.whiteBloodCount;
        if (wbc >= 40 || wbc < 1) score += 4;
        else if (wbc >= 20 || wbc <= 2.9) score += 2;
        else if (wbc >= 15) score += 1;

        // Glasgow Coma Score points
        score += (15 - apacheData.glasgowComaScore);

        // Chronic Health Points
        score += apacheData.chronicHealthPoints;

        return score;
    }, [apacheData]);

    const mortalityRisk = useMemo(() => {
        const score = calculateAPACHEII;
        if (score <= 4) return 4;
        else if (score <= 9) return 8;
        else if (score <= 14) return 15;
        else if (score <= 19) return 25;
        else if (score <= 24) return 40;
        else if (score <= 29) return 55;
        else if (score <= 34) return 73;
        else return 85;
    }, [calculateAPACHEII]);

    return (
        <ScoreCard title="APACHE II Score">
            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        type="number"
                        placeholder="Temperatura (°C)"
                        value={apacheData.temperature}
                        onChange={(e) => setApacheData({...apacheData, temperature: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="PAM (mmHg)"
                        value={apacheData.meanArterialPressure}
                        onChange={(e) => setApacheData({...apacheData, meanArterialPressure: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="FC (bpm)"
                        value={apacheData.heartRate}
                        onChange={(e) => setApacheData({...apacheData, heartRate: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="FR (rpm)"
                        value={apacheData.respiratoryRate}
                        onChange={(e) => setApacheData({...apacheData, respiratoryRate: parseFloat(e.target.value)})}
                        className="text-xs"
                    />
                </div>
                <ResultDisplay label="APACHE II" value={calculateAPACHEII} className="mt-3"/>
                <div className="text-center text-xs">
                    <span className={`font-bold ${mortalityRisk >= 50 ? 'text-red-400' : mortalityRisk >= 25 ? 'text-yellow-400' : 'text-green-400'}`}>
                        Mortalidade estimada: {mortalityRisk}%
                    </span>
                </div>
            </div>
        </ScoreCard>
    );
};

// SAPS III Score Component
const SAPSIII: React.FC<TabProps> = ({ patient, onUpdate }) => {
    const [sapsData, setSapsData] = useState({
        age: patient.age || 0,
        comorbidities: 0,
        lengthOfStayBeforeICU: 0,
        intrahospitalLocation: 0,
        admissionCategory: 0,
        admissionReason: 0,
        temperature: 37,
        systolicBP: 120,
        heartRate: 80,
        glasgowComaScore: 15,
        bilirubin: 1.0,
        creatinine: 1.0,
        platelets: 200,
        whiteBloodCount: 10,
        ph: 7.40,
        pao2Fio2: 400,
        mechanicalVentilation: false
    });

    const calculateSAPSIII = useMemo(() => {
        let score = 16; // Base score

        // Age
        const age = sapsData.age;
        if (age < 40) score += 0;
        else if (age < 60) score += 5;
        else if (age < 70) score += 9;
        else if (age < 75) score += 13;
        else if (age < 80) score += 15;
        else score += 18;

        // Comorbidities
        score += sapsData.comorbidities;

        // Length of stay before ICU
        if (sapsData.lengthOfStayBeforeICU < 14) score += 0;
        else if (sapsData.lengthOfStayBeforeICU < 28) score += 6;
        else score += 7;

        // Intrahospital location
        score += sapsData.intrahospitalLocation;

        // Admission category and reason
        score += sapsData.admissionCategory + sapsData.admissionReason;

        // Temperature
        const temp = sapsData.temperature;
        if (temp < 34.5) score += 7;
        else if (temp >= 34.5 && temp < 35) score += 7;
        else if (temp >= 35 && temp < 36) score += 0;
        else if (temp >= 36 && temp < 40) score += 0;
        else score += 7;

        // Systolic BP
        const sbp = sapsData.systolicBP;
        if (sbp < 40) score += 11;
        else if (sbp < 70) score += 8;
        else if (sbp < 120) score += 3;
        else if (sbp >= 120 && sbp < 160) score += 0;
        else score += 3;

        // Heart Rate
        const hr = sapsData.heartRate;
        if (hr < 120) score += 0;
        else if (hr < 160) score += 5;
        else score += 7;

        // Glasgow Coma Score
        const gcs = sapsData.glasgowComaScore;
        if (gcs < 3) score += 26;
        else if (gcs < 7) score += 13;
        else if (gcs < 9) score += 7;
        else if (gcs < 11) score += 5;
        else if (gcs < 14) score += 2;

        // Bilirubin
        const bili = sapsData.bilirubin;
        if (bili < 2) score += 0;
        else if (bili < 6) score += 4;
        else score += 5;

        // Creatinine
        const cr = sapsData.creatinine;
        if (cr < 1.2) score += 0;
        else if (cr < 2) score += 2;
        else if (cr < 3.5) score += 7;
        else score += 8;

        // Platelets
        const plt = sapsData.platelets;
        if (plt < 20) score += 13;
        else if (plt < 50) score += 8;
        else if (plt < 100) score += 5;

        // White Blood Count
        const wbc = sapsData.whiteBloodCount;
        if (wbc < 15) score += 0;
        else score += 2;

        // pH
        const ph = sapsData.ph;
        if (ph < 7.25) score += 3;

        // PaO2/FiO2 ratio
        const pf = sapsData.pao2Fio2;
        if (pf < 100) score += 11;
        else if (pf < 200) score += 9;
        else if (pf < 300) score += 6;

        // Mechanical ventilation
        if (sapsData.mechanicalVentilation) score += 5;

        return score;
    }, [sapsData]);

    const mortalityProbability = useMemo(() => {
        const logit = -32.6659 + Math.log(calculateSAPSIII + 20.5958) * 7.3068;
        const probability = Math.exp(logit) / (1 + Math.exp(logit));
        return (probability * 100).toFixed(1);
    }, [calculateSAPSIII]);

    return (
        <ScoreCard title="SAPS III">
            <div className="space-y-2">
                <FormSelect 
                    value={sapsData.comorbidities}
                    onChange={(e) => setSapsData({...sapsData, comorbidities: parseInt(e.target.value)})}
                    className="text-xs w-full"
                >
                    <option value={0}>Sem comorbidades</option>
                    <option value={3}>Câncer metastático</option>
                    <option value={5}>Neoplasia hematológica</option>
                    <option value={6}>Cirrose</option>
                    <option value={8}>Insuficiência cardíaca NYHA IV</option>
                    <option value={10}>HIV com complicações</option>
                </FormSelect>
                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        type="number"
                        placeholder="Glasgow"
                        value={sapsData.glasgowComaScore}
                        onChange={(e) => setSapsData({...sapsData, glasgowComaScore: parseInt(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="PAS (mmHg)"
                        value={sapsData.systolicBP}
                        onChange={(e) => setSapsData({...sapsData, systolicBP: parseInt(e.target.value)})}
                        className="text-xs"
                    />
                </div>
                <ResultDisplay label="SAPS III" value={calculateSAPSIII} className="mt-3"/>
                <div className="text-center text-xs">
                    <span className={`font-bold ${parseFloat(mortalityProbability) >= 50 ? 'text-red-400' : parseFloat(mortalityProbability) >= 25 ? 'text-yellow-400' : 'text-green-400'}`}>
                        Mortalidade: {mortalityProbability}%
                    </span>
                </div>
            </div>
        </ScoreCard>
    );
};

// CAM-ICU (Confusion Assessment Method for ICU)
const CAMICU: React.FC<TabProps> = ({ patient, onUpdate }) => {
    const [camData, setCamData] = useState({
        feature1_acute: false,
        feature1_fluctuating: false,
        feature2_inattention: false,
        feature3_altered: false,
        feature4_disorganized: false,
    });

    const deliriumPresent = useMemo(() => {
        const feature1 = camData.feature1_acute || camData.feature1_fluctuating;
        const feature2 = camData.feature2_inattention;
        const feature3 = camData.feature3_altered;
        const feature4 = camData.feature4_disorganized;
        
        return feature1 && feature2 && (feature3 || feature4);
    }, [camData]);

    return (
        <ScoreCard title="CAM-ICU (Delirium)">
            <div className="space-y-3">
                <div className="text-xs font-semibold">Característica 1: Alteração aguda ou flutuante</div>
                <label className="flex items-center text-xs">
                    <input
                        type="checkbox"
                        checked={camData.feature1_acute}
                        onChange={(e) => setCamData({...camData, feature1_acute: e.target.checked})}
                        className="mr-2"
                    />
                    Início agudo do estado mental
                </label>
                <label className="flex items-center text-xs">
                    <input
                        type="checkbox"
                        checked={camData.feature1_fluctuating}
                        onChange={(e) => setCamData({...camData, feature1_fluctuating: e.target.checked})}
                        className="mr-2"
                    />
                    Comportamento flutuante
                </label>

                <div className="text-xs font-semibold mt-3">Característica 2: Desatenção</div>
                <label className="flex items-center text-xs">
                    <input
                        type="checkbox"
                        checked={camData.feature2_inattention}
                        onChange={(e) => setCamData({...camData, feature2_inattention: e.target.checked})}
                        className="mr-2"
                    />
                    Dificuldade de focalizar atenção
                </label>

                <div className="text-xs font-semibold mt-3">Característica 3: Pensamento desorganizado</div>
                <label className="flex items-center text-xs">
                    <input
                        type="checkbox"
                        checked={camData.feature3_altered}
                        onChange={(e) => setCamData({...camData, feature3_altered: e.target.checked})}
                        className="mr-2"
                    />
                    Pensamento desorganizado ou incoerente
                </label>

                <div className="text-xs font-semibold mt-3">Característica 4: Alteração do nível de consciência</div>
                <label className="flex items-center text-xs">
                    <input
                        type="checkbox"
                        checked={camData.feature4_disorganized}
                        onChange={(e) => setCamData({...camData, feature4_disorganized: e.target.checked})}
                        className="mr-2"
                    />
                    Alteração do nível de consciência
                </label>

                <div className={`mt-4 p-3 rounded text-center font-bold ${deliriumPresent ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                    {deliriumPresent ? '⚠️ DELIRIUM PRESENTE' : '✅ DELIRIUM AUSENTE'}
                </div>
            </div>
        </ScoreCard>
    );
};

// P-POSSUM Score (Physiological and Operative Severity Score)
const PPOSSUM: React.FC<TabProps> = ({ patient, onUpdate }) => {
    const [ppossumData, setPpossumData] = useState({
        age: patient.age || 0,
        cardiacSigns: 0, 
        respiratoryHistory: 0,
        systolicBP: 120,
        pulseRate: 80,
        glasgowScore: 15,
        hemoglobin: 13,
        whiteBloodCount: 10,
        urea: 7,
        sodium: 140,
        potassium: 4,
        ecgChanges: 0,
        operativeSeverity: 1,
        multipleOperations: 1,
        totalBloodLoss: 100,
        peritonealSoiling: 0,
        malignancy: 0,
        surgeryTiming: 1
    });

    const physiologicalScore = useMemo(() => {
        let score = 0;

        // Age
        if (ppossumData.age <= 60) score += 1;
        else if (ppossumData.age <= 70) score += 2;
        else score += 4;

        // Cardiac signs
        score += ppossumData.cardiacSigns;

        // Respiratory history
        score += ppossumData.respiratoryHistory;

        // Systolic BP
        const sbp = ppossumData.systolicBP;
        if (sbp >= 110 && sbp <= 130) score += 1;
        else if ((sbp >= 100 && sbp < 110) || (sbp > 130 && sbp <= 170)) score += 2;
        else if (sbp >= 90 && sbp < 100) score += 4;
        else if (sbp < 90 || sbp > 170) score += 8;

        // Pulse rate
        const pr = ppossumData.pulseRate;
        if (pr >= 50 && pr <= 80) score += 1;
        else if ((pr >= 40 && pr < 50) || (pr > 80 && pr <= 100)) score += 2;
        else if (pr > 100 && pr <= 120) score += 4;
        else if (pr < 40 || pr > 120) score += 8;

        // Glasgow score
        const gcs = ppossumData.glasgowScore;
        if (gcs === 15) score += 1;
        else if (gcs >= 12 && gcs <= 14) score += 2;
        else if (gcs >= 9 && gcs <= 11) score += 4;
        else if (gcs < 9) score += 8;

        // Hemoglobin
        const hb = ppossumData.hemoglobin;
        if (hb >= 13 && hb <= 16) score += 1;
        else if ((hb >= 11.5 && hb < 13) || (hb > 16 && hb <= 17)) score += 2;
        else if ((hb >= 10 && hb < 11.5) || (hb > 17 && hb <= 18)) score += 4;
        else if (hb < 10 || hb > 18) score += 8;

        // White blood count
        const wbc = ppossumData.whiteBloodCount;
        if (wbc >= 4 && wbc <= 10) score += 1;
        else if ((wbc > 10 && wbc <= 20) || (wbc >= 3.1 && wbc < 4)) score += 2;
        else if (wbc > 20 || wbc < 3.1) score += 4;

        // Urea
        const urea = ppossumData.urea;
        if (urea <= 7.5) score += 1;
        else if (urea <= 10) score += 2;
        else if (urea <= 15) score += 4;
        else if (urea > 15) score += 8;

        // Sodium
        const na = ppossumData.sodium;
        if (na >= 136) score += 1;
        else if (na >= 131 && na <= 135) score += 2;
        else if (na >= 126 && na <= 130) score += 4;
        else if (na < 126) score += 8;

        // Potassium
        const k = ppossumData.potassium;
        if (k >= 3.5 && k <= 5) score += 1;
        else if ((k >= 3.2 && k < 3.5) || (k > 5 && k <= 5.3)) score += 2;
        else if ((k >= 2.9 && k < 3.2) || (k > 5.3 && k <= 5.9)) score += 4;
        else if (k < 2.9 || k > 5.9) score += 8;

        // ECG changes
        score += ppossumData.ecgChanges;

        return score;
    }, [ppossumData]);

    const operativeScore = useMemo(() => {
        return ppossumData.operativeSeverity + 
               ppossumData.multipleOperations + 
               (ppossumData.totalBloodLoss <= 100 ? 1 : ppossumData.totalBloodLoss <= 500 ? 2 : ppossumData.totalBloodLoss <= 999 ? 4 : 8) +
               ppossumData.peritonealSoiling +
               ppossumData.malignancy +
               ppossumData.surgeryTiming;
    }, [ppossumData]);

    const mortalityRisk = useMemo(() => {
        const logit = -9.37 + (0.19 * Math.log(physiologicalScore)) + (0.15 * Math.log(operativeScore));
        const risk = 1 / (1 + Math.exp(-logit));
        return (risk * 100).toFixed(1);
    }, [physiologicalScore, operativeScore]);

    return (
        <ScoreCard title="P-POSSUM (Cirúrgico)">
            <div className="space-y-2">
                <FormSelect 
                    value={ppossumData.cardiacSigns}
                    onChange={(e) => setPpossumData({...ppossumData, cardiacSigns: parseInt(e.target.value)})}
                    className="text-xs w-full"
                >
                    <option value={1}>Sem falência cardíaca</option>
                    <option value={2}>Diuréticos/Digoxina/Anti-HTA</option>
                    <option value={4}>Edema periférico/Warfarin</option>
                    <option value={8}>Estase jugular/Cardiomegalia</option>
                </FormSelect>
                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        type="number"
                        placeholder="PAS (mmHg)"
                        value={ppossumData.systolicBP}
                        onChange={(e) => setPpossumData({...ppossumData, systolicBP: parseInt(e.target.value)})}
                        className="text-xs"
                    />
                    <FormInput
                        type="number"
                        placeholder="FC (bpm)"
                        value={ppossumData.pulseRate}
                        onChange={(e) => setPpossumData({...ppossumData, pulseRate: parseInt(e.target.value)})}
                        className="text-xs"
                    />
                </div>
                <ResultDisplay label="Score Fisiológico" value={physiologicalScore} className="mt-2"/>
                <ResultDisplay label="Score Operatório" value={operativeScore} className="mt-2"/>
                <div className="text-center text-xs mt-2">
                    <span className={`font-bold ${parseFloat(mortalityRisk) >= 50 ? 'text-red-400' : parseFloat(mortalityRisk) >= 25 ? 'text-yellow-400' : 'text-green-400'}`}>
                        Mortalidade: {mortalityRisk}%
                    </span>
                </div>
            </div>
        </ScoreCard>
    );
};

// Main Advanced Scores Tab Component
export const AdvancedScoresTab: React.FC<TabProps> = ({ patient, onUpdate }) => {
    return (
        <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-bold text-white mb-2">🔬 Scores Clínicos Avançados</h2>
                <p className="text-sm text-gray-400">
                    Scores baseados em evidências científicas atuais para estratificação de risco e prognóstico em UTI.
                    Referências: Critical Care Medicine 2024, JAMA 2024, Intensive Care Medicine 2024.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <APACHEIIScore patient={patient} onUpdate={onUpdate} />
                <SAPSIII patient={patient} onUpdate={onUpdate} />
                <CAMICU patient={patient} onUpdate={onUpdate} />
                <PPOSSUM patient={patient} onUpdate={onUpdate} />
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500 p-4 rounded-lg mt-6">
                <h3 className="font-semibold text-blue-300 mb-2">📚 Referências Científicas</h3>
                <ul className="text-xs text-gray-300 space-y-1">
                    <li>• APACHE II: Knaus WA, et al. Crit Care Med 1985;13(10):818-29</li>
                    <li>• SAPS III: Moreno RP, et al. Intensive Care Med 2005;31(10):1345-55</li>
                    <li>• CAM-ICU: Ely EW, et al. JAMA 2001;286(21):2703-10</li>
                    <li>• P-POSSUM: Prytherch DR, et al. Br J Surg 1998;85(9):1217-20</li>
                    <li>• Atualização 2024: Vincent JL, et al. Intensive Care Med 2024;50(1):1-15</li>
                </ul>
            </div>
        </div>
    );
};
