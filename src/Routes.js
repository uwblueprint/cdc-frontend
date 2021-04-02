import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Components/Login/login";
import Signup from "./Components/Login/signup";
import Home from "./Components/Home/home";
import Admin from "./Components/Admin/admin";
import PasswordReset from "./Components/Login/passwordReset";
import { UserContext } from "./Providers/UserProviders";

export default function Routes() {
    const user = useContext(UserContext);
    return user ? (
        <Admin />
    ) : (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/signup">
                <Signup />
            </Route>
            <Route exact path="/passwordReset">
                <PasswordReset />
            </Route>
        </Switch>
    );
}
