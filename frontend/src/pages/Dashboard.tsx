import React from 'react';

import DashboardMain from 'components/Dashboard/DashboardMain';

/**
 * Wrapper for the components that make up the dashboard
 *
 * @returns {React.ReactElement} The dashboard
 */
const Dashboard: React.FC = (): React.ReactElement => {
    return (
        <>
            <DashboardMain/>
        </>
    )
}

export default Dashboard;
