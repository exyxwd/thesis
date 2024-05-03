import React from 'react';

import petLogo from 'images/logos/PET_logo_white.png';

/**
 * Content of the dashboard's main page
 *
 * @returns {React.ReactElement} Dashboard main page
 */
const DashboardMain = (): React.ReactElement => {
    return (
        <>
            <img src={petLogo} alt='PETkupa logo' className='background-logo'></img>
        </>
    )
}

export default DashboardMain;
