import { create } from 'zustand';

const useStore = create((set) => ({
    
    
  // Wallet state
  walletConnected: false,
  walletAddress: null,
  walletBalance: 0,
  
  connectWallet: async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        
        const balanceHex = await window.ethereum.request({ 
          method: 'eth_getBalance', 
          params: [address, 'latest'] 
        });
        const balance = parseInt(balanceHex, 16) / 1e18;

        set({
          walletConnected: true,
          walletAddress: address,
          walletBalance: balance
        });
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install a Web3 wallet (like MetaMask) to connect.");
    }
  },
  
  initWalletListeners: () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          set({ walletAddress: accounts[0], walletConnected: true });
          // optionally re-fetch balance here
        } else {
          set({ walletAddress: null, walletConnected: false, walletBalance: 0 });
        }
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  },

  disconnectWallet: () => set({
    walletConnected: false,
    walletAddress: null,
    walletBalance: 0
  }),
  

  // Donations state
  donations: [
    {
      id: 1,
      amount: 0.5,
      timestamp: '2024-01-15T10:30:00Z',
      disaster: 'Turkey Earthquake Relief',
      status: 'confirmed',
      txHash: '0x1234...5678',
      impactMetrics: { peopleHelped: 5, foodPackages: 2 }
    },
    {
      id: 2,
      amount: 1.2,
      timestamp: '2024-01-10T14:20:00Z',
      disaster: 'Pakistan Flood Emergency',
      status: 'confirmed',
      txHash: '0xabcd...ef00',
      impactMetrics: { peopleHelped: 12, shelters: 1 }
    },
    {
      id: 3,
      amount: 0.8,
      timestamp: '2024-01-08T09:15:00Z',
      disaster: 'Syria Humanitarian Crisis',
      status: 'pending',
      txHash: '0x5678...9abc',
      impactMetrics: { peopleHelped: 8, medicalSupplies: 1 }
    }
    
  ],

  addDonation: (donation) => set((state) => ({
    donations: [donation, ...state.donations]
  })),
  
  // Checkout state
  selectedDisaster: null,
  setSelectedDisaster: (disaster) => set({ selectedDisaster: disaster }),
  

  // Disasters state
  disasters: [
    {
      id: 1,
      name: 'Turkey Earthquake Relief',
      location: 'Türkiye',
      status: 'active',
      progress: 75,
      targetAmount: 100,
      raisedAmount: 75,
      description: 'Emergency relief for earthquake victims',
      image: '🏢',
      supporters: 1249,
      urgency: 'critical'
    },
    {
      id: 2,
      name: 'Pakistan Flood Emergency',
      location: 'Pakistan',
      status: 'active',
      progress: 45,
      targetAmount: 50,
      raisedAmount: 22.5,
      description: 'Flood relief and reconstruction',
      image: '💧',
      supporters: 856,
      urgency: 'high'
    },
    {
      id: 3,
      name: 'Syria Humanitarian Crisis',
      location: 'Syria',
      status: 'ongoing',
      progress: 60,
      targetAmount: 150,
      raisedAmount: 90,
      description: 'Food, medicine, and shelter assistance',
      image: '🏥',
      supporters: 2145,
      urgency: 'critical'
    },
    {
      id: 4,
      name: 'Yemen Aid Program',
      location: 'Yemen',
      status: 'active',
      progress: 35,
      targetAmount: 75,
      raisedAmount: 26,
      description: 'Medical supplies and clean water',
      image: '💧',
      supporters: 654,
      urgency: 'high'
    },
    {
      id: 5,
      name: 'Ukraine Emergency Relief',
      location: 'Ukraine',
      status: 'active',
      progress: 80,
      targetAmount: 200,
      raisedAmount: 160,
      description: 'Shelter, food, and medical assistance for displaced families',
      image: '🏘️',
      supporters: 5432,
      urgency: 'critical'
    },
    {
      id: 6,
      name: 'California Wildfire Support',
      location: 'USA',
      status: 'active',
      progress: 55,
      targetAmount: 120,
      raisedAmount: 66,
      description: 'Rebuilding communities and providing emergency housing',
      image: '🔥',
      supporters: 1890,
      urgency: 'high'
    },
    {
      id: 7,
      name: 'Central Africa Hunger Relief',
      location: 'Central African Republic',
      status: 'ongoing',
      progress: 25,
      targetAmount: 50,
      raisedAmount: 12.5,
      description: 'Nutritional support and sustainable agriculture initiatives',
      image: '🌾',
      supporters: 945,
      urgency: 'critical'
    },
    {
      id: 8,
      name: 'Global Education Initiative',
      location: 'Worldwide',
      status: 'active',
      progress: 90,
      targetAmount: 30,
      raisedAmount: 27,
      description: 'Providing educational materials and infrastructure',
      image: '📚',
      supporters: 3210,
      urgency: 'medium'
    }
  ],

  // Donor stats
  totalDonated: 2.5,
  impactScore: 85,
  
  updateStats: () => set((state) => ({
    totalDonated: state.donations.reduce((sum, d) => sum + d.amount, 0),
    impactScore: Math.min(100, state.donations.length * 25 + 10)
  })),
  theme: localStorage.getItem('theme') || 'dark',
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light');
    return { theme: newTheme };
  }),
  
  initTheme: () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    }
    return { theme: savedTheme };
  }

}));  // ← YHA CLOSE HOTA HAI


export default useStore;