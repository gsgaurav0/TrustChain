import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import DisasterCards from './pages/DisasterCards';
import TransactionHistory from './pages/TransactionHistory';
import WalletConnect from './pages/WalletConnect';
import useStore from './store';
import Analytics from './pages/Analytics';
import DonationCheckout from './pages/DonationCheckout';
import ValidatorDashboard from './pages/ValidatorDashboard';
import BeneficiaryPortal from './pages/BeneficiaryPortal';
import { DemoOne } from './demo-nav';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [scrollPosition, setScrollPosition] = useState(0);
  const initTheme = useStore((state) => state.initTheme);
  

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const store = useStore.getState();
    if (store.initWalletListeners) {
      store.initWalletListeners();
    }
  }, []);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Landing onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard />;
      case 'donate':
        return <DisasterCards onNavigate={setCurrentPage} />;
      case 'impact':
        return <TransactionHistory />;
      case 'transparency':
        return <TransactionHistory />;
      case 'wallet':
        return <WalletConnect />;
        case 'analytics':
          return <Analytics />;
      case 'demo-nav':
          return <DemoOne />;
      case 'checkout':
          return <DonationCheckout onNavigate={setCurrentPage} />;
      case 'validator':
          return <ValidatorDashboard />;
      case 'beneficiary':
          return <BeneficiaryPortal />;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="bg-dark-900 min-h-screen text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-20 bg-dark-900" />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Header */}
      <Header scrollPosition={scrollPosition} onNavigate={setCurrentPage} />

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;