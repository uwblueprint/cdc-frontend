import React, { Component, createContext } from "react";
import { auth } from "../firebaseCredentials.js";
import { httpGet } from "../lib/dataAccess";

const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;

export const UserContext = createContext({ isAdmin: false });
class UserProvider extends Component {
    state = {
        isAdmin: false,
        displayName: "",
    };

    componentDidMount = async () => {
        auth.onAuthStateChanged(async () => {
            // validate cookies are set appropriately on this user instance
            try {
                const response = await httpGet(baseEndpoint + "user_profile");
                this.setState({
                    isAdmin: response.status === 200,
                    displayName: response.data.display_name,
                });
            } catch {
                this.setState({ isAdmin: false });
            }
        });
    };

    render() {
        return (
            <UserContext.Provider
                value={{
                    isAdmin: this.state.isAdmin,
                    displayName: this.state.displayName,
                }}
            >
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserProvider;
