import { motion } from 'framer-motion';
import { ArrowRight, Zap, Lock, Globe } from 'lucide-react';
import { useAnimationVariants, useNumberAnimation } from '../hooks';
import { BackgroundPaths } from '@/components/ui/background-paths';

const Landing = ({ onNavigate }) => {
  const variants = useAnimationVariants();
  const supportersCount = useNumberAnimation(4500);

  const features = [
    {
      icon: <Lock size={24} />,
      title: 'Blockchain Verified',
      description: 'Every transaction is immutable and transparent on the blockchain'
    },
    {
      icon: <Globe size={24} />,
      title: 'Global Impact',
      description: 'Help communities worldwide with secure, direct donations'
    },
    {
      icon: <Zap size={24} />,
      title: 'Instant Delivery',
      description: 'Near-instant settlement with minimal fees'
    }
  ];

  return (
    <div className="relative min-h-screen pt-20 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <BackgroundPaths title="" />
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={variants.container}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
          <motion.div variants={variants.item} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/10 border border-accent-500/30 rounded-full text-accent-100 text-sm font-semibold">
                <Zap size={16} />
                Welcome to the Future of Giving
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Transparent Aid Through
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"> Blockchain</span>
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed">
              Trust Gain revolutionizes humanitarian aid by making every donation transparent, traceable, and directly impactful. See exactly where your funds go.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <motion.button
                onClick={() => onNavigate('donate')}
                className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-glow flex items-center justify-center gap-2 text-lg"
                variants={variants.buttonHover}
                whileHover="whileHover"
                whileTap="whileTap"
              >
                Start Donating
                <ArrowRight size={20} />
              </motion.button>
              <motion.button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
                variants={variants.buttonHover}
                whileHover="whileHover"
                whileTap="whileTap"
              >
                View Dashboard
                <ArrowRight size={20} />
              </motion.button>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10"
              variants={variants.item}
            >
              {[
                { label: 'Active Campaigns', value: '12' },
                { label: 'Total Raised', value: '$2.3M' },
                { label: 'Donors', value: supportersCount }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={variants.container}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={variants.item}
              className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-8 space-y-4 group hover:bg-white/10 hover:border-accent-500/30 hover:shadow-glow transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-12 h-12 rounded-lg bg-accent-500/20 flex items-center justify-center text-accent-100 group-hover:bg-accent-500/40 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;