import { motion } from 'framer-motion';
import { Heart, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import useStore from '../store';
import { useAnimationVariants } from '../hooks';

const DisasterCards = ({ onNavigate }) => {
  const { disasters, setSelectedDisaster } = useStore();
  const variants = useAnimationVariants();

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'border-red-500/30 bg-red-500/5';
      case 'high':
        return 'border-orange-500/30 bg-orange-500/5';
      default:
        return 'border-yellow-500/30 bg-yellow-500/5';
    }
  };

  const getUrgencyBadgeColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-500/20 text-red-100 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-100 border-orange-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-100 border-yellow-500/30';
    }
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
            Active<span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"> Campaigns</span>
          </h1>
          <p className="text-xl text-gray-400">
            Support critical humanitarian efforts around the world with transparent, traceable donations.
          </p>
        </motion.div>

        {/* Filter/Info Bar */}
        <motion.div
          className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-4 mb-8 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AlertCircle size={20} className="text-accent-100" />
          <p className="text-sm text-gray-300">
            Each ETH donated goes directly to verified relief organizations. Track impact in real-time on the blockchain.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={variants.container}
          initial="hidden"
          animate="visible"
        >
          {disasters.map((disaster, i) => (
            <motion.div
              key={disaster.id}
              variants={variants.item}
              className={`bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-6 space-y-6 ${getUrgencyColor(disaster.urgency)} cursor-pointer transition-all hover:bg-white/10 hover:border-accent-500/30 hover:shadow-glow`}
              onClick={() => setSelectedDisaster(disaster)}
              whileHover={{ scale: 1.02 }}
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{disaster.image}</span>
                      <h3 className="text-2xl font-bold text-white">{disaster.name}</h3>
                    </div>
                    <p className="text-sm text-gray-400">{disaster.location}</p>
                  </div>
                  <motion.div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getUrgencyBadgeColor(disaster.urgency)}`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <AlertCircle size={14} />
                    {disaster.urgency.charAt(0).toUpperCase() + disaster.urgency.slice(1)}
                  </motion.div>
                </div>
                <p className="text-gray-400">{disaster.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Funding Progress</p>
                  <p className="text-sm font-semibold text-accent-100">{disaster.progress}%</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent-500 to-accent-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${disaster.progress}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 1 }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white">${disaster.raisedAmount}M</p>
                  <p className="text-xs text-gray-400">Raised</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white">${disaster.targetAmount}M</p>
                  <p className="text-xs text-gray-400">Target</p>
                </div>
                <div className="space-y-1 flex items-end justify-end">
                  <div className="flex items-center gap-1">
                    <Users size={16} className="text-accent-100" />
                    <p className="text-lg font-bold text-white">{disaster.supporters.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-gray-400">Supporters</p>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDisaster(disaster);
                  onNavigate('checkout');
                }}
                className="w-full px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-glow flex items-center justify-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={18} />
                Donate Now
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DisasterCards;
