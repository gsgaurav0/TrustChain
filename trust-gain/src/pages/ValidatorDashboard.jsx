import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Key, PenTool } from 'lucide-react';
import useStore from '../store';
import { BrowserProvider, solidityPackedKeccak256, getBytes } from 'ethers';

const mockPendingPayouts = [
  {
    id: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    amount: '1.5',
    recipient: '0xabc123...',
    campaign: 'Sudan Famine Relief',
    signatures: 2,
    required: 3
  },
  {
    id: '0x992b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f3333',
    amount: '5.0',
    recipient: '0xdef456...',
    campaign: 'Turkey Earthquake Recovery',
    signatures: 0,
    required: 3
  }
];

const ValidatorDashboard = () => {
  const { walletConnected } = useStore();
  const [payouts, setPayouts] = useState(mockPendingPayouts);
  const [signingId, setSigningId] = useState(null);
  const [executingId, setExecutingId] = useState(null);

  const executePayout = async (payout) => {
    if (!walletConnected) {
      alert("Please connect your wallet to execute.");
      return;
    }
    setExecutingId(payout.id);
    try {
      // In a real app, this would submit the collected signatures to `AidPlatform.releaseFunds(...)`
      console.log(`Executing Multi-Sig Payout for ${payout.id} with ${payout.signatures} signatures...`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction delay

      alert(`Success! Funds (${payout.amount} ETH) have been securely released to the beneficiary via Multi-Sig approval.`);
      
      // Remove the executed payout from the list
      setPayouts(prev => prev.filter(p => p.id !== payout.id));
    } catch (e) {
      console.error(e);
      alert("Execution failed.");
    } finally {
      setExecutingId(null);
    }
  };

  const signPayout = async (payout) => {
    if (!walletConnected) {
      alert("Please connect your validator wallet first.");
      return;
    }

    setSigningId(payout.id);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // In a real app, the contract address and recipient would be fully resolved hex addresses.
      // We hash the parameters exactly as the Solidity contract expects: 
      // keccak256(abi.encodePacked(payoutId, recipient, amount, contractAddress))
      
      // For the mock, we simulate this hashing process
      const messageHash = solidityPackedKeccak256(
        ['bytes32', 'address', 'uint256', 'address'],
        [payout.id, '0x000000000000000000000000000000000000dEaD', BigInt(payout.amount * 1e18), '0x0000000000000000000000000000000000000000']
      );

      // Sign the raw bytes of the hash
      const signature = await signer.signMessage(getBytes(messageHash));

      console.log("Multi-Sig Validator Signature Generated:", signature);
      alert(`Signature generated successfully!\n\n${signature.substring(0, 40)}...`);

      // Update local state to reflect signature addition
      setPayouts(prev => prev.map(p => {
        if (p.id === payout.id) {
          return { ...p, signatures: p.signatures + 1 };
        }
        return p;
      }));

    } catch (error) {
      console.error("Signing failed", error);
      if (error.code === 4001) alert("Signing rejected by validator.");
    } finally {
      setSigningId(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-4 flex items-center gap-3">
              <ShieldAlert className="text-accent-500" size={36} />
              Validator Dashboard
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Secure Multi-Signature (3/5) portal. Review pending transparent aid distributions and sign them cryptographically to release funds from the smart contract.
            </p>
          </div>
          
          <div className="bg-dark-800 border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${walletConnected ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
            <div>
              <p className="text-sm text-gray-400">Validator Status</p>
              <p className="font-semibold text-white">{walletConnected ? 'Connected & Ready' : 'Offline - Please Connect'}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {payouts.map((payout) => {
            const isReady = payout.signatures >= payout.required;

            return (
              <motion.div 
                key={payout.id}
                className={`bg-white/5 border ${isReady ? 'border-emerald-500/30' : 'border-white/10'} backdrop-blur-glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 transition-colors`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="space-y-4 flex-1 w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{payout.campaign}</h3>
                      <p className="text-accent-400 font-mono text-sm mt-1 break-all">ID: {payout.id.substring(0, 16)}...</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-3xl font-bold text-white">{payout.amount} ETH</p>
                      <p className="text-gray-400 text-sm break-all">Target: {payout.recipient}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-medium text-gray-300">Multi-Sig Progress</span>
                       <span className="text-sm font-bold text-white">{payout.signatures} / {payout.required} Signatures</span>
                    </div>
                    <div className="h-3 w-full bg-dark-900 rounded-full overflow-hidden">
                       <motion.div 
                          className={`h-full ${isReady ? 'bg-emerald-500' : 'bg-accent-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(payout.signatures / payout.required) * 100}%` }}
                          transition={{ duration: 1 }}
                       />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                   <motion.button
                     onClick={() => isReady ? executePayout(payout) : signPayout(payout)}
                     disabled={signingId === payout.id || executingId === payout.id || (!isReady && !walletConnected)}
                     className={`w-full md:w-48 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                       isReady 
                         ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                         : 'bg-accent-500 hover:bg-accent-600 text-white shadow-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed'
                     }`}
                     whileTap={(!signingId && !executingId) ? { scale: 0.95 } : {}}
                   >
                     {executingId === payout.id ? (
                       <>
                         <PenTool size={20} className="animate-spin" />
                         Executing...
                       </>
                     ) : isReady ? (
                       <>
                         <CheckCircle2 size={20} />
                         Execute Payout
                       </>
                     ) : signingId === payout.id ? (
                       <>
                         <PenTool size={20} className="animate-bounce" />
                         Check Wallet...
                       </>
                     ) : (
                       <>
                         <Key size={20} />
                         Sign Approval
                       </>
                     )}
                   </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default ValidatorDashboard;
