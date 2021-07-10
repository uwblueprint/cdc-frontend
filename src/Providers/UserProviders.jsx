import React, { Component, createContext } from "react";
import { auth, generateUserDocument } from "../firebaseCredentials.js";
import { httpGet } from "../lib/dataAccess";

const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;

export const UserContext = createContext({ user: null });
class UserProvider extends Component {
    state = {
        user: null,
        isAdmin: false,
    };

    componentDidMount = async () => {
        auth.onAuthStateChanged(async (userAuth) => {
            if (!userAuth) {
                this.setState({ user: null });
            }
            if (userAuth && userAuth.emailVerified) {
                const user = await generateUserDocument(userAuth);
                this.setState({ user });
            }

            // validate cookies are set appropriately on this user instance
            try {
                const response = await httpGet(baseEndpoint + "user_profile");
                this.setState({ isAdmin: response.status === 200 });
            } catch {
                this.setState({ isAdmin: false });
            }
        });
    };

    render() {
        return (
            <UserContext.Provider
                value={{ user: this.state.user, isAdmin: this.state.isAdmin }}
            >
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserProvider;
