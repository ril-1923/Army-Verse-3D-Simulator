import { HashRouter, Routes, Route } from 'react-router-dom';
import { SimProvider } from '@/context/SimContext';
import { Navbar } from '@/components/Navbar';
import CommandCenter from '@/pages/CommandCenter';
import BaseSimulator from '@/pages/BaseSimulator';
import UnitDirectory from '@/pages/UnitDirectory';
import MissionControl from '@/pages/MissionControl';
import Settings from '@/pages/Settings';

export default function App() {
  return (
    <SimProvider>
      <HashRouter>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<CommandCenter />} />
              <Route path="/simulator" element={<BaseSimulator />} />
              <Route path="/directory" element={<UnitDirectory />} />
              <Route path="/missions" element={<MissionControl />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <footer className="app-footer small text-muted">
            ArmyVerse 3D · Interactive Military Base Simulator
          </footer>
        </div>
      </HashRouter>
    </SimProvider>
  );
}
