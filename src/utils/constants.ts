
// FIX: Import the 'Patient' type.
import type { PatientDatabase, Patient } from './types';

export const INITIAL_PATIENTS: PatientDatabase = {
    'leito08': { 
        bed: 'Leito 08', name: 'João Silva Santos', age: 65, gender: 'Masculino', 
        admissionDate: '2025-09-10', icuDay: 3, mainDiagnosis: 'Choque Séptico de Foco Pulmonar',
        history: 'Paciente admitido por quadro de pneumonia comunitária grave que evoluiu com insuficiência respiratória e choque séptico necessitando de intubação orotraqueal e suporte com drogas vasoativas.',
        problems: '1. Choque Séptico de Foco Pulmonar\n2. SARA Moderada (P/F 140)\n3. Lesão Renal Aguda KDIGO 2\n4. Acidose metabólica compensada',
        neuro: 'RASS -4 (Propofol 50ml/h + Fentanil 5ml/h). Glasgow 3T. Pupilas isofotorreagentes.',
        cardio: 'Noradrenalina 0.5 mcg/kg/min para manter PAM > 65 mmHg. Débito urinário 0.8 ml/kg/h.',
        resp: 'SARA moderada com P/F de 140. Paciente pronado 16h/dia. VM protetora.',
        renal: 'LRA KDIGO 2 (Creatinina 2.1 mg/dL). Gasometria: pH 7.28, PaCO2 42, HCO3 18, Lactato 3.8.',
        vm_modo: 'PCV', vm_vc: '380', vm_fr: 20, vm_peep: '12', vm_pip: 30, vm_plato: '27', vm_fio2: 60,
        balanco_entradas: 'SF 0.9% 1500ml\nDieta enteral 1000ml\nMedicações 200ml\nHemoderivados 0ml',
        balanco_saidas: 'Diurese 1200ml\nPerdas insensíveis 800ml',
        balanco_acumulado: '+2800 ml',
        plano: '## PLANO TERAPÊUTICO\n\n### RESPIRATÓRIO\n- Manter ventilação protetora (VC ≤6ml/kg)\n- Posição prona 16h/dia\n- Meta P/F >150\n\n### CARDIOVASCULAR\n- Desmame progressivo de vasopressor\n- Meta PAM 65-70 mmHg\n\n### INFECCIOSO\n- Tazocin D3/7\n- Reavaliar antibioticoterapia conforme culturas\n\n## PENDÊNCIAS\n- [ ] Coletar hemocultura de controle\n- [ ] Gasometria de controle às 14h\n- [ ] Discussão sobre traqueostomia',
        sofa_resp: 3, sofa_coag: 2, sofa_liver: 0, sofa_cardio: 4, sofa_gcs: 4, sofa_renal: 2,
        gcs_eyes: 1, gcs_verbal: 1, gcs_motor: 1,
        ibw_altura: 175, ibw_sexo: 'M', pf_pao2: 84, pf_fio2: 60, raw_fluxo: 60, oi_pma: 18,
        
        // SMART-SED UTI - Dados de Sedação e Analgesia
        peso: 75, tempo_intubacao: 72, previsao_vm: 7,
        ultima_avaliacao_sed: new Date('2025-09-15T14:30:00'),
        rass_atual: -2, meta_rass: -1, meta_cpot: 2,
        cpot_expressao: 1, cpot_movimentos: 0, cpot_tensao: 1, cpot_ventilador: 1,
        fentanil_dose: 2.5, fentanil_concentracao: 50, fentanil_infusao: 3.75,
        propofol_dose: 2.0, propofol_concentracao: 10, propofol_infusao: 15.0,
        dexmedetomidina_dose: 0, dexmedetomidina_concentracao: 0, dexmedetomidina_infusao: 0,
        midazolam_dose: 0, midazolam_concentracao: 0, midazolam_infusao: 0,
        observacoes_sedacao: 'Paciente com sedação moderada em propofol + fentanil. CPOT=3 sugere dor residual. Considerar otimização da analgesia antes de aumentar sedação. Próxima avaliação em 2h.'
    },
    'leito12': { 
        bed: 'Leito 12', name: 'Maria Aparecida Costa', age: 78, gender: 'Feminino', 
        admissionDate: '2025-09-08', icuDay: 5, mainDiagnosis: 'Pós-operatório de Revascularização do Miocárdio',
        history: 'Paciente submetida a cirurgia de revascularização do miocárdio de urgência por IAMCSST. Evoluiu no pós-operatório com baixo débito cardíaco e necessidade de suporte inotrópico.',
        problems: '1. Choque Cardiogênico pós CRM\n2. Fibrilação Atrial de alta resposta\n3. Lesão Renal Aguda KDIGO 1\n4. Desmame ventilatório em curso',
        neuro: 'RASS 0. Despertar progressivo. Orientada no tempo e espaço.',
        cardio: 'Dobutamina 5 mcg/kg/min + Noradrenalina 0.2 mcg/kg/min. FA controlada com Amiodarona.',
        resp: 'Em desmame ventilatório (PSV 10 cmH2O). Gasometria estável.',
        renal: 'LRA KDIGO 1 (Creatinina 1.5 mg/dL). Balanço hídrico negativo programado.',
        vm_modo: 'PSV', vm_vc: '450', vm_fr: 14, vm_peep: '8', vm_pip: 18, vm_plato: '16', vm_fio2: 30,
        balanco_entradas: 'Dieta enteral 1200ml\nMedicações 400ml\nSF 500ml',
        balanco_saidas: 'Diurese 2500ml\nDreno torácico 150ml',
        balanco_acumulado: '-1400 ml',
        plano: '## PLANO TERAPÊUTICO\n\n### RESPIRATÓRIO\n- Progredir desmame da VM\n- TRE se tolerância boa\n\n### CARDIOVASCULAR\n- Manter inotrópicos atuais\n- Controle de FA\n\n### RENAL\n- Manter balanço hídrico negativo\n- Monitorizar função renal\n\n## PENDÊNCIAS\n- [ ] Ecocardiograma de controle\n- [ ] Avaliação de extubação',
        sofa_resp: 1, sofa_coag: 1, sofa_liver: 0, sofa_cardio: 3, sofa_gcs: 1, sofa_renal: 1,
        gcs_eyes: 4, gcs_verbal: 4, gcs_motor: 6,
        ibw_altura: 162, ibw_sexo: 'F', pf_pao2: 120, pf_fio2: 30, raw_fluxo: 40, oi_pma: 10,
        
        // SMART-SED UTI - Dados de Sedação e Analgesia
        peso: 62, tempo_intubacao: 120, previsao_vm: 2,
        ultima_avaliacao_sed: new Date('2025-09-15T16:00:00'),
        rass_atual: 0, meta_rass: 0, meta_cpot: 2,
        cpot_expressao: 0, cpot_movimentos: 0, cpot_tensao: 0, cpot_ventilador: 0,
        fentanil_dose: 1.0, fentanil_concentracao: 50, fentanil_infusao: 1.24,
        propofol_dose: 0, propofol_concentracao: 0, propofol_infusao: 0,
        dexmedetomidina_dose: 0.6, dexmedetomidina_concentracao: 4, dexmedetomidina_infusao: 9.3,
        midazolam_dose: 0, midazolam_concentracao: 0, midazolam_infusao: 0,
        observacoes_sedacao: 'Paciente em desmame da sedação. Transicionado de propofol para dexmedetomidina. RASS 0 adequado para weaning. CPOT=0 indica analgesia eficaz. Próxima avaliação em 4h.'
    }
};

