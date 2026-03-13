import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Globe, Calendar, Users } from 'lucide-react';
import useStore from '../store';
import { useAnimationVariants } from '../hooks';

const Analytics = () => {
  const { donations, disasters } = useStore();
  const variants = useAnimationVariants();

  // Calculate stats
  const totalDonated = donations.reduce((sum, d) => d.status === 'confirmed' ? sum + d.amount : sum, 0);
  const averageDonation = totalDonated / donations.filter(d => d.status === 'confirmed').length;
  const totalCampaigns = disasters.length;
  const activeCampaigns = disasters.filter(d => d.status === 'active').length;

  // Campaign breakdown
  const campaignStats = disasters.map(d => ({
    name: d.name.substring(0, 15),
    raised: d.raisedAmount,
    target: d.targetAmount,
    percentage: (d.raisedAmount / d.targetAmount) * 100
  }));

  // Donations by urgency
  const urgencyStats = {
    critical: disasters.filter(d => d.urgency === 'critical').length,
    high: disasters.filter(d => d.urgency === 'high').length,
    medium: disasters.filter(d => d.urgency === 'medium').length
  };

  // Monthly trend (simulated)
  const monthlyTrend = [
    { month: 'Jan', amount: 0.5 },
    { month: 'Feb', amount: 1.2 },
    { month: 'Mar', amount: 0.8 }
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
            Analytics<span className="text-gradient"> Dashboard</span>
          </h1>
          <p className="text-xl text-gray-400">
            Comprehensive insights into donation trends and campaign performance
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={variants.container}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              icon: <TrendingUp size={24} />,
              label: 'Total Donated',
              value: `${totalDonated.toFixed(2)} ETH`,
              color: 'accent'
            },
            {
              icon: <Users size={24} />,
              label: 'Avg Donation',
              value: `${averageDonation.toFixed(2)} ETH`,
              color: 'blue'
            },
            {
              icon: <Globe size={24} />,
              label: 'Active Campaigns',
              value: activeCampaigns,
              color: 'green'
            },
            {
              icon: <Calendar size={24} />,
              label: 'Total Donations',
              value: donations.filter(d => d.status === 'confirmed').length,
              color: 'purple'
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={variants.item}
              className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-6 space-y-3"
              whileHover={{ y: -8 }}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center
                  ${stat.color === 'accent' ? 'bg-accent-500/20 text-accent-100' : ''}
                  ${stat.color === 'blue' ? 'bg-blue-500/20 text-blue-100' : ''}
                  ${stat.color === 'green' ? 'bg-emerald-500/20 text-emerald-100' : ''}
                  ${stat.color === 'purple' ? 'bg-purple-500/20 text-purple-100' : ''}
                `}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-12"
          variants={variants.container}
          initial="hidden"
          animate="visible"
        >
          {/* Donation Trend Chart */}
          <motion.div
            variants={variants.item}
            className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-8 space-y-6"
          >
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp size={24} className="text-accent-100" />
              Monthly Donation Trend
            </h3>

            <div className="space-y-6">
              {monthlyTrend.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-300">{item.month}</p>
                    <p className="text-sm font-bold text-accent-100">{item.amount} ETH</p>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent-500 to-accent-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.amount / 2) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <motion.div
              className="p-4 bg-accent-500/10 border border-accent-500/20 rounded-lg mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-gray-300">
                📈 <span className="text-accent-100 font-semibold">60% increase</span> in donations this month
              </p>
            </motion.div>
          </motion.div>

          {/* Campaign Breakdown */}
          <motion.div
            variants={variants.item}
            className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-8 space-y-6"
          >
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <BarChart3 size={24} className="text-emerald-100" />
              Campaign Progress
            </h3>

            <div className="space-y-5">
              {campaignStats.map((campaign, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-300">{campaign.name}</p>
                    <p className="text-xs font-bold text-emerald-100">{campaign.percentage.toFixed(0)}%</p>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${campaign.percentage}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 1 }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">${campaign.raised}M / ${campaign.target}M</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Urgency Distribution */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          variants={variants.container}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'Critical', value: urgencyStats.critical, color: 'red', icon: '🚨' },
            { label: 'High Priority', value: urgencyStats.high, color: 'orange', icon: '⚠️' },
            { label: 'Medium', value: urgencyStats.medium, color: 'yellow', icon: '📌' }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={variants.item}
              className={`rounded-2xl overflow-hidden p-8 text-center space-y-4
                ${item.color === 'red' ? 'bg-red-500/10 border border-red-500/20' : ''}
                ${item.color === 'orange' ? 'bg-orange-500/10 border border-orange-500/20' : ''}
                ${item.color === 'yellow' ? 'bg-yellow-500/10 border border-yellow-500/20' : ''}
              `}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-4xl">{item.icon}</p>
              <p className="text-3xl font-bold text-white">{item.value}</p>
              <p className="text-sm text-gray-400">{item.label} Campaigns</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Stats Table */}
        <motion.div
          className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 size={24} className="text-accent-100" />
            Detailed Campaign Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Campaign</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Location</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Raised</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Target</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Progress</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Supporters</th>
                </tr>
              </thead>
              <tbody>
                {disasters.map((campaign, i) => (
                  <motion.tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                  >
                    <td className="py-3 px-4 text-white font-semibold">{campaign.name}</td>
                    <td className="py-3 px-4 text-gray-400">{campaign.location}</td>
                    <td className="py-3 px-4 text-accent-100">${campaign.raisedAmount}M</td>
                    <td className="py-3 px-4 text-gray-400">${campaign.targetAmount}M</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-white/10 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-accent-500 to-accent-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${campaign.progress}%` }}
                            transition={{ delay: 0.8 + i * 0.05 }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 min-w-fit">{campaign.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{campaign.supporters.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          className="mt-12 grid md:grid-cols-3 gap-6"
          variants={variants.container}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              title: '🎯 Most Funded',
              content: disasters.reduce((max, d) => d.raisedAmount > max.raisedAmount ? d : max).name,
              stat: `$${disasters.reduce((max, d) => d.raisedAmount > max.raisedAmount ? d : max).raisedAmount}M raised`
            },
            {
              title: '🚨 Most Urgent',
              content: disasters.find(d => d.urgency === 'critical')?.name || 'No critical campaigns',
              stat: `${disasters.filter(d => d.urgency === 'critical').length} critical campaigns`
            },
            {
              title: '👥 Most Supported',
              content: disasters.reduce((max, d) => d.supporters > max.supporters ? d : max).name,
              stat: `${disasters.reduce((max, d) => d.supporters > max.supporters ? d : max).supporters.toLocaleString()} supporters`
            }
          ].map((insight, i) => (
            <motion.div
              key={i}
              variants={variants.item}
              className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden p-6 space-y-3"
              whileHover={{ y: -5 }}
            >
              <h4 className="text-lg font-bold text-white">{insight.title}</h4>
              <p className="text-sm text-gray-400">{insight.content}</p>
              <p className="text-xs text-accent-100 font-semibold">{insight.stat}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;