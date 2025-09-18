
import React, { useState, useEffect, useCallback } from 'react';
import type { Patient, PatientDatabase } from './types/types';
import { INITIAL_PATIENTS, BLANK_PATIENT } from './utils/constants';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { PatientModal } from './components/PatientModal';
import { OfflineIndicator, PWAInstallPrompt } from './components/OfflineIndicator';

const App: React.FC = () => {
    const [patients, setPatients] = useState<PatientDatabase>({});
    const [activePatientId, setActivePatientId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        try {
            const savedData = localStorage.getItem('icuDashboardData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (parsed.patientDatabase && Object.keys(parsed.patientDatabase).length > 0) {
                    setPatients(parsed.patientDatabase);
                    setActivePatientId(parsed.activePatientId || Object.keys(parsed.patientDatabase)[0]);
                    return;
                }
            }
        } catch (e) {
            console.error('Could not load saved data:', e);
        }
        setPatients(INITIAL_PATIENTS);
        setActivePatientId(Object.keys(INITIAL_PATIENTS)[0]);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if(Object.keys(patients).length > 0 && activePatientId) {
                localStorage.setItem('icuDashboardData', JSON.stringify({
                    patientDatabase: patients,
                    activePatientId
                }));
            }
        }, 5000); // Auto-save every 5 seconds after a change
        return () => clearTimeout(timer);
    }, [patients, activePatientId]);

    const handleSelectPatient = (id: string) => {
        setActivePatientId(id);
    };

    const handleAddPatient = () => {
        const newId = `leito_new_${Date.now()}`;
        const newPatient = { ...BLANK_PATIENT };
        setPatients((prev: PatientDatabase) => ({ ...prev, [newId]: newPatient }));
        setActivePatientId(newId);
        setIsModalOpen(true);
    };

    const handleUpdatePatient = useCallback((updatedData: Partial<Patient>) => {
        if (!activePatientId) return;
        setPatients((prev: PatientDatabase) => ({
            ...prev,
            [activePatientId]: { ...prev[activePatientId], ...updatedData },
        }));
    }, [activePatientId]);
    
    const handleSaveFromModal = (patientData: Patient) => {
        if(activePatientId) {
             setPatients((prev: PatientDatabase) => ({
                ...prev,
                [activePatientId]: patientData
            }));
        }
        setIsModalOpen(false);
    };

    const handleDeletePatient = () => {
        if (!activePatientId) return;
        const newPatients = { ...patients };
        delete newPatients[activePatientId];
        setPatients(newPatients);

        const remainingIds = Object.keys(newPatients);
        if (remainingIds.length > 0) {
            setActivePatientId(remainingIds[0]);
        } else {
            setActivePatientId(null);
        }
        setIsModalOpen(false);
    };

    const activePatient = activePatientId ? patients[activePatientId] : null;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-900 text-gray-300">
            {/* Indicador de status offline */}
            <OfflineIndicator />
            
            <Sidebar 
                patients={patients}
                activePatientId={activePatientId}
                onSelectPatient={handleSelectPatient}
                onAddPatient={handleAddPatient}
            />
            <MainContent 
                patient={activePatient}
                onUpdatePatient={handleUpdatePatient}
                onOpenModal={() => setIsModalOpen(true)}
            />
            <PatientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveFromModal}
                onDelete={handleDeletePatient}
                patient={activePatient}
            />
            
            {/* PWA Install Prompt */}
            <PWAInstallPrompt />
        </div>
    );
};

export default App;
