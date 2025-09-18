
export interface Patient {
  bed: string;
  name: string;
  age: number | string;
  gender: 'Masculino' | 'Feminino' | 'Outro';
  admissionDate: string;
  icuDay: number | string;
  mainDiagnosis: string;
  history: string;
  problems: string;
  neuro: string;
  cardio: string;
  resp: string;
  renal: string;
  vm_modo: string;
  vm_vc: number | string;
  vm_fr: number | string;
  vm_peep: number | string;
  vm_pip: number | string;
  vm_plato: number | string;
  vm_fio2: number | string;
  balanco_entradas: string;
  balanco_saidas: string;
  balanco_acumulado: string;
  plano: string;
  sofa_resp: number | string;
  sofa_coag: number | string;
  sofa_liver: number | string;
  sofa_cardio: number | string;
  sofa_gcs: number | string;
  sofa_renal: number | string;
  gcs_eyes: number | string;
  gcs_verbal: number | string;
  gcs_motor: number | string;
  ibw_altura: number | string;
  ibw_sexo: 'M' | 'F';
  pf_pao2: number | string;
  pf_fio2: number | string;
  raw_fluxo: number | string;
  oi_pma: number | string;
  saps3_age?: number | string;
  saps3_admission?: number | string;
  saps3_gcs?: number | string;
  saps3_temp?: number | string;
  saps3_sbp?: number | string;
  saps3_hr?: number | string;
  saps3_bili?: number | string;
  saps3_cr?: number | string;
  saps3_plt?: number | string;
  saps3_wbc?: number | string;
  qsofa_mental?: number | string;
  qsofa_sbp?: number | string;
  qsofa_rr?: number | string;
  curb65_confusion?: number | string;
  curb65_urea?: number | string;
  curb65_rr?: number | string;
  curb65_bp?: number | string;
  curb65_age?: number | string;
  mews_sbp?: number | string;
  mews_hr?: number | string;
  mews_rr?: number | string;
  mews_temp?: number | string;
  mews_avpu?: number | string;
  nutric_age?: number | string;
  nutric_apache?: number | string;
  nutric_sofa?: number | string;
  nutric_comorbid?: number | string;
  nutric_hospital?: number | string;
  charlson_mi?: number | string;
  charlson_chf?: number | string;
  charlson_pvd?: number | string;
  charlson_dementia?: number | string;
  charlson_copd?: number | string;
  charlson_connective?: number | string;
  charlson_peptic?: number | string;
  charlson_liver_mild?: number | string;
  charlson_diabetes?: number | string;
  charlson_hemiplegia?: number | string;
  charlson_renal?: number | string;
  charlson_tumor?: number | string;
  
  // SMART-SED UTI - Campos de Sedação e Analgesia
  peso?: number; // peso em kg para cálculos
  comorbidades?: string; // texto livre para comorbidades
  tempo_intubacao?: number | string; // horas
  previsao_vm?: number | string; // dias
  
  // Avaliações RASS/CPOT
  ultima_avaliacao_sed?: Date;
  rass_atual?: number; // -5 a +4
  cpot_expressao?: number | string; // 0-2
  cpot_movimentos?: number | string; // 0-2
  cpot_tensao?: number | string; // 0-2
  cpot_ventilador?: number | string; // 0-2
  cpot_total?: number; // calculado
  
  // Medicamentos ativos
  fentanil_dose?: number | string; // mcg/kg/h
  fentanil_concentracao?: number | string; // mcg/mL
  fentanil_infusao?: number | string; // mL/h
  
  propofol_dose?: number | string; // mg/kg/h
  propofol_concentracao?: number | string; // mg/mL
  propofol_infusao?: number | string; // mL/h
  
  dexmedetomidina_dose?: number | string; // mcg/kg/h
  dexmedetomidina_concentracao?: number | string; // mcg/mL
  dexmedetomidina_infusao?: number | string; // mL/h
  
  midazolam_dose?: number | string; // mg/kg/h
  midazolam_concentracao?: number | string; // mg/mL
  midazolam_infusao?: number | string; // mL/h
  
  // Observações sobre sedação
  observacoes_sedacao?: string;
  meta_rass?: number; // meta RASS desejada
  meta_cpot?: number; // meta CPOT desejada
}

export type PatientDatabase = Record<string, Patient>;

