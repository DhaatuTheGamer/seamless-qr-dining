import React from 'react';

/**
 * Props for the Button component.
 * Extends standard HTML button attributes.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** The visual style of the button. Defaults to 'primary'. */
    variant?: 'primary' | 'outline' | 'ghost';
    /** The size of the button. Defaults to 'md'. */
    size?: 'sm' | 'md' | 'lg';
    /** Whether the button should take up the full width of its container. */
    fullWidth?: boolean;
    /** Whether the button is in a loading state. */
    isLoading?: boolean;
}

/**
 * A reusable button component with various styles and sizes.
 *
 * @component
 * @example
 * <Button variant="primary" size="lg" onClick={() => console.log('Clicked')}>
 *   Click Me
 * </Button>
 *
 * @param {ButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered button component.
 */
const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'btn';

    const variants = {
        primary: 'btn-primary',
        outline: 'btn-outline',
        ghost: 'btn-ghost'
    };

    const sizes = {
        sm: 'py-1.5 px-3 text-xs',
        md: 'py-2.5 px-5 text-sm',
        lg: 'py-3.5 px-6 text-base'
    };

    return (
        <button
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isLoading || disabled ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </span>
            ) : children}
        </button>
    );
};

export default Button;
