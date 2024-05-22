import React from 'react';
import { mount as originalMount } from '@cypress/react18';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LoginStateProvider } from 'components/Dashboard/AuthContext';
import { ActiveFiltersProvider } from 'components/Main/FilterContext';
import { NotificationProvider } from 'components/Main/NotificationContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/app.scss';
import 'material-symbols';

const queryClient = new QueryClient();

function mount(children: React.ReactNode) {
    return originalMount(
        <QueryClientProvider client={queryClient}>
            <LoginStateProvider>
            <ActiveFiltersProvider>
                <NotificationProvider>
                    <Router>
                        {children}
                    </Router>
                </NotificationProvider>
                </ActiveFiltersProvider>
            </LoginStateProvider>
        </QueryClientProvider>
    );
}

export default mount;