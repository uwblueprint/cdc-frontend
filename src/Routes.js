import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Components/Login/login";
import Home from "./Components/Home/home";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/login">
                <Login />
            </Route>
        </Switch>
    );
}
