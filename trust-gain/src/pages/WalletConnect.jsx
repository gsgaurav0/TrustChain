import { motion } from 'framer-motion';
import { Wallet, Copy, LogOut, ArrowUpRight, ArrowDownLeft, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import useStore from '../store';
import { useAnimationVariants, truncateAddress, formatCurrency } from '../hooks';

const WalletConnect = () => {
  const { walletConnected, walletAddress, walletBalance, connectWallet, disconnectWallet } = useStore();
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const variants = useAnimationVariants();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-4">
            Wallet<span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"> Connection</span>
          </h1>
          <p className="text-xl text-gray-400">
            Connect your Web3 wallet to start donating and tracking impact on the blockchain.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Wallet Card */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {!walletConnected ? (
              <div className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-12 space-y-8 text-center">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Wallet size={48} className="text-white" />
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">Connect Your Wallet</h2>
                  <p className="text-gray-400">
                    Connect a Web3-enabled wallet to begin making transparent, blockchain-verified donations.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <motion.button
                    onClick={connectWallet}
                    className="w-full px-6 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-glow flex items-center justify-center gap-2 text-lg"
                    variants={variants.buttonHover}
                    whileHover="whileHover"
                    whileTap="whileTap"
                  >
                    <Wallet size={24} />
                    Connect Wallet
                  </motion.button>
                  <p className="text-sm text-gray-500">
                    Supported: MetaMask, WalletConnect, Coinbase Wallet
                  </p>
                </div>

                {/* Wallet Options */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
                  {[
                    { name: 'MetaMask', emoji: '🦊' },
                    { name: 'WalletConnect', emoji: '📱' },
                    { name: 'Coinbase', emoji: '💙' }
                  ].map((wallet, i) => (
                    <motion.div
                      key={i}
                      className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-lg p-4 space-y-2 hover:bg-white/10 cursor-pointer transition-all"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-3xl">{wallet.emoji}</p>
                      <p className="text-sm font-semibold text-white">{wallet.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Wallet Info Card */}
                <motion.div
                  className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-8 space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Connected Wallet</h2>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-100 rounded-full text-xs font-semibold border border-emerald-500/30">✓ Connected</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Wallet Address</p>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {walletAddress?.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-mono text-white flex-1">{walletAddress}</span>
                        <motion.button
                          onClick={handleCopyAddress}
                          className="p-2 hover:bg-white/10 rounded transition-colors"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Copy size={18} className="text-gray-400" />
                        </motion.button>
                      </div>
                      {copied && (
                        <motion.p
                          className="text-xs text-emerald-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          ✓ Copied to clipboard
                        </motion.p>
                      )}
                    </div>

                    {/* Balance Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">ETH Balance</p>
                        <motion.button
                          onClick={() => setShowBalance(!showBalance)}
                          className="p-1 text-gray-400 hover:text-white"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                        </motion.button>
                      </div>
                      <motion.div
                        className="p-4 bg-accent-500/10 border border-accent-500/30 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <p className="text-3xl font-bold text-accent-100">
                          {showBalance ? `${walletBalance} ETH` : '••••••'}
                        </p>
                        {showBalance && (
                          <p className="text-sm text-gray-400 mt-2">
                            ≈ ${(walletBalance * 2000).toFixed(2)} USD
                          </p>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  <motion.button
                    onClick={disconnectWallet}
                    className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut size={18} />
                    Disconnect Wallet
                  </motion.button>
                </motion.div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-6 space-y-3 text-center group hover:bg-white/10 hover:border-accent-500/30 hover:shadow-glow transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-100 mx-auto group-hover:bg-emerald-500/40 transition-all">
                      <ArrowDownLeft size={24} />
                    </div>
                    <p className="font-semibold text-white">Receive</p>
                    <p className="text-xs text-gray-400">Get funds from others</p>
                  </motion.button>
                  <motion.button
                    className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-6 space-y-3 text-center group hover:bg-white/10 hover:border-accent-500/30 hover:shadow-glow transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-100 mx-auto group-hover:bg-blue-500/40 transition-all">
                      <ArrowUpRight size={24} />
                    </div>
                    <p className="font-semibold text-white">Send</p>
                    <p className="text-xs text-gray-400">Transfer to another wallet</p>
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Security Info */}
            <div className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                🔒 Security
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Non-custodial wallet connection</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Your keys, your crypto</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>No personal data stored</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Verified smart contracts</span>
                </li>
              </ul>
            </div>

            {/* Network Info */}
            <div className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                🌐 Network
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Blockchain</p>
                  <p className="font-semibold text-white">Ethereum Mainnet</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Network ID</p>
                  <p className="font-mono text-accent-100 text-sm">1</p>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-6 space-y-4 border-l-4 border-accent-500">
              <h3 className="font-bold text-white">❓ Need Help?</h3>
              <p className="text-sm text-gray-400">
                Check our documentation or contact support for assistance with wallet connection.
              </p>
              <motion.button
                className="text-accent-100 hover:text-accent-50 text-sm font-semibold transition-colors"
                whileHover={{ x: 5 }}
              >
                View Docs →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;