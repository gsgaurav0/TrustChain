import { BrowserProvider } from 'ethers';
import CryptoJS from 'crypto-js';

// --- ASYMMETRIC ENCRYPTION MODULE --- //

/**
 * Prompts the connected MetaMask wallet to sign a deterministic message to generate a resilient encryption key.
 * Only the owner of this wallet's private key can generate the same signature for this exact text.
 */
export async function deriveEncryptionKey() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error("No Web3 wallet installed.");
  }
  
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // The text string that the beneficiary signs. They don't expose their private key to the web app,
  // but the resulting cryptographic signature is deterministic and acts as a safe symmetric key.
  const challengeText = "AidLedger Security: Sign this message to unlock and decrypt your secure aid package data. This does not trigger a transaction.";
  const signature = await signer.signMessage(challengeText);

  // Hash the 130-char hex signature to generate a clean 256-bit AES key string
  return CryptoJS.SHA256(signature).toString(CryptoJS.enc.Hex);
}

/**
 * Encrypts sensitive JSON payload data using the derived AES key from the user's signature.
 * @param {Object} data - The sensitive aid package data (e.g. food voucher codes, location).
 * @param {string} keyString - The SHA256 hashed signature key.
 */
export function encryptBeneficiaryData(data, keyString) {
  const jsonString = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonString, keyString).toString();
  return encrypted;
}

/**
 * Decrypts the cipher text using the derived AES key.
 * @param {string} cipherText - The AES encrypted string.
 * @param {string} keyString - The SHA256 hashed signature key.
 */
export function decryptBeneficiaryData(cipherText, keyString) {
  const bytes = CryptoJS.AES.decrypt(cipherText, keyString);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  
  if (!decryptedString) {
      throw new Error("Invalid decryption key or corrupted data");
  }
  return JSON.parse(decryptedString);
}


// --- ZERO KNOWLEDGE PROOF MODULE (snarkjs mock implementation) --- //

/**
 * Generates a mock Zero Knowledge Proof off-chain for the hackathon. 
 * Represents a user proving they own a secret identity commitment inside the AidLedger Merkle Tree,
 * without revealing which leaf they actually belong to.
 */
export async function generateZKProofOffchain(secretPreimage) {
    // In production, snarkjs.groth16.fullProve would be called here:
    // const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    //     { secret: secretPreimage }, 
    //     "circuit.wasm", 
    //     "circuit_final.zkey"
    // );
    
    // For Hackathon Demo Simulation:
    console.log("Generating Zero-Knowledge Snark Proof from local constraints...");
    
    // Simulate complex proof generation time (e.g., 2000ms delay)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockNullifierHash = CryptoJS.SHA256(secretPreimage + "_nullifier").toString(CryptoJS.enc.Hex);
    
    return {
        proof: {
            pi_a: ["0x12..34", "0x56..78"],
            pi_b: [["0xab..cd", "0xef..01"], ["0x23..45", "0x67..89"]],
            pi_c: ["0xaa..bb", "0xcc..dd"]
        },
        publicSignals: [
            `0x${mockNullifierHash.substring(0, 64)}`
        ],
        nullifierHash: `0x${mockNullifierHash.substring(0, 64)}`
    };
}
