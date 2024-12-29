import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { AgentConfigPage } from "./pages/AgentConfigPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AgentConfigPage />,
    },
    {
        path: "/agent-config",
        element: <AgentConfigPage />,
    },
]);

export default router;
