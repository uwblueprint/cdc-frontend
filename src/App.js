import "./App.css";
import Routes from "./Routes";
require("dotenv").config();
import UserProvider from "./Providers/UserProviders.jsx";
import Navbar from "./Components/Admin/navbar.js";
import ErrorModal from "./Components/Admin/common/errorModal.js";
import { ErrorBoundary } from "react-error-boundary";
import "./styles/index.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { Theme } from "./styles/Theme";

function App() {
    return (
        <ErrorBoundary FallbackComponent={ErrorModal}>
            <ThemeProvider theme={Theme}>
                <UserProvider>
                    <div className="App container py-3">
                        <Routes />
                    </div>
                </UserProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
