import "./App.css";
import React from "react";
import Routes from "./Routes";
require("dotenv").config();

function App() {
    return (
        <div className="App container py-3">
            <Routes />
        </div>
    );
}

export default App;
