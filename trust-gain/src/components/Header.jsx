import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import useStore from '../store';
import NavMenu from './ui/menu-hover-effects';
import { truncateAddress } from '../hooks';
import { Wallet, LogOut } from 'lucide-react';

const Header = ({ scrollPosition, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleTheme, theme, walletConnected, walletAddress, connectWallet, disconnectWallet } = useStore();

  const handleWalletToggle = () => {
    if (walletConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const navItems = [
  { label: 'Dashboard', id: 'dashboard' },
  { label: 'Donate', id: 'donate' },
  { label: 'Validator', id: 'validator' },
  { label: 'Beneficiary', id: 'beneficiary' },
  { label: 'Analytics', id: 'analytics' },
  { label: 'Impact', id: 'impact' }
];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollPosition > 50
          ? 'bg-dark-900/80 backdrop-blur-glass border-b border-white/5'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center font-bold text-white">
              TG
            </div>
          </motion.div>

          {/* Navigation */}
          <NavMenu navItems={navItems} onNavigate={onNavigate} currentPath={typeof window !== 'undefined' ? window.location.pathname : 'home'} />

          {/* Theme & menu toggle */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-all duration-200"
              title="Toggle theme"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden pb-4 space-y-2 border-t border-white/5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors"
              >
                {item.label}
              </button>
            ))}
            {/* Mobile Wallet Button */}
            <div className="px-4 pt-2 pb-1">
              <button
                onClick={() => {
                  handleWalletToggle();
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  walletConnected
                    ? 'bg-accent-500/10 text-accent-100 border border-accent-500/30'
                    : 'bg-accent-500 text-white'
                }`}
              >
                {walletConnected ? (
                  <>
                    <LogOut size={16} />
                    {truncateAddress(walletAddress)}
                  </>
                ) : (
                  <>
                    <Wallet size={16} />
                    Connect Wallet
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;