import "./App.css";
import Routes from "./Routes";
require("dotenv").config();
import UserProvider from "./Providers/UserProviders.jsx";
import Navbar from "./Components/Admin/navbar.js";
import ErrorModal from "./Components/Admin/common/errorModal.js";
import { ErrorBoundary } from "react-error-boundary";

function App() {
    return (
        <ErrorBoundary FallbackComponent={ErrorModal}>
            <UserProvider>
                <div className="App container py-3">
                    <Navbar />
                    <Routes />
                </div>
            </UserProvider>
        </ErrorBoundary>
    );
}

export default App;
