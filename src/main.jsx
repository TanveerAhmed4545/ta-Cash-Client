import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./Provider/AuthProvider.jsx";
import { router } from "./Routes/router.jsx";
import { ThemeProvider } from "./Provider/ThemeProvider.jsx";

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
 <React.StrictMode>
 <QueryClientProvider client={queryClient}>
 <ThemeProvider>
 <AuthProvider>
 <RouterProvider router={router} />
 <Toaster />
 </AuthProvider>
 </ThemeProvider>
 </QueryClientProvider>
 </React.StrictMode>
);
