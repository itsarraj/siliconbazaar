import '@/styles/globals.css';

import { setUnauthorizedHandler } from '@/config';
import { logOutUser } from '@/features/auth/authSlice';
import router from '@/router';
import { store } from './store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import toast from 'react-hot-toast';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

const queryClient = new QueryClient();

setUnauthorizedHandler(() => {
  store.dispatch(logOutUser());
  toast.error("Session expired. Please sign in again.");
  void router.navigate("/login");
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <RouterProvider router={router} />
      </ReduxProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
