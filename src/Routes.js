import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Components/Login/login";
import Signup from "./Components/Login/signup";
import Home from "./Components/Home/home";
import Admin from "./Components/Admin/admin";
import PasswordReset from "./Components/Login/passwordReset";
import EnvironmentEditor from "./Components/Admin/EnvironmentEditor/environment";
import { UserContext } from "./Providers/UserProviders";

export default function Routes() {
    const user = useContext(UserContext);
    return user ? (
        <Switch>
            <Route exact path="/" component={Admin} />
            <Route
                exact
                path="/environment/:environmentId"
                component={EnvironmentEditor}
            />
        </Switch>
    ) : (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/passwordReset" component={PasswordReset} />
        </Switch>
    );
}
