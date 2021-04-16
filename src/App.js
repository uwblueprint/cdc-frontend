import "./App.css";
import React from "react";
import Routes from "./Routes";
require("dotenv").config();
import UserProvider from "./Providers/UserProviders.jsx";
import AppBar from "./Components/Admin/navbar.js";

function App() {
    return (
        <UserProvider>
            <div className="App container py-3">
                <AppBar />
                <Routes />
            </div>
        </UserProvider>
    );
}

export default App;
