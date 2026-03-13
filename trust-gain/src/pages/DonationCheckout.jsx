import { motion } from 'framer-motion';
import { Heart, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import useStore from '../store';
import { useAnimationVariants } from '../hooks';

const DonationCheckout = ({ onNavigate }) => {
  const { selectedDisaster, addDonation, walletConnected, walletAddress, setSelectedDisaster } = useStore();
  const [donationAmount, setDonationAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const variants = useAnimationVariants();

  useEffect(() => {
    // Redirect back to donate page if accessed without a selected disaster
    if (!selectedDisaster) {
      onNavigate('donate');
    }
  }, [selectedDisaster, onNavigate]);

  if (!selectedDisaster) return null;

  const handleDonate = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (donationAmount && parseFloat(donationAmount) > 0) {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install a Web3 wallet (like MetaMask) to donate.');
        return;
      }

      setIsProcessing(true);
      try {
        // Convert ETH amount to Wei (hex)
        const amountInWei = BigInt(Math.floor(parseFloat(donationAmount) * 1e18)).toString(16);
        const transactionParameters = {
          to: '0x000000000000000000000000000000000000dEaD', // Burn/treasury address for hackathon
          from: walletAddress,
          value: `0x${amountInWei}`,
        };

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });

        // If user approves and transaction is sent:
        const newDonation = {
          id: Date.now(),
          amount: parseFloat(donationAmount),
          timestamp: new Date().toISOString(),
          disaster: selectedDisaster.name,
          status: 'pending',
          txHash: txHash,
          impactMetrics: { peopleHelped: Math.floor(Math.random() * 20), supplies: 1 }
        };

        addDonation(newDonation);
        setDonationAmount('');
        setSelectedDisaster(null);
        alert('Donation submitted! Check your transaction history.');
        onNavigate('impact'); 
      } catch (error) {
         console.error("Donation transaction failed:", error);
         if (error.code === 4001) {
             alert('Transaction rejected by user.');
         } else {
             alert(`Transaction failed: ${error.message}`);
         }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button 
          onClick={() => {
             setSelectedDisaster(null);
             onNavigate('donate');
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft size={20} />
          Back to Campaigns
        </motion.button>

        <motion.div
           variants={variants.container}
           initial="hidden"
           animate="visible"
           className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header Area */}
          <motion.div variants={variants.item} className="p-8 md:p-12 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
             <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl drop-shadow-lg">{selectedDisaster.image}</span>
                <div>
                   <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{selectedDisaster.name}</h1>
                   <p className="text-lg text-gray-400 flex items-center gap-2">
                       <ShieldCheck size={18} className="text-accent-500" />
                       Verified Campaign in {selectedDisaster.location}
                   </p>
                </div>
             </div>
             <p className="text-gray-300 mt-6 leading-relaxed max-w-2xl">{selectedDisaster.description}</p>
          </motion.div>

          {/* Checkout Area */}
          <motion.div variants={variants.item} className="p-8 md:p-12 grid md:grid-cols-2 gap-12">
            
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Choose Amount (ETH)</h3>
                    <div className="grid grid-cols-2 gap-3">
                    {[0.1, 0.5, 1.0, 2.0].map((amount) => (
                        <motion.button
                        key={amount}
                        onClick={() => setDonationAmount(amount.toString())}
                        className={`py-3 rounded-xl border text-lg font-semibold transition-all ${donationAmount === amount.toString() ? 'bg-accent-500/20 text-accent-100 border-accent-500' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                        whileTap={{ scale: 0.95 }}
                        >
                        {amount} ETH
                        </motion.button>
                    ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Or Enter Custom Amount</h3>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-2xl font-bold text-white placeholder-gray-600 focus:outline-none focus:border-accent-500/50 focus:bg-white/10 transition-all duration-200"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">ETH</span>
                    </div>
                </div>
            </div>

            <div className="bg-dark-900/50 rounded-2xl p-6 border border-white/5 space-y-6 flex flex-col justify-between">
               <div>
                  <h3 className="text-lg font-semibold text-gray-400 mb-4">Donation Summary</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center pb-4 border-b border-white/10">
                         <span className="text-gray-300">Campaign</span>
                         <span className="text-white font-medium text-right max-w-[150px] truncate">{selectedDisaster.name}</span>
                     </div>
                     <div className="flex justify-between items-center pb-4 border-b border-white/10">
                         <span className="text-gray-300">Network Fee</span>
                         <span className="text-emerald-400 font-medium">Covered by platform</span>
                     </div>
                     <div className="flex justify-between items-end pt-2">
                         <span className="text-gray-300 font-medium">Total Total</span>
                         <span className="text-3xl font-bold text-accent-100">{donationAmount || '0.00'} <span className="text-lg">ETH</span></span>
                     </div>
                  </div>

                  <motion.div
                    className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-4 mt-6"
                   >
                    <p className="text-sm text-gray-400 mb-1">Estimated Impact</p>
                    <p className="text-xl font-bold text-white flex items-center gap-2">
                    <Heart size={18} className="text-accent-500"/>
                    ~{donationAmount ? (parseFloat(donationAmount) * 10).toFixed(0) : 0} people helped
                    </p>
                  </motion.div>
               </div>

                <motion.button
                  onClick={handleDonate}
                  disabled={!donationAmount || parseFloat(donationAmount) <= 0 || isProcessing}
                  className="w-full py-4 bg-accent-500 disabled:bg-white/10 disabled:text-gray-500 hover:bg-accent-600 text-white font-bold text-lg rounded-xl transition-all duration-200 transform disabled:hover:scale-100 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-glow flex items-center justify-center gap-2 mt-8"
                  whileTap={(!isProcessing) ? { scale: 0.95 } : {}}
                >
                  <ShieldCheck size={20} />
                  {isProcessing ? 'Confirming in Wallet...' : 'Confirm Donation'}
                </motion.button>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DonationCheckout;
