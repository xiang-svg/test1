import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useAppContext } from './hooks/useAppContext';
import HomePage from './components/home/HomePage';
import GamePage from './components/game/GamePage';
import ResultPage from './components/result/ResultPage';
import SettingsPage from './components/settings/SettingsPage';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

function AppContent() {
  const { state } = useAppContext();

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {state.page === 'home' && (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <HomePage />
          </motion.div>
        )}
        {state.page === 'game' && (
          <motion.div key="game" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <GamePage />
          </motion.div>
        )}
        {state.page === 'result' && (
          <motion.div key="result" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ResultPage />
          </motion.div>
        )}
        {state.page === 'settings' && (
          <motion.div key="settings" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <SettingsPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
