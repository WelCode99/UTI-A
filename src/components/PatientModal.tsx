
import React, { useState, useEffect } from 'react';
import type { Patient } from '../types/types';
import { FormInput, FormSelect } from './FormControls';

interface PatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (patientData: Patient) => void;
    onDelete: () => void;
    patient: Patient | null;
}

export const PatientModal: React.FC<PatientModalProps> = ({ isOpen, onClose, onSave, onDelete, patient }) => {
    const [formData, setFormData] = useState<Patient | null>(null);

    useEffect(() => {
        if (patient) {
            setFormData({ ...patient });
        }
    }, [patient, isOpen]);

    if (!isOpen || !formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => prev ? { ...prev, [id]: value } : null);
    };

    const handleSave = () => {
        if (formData) {
            onSave(formData);
        }
    };
    
    const handleDelete = () => {
        if (window.confirm('Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.')) {
            onDelete();
        }
    };

    return (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg p-6 w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-white">📋 Dados do Paciente</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>
                {/* Abas para organizar os dados */}
                <div className="flex border-b border-gray-700 mb-4">
                    <button className="px-4 py-2 text-blue-400 border-b-2 border-blue-400 font-medium">🏥 Dados Básicos</button>
                    <button className="px-4 py-2 text-gray-400 hover:text-white">💊 Medicações</button>
                    <button className="px-4 py-2 text-gray-400 hover:text-white">📊 Parâmetros</button>
                </div>

                {/* Dados Básicos */}
                <div className="space-y-6">
                    {/* Identificação */}
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-white mb-3">👤 Identificação</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
                                <FormInput id="name" value={formData.name} onChange={handleChange} placeholder="Ex: João Silva Santos" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Idade</label>
                                <FormInput id="age" type="number" value={formData.age} onChange={handleChange} placeholder="Ex: 65" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Sexo</label>
                                <FormSelect id="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </FormSelect>
                            </div>
                        </div>
                    </div>

                    {/* Internação */}
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-white mb-3">🏥 Dados de Internação</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Leito</label>
                                <FormInput id="bed" value={formData.bed} onChange={handleChange} placeholder="Ex: Leito 08" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Data de Admissão</label>
                                <FormInput id="admissionDate" type="date" value={formData.admissionDate} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Dia de UTI</label>
                                <FormInput id="icuDay" type="number" value={formData.icuDay} onChange={handleChange} min="1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Peso (kg)</label>
                                <FormInput id="peso" type="number" step="0.1" value={formData.peso || ''} onChange={handleChange} placeholder="Ex: 75" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Diagnóstico Principal</label>
                            <FormInput id="mainDiagnosis" value={formData.mainDiagnosis} onChange={handleChange} placeholder="Ex: Choque Séptico de Foco Pulmonar" />
                        </div>
                    </div>

                    {/* Ventilação Mecânica */}
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-white mb-3">🫁 Ventilação Mecânica</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Modo Ventilatório</label>
                                <FormSelect id="vm_modo" value={formData.vm_modo || ''} onChange={handleChange}>
                                    <option value="">Selecionar...</option>
                                    <option value="VCV">VCV - Volume Controlado</option>
                                    <option value="PCV">PCV - Pressão Controlada</option>
                                    <option value="PSV">PSV - Pressão Suporte</option>
                                    <option value="CPAP">CPAP</option>
                                    <option value="SIMV">SIMV</option>
                                </FormSelect>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Volume Corrente (mL)</label>
                                <FormInput id="vm_vc" type="number" value={formData.vm_vc || ''} onChange={handleChange} placeholder="Ex: 450" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Frequência (irpm)</label>
                                <FormInput id="vm_fr" type="number" value={formData.vm_fr || ''} onChange={handleChange} placeholder="Ex: 20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">PEEP (cmH₂O)</label>
                                <FormInput id="vm_peep" type="number" value={formData.vm_peep || ''} onChange={handleChange} placeholder="Ex: 10" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">FiO₂ (%)</label>
                                <FormInput id="vm_fio2" type="number" min="21" max="100" value={formData.vm_fio2 || ''} onChange={handleChange} placeholder="Ex: 60" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">PIP (cmH₂O)</label>
                                <FormInput id="vm_pip" type="number" value={formData.vm_pip || ''} onChange={handleChange} placeholder="Ex: 25" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">P.Platô (cmH₂O)</label>
                                <FormInput id="vm_plato" type="number" value={formData.vm_plato || ''} onChange={handleChange} placeholder="Ex: 22" />
                            </div>
                        </div>
                    </div>

                    {/* Sedação e Analgesia */}
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-white mb-3">🧠 Sedação e Analgesia</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">RASS Atual</label>
                                <FormSelect id="rass_atual" value={formData.rass_atual || ''} onChange={handleChange}>
                                    <option value="">Não avaliado</option>
                                    <option value="4">+4 - Combativo</option>
                                    <option value="3">+3 - Muito agitado</option>
                                    <option value="2">+2 - Agitado</option>
                                    <option value="1">+1 - Inquieto</option>
                                    <option value="0">0 - Alerta e calmo</option>
                                    <option value="-1">-1 - Sonolento</option>
                                    <option value="-2">-2 - Sedação leve</option>
                                    <option value="-3">-3 - Sedação moderada</option>
                                    <option value="-4">-4 - Sedação profunda</option>
                                    <option value="-5">-5 - Não desperta</option>
                                </FormSelect>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Meta RASS</label>
                                <FormSelect id="meta_rass" value={formData.meta_rass || ''} onChange={handleChange}>
                                    <option value="-1">-1 (Padrão)</option>
                                    <option value="0">0</option>
                                    <option value="-2">-2</option>
                                    <option value="-3">-3</option>
                                </FormSelect>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Tempo Intubação (h)</label>
                                <FormInput id="tempo_intubacao" type="number" value={formData.tempo_intubacao || ''} onChange={handleChange} placeholder="Ex: 72" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold">🗑️ Excluir Paciente</button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium border border-gray-600">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 btn-primary rounded-lg font-semibold">💾 Salvar Alterações</button>
                </div>
            </div>
        </div>
    );
};
