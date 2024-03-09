import { useContext, useReducer, createContext } from "react";

const AuthContext = createContext()

const initialState={
    user:{},
    isAuthenticated:false
}

function reducer(state, action){
    switch(action.type){
        case "login":
            return {
                ...state, 
                user: action.payload, 
                isAuthenticated: true,
            }
        case "logout":
            return {
                ...state,
                user: {},
                isAuthenticated: false,
            }
        default:
            throw new Error("Unexpected behaviour in reducer of FakeAuthContext!")
    }
}

function AuthProvider({children}){
    const [{user, isAuthenticated}, dispatch] = useReducer(reducer, initialState);

    const FAKE_USER = {
       name: "Ayush",
       email: "Ayush@example.com",
       password: "qwerty2",
       avatar: "https://i.pravatar.cc/100?u=zz",
    };
    
    function login({email, password}){
        if(email===FAKE_USER.email && password===FAKE_USER.password){
            dispatch({type:"login", payload:FAKE_USER})
        }
    }

    function logout(){
        dispatch({type:"logout"})
    }

    return( 
        <AuthContext.Provider value={{
                user, 
                isAuthenticated, 
                login, 
                logout,
            }
        }>{children}</AuthContext.Provider>
    );
}

function useAuth(){
    const context = useContext(AuthContext);
    if(context===undefined) throw new Error("Use of useAuth outside the AuthProvider!")

    return context;
}

export {AuthProvider, useAuth}