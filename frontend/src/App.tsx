import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom';

import 'styles/app.scss';
import 'material-symbols';

import NavBar from 'components/Navigation/NavBar.tsx';
import MainPage from 'pages/MainPage.tsx';


/**
 * Main App component
 *
 * @returns {JSX.Element} The main app component
 */
function App() {
    const { i18n } = useTranslation();

    return (
        <>
            <NavBar i18n={i18n}/>
            <Routes>
                <Route path={`/waste/:selectedMarkerId`} element={<MainPage />}></Route>
                <Route path={'/'} element={<MainPage />}/>
                <Route path={`/*`} element={<Navigate to={'/'} />} />
            </Routes>
        </>
    )
}

export default App
