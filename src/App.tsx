import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import Messages from "./pages/Messages";
import Virt from "./pages/Virt";
import Files from "./pages/Files";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { registerUser, loginUser } from "./lib/auth";

const queryClient = new QueryClient();

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{ login: string; password: string } | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [credentialsSaved, setCredentialsSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedSession = localStorage.getItem('anonimcity_session');
    const credsSaved = localStorage.getItem('credentials_saved');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setGeneratedCredentials(session);
        setIsAuthenticated(true);
        setCredentialsSaved(credsSaved === 'true');
      } catch (error) {
        localStorage.removeItem('anonimcity_session');
      }
    }
  }, []);

  const generateCredentials = async () => {
    const login = `anon_${Math.random().toString(36).substr(2, 8)}`;
    const password = Math.random().toString(36).substr(2, 12);
    
    const result = await registerUser(login, password);
    
    if (result.success) {
      const credentials = { login, password };
      setGeneratedCredentials(credentials);
      setIsAuthenticated(true);
      localStorage.setItem('anonimcity_session', JSON.stringify(credentials));
      toast({
        title: "Аккаунт создан",
        description: `Логин: ${login}`,
      });
    } else {
      toast({
        title: "Ошибка регистрации",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleExistingLogin = async (login: string, password: string) => {
    if (!login || !password) return;
    
    const result = await loginUser(login, password);
    
    if (result.success) {
      const credentials = { login, password };
      setGeneratedCredentials(credentials);
      setIsAuthenticated(true);
      localStorage.setItem('anonimcity_session', JSON.stringify(credentials));
      toast({
        title: "Успешный вход",
        description: `Добро пожаловать, ${login}`,
      });
    } else {
      toast({
        title: "Ошибка входа",
        description: result.error || "Неверный логин или пароль",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setGeneratedCredentials(null);
    localStorage.removeItem('anonimcity_session');
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из аккаунта",
    });
  };

  return (
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
            credentialsSaved={credentialsSaved}
            onCredentialsSaved={() => {
              setCredentialsSaved(true);
              localStorage.setItem('credentials_saved', 'true');
            }}
          />
        } />
        <Route path="/listings" element={
          isAuthenticated ? <Listings /> : <Navigate to="/" replace />
        } />
        <Route path="/create-listing" element={
          isAuthenticated ? <CreateListing /> : <Navigate to="/" replace />
        } />
        <Route path="/my-listings" element={
          isAuthenticated ? <MyListings generatedCredentials={generatedCredentials} twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} /> : <Navigate to="/" replace />
        } />
        <Route path="/messages" element={
          isAuthenticated ? <Messages generatedCredentials={generatedCredentials} twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} /> : <Navigate to="/" replace />
        } />
        <Route path="/virt" element={
          isAuthenticated ? <Virt generatedCredentials={generatedCredentials} twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} /> : <Navigate to="/" replace />
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
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;