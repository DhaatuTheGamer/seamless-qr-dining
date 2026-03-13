import React from 'react';
import { render } from '@testing-library/react';
import MenuSkeleton from './MenuSkeleton';

describe('MenuSkeleton Component', () => {
    it('renders without crashing', () => {
        const { container } = render(<MenuSkeleton />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders exactly 6 skeleton cards', () => {
        const { container } = render(<MenuSkeleton />);
        // Find elements that match the specific class string of the card wrapper
        const cards = container.querySelectorAll('.bg-white.rounded-xl');
        expect(cards).toHaveLength(6);
    });

    it('has the animate-pulse class on the wrapper element', () => {
        const { container } = render(<MenuSkeleton />);
        const wrapper = container.firstChild;
        expect(wrapper).toHaveClass('animate-pulse');
    });
});
