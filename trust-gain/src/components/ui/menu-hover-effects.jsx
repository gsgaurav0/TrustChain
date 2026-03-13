import { useState } from 'react';
import useStore from '../../store';
import { Wallet, LogOut } from 'lucide-react';
import { truncateAddress } from '../../hooks';

export default function NavMenu({ navItems, onNavigate, currentPath }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { walletConnected, walletAddress, connectWallet, disconnectWallet } = useStore();
  
  const handleWalletToggle = () => {
    if (walletConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative w-full z-50">
      {/* Mobile menu toggle button - only visible on small screens */}
      <button 
        onClick={toggleMenu}
        className="md:hidden absolute top-6 right-6 z-20 p-2 text-white"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <div className={`w-6 h-0.5 bg-current mb-1.5 transition-transform duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-current mb-1.5 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-current transition-transform duration-300 ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></div>
      </button>
      
      {/* Menu container - adapts to screen size */}
      <div className={`
        flex items-center justify-center w-full
        md:block md:w-auto
        ${isMenuOpen ? 'block absolute top-16 left-0 right-0 bg-dark-900/95 backdrop-blur shadow-glass py-4 rounded-b-xl border border-white/10 border-t-0' : 'hidden md:block'}
      `}>
        <ul className={`
          flex flex-col items-center space-y-4
          md:flex-row md:space-y-0 md:space-x-1 md:justify-center
          lg:space-x-2
        `}>
          {navItems.map((item) => (
            <li key={item.id} className="list-none w-full md:w-auto text-center">
              <button 
                className="relative inline-block group w-full px-4 py-2"
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
              >
                {/* Link text */}
                <span className={`
                  relative z-10 block font-display font-semibold transition-colors duration-300 
                  group-hover:text-white
                  text-lg
                  md:text-base
                  ${currentPath === item.id ? 'text-white' : 'text-gray-300'}
                `}>
                  {item.label}
                </span>
                {/* Top & bottom border animation */}
                <span className="
                  absolute inset-0 border-t-2 border-b-2 border-accent-500
                  transform scale-y-[2] opacity-0 
                  transition-all duration-300 origin-center
                  group-hover:scale-y-100 group-hover:opacity-100
                  rounded-none
                " />
                {/* Background fill animation */}
                <span className="
                  absolute top-[2px] left-0 w-full h-full bg-accent-500/20
                  transform scale-0 opacity-0
                  transition-all duration-300 origin-top
                  group-hover:scale-100 group-hover:opacity-100
                " />
              </button>
            </li>
          ))}
          {/* Injected Wallet Button */}
          <li className="list-none w-full md:w-auto text-center ml-0 md:ml-4 mt-4 md:mt-0">
             <button
              onClick={() => {
                 handleWalletToggle();
                 setIsMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 w-full ${
                walletConnected
                  ? 'bg-accent-500/10 text-accent-100 border border-accent-500/30 hover:bg-accent-500/20'
                  : 'bg-accent-500 text-white hover:bg-accent-600 shadow-md hover:shadow-glow'
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
                  Connect
                </>
              )}
             </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
