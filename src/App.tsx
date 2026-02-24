import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Screening from './pages/Screening';
import EmotionalCare from './pages/EmotionalCare';
import SelfCare from './pages/SelfCare';
import Community from './pages/Community';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-mint-50 to-warmBeige-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/screening" element={<Screening />} />
            <Route path="/emotional-care" element={<EmotionalCare />} />
            <Route path="/self-care" element={<SelfCare />} />
            <Route path="/community" element={<Community />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
