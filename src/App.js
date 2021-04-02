import "./App.css";
import React from "react";
import Routes from "./Routes";
require("dotenv").config();
import UserProvider from "./Providers/UserProviders.jsx";

function App() {
    return (
        <UserProvider>
            <div className="App container py-3">
                <Routes />
            </div>
        </UserProvider>
    );
}

export default App;
