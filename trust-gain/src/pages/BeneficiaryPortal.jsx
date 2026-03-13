import { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Lock, Unlock, FileCheck2, Loader2, Key } from 'lucide-react';
import useStore from '../store';
import { generateZKProofOffchain, deriveEncryptionKey } from '../utils/crypto';

// This represents the encrypted aid package payload stored publicly on IPFS/Chain.
// Only the beneficiary who signs the exact message with their private key can generate
// the AES key required to decrypt this and see the pickup location and voucher codes.
const MOCK_ENCRYPTED_PAYLOAD = "U2FsdGVkX19x9A1yYkZ2tW55K3K2E/qYjR3R0O7g1wzQWjQZ1pRbqK0t0r3yq5rO"; // Simulated ciphertext

const BeneficiaryPortal = () => {
  const { walletConnected } = useStore();
  
  // ZK State
  const [isGeneratingZk, setIsGeneratingZk] = useState(false);
  const [zkProof, setZkProof] = useState(null);
  
  // Decryption State
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedData, setDecryptedData] = useState(null);
  const [decryptError, setDecryptError] = useState(null);

  const handleGenerateZK = async () => {
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    setIsGeneratingZk(true);
    try {
      // Pass a secret preimage (simulated from local storage or wallet signature)
      const data = await generateZKProofOffchain("my_secret_id_1234");
      setZkProof(data);
    } catch (e) {
      console.error(e);
      alert("ZK Profile generation failed.");
    } finally {
      setIsGeneratingZk(false);
    }
  };

  const handleDecryptAid = async () => {
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    
    setIsDecrypting(true);
    setDecryptError(null);
    try {
      // 1. Ask MetaMask to sign the deterministic challenge text to derive a secure AES key
      await deriveEncryptionKey();
      
      // 2. We mock the decryption process here for demonstration, 
      // since the MOCK_ENCRYPTED_PAYLOAD was encrypted with a different dummy key.
      // In reality, we'd use decryptBeneficiaryData(MOCK_ENCRYPTED_PAYLOAD, derivedAESKey)
      
      const simulatedPackage = {
        name: "Emergency Food Ration (Family Size)",
        location: "Distribution Center Alpha, Kigali",
        voucherCode: "RATION-9284-XYZ",
        validUntil: new Date(Date.now() + 86400000 * 7).toLocaleDateString()
      };

      setDecryptedData(simulatedPackage);
      
    } catch (e) {
      console.error("Decryption failed:", e);
      if (e.code === 4001) {
        setDecryptError("You rejected the signature request.");
      } else {
        setDecryptError("Failed to decrypt package. Is this your wallet?");
      }
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Beneficiary Security Portal
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Protecting identity and data in dangerous regions. Claim your aid using Zero-Knowledge proofs without revealing who you are, and decrypt your pickup details safely.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ZK Proof Identity Section */}
          <motion.div 
            className="bg-white/5 border border-white/10 backdrop-blur-glass rounded-3xl p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
             <div className="w-16 h-16 bg-accent-500/20 rounded-2xl flex items-center justify-center text-accent-400 mb-6">
               <Fingerprint size={32} />
             </div>
             
             <h2 className="text-2xl font-bold text-white mb-2">Zero-Knowledge ID</h2>
             <p className="text-gray-400 text-sm mb-8 min-h-[60px]">
               Generate a cryptographic proof that you are on the approved recipient list without exposing your wallet address or real name to the public ledger.
             </p>

             {zkProof ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-400 space-y-3">
                  <div className="flex items-center gap-2 font-bold font-display">
                    <FileCheck2 size={20} />
                    ZK Proof Generated successfully
                  </div>
                  <div className="text-xs font-mono break-all opacity-80 bg-black/20 p-2 rounded">
                    Nullifier: {zkProof.nullifierHash.substring(0,32)}...
                  </div>
                  <button className="w-full mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors">
                    Submit to Smart Contract
                  </button>
                </div>
             ) : (
                <motion.button
                  onClick={handleGenerateZK}
                  disabled={isGeneratingZk || !walletConnected}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 border border-white/5"
                  whileTap={!isGeneratingZk && walletConnected ? { scale: 0.95 } : {}}
                >
                  {isGeneratingZk ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Computing Snark Proof...
                    </>
                  ) : (
                    <>
                      Generate ZK Profile (snarkjs)
                    </>
                  )}
                </motion.button>
             )}
          </motion.div>


          {/* Asymmetric Encryption Section */}
          <motion.div 
            className="bg-white/5 border border-white/10 backdrop-blur-glass rounded-3xl p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
             <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
               <Lock size={32} />
             </div>
             
             <h2 className="text-2xl font-bold text-white mb-2">Secure Aid Package</h2>
             <p className="text-gray-400 text-sm mb-8 min-h-[60px]">
               Decrypt your aid package pickup location and voucher codes locally. The data remains encrypted on the decentralized network.
             </p>

             {decryptedData ? (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 text-blue-100 space-y-4">
                  <div className="flex items-center gap-2 font-bold text-blue-400">
                    <Unlock size={20} />
                    Decryption Successful
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-blue-400 font-semibold mb-1 block">Package</span> {decryptedData.name}</p>
                    <p><span className="text-blue-400 font-semibold mb-1 block">Pickup Location</span> {decryptedData.location}</p>
                    <p><span className="text-blue-400 font-semibold mb-1 block">Voucher Code</span> <span className="font-mono bg-blue-900/50 px-2 py-1 rounded">{decryptedData.voucherCode}</span></p>
                    <p className="text-xs text-blue-300/60 pt-2 border-t border-blue-500/20">Valid Until: {decryptedData.validUntil}</p>
                  </div>
                </div>
             ) : (
                <div className="space-y-4">
                  <div className="bg-black/30 w-full p-4 rounded-xl border border-white/5 font-mono text-xs text-gray-500 break-all h-20 overflow-hidden relative">
                    {MOCK_ENCRYPTED_PAYLOAD.repeat(5)}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                  </div>
                  
                  {decryptError && (
                    <p className="text-red-400 text-sm font-semibold text-center">{decryptError}</p>
                  )}

                  <motion.button
                    onClick={handleDecryptAid}
                    disabled={isDecrypting || !walletConnected}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20"
                    whileTap={!isDecrypting && walletConnected ? { scale: 0.95 } : {}}
                  >
                    {isDecrypting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Sign in Wallet to Decrypt...
                      </>
                    ) : (
                      <>
                        <Key size={20} />
                        Decrypt Package (ethers.js)
                      </>
                    )}
                  </motion.button>
                </div>
             )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default BeneficiaryPortal;
