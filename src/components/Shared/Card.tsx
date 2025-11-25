import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    glass?: boolean;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', glass = false, onClick }) => {
    return (
        <div
            className={`
        ${glass ? 'glass-panel' : 'card'} 
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
