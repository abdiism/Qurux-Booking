import React, { ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { SalonProvider, useSalon } from './SalonContext';
import { BookingProvider, useBooking } from './BookingContext';
import { NavigationProvider, useNavigation } from './NavigationContext';

// Re-export types if needed, or just rely on types.ts
import { User, Salon, Service, Booking, Role } from '../types';

// Combine Providers
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // We need a way to pass the redirect callback from Auth to Navigation
  // But Providers are nested.
  // We can create a wrapper component that uses Navigation hook and passes it to AuthProvider?
  // Or simpler: AuthProvider takes a callback.

  return (
    <NavigationProvider>
      <AuthWrapper>
        <SalonProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </SalonProvider>
      </AuthWrapper>
    </NavigationProvider>
  );
};

// Helper to connect Auth redirects to Navigation
const AuthWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setCurrentView } = useNavigation();

  const handleRoleRedirect = (role: Role) => {
    if (role === Role.MANAGER) {
      setCurrentView('MANAGER_DASHBOARD');
    }
    // Customers stay on the current view (usually Landing Page) or default to Landing
    // They can navigate to CustomerHome via the "Discover" button
  };

  return (
    <AuthProvider onRoleRedirect={handleRoleRedirect}>
      {children}
    </AuthProvider>
  );
};

// Facade Hook
export const useApp = () => {
  const auth = useAuth();
  const salon = useSalon();
  const booking = useBooking();
  const navigation = useNavigation();

  return {
    ...auth,
    ...salon,
    ...booking,
    ...navigation
  };
};