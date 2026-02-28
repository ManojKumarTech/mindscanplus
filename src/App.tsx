import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import Admin from './pages/Admin';
import Community from './pages/Community';
import Dashboard from './pages/Dashboard';
import EmotionalCare from './pages/EmotionalCare';
import Home from './pages/Home';
import Login from './pages/Login';
import Resources from './pages/Resources';
import Screening from './pages/Screening';
import SelfCare from './pages/SelfCare';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-mint-50 to-warmBeige-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* public route */}
            <Route path="/login" element={<Login />} />

            {/* protected routes */}
            <Route element={<RequireAuth />}> 
              <Route path="/" element={<Home />} />
              <Route path="/screening" element={<Screening />} />
              <Route path="/emotional-care" element={<EmotionalCare />} />
              <Route path="/self-care" element={<SelfCare />} />
              <Route path="/community" element={<Community />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
