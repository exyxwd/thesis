import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';

import App from './App.tsx';
import { LoginStateProvider } from 'components/Dashboard/AuthContext';
import { ActiveFiltersProvider } from 'components/Main/FilterContext';
import { NotificationProvider } from 'components/Main/NotificationContext.tsx';

// Ignore the network response was not ok error logs since they are
// thrown by the fetcher functions and handled by the application
setLogger({
    log: console.log,
    warn: console.warn,
    error: (error) => {
      if (error.message !== 'Network response was not ok.') {
        console.error(error);
      }
    },
  });
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ActiveFiltersProvider>
                    <LoginStateProvider>
                        <NotificationProvider>
                            <App />
                        </NotificationProvider>
                    </LoginStateProvider>
                </ActiveFiltersProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
);
