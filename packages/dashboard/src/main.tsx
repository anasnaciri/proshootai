import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './assets/styles/index.css';

import { store } from './store/index';
import { Provider } from 'react-redux';
import { AuthProvider } from 'react-oidc-context';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: 'http://localhost:5173/',
  response_type: 'code',
  scope: 'email openid profile',
};

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);