export enum Tab {
  Resumo = 'resumo',
  Sistemas = 'sistemas',
  VM = 'vm',
  Scores = 'scores',
  Balanco = 'balanco',
  Plano = 'plano',
  Sedacao = 'sedacao-analgesia',
  IA = 'ia-intensivista',
}

// SMART-SED UTI - Tipos específicos para Sedação e Analgesia

export interface Medicamento {
  nome: string;
  codigo: string;
  concentracoes: number[]; // mg/mL ou mcg/mL
  unidadeDose: 'mcg/kg/h' | 'mg/kg/h' | 'mg/h';
  unidadeConcentracao: 'mg/mL' | 'mcg/mL';
  indicacoes: string[];
  contraindicacoes: string[];
  interacoes: string[];
  alertasFDA: string[];
  limitesDose: {
    minima: number;
    maxima: number;
    inicial: number;
  };
  monitorização: string[];
}

export interface RASSScore {
  valor: number; // -5 a +4
  descricao: string;
  interpretacao: string;
  meta: boolean; // Se é a meta ideal (-1 a 0)
}

export interface CPOTParameter {
  nome: string;
  opcoes: CPOTOption[];
}

export interface CPOTOption {
  valor: number; // 0, 1 ou 2
  descricao: string;
  criterio: string;
}

export interface CPOTScore {
  expressaoFacial: number;
  movimentosCorporais: number;
  tensaoMuscular: number;
  ventilador: number;
  total: number;
  interpretacao: 'adequado' | 'dor_leve' | 'dor_significativa';
  timestamp: Date;
}

export interface CalculoDose {
  medicamento: Medicamento;
  peso: number;
  doseDesejada: number;
  concentracao: number;
  resultado: {
    infusaoML: number;
    doseReal: number;
    faixaTerapeutica: {
      min: number;
      max: number;
    };
    alertas: string[];
    tempoReavaliacao: number; // minutos
  };
}

export interface AlertaSeguranca {
  tipo: 'contraindicacao' | 'interacao' | 'dose_limite' | 'monitorização' | 'fda';
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  titulo: string;
  descricao: string;
  acao: string;
  medicamentoRelacionado?: string;
}

// Constantes para SMART-SED UTI

export const MEDICAMENTOS_DISPONIVEIS: Medicamento[] = [
  {
    nome: 'Fentanil',
    codigo: 'FENT',
    concentracoes: [50, 100], // mcg/mL
    unidadeDose: 'mcg/kg/h',
    unidadeConcentracao: 'mcg/mL',
    indicacoes: ['Analgesia', 'Sedação complementar'],
    contraindicacoes: ['Alergia conhecida', 'Íleo paralítico'],
    interacoes: ['Midazolam (sinergismo)', 'Propofol (hipotensão)'],
    alertasFDA: ['Risco de rigidez torácica em doses altas'],
    limitesDose: {
      minima: 0.5,
      maxima: 10,
      inicial: 1.5
    },
    monitorização: ['Frequência respiratória', 'Saturação O2', 'Pressão arterial']
  },
  {
    nome: 'Propofol',
    codigo: 'PROP',
    concentracoes: [10, 20], // mg/mL
    unidadeDose: 'mg/kg/h',
    unidadeConcentracao: 'mg/mL',
    indicacoes: ['Sedação', 'Indução anestésica'],
    contraindicacoes: ['Alergia a soja/ovo', 'Instabilidade hemodinâmica grave'],
    interacoes: ['Fentanil (hipotensão)', 'Midazolam (depressão respiratória)'],
    alertasFDA: ['PRIS - Síndrome da infusão do propofol', 'Limite 4mg/kg/h por >48h'],
    limitesDose: {
      minima: 0.5,
      maxima: 4,
      inicial: 1.5
    },
    monitorização: ['Pressão arterial', 'Triglicerídeos', 'CK', 'Lactato']
  },
  {
    nome: 'Dexmedetomidina',
    codigo: 'DEX',
    concentracoes: [4, 100], // mcg/mL
    unidadeDose: 'mcg/kg/h',
    unidadeConcentracao: 'mcg/mL',
    indicacoes: ['Sedação consciente', 'Weaning ventilador'],
    contraindicacoes: ['Bloqueio AV avançado', 'Bradicardia <60bpm'],
    interacoes: ['Beta-bloqueadores (bradicardia)', 'Digitálicos (BAV)'],
    alertasFDA: ['Bradicardia e hipotensão dose-dependentes'],
    limitesDose: {
      minima: 0.2,
      maxima: 1.5,
      inicial: 0.5
    },
    monitorização: ['ECG contínuo', 'Pressão arterial', 'Frequência cardíaca']
  },
  {
    nome: 'Midazolam',
    codigo: 'MID',
    concentracoes: [1, 5], // mg/mL
    unidadeDose: 'mg/kg/h',
    unidadeConcentracao: 'mg/mL',
    indicacoes: ['Sedação', 'Ansiolítico', 'Anticonvulsivante'],
    contraindicacoes: ['Insuficiência respiratória grave', 'Miastenia gravis'],
    interacoes: ['Propofol (depressão respiratória)', 'Fentanil (sinergismo)'],
    alertasFDA: ['Acúmulo em infusões prolongadas', 'Síndrome de abstinência'],
    limitesDose: {
      minima: 0.02,
      maxima: 0.2,
      inicial: 0.05
    },
    monitorização: ['Sedação', 'Função respiratória', 'Função hepática']
  }
];

