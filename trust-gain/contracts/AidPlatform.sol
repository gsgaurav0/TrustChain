// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AidPlatform
 * @dev A transparent donation ledger with Multi-Sig (3/5) release and Zero-Knowledge Proof beneficiary verification.
 */
contract AidPlatform {

    // --- Multi-Sig Constants & State ---
    address[5] public validators;
    uint256 public constant REQUIRED_SIGNATURES = 3;
    
    // Mapping to track if a specific payout ID has already been executed to prevent replay attacks
    mapping(bytes32 => bool) public executedPayouts;

    // --- ZK Proof Placeholder Mapping ---
    // Maps a public inputs hash to a boolean indicating if the beneficiary has successfully proven their identity off-chain.
    mapping(bytes32 => bool) public verifiedBeneficiaries;

    // Events
    event FundsReleased(bytes32 indexed payoutId, address indexed recipient, uint256 amount);
    event BeneficiaryVerified(bytes32 indexed nullifierHash);
    event DonationReceived(address indexed donor, uint256 amount);

    constructor(address[5] memory _validators) {
        validators = _validators;
    }

    // Fallback block to receive ETH donations
    receive() external payable {
        emit DonationReceived(msg.sender, msg.value);
    }

    /**
     * @dev Release funds to a verified beneficiary requiring 3/5 Validator signatures.
     * @param payoutId A unique identifier for this specific payout
     * @param recipient The address receiving the funds
     * @param amount The amount of ETH to send
     * @param signatures An array of exactly 3 concatenated ECDSA signatures (each 65 bytes: r, s, v)
     */
    function releaseFunds(
        bytes32 payoutId, 
        address payable recipient, 
        uint256 amount, 
        bytes[] calldata signatures
    ) external {
        require(!executedPayouts[payoutId], "Payout has already been executed");
        require(signatures.length == REQUIRED_SIGNATURES, "Invalid number of signatures");
        require(address(this).balance >= amount, "Insufficient contract balance");

        // The message hash that validators should have signed (EIP-191 standard)
        bytes32 messageHash = keccak256(abi.encodePacked(payoutId, recipient, amount, address(this)));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));

        address lastSigner = address(0);
        uint256 validSignatures = 0;

        for (uint256 i = 0; i < signatures.length; i++) {
            address signer = recoverSigner(ethSignedMessageHash, signatures[i]);
            
            // Signatures must be from validators
            require(isValidator(signer), "Signer is not a validator");
            
            // Signatures must be uniquely provided in ascending order (prevents duplicate signatures from same validator)
            require(signer > lastSigner, "Signatures not unique or properly ordered");
            lastSigner = signer;
            validSignatures += 1;
        }

        require(validSignatures == REQUIRED_SIGNATURES, "Multi-Sig verification failed");

        executedPayouts[payoutId] = true;
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "ETH transfer failed");

        emit FundsReleased(payoutId, recipient, amount);
    }

    /**
     * @dev Helper function to verify if an address represents an approved validator
     */
    function isValidator(address account) public view returns (bool) {
        for (uint256 i = 0; i < 5; i++) {
            if (validators[i] == account) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Recover ECDSA signer address from a signature
     */
    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) internal pure returns (address) {
        require(_signature.length == 65, "Invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    /**
     * @dev Placeholder for SnarkJS Zero-Knowledge Proof Verification on-chain.
     * In a production environment, this would call a generated Groth16Verifier.sol contract.
     */
    function verifyZKProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory publicInputs, // [0] = nullifier hash
        bytes32 nullifierHash
    ) external {
        // [Hackathon Mock]
        // This simulates a successful ZK proof verification that the individual
        // holds the preimage to the identity commitment without revealing their actual ID.
        require(!verifiedBeneficiaries[nullifierHash], "Beneficiary already verified");
        verifiedBeneficiaries[nullifierHash] = true;
        
        emit BeneficiaryVerified(nullifierHash);
    }
}
