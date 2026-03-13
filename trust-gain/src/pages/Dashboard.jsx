import { motion } from 'framer-motion';
import { TrendingUp, Gift, Globe, Award, BarChart3, Zap } from 'lucide-react';
import useStore from '../store';
import { useAnimationVariants, useNumberAnimation, formatCurrency } from '../hooks';

const DashboardStats = () => {
  const { walletAddress, walletConnected, totalDonated, impactScore, donations, disasters } = useStore();
  const variants = useAnimationVariants();
  const animatedScore = useNumberAnimation(impactScore);
  const animatedDonations = useNumberAnimation(donations.length);

  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalImpacted = donations.reduce((sum, d) => sum + (d.impactMetrics?.peopleHelped || 0), 0);

  const stats = [
    {
      icon: <Gift size={24} />,
      label: 'Total Donated',
      value: formatCurrency(totalRaised),
      trend: '+0.5 ETH this month'
    },
    {
      icon: <Globe size={24} />,
      label: 'Campaigns Supported',
      value: new Set(donations.map(d => d.disaster)).size,
      trend: `Out of ${disasters.length} active`
    },
    {
      icon: <Award size={24} />,
      label: 'Impact Score',
      value: `${animatedScore}%`,
      trend: 'Verified on blockchain'
    },
    {
      icon: <Zap size={24} />,
      label: 'Total Transactions',
      value: animatedDonations,
      trend: 'All verified and transparent'
    }
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
          <h1 className="text-5xl font-bold mb-2">
            Your<span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"> Impact</span>
          </h1>
          {walletConnected && (
            <p className="text-lg text-gray-400">
              Welcome back, {walletAddress?.slice(0, 10)}...
            </p>
          )}
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={variants.container}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={variants.item}
              className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-6 space-y-2 group hover:bg-white/10 hover:border-accent-500/30 hover:shadow-glow transition-all duration-300"
              whileHover={{ y: -8 }}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-lg bg-accent-500/20 flex items-center justify-center text-accent-100 group-hover:bg-accent-500/40 transition-all duration-300">
                  {stat.icon}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <p className="text-xs text-gray-500">{stat.trend}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Impact Visualization */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-12"
          variants={variants.container}
          initial="hidden"
          animate="visible"
        >
          {/* Impact Gauge */}
          <motion.div
            variants={variants.item}
            className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-8 space-y-6"
          >
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 size={20} className="text-accent-100" />
              Impact Metrics
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-400">People Helped</p>
                  <p className="text-lg font-bold text-accent-100">{totalImpacted}</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalImpacted / 100) * 100, 100)}%` }}
                    transition={{ delay: 0.3, duration: 1 }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-400">Donor Trust Score</p>
                  <p className="text-lg font-bold text-blue-100">{animatedScore}%</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${animatedScore}%` }}
                    transition={{ delay: 0.4, duration: 1 }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-400">Verification Status</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-100 rounded-full text-xs font-semibold border border-emerald-500/30">✓ Verified</span>
                </div>
              </div>
            </div>

            <motion.div
              className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-lg p-4 border-l-4 border-accent-500"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-gray-300">
                All your donations are verified on the Ethereum blockchain with 100% transparency.
              </p>
            </motion.div>
          </motion.div>

          {/* Recent Activity Summary */}
          <motion.div
            variants={variants.item}
            className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-8 space-y-6"
          >
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-accent-100" />
              Donation Summary
            </h3>

            <div className="space-y-4">
              {donations.slice(0, 3).map((donation, i) => (
                <motion.div
                  key={i}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-semibold text-white">{donation.disaster}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(donation.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-accent-100">{donation.amount} ETH</p>
                    <p className={`text-xs font-semibold ${
                      donation.status === 'confirmed' ? 'text-emerald-400' : 'text-yellow-400'
                    }`}>
                      {donation.status === 'confirmed' ? '✓ Confirmed' : '⏱ Pending'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="w-full py-2 text-accent-100 border border-accent-500/30 rounded-lg hover:bg-accent-500/10 transition-colors text-sm font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Transactions →
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        {totalRaised === 0 && (
          <motion.div
            className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-8 text-center space-y-4 border border-accent-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold">Ready to Make an Impact?</h3>
            <p className="text-gray-400">Start by supporting one of our active campaigns and see your donation create real-world change.</p>
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Campaigns →
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;