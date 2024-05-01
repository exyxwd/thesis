import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom';

import 'styles/app.scss';
import 'material-symbols';

import { fetchUserinfo } from 'API/queryUtils';
import Login from 'components/Dashboard/Login';
import MainPage from 'components/Pages/MainPage';
import NavBar from 'components/Navigation/NavBar';
import Register from 'components/Dashboard/Register';
import UpdateLogs from 'components/Dashboard/UpdateLogs';
import UserEditor from 'components/Dashboard/UserEditor';
import HiddenWastes from 'components/Dashboard/HiddenWastes';
import DashboardMain from 'components/Dashboard/DashboardMain';
import ProtectedRoute from 'components/Dashboard/ProtectedRoute';
import { useSetAuthenticated } from 'components/Dashboard/AuthContext';

// TODO About page and contact page
/**
 * Main App component
 *
 * @returns {JSX.Element} The main app component
 */
function App() {
    const { i18n } = useTranslation();
    const setAuthenticated = useSetAuthenticated();

    useQuery('getUserinfo', fetchUserinfo,
        {
            onSuccess: (isAuthenticated) => { if (isAuthenticated) { setAuthenticated(true) } },
            retry: 0
        });

    return (
        <>
            <NavBar i18n={i18n} />
            <Routes>
                <Route path={'/'} element={<MainPage />} />
                <Route path={'/waste/:selectedMarkerId'} element={<MainPage />} />
                <Route path={'/dashboard/login'} element={<Login />} />
                <Route element={<ProtectedRoute />}>
                    <Route path={'/dashboard'} element={<DashboardMain />} />
                    <Route path={'/dashboard/users'} element={<UserEditor />} />
                    <Route path={'/dashboard/hiddens'} element={<HiddenWastes />} />
                    <Route path={'/dashboard/register'} element={<Register />} />
                    <Route path={'/dashboard/logs'} element={<UpdateLogs />} />
                </Route>
                <Route path={'/*'} element={<Navigate to={'/'} />} />
            </Routes>
        </>
    )
}

export default App
