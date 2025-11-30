import React from 'react';

/**
 * Props for the Card component.
 */
interface CardProps {
    /** The content to be rendered inside the card. */
    children: React.ReactNode;
    /** Additional CSS classes to apply to the card container. */
    className?: string;
    /** Whether to apply a glassmorphism effect. */
    glass?: boolean;
    /** Optional click handler for the card. */
    onClick?: () => void;
}

/**
 * A reusable card container component.
 * Can be configured with a glass effect or standard card styling.
 *
 * @component
 * @example
 * <Card glass={true} className="p-4">
 *   <p>Card Content</p>
 * </Card>
 *
 * @param {CardProps} props - The component props.
 * @returns {JSX.Element} The rendered card component.
 */
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
