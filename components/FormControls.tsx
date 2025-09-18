
import React from 'react';

const inputClasses = "form-input w-full text-white bg-dark-surface/80 border border-white/20 rounded-xl px-4 py-3 focus:border-medical-primary focus:ring-2 focus:ring-medical-primary/20 focus:outline-none transition-all duration-200 placeholder-gray-400";
const selectClasses = "form-select w-full text-white bg-dark-surface/80 border border-white/20 rounded-xl px-4 py-3 focus:border-medical-primary focus:ring-2 focus:ring-medical-primary/20 focus:outline-none transition-all duration-200";
const textareaClasses = "form-textarea w-full text-white bg-dark-surface/80 border border-white/20 rounded-xl px-4 py-3 focus:border-medical-primary focus:ring-2 focus:ring-medical-primary/20 focus:outline-none transition-all duration-200 placeholder-gray-400 resize-vertical min-h-[100px]";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const FormInput: React.FC<InputProps> = ({ className, ...props }) => (
    <input {...props} className={`${inputClasses} ${className || ''}`} />
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export const FormTextarea: React.FC<TextareaProps> = ({ className, ...props }) => (
    <textarea {...props} className={`${textareaClasses} ${className || ''}`} />
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}
export const FormSelect: React.FC<SelectProps> = ({ className, children, ...props }) => (
    <select {...props} className={`${selectClasses} ${className || ''}`}>
        {children}
    </select>
);

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
export const FormLabel: React.FC<LabelProps> = ({ className, children, ...props }) => (
    <label {...props} className={`block text-sm font-semibold text-primary mb-2 ${className || ''}`}>
        {children}
    </label>
);

interface FormGroupProps {
    label: string;
    children: React.ReactNode;
    className?: string;
    required?: boolean;
}
export const FormGroup: React.FC<FormGroupProps> = ({ label, children, className, required }) => (
    <div className={`space-y-2 ${className || ''}`}>
        <FormLabel>
            {label}
            {required && <span className="text-medical-danger ml-1">*</span>}
        </FormLabel>
        {children}
    </div>
);