export const RASS_SCALE: RASSScore[] = [
  { valor: 4, descricao: 'Combativo', interpretacao: 'Combativo, violento, risco para equipe', meta: false },
  { valor: 3, descricao: 'Muito agitado', interpretacao: 'Remove tubos/cateteres, não obedece comandos', meta: false },
  { valor: 2, descricao: 'Agitado', interpretacao: 'Movimentos não propositais frequentes', meta: false },
  { valor: 1, descricao: 'Inquieto', interpretacao: 'Ansioso, movimentos não agressivos', meta: false },
  { valor: 0, descricao: 'Alerta e calmo', interpretacao: 'Desperto, calmo, cooperativo', meta: true },
  { valor: -1, descricao: 'Sonolento', interpretacao: 'Desperta ao chamado (voz), mantém contato visual >10s', meta: true },
  { valor: -2, descricao: 'Sedação leve', interpretacao: 'Desperta ao chamado, mantém contato visual <10s', meta: false },
  { valor: -3, descricao: 'Sedação moderada', interpretacao: 'Desperta ao estímulo físico, sem contato visual', meta: false },
  { valor: -4, descricao: 'Sedação profunda', interpretacao: 'Sem resposta ao chamado, desperta ao estímulo físico', meta: false },
  { valor: -5, descricao: 'Não desperta', interpretacao: 'Sem resposta ao chamado ou estímulo físico', meta: false }
];

export const CPOT_PARAMETERS: CPOTParameter[] = [
  {
    nome: 'Expressão Facial',
    opcoes: [
      { valor: 0, descricao: 'Relaxada', criterio: 'Sem tensão muscular facial' },
      { valor: 1, descricao: 'Tensa', criterio: 'Franzir testa, sobrancelhas contraídas' },
      { valor: 2, descricao: 'Contraída', criterio: 'Pálpebras fechadas, músculos faciais contraídos' }
    ]
  },
  {
    nome: 'Movimentos Corporais',
    opcoes: [
      { valor: 0, descricao: 'Ausentes', criterio: 'Sem movimentos ou posição normal' },
      { valor: 1, descricao: 'Proteção', criterio: 'Movimentos lentos, cautelosos, toca área dolorida' },
      { valor: 2, descricao: 'Agitação', criterio: 'Movimentos frequentes, inquieto, não colabora' }
    ]
  },
  {
    nome: 'Tensão Muscular',
    opcoes: [
      { valor: 0, descricao: 'Relaxado', criterio: 'Sem resistência a movimentos passivos' },
      { valor: 1, descricao: 'Tenso', criterio: 'Resistência a movimentos passivos' },
      { valor: 2, descricao: 'Muito tenso', criterio: 'Forte resistência, impossível completar movimentos' }
    ]
  },
  {
    nome: 'Ventilador',
    opcoes: [
      { valor: 0, descricao: 'Tolerando', criterio: 'Alarmes não ativados, respiração sincronizada' },
      { valor: 1, descricao: 'Tosse', criterio: 'Tosse mas tolerando ventilação' },
      { valor: 2, descricao: 'Fighting', criterio: 'Alarmes frequentes, assincronia, bloqueio' }
    ]
  }
];
