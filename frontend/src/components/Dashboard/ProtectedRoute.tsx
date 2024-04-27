import React from 'react';
import { useQuery } from 'react-query';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import DashboardMenu from './DashboardMenu';
import { fetchUserinfo } from 'API/queryUtils';
import { useAuthenticated, useSetAuthenticated } from './AuthContext';

/**
 * Component to make children routes protected
 *
 * @returns {React.ReactElement} The child component or the login page depending on user authentication
 */
const ProtectedRoute = (): React.ReactElement => {
   const authenticated = useAuthenticated();
   const setAuthenticated = useSetAuthenticated();
   const location = useLocation();

   useQuery('getUserinfo', fetchUserinfo,
      {
         enabled: !authenticated, retry: 0, onSuccess: (isAuthenticated) => { if (isAuthenticated) {setAuthenticated(true)} }
      });

   return authenticated ? <><DashboardMenu/> <Outlet /></> : <Navigate to={`/dashboard/login`} replace state={{ from: location }} />;
};

export default ProtectedRoute;