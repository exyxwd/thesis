import React, { createContext, useContext, useState } from 'react';

const LoginStateContext = createContext<{
    authenticated: boolean;
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
} | undefined>(undefined);

/**
 * Getter for user login state
 *
 * @returns {boolean} Returns whether the user is logged in or not
 */
export const useAuthenticated = (): boolean => {
    const context = useContext(LoginStateContext);
    if (!context) {
        throw new Error('useAuthenticated must be used within an LoginStateProvider');
    }
    return context.authenticated;
};

/**
 * Setter for user login state
 *
 * @returns {React.Dispatch<React.SetStateAction<boolean>>} The function to set the user login state
 */
export const useSetAuthenticated = (): React.Dispatch<React.SetStateAction<boolean>> => {
    const context = useContext(LoginStateContext);
    if (!context) {
        throw new Error('useSetAuthenticated must be used within an LoginStateProvider');
    }
    return context.setAuthenticated;
};

/**
 * Wraps its children with a context provider that allows managing user login state
 *
 * @param {Object} props The component props
 * @param {React.ReactNode} props.children The child components that will be wrapped by the context provider
 * @returns {React.ReactElement} A context provider for managing user login state
 */
export const LoginStateProvider: React.FC<{ children: React.ReactNode }> = ({children}: { children: React.ReactNode; }): React.ReactElement => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    return (
        <LoginStateContext.Provider value={{ authenticated: authenticated, setAuthenticated: setAuthenticated }}>
            {children}
        </LoginStateContext.Provider>
    );
};
