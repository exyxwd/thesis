import { Trans } from 'react-i18next';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { NotificationType } from 'models/models';

interface NotificationContextProps {
    showNotification: (mode: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useShowNotification = (): ((mode: NotificationType, message: string) => void) => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useShowNotification must be used within a NotificationProvider');
    }
    return context.showNotification;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<NotificationType>(NotificationType.Info);
    const [message, setMessage] = useState<string>('');

    const showNotification = (mode: NotificationType, message: string) => {
        setMode(mode);
        setMessage(message);
    };

    useEffect(() => {
        if (message !== '') {
            const timer = setTimeout(() => {
                setMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const closeNotification = () => {
        setMessage('');
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {message && (
                <div className={`notification-panel ${mode.toLowerCase()}-notification`}>
                    <button className='notification-panel-close-btn' onClick={closeNotification}>
                        <span className='material-symbols-outlined'>close</span>
                    </button>
                    <div className='notification-msg'>
                        <Trans i18nKey={'notifications.' + message}>{message}</Trans>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};