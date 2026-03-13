import { create } from 'zustand';

const useStore = create((set) => ({
    
    
  // Wallet state
  walletConnected: false,
  walletAddress: null,
  walletBalance: 0,
  
  connectWallet: () => set({
    walletConnected: true,
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f42D5',
    walletBalance: 2.5
  }),
  
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