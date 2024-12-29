import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
    return (
        <div className="min-h-screen bg-background">
            <Outlet />
            <Toaster />
        </div>
    );
}

export default App;
