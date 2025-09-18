import React from 'react';
import type { PatientDatabase, Patient } from '../types';

interface SidebarProps {
    patients: PatientDatabase;
    activePatientId: string | null;
    onSelectPatient: (id: string) => void;
    onAddPatient: () => void;
}

const PatientCard: React.FC<{ patient: Patient; isActive: boolean; onClick: () => void }> = ({ patient, isActive, onClick }) => {
    const activeClasses = "medical-card border-medical-primary shadow-glow transform scale-105";
    const baseClasses = "glass-light border-transparent hover:border-medical-secondary";

    return (
        <div
            className={`${isActive ? activeClasses : baseClasses} p-4 rounded-xl mb-3 cursor-pointer transition-all duration-300 ease-out border`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-primary text-lg">{patient.bed || 'Novo Leito'}</h3>
                {isActive && (
                    <div className="w-3 h-3 bg-medical-primary rounded-full animate-pulse"></div>
                )}
            </div>
            <p className="text-sm text-secondary font-medium truncate">
                {patient.name || 'Nome não definido'}, {patient.age || '--'} anos
            </p>
            <p className="text-xs text-medical-info mt-2 truncate font-medium">
                {patient.mainDiagnosis || 'Diagnóstico não informado'}
            </p>
            <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-muted">Dia UTI: {patient.icuDay || '--'}</span>
                <span className={`px-2 py-1 rounded-lg font-semibold ${
                    patient.icuDay && parseInt(String(patient.icuDay)) > 7
                        ? 'bg-medical-warning/20 text-medical-warning'
                        : 'bg-medical-success/20 text-medical-success'
                }`}>
                    {patient.icuDay && parseInt(String(patient.icuDay)) > 7 ? 'Prolongado' : 'Estável'}
                </span>
            </div>
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ patients, activePatientId, onSelectPatient, onAddPatient }) => {
    return (
        <aside className="glass w-80 h-full p-6 overflow-y-auto flex flex-col border-r border-white/10">
            <div className="flex items-center mb-8 flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-medical-primary to-medical-secondary rounded-2xl flex items-center justify-center mr-4 shadow-glow">
                    <span className="text-white font-bold text-2xl">🏥</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-primary bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        UTI.AI
                    </h1>
                    <p className="text-sm text-secondary font-medium">Sistema Inteligente de UTI</p>
                </div>
            </div>

            <button
                onClick={onAddPatient}
                className="btn-primary mb-6 flex items-center justify-center py-4 px-6 text-sm font-semibold flex-shrink-0 group w-full"
            >
                <span className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200">+</span>
                <span>Adicionar Novo Paciente</span>
            </button>

            <div className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-primary">Pacientes Ativos</h2>
                    <div className="bg-medical-accent/20 text-medical-accent px-3 py-1 rounded-full text-sm font-semibold">
                        {Object.keys(patients).length}
                    </div>
                </div>

                <div className="space-y-3">
                    {Object.entries(patients).map(([id, patient]) => (
                        <PatientCard
                            key={id}
                            patient={patient}
                            isActive={activePatientId === id}
                            onClick={() => onSelectPatient(id)}
                        />
                    ))}
                </div>

                {Object.keys(patients).length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🏥</span>
                        </div>
                        <p className="text-secondary font-medium">Nenhum paciente cadastrado</p>
                        <p className="text-muted text-sm mt-1">Clique no botão acima para adicionar</p>
                    </div>
                )}
            </div>
        </aside>
    );
};