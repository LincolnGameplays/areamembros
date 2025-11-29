import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { LessonView } from "./pages/LessonView";
import { ParticleVoid } from "./components/background/ParticleVoid";
import { NoiseOverlay } from "./components/background/NoiseOverlay";

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan/30 border-t-cyan rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white font-mono text-sm tracking-widest">CARREGANDO SISTEMA...</p>
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" />;
    return <>{children}</>;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                {/* Global Background Layers */}
                <NoiseOverlay />
                <ParticleVoid />

                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/lesson/:lessonId"
                        element={
                            <ProtectedRoute>
                                <LessonView />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
