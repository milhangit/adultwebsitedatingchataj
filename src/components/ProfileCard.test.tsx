import { render, screen } from '@testing-library/react';
import ProfileCard from './ProfileCard';

describe('ProfileCard', () => {
    const mockProfile = {
        id: 1,
        name: 'Test User',
        age: 25,
        location: 'Colombo',
        occupation: 'Engineer',
        height: '5\' 8"',
        education: 'Degree',
        imageUrl: 'https://example.com/image.jpg',
        isVerified: true,
    };

    it('renders profile information correctly', () => {
        render(<ProfileCard profile={mockProfile} />);

        expect(screen.getByText('Test User, 25')).toBeInTheDocument();
        expect(screen.getByText('Colombo')).toBeInTheDocument();
        expect(screen.getByText('Engineer')).toBeInTheDocument();
        expect(screen.getByText('Degree')).toBeInTheDocument();
        expect(screen.getByText('5\' 8"')).toBeInTheDocument();
    });

    it('renders verification badge when verified', () => {
        render(<ProfileCard profile={mockProfile} />);
        expect(screen.getByTitle('Verified')).toBeInTheDocument();
    });

    it('does not render verification badge when not verified', () => {
        render(<ProfileCard profile={{ ...mockProfile, isVerified: false }} />);
        expect(screen.queryByTitle('Verified')).not.toBeInTheDocument();
    });
});
