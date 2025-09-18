
import React, { useState, useMemo, useCallback } from 'react';
import type { Patient } from '../../types';
// FIX: Import GoogleGenAI for AI functionality.
import { GoogleGenerativeAI } from "@google/generative-ai";

interface TabProps {
    patient: Patient;
}

export const IaIntensivistaTab: React.FC<TabProps> = ({ patient }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');
    // FIX: Add state to handle potential API errors.
    const [error, setError] = useState('');

    const sofaTotal = useMemo(() => ['sofa_resp', 'sofa_coag', 'sofa_liver', 'sofa_cardio', 'sofa_gcs', 'sofa_renal'].reduce((acc, key) => acc + (parseInt(String(patient[key as keyof Patient])) || 0), 0), [patient]);
    const gcsTotal = useMemo(() => ['gcs_eyes', 'gcs_verbal', 'gcs_motor'].reduce((acc, key) => acc + (parseInt(String(patient[key as keyof Patient])) || 0), 0), [patient]);
    const qsofaTotal = useMemo(() => ['qsofa_mental', 'qsofa_sbp', 'qsofa_rr'].reduce((acc, key) => acc + (parseInt(String(patient[key as keyof Patient])) || 0), 0), [patient]);
    const p = {
        vm_plato: parseFloat(String(patient.vm_plato)) || 0,
        vm_peep: parseFloat(String(patient.vm_peep)) || 0,
        pf_pao2: parseFloat(String(patient.pf_pao2)) || 0,
        pf_fio2: parseFloat(String(patient.pf_fio2)) || 0,
    };
    const drivingPressure = useMemo(() => p.vm_plato > p.vm_peep ? p.vm_plato - p.vm_peep : 0, [p.vm_plato, p.vm_peep]);
    const pfRatio = useMemo(() => p.pf_pao2 > 0 && p.pf_fio2 >= 21 ? p.pf_pao2 / (p.pf_fio2 / 100) : 0, [p.pf_pao2, p.pf_fio2]);

    // FIX: Replace mock API call with a real Gemini API call.
    const runAiAnalysis = useCallback(async () => {
        setIsLoading(true);
        setResponse('');
        setError('');

        const prompt = `
**ANÁLISE DE PACIENTE DE UTI - IA INTENSIVISTA**

**INSTRUÇÕES:** Aja como um médico intensivista experiente. Analise os dados do paciente abaixo e forneça um parecer conciso e estratégico. Sua resposta DEVE seguir EXATAMENTE o formato Markdown abaixo, preenchendo as informações e os alertas/recomendações com base nos dados. NÃO inclua nenhuma outra informação ou formatação. A data e hora atual é ${new Date().toLocaleString('pt-BR')}.

**FORMATO DA RESPOSTA (MARKDOWN):**
**🤖 ANÁLISE INTEGRADA - IA INTENSIVISTA**

**PACIENTE:** {NOME}, {IDADE} anos
**DIAGNÓSTICO:** {DIAGNÓSTICO PRINCIPAL}
**DIA DE UTI:** {DIA DE UTI}

**📊 GRAVIDADE GERAL:**
• SOFA Score: {SOFA_TOTAL} pontos {AVALIAÇÃO SOFA}
• Glasgow: {GCS_TOTAL} pontos {AVALIAÇÃO GCS}
• qSOFA: {QSOFA_TOTAL} pontos {AVALIAÇÃO QSOFA}

**🫁 ANÁLISE RESPIRATÓRIA:**
• Relação P/F: {PF_RATIO} {AVALIAÇÃO PF}
• Driving Pressure: {DRIVING_PRESSURE} cmH₂O {AVALIAÇÃO DP}

**⚠️ ALERTAS PRIORITÁRIOS:**
{LISTA DE ALERTAS. Ex: • 🚨 SOFA ≥10: Risco de mortalidade >40%}

**🎯 RECOMENDAÇÕES:**
{LISTA DE RECOMENDAÇÕES. Ex: • Otimizar PEEP para DP <15 cmH₂O}

*Análise gerada em {DATA E HORA ATUAL}*

---

**DADOS DO PACIENTE PARA ANÁLISE:**
*   **Nome:** ${patient.name || 'Não informado'}
*   **Idade:** ${patient.age || '--'}
*   **Sexo:** ${patient.gender}
*   **Dia de UTI:** ${patient.icuDay || '--'}
*   **Diagnóstico Principal:** ${patient.mainDiagnosis || 'Não definido'}
*   **História:** ${patient.history}
*   **Problemas Atuais:** ${patient.problems}
*   **Dados Neurológicos:** ${patient.neuro}, Glasgow Score Total: ${gcsTotal}
*   **Dados Cardiovasculares:** ${patient.cardio}
*   **Dados Respiratórios:** ${patient.resp}, Modo VM: ${patient.vm_modo}, PEEP: ${patient.vm_peep}, Platô: ${patient.vm_plato}, Driving Pressure: ${drivingPressure}, Relação P/F: ${pfRatio > 0 ? pfRatio.toFixed(0) : 'N/A'}
*   **Dados Renais/Metabólicos:** ${patient.renal}
*   **SOFA Score Total:** ${sofaTotal}
*   **qSOFA Score Total:** ${qsofaTotal}
*   **Balanço Hídrico Acumulado:** ${patient.balanco_acumulado}
*   **Plano Terapêutico Atual:** ${patient.plano}
`;
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setResponse(result.text);

        } catch (e) {
            console.error("Error calling Gemini API:", e);
            setError("Ocorreu um erro ao comunicar com a IA. Por favor, verifique sua conexão, a validade da chave de API e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, [patient, sofaTotal, gcsTotal, qsofaTotal, pfRatio, drivingPressure]);


    return (
        <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Análise do <span className="main-gradient-text">IA-Intensivista</span></h3>
            <p className="text-gray-400 mb-6">Pressione o botão para que a IA analise todos os dados e forneça um parecer estratégico.</p>
            <button onClick={runAiAnalysis} disabled={isLoading} className="btn-primary px-8 py-3 text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <span>{isLoading ? 'Analisando...' : '🤖 Analisar Paciente'}</span>
            </button>
            
            {error && (
                <div className="mt-8 bg-red-900/50 border-l-4 border-red-500 p-4 rounded-lg text-sm text-left">
                    <h4 className="font-bold text-red-400">Erro na Análise</h4>
                    <p className="text-red-300">{error}</p>
                </div>
            )}

            {(isLoading || response) && !error && (
                <div className="mt-8">
                    {isLoading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="loader"></div>
                            <p className="ml-4 text-lg text-gray-300">Analisando dados...</p>
                        </div>
                    )}
                    {response && !isLoading && (
                        <div>
                            <h4 className="text-xl font-semibold text-white mb-4">📋 Parecer do IA-Intensivista</h4>
                            <div className="bg-gray-900/50 border-l-4 border-purple-600 p-4 rounded-lg text-sm text-left whitespace-pre-wrap font-mono">
                                {response}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
