import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Patient, CPOTScore, CalculoDose, AlertaSeguranca } from '../../types';
import { RASS_SCALE, CPOT_PARAMETERS, MEDICAMENTOS_DISPONIVEIS } from '../../types';
import { FormInput, FormSelect, FormTextarea } from '../FormControls';
import { ScoreCard } from '../ScoreCard';

interface TabProps {
    patient: Patient;
    onUpdate: (data: Partial<Patient>) => void;
}

const MedicamentoCard: React.FC<{
    titulo: string;
    codigo: string;
    dose: number | string;
    concentracao: number | string;
    infusao: number | string;
    peso: number;
    onUpdate: (campo: string, valor: any) => void;
    medicamento: any;
}> = ({ titulo, codigo, dose, concentracao, infusao, peso, onUpdate, medicamento }) => {
    
    const calcularInfusao = useCallback(() => {
        const pesoNum = peso || 70;
        const doseNum = parseFloat(String(dose)) || 0;
        const concNum = parseFloat(String(concentracao)) || 1;

        if (doseNum > 0 && concNum > 0) {
            const infusaoCalc = (doseNum * pesoNum) / concNum;
            onUpdate(`${codigo.toLowerCase()}_infusao`, Number(infusaoCalc.toFixed(2)));
        }
    }, [dose, concentracao, codigo, peso, onUpdate]);

    // Auto-cálculo quando dose ou concentração mudam
    useEffect(() => {
        calcularInfusao();
    }, [calcularInfusao]);

    const getDoseColor = () => {
        const doseNum = parseFloat(String(dose)) || 0;
        if (!medicamento) return 'text-gray-300';
        
        if (doseNum < medicamento.limitesDose.minima) return 'text-blue-400';
        if (doseNum > medicamento.limitesDose.maxima) return 'text-red-400';
        if (doseNum > medicamento.limitesDose.maxima * 0.8) return 'text-yellow-400';
        return 'text-green-400';
    };

    return (
        <ScoreCard title={titulo} className="bg-gray-800 border border-gray-600">
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="text-xs text-gray-400">Dose ({medicamento?.unidadeDose})</label>
                    <FormInput
                        type="number"
                        step="0.1"
                        value={dose}
                        onChange={(e) => onUpdate(`${codigo.toLowerCase()}_dose`, e.target.value)}
                        onBlur={calcularInfusao}
                        className="text-center"
                    />
                    {medicamento && (
                        <div className="text-xs mt-1 text-gray-500">
                            Faixa: {medicamento.limitesDose.minima}-{medicamento.limitesDose.maxima}
                        </div>
                    )}
                </div>
                <div>
                    <label className="text-xs text-gray-400">Concentração ({medicamento?.unidadeConcentracao})</label>
                    <FormSelect
                        value={concentracao}
                        onChange={(e) => onUpdate(`${codigo.toLowerCase()}_concentracao`, e.target.value)}
                        onBlur={calcularInfusao}
                    >
                        <option value="">Selecionar</option>
                        {medicamento?.concentracoes.map((conc: number) => (
                            <option key={conc} value={conc}>{conc}</option>
                        ))}
                    </FormSelect>
                </div>
            </div>
            
            <div className="text-center pt-2 border-t border-gray-600">
                <span className="text-gray-400 text-sm">Infusão: </span>
                <span className={`font-bold text-lg ${getDoseColor()}`}>
                    {parseFloat(String(infusao)) > 0 ? parseFloat(String(infusao)).toFixed(1) : '--'} mL/h
                </span>
            </div>
            
            {medicamento && (
                <div className="mt-2 text-xs text-gray-500">
                    <div>🔍 Monitor: {medicamento.monitorização.slice(0, 2).join(', ')}</div>
                    {parseFloat(String(dose)) > medicamento.limitesDose.maxima * 0.8 && (
                        <div className="text-yellow-400 mt-1">⚠️ Dose próxima ao limite máximo</div>
                    )}
                    {parseFloat(String(dose)) > medicamento.limitesDose.maxima && (
                        <div className="text-red-400 mt-1">🚨 Dose acima do limite seguro!</div>
                    )}
                </div>
            )}
        </ScoreCard>
    );
};

