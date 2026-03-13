import { motion } from 'framer-motion';
import { ExternalLink, Filter, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import useStore from '../store';
import { useAnimationVariants, formatDate } from '../hooks';

const TransactionHistory = () => {
  const { donations } = useStore();
  const [filterStatus, setFilterStatus] = useState('all');
  const variants = useAnimationVariants();

  const filteredDonations = donations.filter(d => 
    filterStatus === 'all' || d.status === filterStatus
  );

  const stats = [
    { label: 'Total Transactions', value: donations.length, icon: '📊' },
    { label: 'Confirmed', value: donations.filter(d => d.status === 'confirmed').length, icon: '✓' },
    { label: 'Pending', value: donations.filter(d => d.status === 'pending').length, icon: '⏱' },
    { label: 'Total Volume', value: `${donations.reduce((sum, d) => sum + d.amount, 0).toFixed(2)} ETH`, icon: '💰' }
  ];

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
            Transaction<span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"> History</span>
          </h1>
          <p className="text-xl text-gray-400">
            Complete transparency of all donations verified on the blockchain.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          variants={variants.container}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={variants.item}
              className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-6 space-y-2"
            >
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-4 mb-8 flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Filter size={20} className="text-gray-400" />
          <div className="flex-1 flex flex-wrap gap-2">
            {['all', 'confirmed', 'pending'].map((status) => (
              <motion.button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filterStatus === status
                    ? 'bg-accent-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar size={18} />
            <span className="text-sm">All time</span>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          className="space-y-3"
          variants={variants.container}
          initial="hidden"
          animate="visible"
        >
          {filteredDonations.length > 0 ? (
            filteredDonations.map((donation, i) => (
              <motion.div
                key={donation.id}
                variants={variants.item}
                className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-white/10 hover:border-accent-500/30 hover:shadow-glow transition-all"
                whileHover={{ scale: 1.01 }}
              >
                {/* Left Section */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{donation.disaster}</h3>
                      <p className="text-sm text-gray-400">{formatDate(donation.timestamp)}</p>
                    </div>
                    <motion.div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                        donation.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30'
                          : 'bg-yellow-500/20 text-yellow-100 border-yellow-500/30'
                      }`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      {donation.status === 'confirmed' ? (
                        <>
                          <CheckCircle size={14} />
                          Confirmed
                        </>
                      ) : (
                        <>
                          <Clock size={14} />
                          Pending
                        </>
                      )}
                    </motion.div>
                  </div>

                  {/* Impact Details */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">
                      Helped <span className="text-emerald-400 font-semibold">
                        {donation.impactMetrics?.peopleHelped || 0} people
                      </span>
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">
                      <span className="font-mono text-accent-100">{donation.txHash}</span>
                    </span>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent-100">{donation.amount} ETH</p>
                    <p className="text-xs text-gray-400">Ethereum</p>
                  </div>

                  {/* Blockchain Link */}
                  <motion.a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-accent-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="View on Etherscan"
                  >
                    <ExternalLink size={20} />
                  </motion.a>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-12 text-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-2xl">📭</p>
              <p className="text-gray-400">No transactions found for this filter.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Details Panel */}
        {filteredDonations.length > 0 && (
          <motion.div
            className="mt-12 bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold">How Blockchain Ensures Transparency</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Immutable Records',
                  description: 'Every transaction is permanently recorded on the blockchain and cannot be altered or deleted.'
                },
                {
                  title: 'Real-time Tracking',
                  description: 'Track your donations in real-time and see exactly where funds are being distributed.'
                },
                {
                  title: 'Smart Contracts',
                  description: 'Automated smart contracts ensure funds reach verified relief organizations without intermediaries.'
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-lg p-6 space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <h4 className="font-bold text-white">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;