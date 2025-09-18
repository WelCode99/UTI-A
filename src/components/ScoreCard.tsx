import React from 'react';

interface ScoreCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`medical-card ${className}`}>
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                {title}
            </h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

interface ResultDisplayProps {
    label: string;
    value: string | number;
    unit?: string;
    className?: string;
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
    label,
    value,
    unit,
    className = '',
    color = 'primary'
}) => {
    const colorClasses = {
        primary: 'text-medical-primary',
        success: 'text-medical-success',
        warning: 'text-medical-warning',
        danger: 'text-medical-danger',
        info: 'text-medical-info'
    };

    return (
        <div className={`result-display ${className}`}>
            <div className="text-center">
                <span className="block text-sm text-secondary font-medium mb-1">{label}</span>
                <div className="flex items-center justify-center gap-1">
                    <span className={`font-bold text-3xl ${colorClasses[color]}`}>
                        {value}
                    </span>
                    {unit && (
                        <span className={`text-lg font-semibold ${colorClasses[color]} opacity-80`}>
                            {unit}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Componente adicional para métricas pequenas
export const MetricDisplay: React.FC<{
    label: string;
    value: string | number;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
    className?: string;
}> = ({ label, value, unit, trend, className = '' }) => {
    const trendIcons = {
        up: '📈',
        down: '📉',
        stable: '➡️'
    };

    const trendColors = {
        up: 'text-medical-success',
        down: 'text-medical-danger',
        stable: 'text-medical-info'
    };

    return (
        <div className={`glass-light p-3 rounded-lg ${className}`}>
            <div className="flex items-center justify-between">
                <span className="text-xs text-secondary font-medium">{label}</span>
                {trend && (
                    <span className="text-xs">{trendIcons[trend]}</span>
                )}
            </div>
            <div className="mt-1 flex items-baseline gap-1">
                <span className={`text-lg font-bold ${trend ? trendColors[trend] : 'text-primary'}`}>
                    {value}
                </span>
                {unit && (
                    <span className="text-xs text-secondary font-medium">{unit}</span>
                )}
            </div>
        </div>
    );
};