const RASSComponent: React.FC<{
    valor: number;
    onUpdate: (valor: number) => void;
}> = ({ valor, onUpdate }) => {
    return (
        <ScoreCard title="Escala RASS" className="bg-gray-800">
            <div className="space-y-2">
                {RASS_SCALE.map((score) => (
                    <button
                        key={score.valor}
                        type="button"
                        onClick={() => onUpdate(score.valor)}
                        className={`w-full p-3 border-2 rounded-lg transition-all text-left ${
                            valor === score.valor 
                                ? score.meta 
                                    ? 'bg-green-600 border-green-500 text-white' 
                                    : score.valor > 0 
                                        ? 'bg-red-600 border-red-500 text-white'
                                        : 'bg-purple-600 border-purple-500 text-white'
                                : 'border-gray-600 hover:border-purple-400'
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="font-bold text-lg">
                                    {score.valor >= 0 ? '+' : ''}{score.valor}
                                </span>
                                <span className="ml-2">{score.descricao}</span>
                                {score.meta && <span className="ml-2 text-xs">🎯 META</span>}
                            </div>
                        </div>
                        <div className="text-sm mt-1 opacity-90">{score.interpretacao}</div>
                    </button>
                ))}
            </div>
            
            <div className="mt-4 p-3 bg-gray-700 rounded">
                <div className="text-sm font-medium mb-2">Interpretação Atual</div>
                {valor >= -1 && valor <= 0 && (
                    <div className="text-green-400">✅ Meta RASS atingida - Manter sedação</div>
                )}
                {valor > 0 && (
                    <div className="text-red-400">⚠️ Agitação - Considerar aumento da sedação</div>
                )}
                {valor < -2 && (
                    <div className="text-yellow-400">📉 Sedação excessiva - Considerar redução</div>
                )}
            </div>
        </ScoreCard>
    );
};

const CPOTComponent: React.FC<{
    expressao: number;
    movimentos: number;
    tensao: number;
    ventilador: number;
    onUpdate: (campo: string, valor: number) => void;
}> = ({ expressao, movimentos, tensao, ventilador, onUpdate }) => {
    
    const total = useMemo(() => {
        return (expressao || 0) + (movimentos || 0) + (tensao || 0) + (ventilador || 0);
    }, [expressao, movimentos, tensao, ventilador]);

    const interpretacao = useMemo(() => {
        if (total <= 2) return { texto: '✅ Analgesia Adequada', cor: 'text-green-400' };
        if (total <= 4) return { texto: '⚠️ Dor Leve', cor: 'text-yellow-400' };
        return { texto: '🚨 Dor Significativa', cor: 'text-red-400' };
    }, [total]);

    const parametros = [
        { nome: 'Expressão Facial', valor: expressao, campo: 'cpot_expressao' },
        { nome: 'Movimentos', valor: movimentos, campo: 'cpot_movimentos' },
        { nome: 'Tensão Muscular', valor: tensao, campo: 'cpot_tensao' },
        { nome: 'Ventilador', valor: ventilador, campo: 'cpot_ventilador' }
    ];

    return (
        <ScoreCard title="Escala CPOT" className="bg-gray-800">
            <div className="space-y-4">
                {parametros.map((param, index) => (
                    <div key={param.campo}>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                            {param.nome}
                        </label>
                        <div className="flex gap-2">
                            {CPOT_PARAMETERS[index]?.opcoes.map((opcao) => (
                                <button
                                    key={opcao.valor}
                                    type="button"
                                    onClick={() => onUpdate(param.campo, opcao.valor)}
                                    className={`flex-1 p-2 border rounded text-center transition-all ${
                                        param.valor === opcao.valor
                                            ? opcao.valor === 0 
                                                ? 'bg-green-600 border-green-500 text-white'
                                                : opcao.valor === 1
                                                    ? 'bg-yellow-600 border-yellow-500 text-white'
                                                    : 'bg-red-600 border-red-500 text-white'
                                            : 'border-gray-600 hover:border-purple-400'
                                    }`}
                                >
                                    <div className="font-bold">{opcao.valor}</div>
                                    <div className="text-xs">{opcao.descricao}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-600 text-center">
                <div className="text-2xl font-bold text-white mb-2">
                    CPOT Total: {total}/8
                </div>
                <div className={`text-lg font-semibold ${interpretacao.cor}`}>
                    {interpretacao.texto}
                </div>
            </div>

            {total > 2 && (
                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500 rounded">
                    <div className="text-yellow-400 font-semibold mb-1">Protocolo Analgesia-First</div>
                    <div className="text-sm text-yellow-300">
                        • Otimizar analgesia antes de ajustar sedação<br/>
                        • Investigar causas de desconforto<br/>
                        • Reavaliação em {total > 4 ? '30-60' : '60-120'} minutos
                    </div>
                </div>
            )}
        </ScoreCard>
    );
};

// Algoritmo PADIS 2018 - Pain, Agitation, Delirium, Immobility, Sleep
const PADISProtocol: React.FC<{
    cpotTotal: number;
    rassAtual: number;
    patient: Patient;
    onUpdate: (data: Partial<Patient>) => void;
}> = ({ cpotTotal, rassAtual, patient, onUpdate }) => {

    const getRecomendacao = useMemo(() => {
        // Algoritmo PADIS 2018
        if (cpotTotal > 2) {
            return {
                prioridade: 'CRÍTICA',
                titulo: '🚨 ANALGESIA FIRST - PADIS 2018',
                acoes: [
                    'NÃO aumentar sedação antes de otimizar analgesia',
                    'Avaliar causas de dor: posicionamento, procedimentos',
                    'Considerar Fentanil 1-2 mcg/kg/h se CPOT > 4',
                    'Reavaliar CPOT em 30-60 min'
                ],
                cor: 'border-red-500 bg-red-900/20 text-red-300'
            };
        }

        if (cpotTotal <= 2 && rassAtual > 0) {
            return {
                prioridade: 'ALTA',
                titulo: '⚡ AGITAÇÃO - Otimizar Sedação',
                acoes: [
                    rassAtual >= 3 ? 'EMERGÊNCIA: Considerar bolus Propofol 0.5-1mg/kg' : '',
                    'Aumentar Propofol em 0.5mg/kg/h (máx 4mg/kg/h)',
                    'Alternativa: Dexmedetomidina 0.2-1.5mcg/kg/h',
                    'Meta RASS: -1 a 0',
                    'Reavaliar em 15-30 min'
                ].filter(Boolean),
                cor: 'border-orange-500 bg-orange-900/20 text-orange-300'
            };
        }

        if (cpotTotal <= 2 && rassAtual < -2) {
            return {
                prioridade: 'MÉDIA',
                titulo: '📉 SEDAÇÃO EXCESSIVA - Reduzir',
                acoes: [
                    rassAtual <= -4 ? 'Considerar interrupção diária de sedação' : '',
                    'Reduzir Propofol em 25-50%',
                    'Manter analgesia adequada',
                    'Avaliar despertar espontâneo',
                    'Reavaliar em 60 min'
                ].filter(Boolean),
                cor: 'border-yellow-500 bg-yellow-900/20 text-yellow-300'
            };
        }

        if (cpotTotal <= 2 && rassAtual >= -1 && rassAtual <= 0) {
            return {
                prioridade: 'BAIXA',
                titulo: '✅ META ATINGIDA - Manter',
                acoes: [
                    'Paciente na meta PADIS 2018',
                    'Manter doses atuais',
                    'Avaliar SAT/SBT se indicado',
                    'Próxima avaliação em 4-6h'
                ],
                cor: 'border-green-500 bg-green-900/20 text-green-300'
            };
        }

        return {
            prioridade: 'MÉDIA',
            titulo: '🔄 AJUSTE NECESSÁRIO',
            acoes: ['Reavaliar CPOT e RASS', 'Seguir protocolo PADIS'],
            cor: 'border-blue-500 bg-blue-900/20 text-blue-300'
        };
    }, [cpotTotal, rassAtual]);

    const implementarRecomendacao = useCallback((acao: string) => {
        const peso = parseFloat(String(patient.peso)) || 70;
        const propofolAtual = parseFloat(String(patient.propofol_dose)) || 0;
        const fentanilAtual = parseFloat(String(patient.fentanil_dose)) || 0;

        if (acao.includes('Aumentar Propofol em 0.5mg/kg/h')) {
            const novaDose = Math.min(propofolAtual + 0.5, 4.0);
            onUpdate({ propofol_dose: novaDose });
        } else if (acao.includes('Reduzir Propofol em 25-50%')) {
            const novaDose = propofolAtual * 0.75;
            onUpdate({ propofol_dose: novaDose });
        } else if (acao.includes('Considerar Fentanil 1-2 mcg/kg/h')) {
            const novaDose = Math.max(fentanilAtual, 1.5);
            onUpdate({ fentanil_dose: novaDose });
        }

        // Atualizar timestamp da última avaliação
        onUpdate({ ultima_avaliacao_sed: new Date() });
    }, [patient, onUpdate]);

    return (
        <ScoreCard title={getRecomendacao.titulo} className={`bg-gray-800 border-2 ${getRecomendacao.cor}`}>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Prioridade: {getRecomendacao.prioridade}</span>
                    <span className="text-xs">PADIS 2018</span>
                </div>

                <div className="space-y-2">
                    {getRecomendacao.acoes.map((acao, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-700/50 rounded">
                            <span className="text-sm flex-1">{acao}</span>
                            {acao.includes('Aumentar') || acao.includes('Reduzir') || acao.includes('Considerar Fentanil') ? (
                                <button
                                    onClick={() => implementarRecomendacao(acao)}
                                    className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                                >
                                    Aplicar
                                </button>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </ScoreCard>
    );
};

export const SedacaoTab: React.FC<TabProps> = ({ patient, onUpdate }) => {
    
    // Calcular peso se não estiver definido
    const peso = useMemo(() => {
        if (patient.peso) return parseFloat(String(patient.peso));
        // Estimar peso baseado na idade e gênero se não informado
        const idade = parseFloat(String(patient.age)) || 70;
        const genero = patient.gender;
        if (genero === 'Feminino') return Math.max(50, 70 - (idade > 65 ? (idade - 65) * 0.5 : 0));
        return Math.max(60, 75 - (idade > 65 ? (idade - 65) * 0.5 : 0));
    }, [patient.peso, patient.age, patient.gender]);

    // Estados dos scores
    const rassAtual = useMemo(() => parseInt(String(patient.rass_atual)) || 0, [patient.rass_atual]);
    const cpotTotal = useMemo(() => {
        const expr = parseInt(String(patient.cpot_expressao)) || 0;
        const mov = parseInt(String(patient.cpot_movimentos)) || 0;
        const tens = parseInt(String(patient.cpot_tensao)) || 0;
        const vent = parseInt(String(patient.cpot_ventilador)) || 0;
        return expr + mov + tens + vent;
    }, [patient.cpot_expressao, patient.cpot_movimentos, patient.cpot_tensao, patient.cpot_ventilador]);

    // Medicamentos
    const fentanil = MEDICAMENTOS_DISPONIVEIS.find(m => m.codigo === 'FENT');
    const propofol = MEDICAMENTOS_DISPONIVEIS.find(m => m.codigo === 'PROP');
    const dexmedetomidina = MEDICAMENTOS_DISPONIVEIS.find(m => m.codigo === 'DEX');
    const midazolam = MEDICAMENTOS_DISPONIVEIS.find(m => m.codigo === 'MID');

    const handleRASSUpdate = useCallback((valor: number) => {
        onUpdate({ rass_atual: valor });
    }, [onUpdate]);

    const handleCPOTUpdate = useCallback((campo: string, valor: number) => {
        onUpdate({ [campo]: valor });
    }, [onUpdate]);

    const handleMedicamentoUpdate = useCallback((campo: string, valor: any) => {
        onUpdate({ [campo]: valor });
    }, [onUpdate]);

    return (
        <div className="space-y-6">
            {/* Header da Sedação */}
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded-lg border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    🧠 Protocolo SMART-SED
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="text-gray-400">Peso: </span>
                        <span className="text-white font-semibold">{peso.toFixed(1)} kg</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Última Avaliação: </span>
                        <span className="text-white font-semibold">
                            {patient.ultima_avaliacao_sed ? 
                                new Date(patient.ultima_avaliacao_sed).toLocaleTimeString('pt-BR') : 
                                'Não avaliado'
                            }
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-400">Status: </span>
                        <span className={`font-semibold ${
                            cpotTotal <= 2 && rassAtual >= -1 && rassAtual <= 0 ? 'text-green-400' :
                            cpotTotal > 2 ? 'text-red-400' :
                            'text-yellow-400'
                        }`}>
                            {cpotTotal <= 2 && rassAtual >= -1 && rassAtual <= 0 ? '✅ Adequado' :
                             cpotTotal > 2 ? '🚨 Dor Detectada' :
                             '⚠️ Ajuste Necessário'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Protocolos de Avaliação */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <CPOTComponent
                    expressao={parseInt(String(patient.cpot_expressao)) || 0}
                    movimentos={parseInt(String(patient.cpot_movimentos)) || 0}
                    tensao={parseInt(String(patient.cpot_tensao)) || 0}
                    ventilador={parseInt(String(patient.cpot_ventilador)) || 0}
                    onUpdate={handleCPOTUpdate}
                />
                
                <RASSComponent
                    valor={rassAtual}
                    onUpdate={handleRASSUpdate}
                />
            </div>

            {/* Medicamentos em Uso */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    💊 Medicamentos em Uso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <MedicamentoCard
                        titulo="Fentanil"
                        codigo="FENT"
                        dose={patient.fentanil_dose || 0}
                        concentracao={patient.fentanil_concentracao || 50}
                        infusao={patient.fentanil_infusao || 0}
                        peso={peso}
                        onUpdate={handleMedicamentoUpdate}
                        medicamento={fentanil}
                    />
                    
                    <MedicamentoCard
                        titulo="Propofol"
                        codigo="PROP"
                        dose={patient.propofol_dose || 0}
                        concentracao={patient.propofol_concentracao || 10}
                        infusao={patient.propofol_infusao || 0}
                        peso={peso}
                        onUpdate={handleMedicamentoUpdate}
                        medicamento={propofol}
                    />
                    
                    <MedicamentoCard
                        titulo="Dexmedetomidina"
                        codigo="DEX"
                        dose={patient.dexmedetomidina_dose || 0}
                        concentracao={patient.dexmedetomidina_concentracao || 4}
                        infusao={patient.dexmedetomidina_infusao || 0}
                        peso={peso}
                        onUpdate={handleMedicamentoUpdate}
                        medicamento={dexmedetomidina}
                    />
                    
                    <MedicamentoCard
                        titulo="Midazolam"
                        codigo="MID"
                        dose={patient.midazolam_dose || 0}
                        concentracao={patient.midazolam_concentracao || 1}
                        infusao={patient.midazolam_infusao || 0}
                        peso={peso}
                        onUpdate={handleMedicamentoUpdate}
                        medicamento={midazolam}
                    />
                </div>
            </div>

            {/* Protocolo PADIS 2018 */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    🎯 Protocolo PADIS 2018 - Recomendações Baseadas em Evidências
                </h3>
                <PADISProtocol
                    cpotTotal={cpotTotal}
                    rassAtual={rassAtual}
                    patient={patient}
                    onUpdate={onUpdate}
                />
            </div>

            {/* Metas e Alertas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScoreCard title="🎯 Metas Terapêuticas" className="bg-gray-800">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Meta RASS:</span>
                            <FormSelect
                                value={patient.meta_rass || -1}
                                onChange={(e) => onUpdate({ meta_rass: parseInt(e.target.value) })}
                                className="w-24"
                            >
                                <option value={-1}>-1</option>
                                <option value={0}>0</option>
                                <option value={-2}>-2</option>
                            </FormSelect>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Meta CPOT:</span>
                            <FormSelect
                                value={patient.meta_cpot || 2}
                                onChange={(e) => onUpdate({ meta_cpot: parseInt(e.target.value) })}
                                className="w-24"
                            >
                                <option value={0}>≤ 0</option>
                                <option value={2}>≤ 2</option>
                            </FormSelect>
                        </div>
                        <div className="pt-2 border-t border-gray-600">
                            <div className="text-sm text-gray-400">Status das Metas:</div>
                            <div className={`text-sm font-medium ${
                                rassAtual === (patient.meta_rass || -1) && cpotTotal <= (patient.meta_cpot || 2)
                                    ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                                RASS: {rassAtual === (patient.meta_rass || -1) ? '✅' : '❌'} | 
                                CPOT: {cpotTotal <= (patient.meta_cpot || 2) ? '✅' : '❌'}
                            </div>
                        </div>
                    </div>
                </ScoreCard>

                <ScoreCard title="⚠️ Alertas de Segurança Avançados" className="bg-gray-800">
                    <div className="space-y-2 text-sm">
                        {/* Alertas CRÍTICOS baseados em evidências */}
                        {cpotTotal > 4 && (
                            <div className="p-3 bg-red-900/30 border border-red-500 rounded">
                                <div className="font-semibold text-red-400">🚨 DOR SIGNIFICATIVA</div>
                                <div className="text-red-300">PADIS 2018: NÃO aumentar sedação até CPOT ≤2</div>
                                <div className="text-xs text-red-400 mt-1">
                                    • Investigar causa: posicionamento, procedimentos
                                    <br/>• Considerar analgesia regional se aplicável
                                </div>
                            </div>
                        )}

                        {parseFloat(String(patient.propofol_dose)) > 4 && (
                            <div className="p-3 bg-red-900/30 border border-red-500 rounded">
                                <div className="font-semibold text-red-400">🚨 RISCO DE PRIS</div>
                                <div className="text-red-300">Propofol {'>'}4mg/kg/h por {'>'}48h</div>
                                <div className="text-xs text-red-400 mt-1">
                                    • Monitorar: CK, Lactato, ECG, Função renal
                                    <br/>• Considerar substituição por Dexmedetomidina
                                </div>
                            </div>
                        )}

                        {parseFloat(String(patient.propofol_dose)) > 2 && parseFloat(String(patient.tempo_intubacao)) > 48 && (
                            <div className="p-3 bg-orange-900/30 border border-orange-500 rounded">
                                <div className="font-semibold text-orange-400">⚠️ PROPOFOL PROLONGADO</div>
                                <div className="text-orange-300">Uso {'>'} 48h - Avaliar alternativas</div>
                                <div className="text-xs text-orange-400 mt-1">
                                    • Considerar rotação para Dexmedetomidina
                                    <br/>• Monitorar triglicerídeos
                                </div>
                            </div>
                        )}

                        {rassAtual > 2 && (
                            <div className="p-3 bg-red-900/30 border border-red-500 rounded">
                                <div className="font-semibold text-red-400">🚨 AGITAÇÃO GRAVE</div>
                                <div className="text-red-300">RASS +{rassAtual} - Risco para segurança</div>
                                <div className="text-xs text-red-400 mt-1">
                                    • Avaliar causas reversíveis: dor, hipoxemia, delirium
                                    <br/>• Considerar contenção temporária se necessário
                                </div>
                            </div>
                        )}

                        {rassAtual < -3 && (
                            <div className="p-3 bg-yellow-900/30 border border-yellow-500 rounded">
                                <div className="font-semibold text-yellow-400">📉 SEDAÇÃO PROFUNDA</div>
                                <div className="text-yellow-300">RASS {rassAtual} - Risco de complicações</div>
                                <div className="text-xs text-yellow-400 mt-1">
                                    • Risco: delirium, fraqueza, trombose
                                    <br/>• Considerar interrupção diária de sedação
                                </div>
                            </div>
                        )}

                        {parseFloat(String(patient.fentanil_dose)) > 5 && (
                            <div className="p-3 bg-yellow-900/30 border border-yellow-500 rounded">
                                <div className="font-semibold text-yellow-400">⚠️ FENTANIL ALTO</div>
                                <div className="text-yellow-300">Dose {parseFloat(String(patient.fentanil_dose)).toFixed(1)} mcg/kg/h</div>
                                <div className="text-xs text-yellow-400 mt-1">
                                    • Risco de tolerância e dependência
                                    <br/>• Considerar rotação de opióides
                                </div>
                            </div>
                        )}

                        {/* Alertas de interação medicamentosa */}
                        {parseFloat(String(patient.propofol_dose)) > 0 && parseFloat(String(patient.midazolam_dose)) > 0 && (
                            <div className="p-3 bg-orange-900/30 border border-orange-500 rounded">
                                <div className="font-semibold text-orange-400">⚠️ INTERAÇÃO MEDICAMENTOSA</div>
                                <div className="text-orange-300">Propofol + Midazolam - Depressão sinérgica</div>
                                <div className="text-xs text-orange-400 mt-1">
                                    • Monitorar função respiratória e hemodinâmica
                                </div>
                            </div>
                        )}

                        {/* Quando tudo está adequado */}
                        {cpotTotal <= 2 && rassAtual >= -1 && rassAtual <= 0 && (
                            <div className="p-3 bg-green-900/30 border border-green-500 rounded">
                                <div className="font-semibold text-green-400">✅ PROTOCOLO ADEQUADO</div>
                                <div className="text-green-300">Metas PADIS 2018 atingidas</div>
                                <div className="text-xs text-green-400 mt-1">
                                    • Manter conduta atual
                                    <br/>• Próxima avaliação em 4-6h
                                </div>
                            </div>
                        )}
                    </div>
                </ScoreCard>
            </div>

            {/* Observações e Plano */}
            <ScoreCard title="📝 Observações sobre Sedação/Analgesia" className="bg-gray-800">
                <FormTextarea
                    rows={6}
                    value={patient.observacoes_sedacao || ''}
                    onChange={(e) => onUpdate({ observacoes_sedacao: e.target.value })}
                    placeholder="Observações sobre ajustes de sedação, resposta do paciente, eventos adversos, planos de desmame..."
                />
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Tempo de Intubação (horas)</label>
                        <FormInput
                            type="number"
                            value={patient.tempo_intubacao || ''}
                            onChange={(e) => onUpdate({ tempo_intubacao: e.target.value })}
                            placeholder="Ex: 72"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Previsão VM (dias)</label>
                        <FormInput
                            type="number"
                            value={patient.previsao_vm || ''}
                            onChange={(e) => onUpdate({ previsao_vm: e.target.value })}
                            placeholder="Ex: 5"
                        />
                    </div>
                </div>
            </ScoreCard>

            {/* Protocolo de Avaliação */}
            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                <h4 className="font-semibold text-blue-400 mb-2">📋 Protocolo de Avaliação</h4>
                <div className="text-sm text-gray-300 space-y-1">
                    <div>1. <strong>Analgesia First:</strong> Sempre avaliar CPOT primeiro</div>
                    <div>2. <strong>Se CPOT ≤ 2:</strong> Proceder com avaliação RASS</div>
                    <div>3. <strong>Se CPOT {'>'}  2:</strong> Otimizar analgesia antes de ajustar sedação</div>
                    <div>4. <strong>Meta RASS:</strong> -1 a 0 (sonolento mas despertável)</div>
                    <div>5. <strong>Reavaliação:</strong> A cada 4-6h ou conforme protocolo</div>
                </div>
                
                <button
                    onClick={() => onUpdate({ ultima_avaliacao_sed: new Date() })}
                    className="mt-3 btn-primary px-4 py-2 rounded-lg font-semibold"
                >
                    ⏰ Registrar Avaliação Atual
                </button>
            </div>
        </div>
    );
};