export const BLANK_PATIENT: Patient = {
  bed: 'Novo Leito', name: '', age: '', gender: 'Masculino',
  admissionDate: new Date().toISOString().split('T')[0], icuDay: 1,
  mainDiagnosis: '', history: '', problems: '', neuro: '', cardio: '', resp: '', renal: '',
  vm_modo: '', vm_vc: '', vm_fr: '', vm_peep: '', vm_pip: '', vm_plato: '', vm_fio2: '',
  balanco_entradas: '', balanco_saidas: '', balanco_acumulado: '', plano: '',
  sofa_resp: 0, sofa_coag: 0, sofa_liver: 0, sofa_cardio: 0, sofa_gcs: 0, sofa_renal: 0,
  gcs_eyes: 4, gcs_verbal: 5, gcs_motor: 6, ibw_altura: '', ibw_sexo: 'M',
  pf_pao2: '', pf_fio2: '', raw_fluxo: '', oi_pma: '',
  
  // SMART-SED UTI - Campos padrão para novos pacientes
  peso: 70, tempo_intubacao: 0, previsao_vm: 3,
  rass_atual: 0, meta_rass: -1, meta_cpot: 2,
  cpot_expressao: 0, cpot_movimentos: 0, cpot_tensao: 0, cpot_ventilador: 0,
  fentanil_dose: 0, fentanil_concentracao: 50, fentanil_infusao: 0,
  propofol_dose: 0, propofol_concentracao: 10, propofol_infusao: 0,
  dexmedetomidina_dose: 0, dexmedetomidina_concentracao: 4, dexmedetomidina_infusao: 0,
  midazolam_dose: 0, midazolam_concentracao: 1, midazolam_infusao: 0,
  observacoes_sedacao: ''
};
