import React, { useEffect, useState, createContext } from "react";
import { auth } from "../firebaseCredentials.js";
import { httpGet } from "../lib/dataAccess";

const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;

export const UserContext = createContext();

const isTokenExpired = (user) => {
    const MILLISECONDS_PER_DAY = 24 * 3600 * 1000;
    const NOW = new Date().getTime();

    // Force user to relog in every 24 hours
    return Number(user.toJSON().lastLoginAt) < NOW - MILLISECONDS_PER_DAY;
};

const AUTH_STATES = {
    LOADING: "LOADING",
    NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
    AUTHENTICATED: "AUTHENTICATED",
};

export default function UserProvider({ children }) {
    const [authState, setAuthState] = useState({
        user: null,
        state: AUTH_STATES.LOADING,
    });

    useEffect(() => {
        async function setUser(user) {
            //Set the state to loading by default
            setAuthState({ state: AUTH_STATES.LOADING, user: null });

            if (user === null) {
                setAuthState({ state: AUTH_STATES.NOT_AUTHENTICATED, user });
                return;
            }

            if (isTokenExpired(user)) {
                auth.signOut();
                setAuthState({
                    state: AUTH_STATES.NOT_AUTHENTICATED,
                    user: null,
                });
                return;
            }

            let response = null;
            try {
                response = await httpGet(baseEndpoint + "user_profile");
            } catch (error) {
                setAuthState({
                    state: AUTH_STATES.NOT_AUTHENTICATED,
                    user: null,
                });
                return;
            }

            if (!response) {
                setAuthState({
                    state: AUTH_STATES.NOT_AUTHENTICATED,
                    user: null,
                });
                return;
            }

            setAuthState({
                state: AUTH_STATES.AUTHENTICATED,
                user: response.data,
            });
        }

        const unsubscribe = auth.onAuthStateChanged(setUser);

        return () => {
            unsubscribe();
        };
    }, []);

    async function reloadUser() {
        const response = await httpGet(baseEndpoint + "user_profile");

        if (!response) {
            setAuthState({
                state: AUTH_STATES.NOT_AUTHENTICATED,
                user: null,
            });
            return;
        }

        setAuthState({
            state: AUTH_STATES.AUTHENTICATED,
            user: response.data,
        });
    }

    return (
        <UserContext.Provider
            value={{
                isLoading: authState.state === AUTH_STATES.LOADING,
                user: authState.user ?? null,
                reloadUser: reloadUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
