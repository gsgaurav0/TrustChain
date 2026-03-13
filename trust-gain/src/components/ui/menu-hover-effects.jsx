import useStore from '../../store';
import { Wallet, LogOut } from 'lucide-react';
import { truncateAddress } from '../../hooks';

export default function NavMenu({ navItems, onNavigate, currentPath }) {
  const { walletConnected, walletAddress, connectWallet, disconnectWallet } = useStore();
  
  const handleWalletToggle = () => {
    if (walletConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <nav className="hidden md:block w-full z-50">
      {/* Menu container */}
      <div className="flex items-center justify-center w-full md:w-auto">
        <ul className="flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <li key={item.id} className="list-none w-auto text-center">
              <button 
                className="relative inline-block group px-4 py-2"
                onClick={() => {
                  onNavigate(item.id);
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
          <li className="list-none w-auto text-center ml-4">
             <button
              onClick={() => {
                 handleWalletToggle();
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
