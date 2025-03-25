import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";

// Import Three.js for 3D effects
import * as THREE from 'three';
// Add THREE to window for global access
(window as any).THREE = THREE;

// Create the root element
const root = createRoot(document.getElementById("root")!);

// Render the app with providers
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
