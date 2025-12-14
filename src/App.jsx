import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { LoginPage } from "./components/auth/LoginPage";

import EmailDashboard from "./pages/EmailDashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/Signup";

import ProtectedRoute from "./components/ProtectedRoute";
import KanpanPage from "./pages/KanpanPage";
import { Search } from "lucide-react";
import SearchPage from "./pages/SearchPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* <Route path="/access" element={<AccessCallback />} /> */}

          <Route
            path="/kanpan"
            element={
              <ProtectedRoute>
                <KanpanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <EmailDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
