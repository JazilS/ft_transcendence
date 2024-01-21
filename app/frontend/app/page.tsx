import HomePage from './HomePage';
import SettingsPage from './LobbyPage';
import * as React from "react";
import * as ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);

const rootElement = document.getElementById("root");  
const root = ReactDOM.createRoot(rootElement || document.createElement("div"));
root.render(
    <RouterProvider router={router} />

);
