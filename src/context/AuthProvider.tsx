import { createContext, useState } from "react";

/* type Props = {
    children?: React.ReactNode;
}; */


type IAuthContext = {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
}

const initialState: IAuthContext = {
    isAuthenticated: false,
    setIsAuthenticated: () => { }
}



const AuthContext = createContext<IAuthContext>(initialState);

export const AuthProvider = ({ children }: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
