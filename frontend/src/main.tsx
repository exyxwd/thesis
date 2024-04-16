import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import App from './App.tsx';
import { ActiveFiltersProvider } from 'components/Main/FilterContext.tsx';


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ActiveFiltersProvider>
                    <App />
                </ActiveFiltersProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
);
