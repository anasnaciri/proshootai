import { useAuth } from 'react-oidc-context';
import { useCallback } from 'react';

export const useLogout = () => {
  const auth = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      await auth.removeUser();
      const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
      const logoutUri = 'http://localhost:5173/';
      const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    } catch (error) {
      console.error('Logout error:', error);
      // You might want to handle this error in your UI
    }
  }, [auth]);

  return { handleLogout };
};
