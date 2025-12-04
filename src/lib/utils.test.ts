import { cn, calculateAge } from './utils';

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names correctly', () => {
            expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
        });

        it('should handle conditional classes', () => {
            expect(cn('bg-red-500', false && 'text-white', 'p-4')).toBe('bg-red-500 p-4');
        });

        it('should merge tailwind classes', () => {
            expect(cn('p-4', 'p-8')).toBe('p-8');
        });
    });

    describe('calculateAge', () => {
        it('should calculate age correctly', () => {
            const birthDate = new Date();
            birthDate.setFullYear(birthDate.getFullYear() - 25);
            expect(calculateAge(birthDate)).toBe(25);
        });
    });
});
