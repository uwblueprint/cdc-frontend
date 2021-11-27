import React, { useContext, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Components/Login/login";
import Signup from "./Components/Login/signup";
import Home from "./Components/Home/home";
import Admin from "./Components/Admin/admin";
import PasswordReset from "./Components/Login/passwordReset";
import EnvironmentEditor from "./Components/Admin/EnvironmentEditor/environment";
import ObjectEditor from "./Components/Admin/ObjectEditor/object";
import AssetModelViewer from "./Components/Admin/AssetModelViewer/assetModelViewer";
import { UserContext } from "./Providers/UserProviders";
import ClipLoader from "react-spinners/ClipLoader";

export default function Routes() {
    const { isLoading, user } = useContext(UserContext);

    useEffect(() => {
        if (isLoading) {
            return;
        }
    }, [isLoading]);

    return isLoading ? (
        <div
            style={{
                display: "grid",
                placeItems: "center",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            <ClipLoader color={"#EC4E55"} loading={isLoading} size={150} />
        </div>
    ) : user ? (
        <Switch>
            <Route exact path="/admin" component={Admin} />
            <Route
                exact
                path="/admin/environment/:environmentId"
                component={EnvironmentEditor}
            />
            <Route
                exact
                path="/admin/scene/:sceneId/object/:objectId"
                component={ObjectEditor}
            />
            <Route
                exact
                path="/admin/asset/:assetId"
                component={AssetModelViewer}
            />
            <Route exact path="/*" component={Admin} />
        </Switch>
    ) : (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/passwordReset" component={PasswordReset} />
            <Route exact path="/*" component={Login} />
        </Switch>
    );
}
