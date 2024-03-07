import { useTranslation } from 'react-i18next';

import 'styles/app.scss';
import 'material-symbols';

import NavBar from 'components/Navigation/NavBar.tsx';
import MainPage from 'pages/MainPage.tsx';


/**
 * Main App component
 * 
 * @returns {JSX.Element} 
 */
function App() {
    // const baseURL = window.location.origin;

    const { i18n } = useTranslation();

    return (
        <>
            <NavBar i18n={i18n}></NavBar>
            <MainPage />
        </>
    )
}

export default App
