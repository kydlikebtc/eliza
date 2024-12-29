import { Outlet } from "react-router-dom";
import { ToastProvider, ToastViewport } from "@eliza/agent-config-frontend";
import "./App.css";

function App() {
    return (
        <div className="min-h-screen bg-background">
            <Outlet />
            <ToastProvider>
                <ToastViewport />
            </ToastProvider>
        </div>
    );
}

export default App;
