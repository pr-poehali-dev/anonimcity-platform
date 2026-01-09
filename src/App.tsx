import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import MyListings from "./pages/MyListings";
import Messages from "./pages/Messages";
import Files from "./pages/Files";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{ login: string; password: string } | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const generateCredentials = () => {
    const login = `anon_${Math.random().toString(36).substr(2, 8)}`;
    const password = Math.random().toString(36).substr(2, 12);
    setGeneratedCredentials({ login, password });
    setIsAuthenticated(true);
  };

  const handleExistingLogin = (login: string, password: string) => {
    if (login && password) {
      setGeneratedCredentials({ login, password });
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setGeneratedCredentials(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation 
            isAuthenticated={isAuthenticated}
            onLogin={generateCredentials}
            onExistingLogin={handleExistingLogin}
            onLogout={handleLogout}
          />
          <Routes>
            <Route path="/" element={
              <Home 
                isAuthenticated={isAuthenticated}
                generatedCredentials={generatedCredentials}
                onLogin={generateCredentials}
              />
            } />
            <Route path="/listings" element={
              isAuthenticated ? <Listings /> : <Navigate to="/" replace />
            } />
            <Route path="/my-listings" element={
              isAuthenticated ? <MyListings generatedCredentials={generatedCredentials} twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} /> : <Navigate to="/" replace />
            } />
            <Route path="/messages" element={
              isAuthenticated ? <Messages generatedCredentials={generatedCredentials} twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} /> : <Navigate to="/" replace />
            } />
            <Route path="/files" element={
              isAuthenticated ? <Files generatedCredentials={generatedCredentials} twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} /> : <Navigate to="/" replace />
            } />
            <Route path="/profile" element={
              isAuthenticated ? <Profile generatedCredentials={generatedCredentials} twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} /> : <Navigate to="/" replace />
            } />
            <Route path="/wallet" element={
              isAuthenticated ? <Wallet generatedCredentials={generatedCredentials} twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} /> : <Navigate to="/" replace />
            } />
            <Route path="/support" element={
              isAuthenticated ? <Support generatedCredentials={generatedCredentials} twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} /> : <Navigate to="/" replace />
            } />
            <Route path="/settings" element={
              isAuthenticated ? <Settings generatedCredentials={generatedCredentials} twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} /> : <Navigate to="/" replace />
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
