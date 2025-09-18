
import React, { useState, useMemo } from 'react';
import type { Patient } from '../types/types';
import { Tab } from '../types/types';
import { ResumoTab, SistemasTab, VmTab, ScoresTab, BalancoTab, PlanoTab, SedacaoTab, IaIntensivistaTab } from './tabs';

interface MainContentProps {
    patient: Patient | null;
    onUpdatePatient: (updatedData: Partial<Patient>) => void;
    onOpenModal: () => void;
}

interface TabButtonProps {
    label: string;
    icon: string;
    tabKey: Tab;
    activeTab: Tab;
    isGradient?: boolean;
    onClick: (tab: Tab) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, tabKey, activeTab, isGradient = false, onClick }) => {
    const isActive = activeTab === tabKey;

    return (
        <button
            onClick={() => onClick(tabKey)}
            className={`tab-button px-6 py-3 mx-1 text-sm font-medium transition-all duration-300 ease-out ${isActive ? 'active' : ''}`}
        >
            <span className="mr-2 text-lg">{icon}</span>
            <span>{label}</span>
        </button>
    );
};

export const MainContent: React.FC<MainContentProps> = ({ patient, onUpdatePatient, onOpenModal }) => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Resumo);

    const admissionDateFormatted = useMemo(() => {
        if (!patient?.admissionDate) return '';
        try {
            return new Date(patient.admissionDate + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        } catch {
            return '';
        }
    }, [patient?.admissionDate]);
    
    if (!patient) {
        return (
            <main className="flex-1 h-full p-8 overflow-y-auto flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-medical-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🏥</span>
                    </div>
                    <h2 className="text-3xl font-bold text-primary mb-3">Nenhum paciente selecionado</h2>
                    <p className="text-secondary text-lg">Adicione um novo paciente ou selecione um da lista ao lado.</p>
                    <div className="mt-8">
                        <div className="glass p-6 rounded-2xl max-w-md mx-auto">
                            <h3 className="text-lg font-semibold text-primary mb-4">💡 Dicas do Sistema</h3>
                            <ul className="text-left text-secondary space-y-2">
                                <li className="flex items-center">
                                    <span className="text-medical-accent mr-2">•</span>
                                    Use a aba <strong>Sedação</strong> para protocolos PADIS 2018
                                </li>
                                <li className="flex items-center">
                                    <span className="text-medical-accent mr-2">•</span>
                                    Acesse <strong>Scores</strong> para avaliações clínicas
                                </li>
                                <li className="flex items-center">
                                    <span className="text-medical-accent mr-2">•</span>
                                    Utilize <strong>IA-Intensivista</strong> para sugestões
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case Tab.Resumo: return <ResumoTab patient={patient} onUpdate={onUpdatePatient} />;
            case Tab.Sistemas: return <SistemasTab patient={patient} onUpdate={onUpdatePatient} />;
            case Tab.VM: return <VmTab patient={patient} onUpdate={onUpdatePatient} />;
            case Tab.Scores: return <ScoresTab patient={patient} onUpdate={onUpdatePatient} />;
            case Tab.Balanco: return <BalancoTab patient={patient} onUpdate={onUpdatePatient} />;
            case Tab.Plano: return <PlanoTab patient={patient} onUpdate={onUpdatePatient} />;
            case Tab.Sedacao: return <SedacaoTab patient={patient} onUpdate={onUpdatePatient} />;
            case Tab.IA: return <IaIntensivistaTab patient={patient} />;
            default: return null;
        }
    };

    return (
        <main className="flex-1 h-full overflow-hidden flex flex-col">
            {/* Header do Paciente */}
            <div className="glass-light border-b border-white/10 p-6">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center mb-3">
                            <h2
                                onClick={onOpenModal}
                                className="text-2xl font-bold text-primary cursor-pointer hover:text-medical-secondary transition-all duration-200 transform hover:scale-105"
                                title="Clique para editar dados do paciente"
                            >
                                {patient.bed} - {patient.name}
                            </h2>
                            <span className="ml-3 px-3 py-1 bg-medical-info/20 text-medical-info rounded-full text-sm font-semibold">
                                {patient.age} anos, {patient.gender}
                            </span>
                        </div>
                        <p className="text-secondary font-medium">
                            <span className="text-medical-accent font-semibold">Diagnóstico:</span> {patient.mainDiagnosis}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0 bg-medical-primary/10 rounded-xl p-4">
                        <div className="space-y-2">
                            <p className="text-sm text-secondary">
                                <span className="font-medium">Admissão:</span>
                                <span className="font-bold text-primary ml-1">{admissionDateFormatted}</span>
                            </p>
                            <p className="text-sm text-secondary">
                                <span className="font-medium">Dia de UTI:</span>
                                <span className={`font-bold ml-1 ${
                                    parseInt(String(patient.icuDay)) > 7 ? 'text-medical-warning' : 'text-medical-success'
                                }`}>{patient.icuDay}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 py-4 border-b border-white/10">
                <nav className="flex flex-wrap gap-2">
                    <TabButton label="Resumo" icon="📄" tabKey={Tab.Resumo} activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton label="Sistemas" icon="🏥" tabKey={Tab.Sistemas} activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton label="VM" icon="🫁" tabKey={Tab.VM} activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton label="Scores" icon="📊" tabKey={Tab.Scores} activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton label="Balanço" icon="💧" tabKey={Tab.Balanco} activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton label="Plano" icon="📋" tabKey={Tab.Plano} activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton label="Sedação" icon="🧠" tabKey={Tab.Sedacao} activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton label="IA-Intensivista" icon="🤖" tabKey={Tab.IA} activeTab={activeTab} onClick={setActiveTab} isGradient />
                </nav>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-full">
                    {renderTabContent()}
                </div>
            </div>
        </main>
    );
};
