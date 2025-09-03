import React, { useState } from 'react';
import { Gift, Users, Mail, Link, Copy, Check, DollarSign, Share2, Send, Star, TrendingUp, Award, X as CloseIcon, Crown, Target, Zap, Trophy, Calendar, CreditCard, Plus, Eye, CheckCircle } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface ReferralTier {
  name: string;
  minReferrals: number;
  reward: number;
  bonusReward: number;
  benefits: string[];
  color: string;
}

interface PartnerProgram {
  id: string;
  name: string;
  type: 'accounting_firm' | 'consultant' | 'association';
  status: 'active' | 'pending' | 'inactive';
  commissionRate: number;
  totalReferrals: number;
  totalEarnings: number;
  joinDate: Date;
}

const ReferralProgram: React.FC = () => {
  const [referralLink, setReferralLink] = useState('https://financeflow.com/ref/johndoe123');
  const [copied, setCopied] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentTier, setCurrentTier] = useState('Bronze');
  const [totalReferrals, setTotalReferrals] = useState(8);
  const [emailForm, setEmailForm] = useState({
    emails: ''
  });

  const referralTiers: ReferralTier[] = [
    {
      name: 'Bronze',
      minReferrals: 0,
      reward: 5,
      bonusReward: 0,
      benefits: ['$5 per referral', 'Basic support'],
      color: '#CD7F32'
    },
    {
      name: 'Silver',
      minReferrals: 5,
      reward: 7,
      bonusReward: 25,
      benefits: ['$7 per referral', '$25 tier bonus', 'Priority support'],
      color: '#C0C0C0'
    },
    {
      name: 'Gold',
      minReferrals: 15,
      reward: 10,
      bonusReward: 100,
      benefits: ['$10 per referral', '$100 tier bonus', 'Dedicated account manager'],
      color: '#FFD700'
    },
    {
      name: 'Platinum',
      minReferrals: 30,
      reward: 15,
      bonusReward: 250,
      benefits: ['$15 per referral', '$250 tier bonus', 'Co-marketing opportunities'],
      color: '#E5E4E2'
    }
  ];

  const partnerPrograms: PartnerProgram[] = [
    {
      id: '1',
      name: 'Smith & Associates CPA',
      type: 'accounting_firm',
      status: 'active',
      commissionRate: 15,
      totalReferrals: 23,
      totalEarnings: 3450,
      joinDate: new Date('2024-06-15')
    },
    {
      id: '2',
      name: 'Business Consultants Group',
      type: 'consultant',
      status: 'active',
      commissionRate: 12,
      totalReferrals: 18,
      totalEarnings: 2160,
      joinDate: new Date('2024-08-20')
    },
    {
      id: '3',
      name: 'Regional CPA Association',
      type: 'association',
      status: 'pending',
      commissionRate: 8,
      totalReferrals: 0,
      totalEarnings: 0,
      joinDate: new Date('2025-01-10')
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Jennifer Smith (CPA)', referrals: 45, earnings: 675, tier: 'Platinum' },
    { rank: 2, name: 'Michael Johnson', referrals: 38, earnings: 570, tier: 'Platinum' },
    { rank: 3, name: 'Sarah Davis', referrals: 32, earnings: 480, tier: 'Platinum' },
    { rank: 4, name: 'You (John Doe)', referrals: 8, earnings: 40, tier: 'Bronze' },
    { rank: 5, name: 'David Wilson', referrals: 7, earnings: 35, tier: 'Bronze' }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleEmailInvite = () => {
    console.log('Sending email invitations:', emailForm);
    alert('Invitations sent successfully!');
    setEmailForm({ emails: '' });
  };

  const getCurrentTierInfo = () => {
    return referralTiers.find(tier => tier.name === currentTier) || referralTiers[0];
  };

  const getNextTierInfo = () => {
    const currentIndex = referralTiers.findIndex(tier => tier.name === currentTier);
    return currentIndex < referralTiers.length - 1 ? referralTiers[currentIndex + 1] : null;
  };

  const getProgressToNextTier = () => {
    const nextTier = getNextTierInfo();
    if (!nextTier) return 100;
    return (totalReferrals / nextTier.minReferrals) * 100;
  };

  const referralStats = [
    { label: 'Total Referrals', value: '12', icon: Users, color: '#212B36' },
    { label: 'Successful Signups', value: '8', icon: Check, color: '#4ADE80' },
    { label: 'Credits Earned', value: '$40', icon: DollarSign, color: '#F59E0B' },
    { label: 'Pending Referrals', value: '4', icon: Gift, color: '#8B5CF6' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'white', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: '#212B36' }}>
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#212B36', fontSize: '40px', fontWeight: '600' }}>
            Referral Program
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#878b91', fontSize: '18px', lineHeight: '1.5' }}>
            Earn $5 for every business you refer that signs up for FinanceFlow. 
            Help others grow their business while growing your rewards.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {referralStats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              style={{ borderRadius: '24px' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: '#878b91', fontSize: '14px' }}>
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold" style={{ color: stat.color, fontSize: '35px', fontWeight: '600' }}>
                    {stat.value}
                  </p>
                </div>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Referral Card */}
        <div 
          className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-100"
          style={{ borderRadius: '24px' }}
        >
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: '#212B36' }}
            >
              <Star className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#212B36', fontSize: '25px', fontWeight: '600' }}>
              Share & Earn Rewards
            </h2>
            <p className="text-lg" style={{ color: '#878b91', fontSize: '16px' }}>
              For each business you refer that signs up, you'll receive $5 off your account. No limits!
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#f7f7f7' }}>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#4ADE80' }}
              >
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#212B36', fontSize: '18px', fontWeight: '500' }}>
                Instant Credits
              </h3>
              <p style={{ color: '#878b91', fontSize: '14px' }}>
                Credits are applied immediately when your referral signs up
              </p>
            </div>

            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#f7f7f7' }}>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#212B36' }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#212B36', fontSize: '18px', fontWeight: '500' }}>
                No Limits
              </h3>
              <p style={{ color: '#878b91', fontSize: '14px' }}>
                Refer as many businesses as you want - unlimited earning potential
              </p>
            </div>

            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#f7f7f7' }}>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#F59E0B' }}
              >
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#212B36', fontSize: '18px', fontWeight: '500' }}>
                Easy Tracking
              </h3>
              <p style={{ color: '#878b91', fontSize: '14px' }}>
                Monitor your referrals and earnings in real-time
              </p>
            </div>
          </div>

          {/* Referral Link Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#212B36', fontSize: '20px', fontWeight: '500' }}>
              Your Referral Link
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-700"
                style={{ 
                  backgroundColor: '#f7f7f7',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#212B36'
                }}
              />
              <button
                onClick={handleCopyLink}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center"
                style={{
                  backgroundColor: copied ? '#4ADE80' : '#212B36',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.currentTarget.style.backgroundColor = '#1a2028';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.currentTarget.style.backgroundColor = '#212B36';
                  }
                }}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              className="flex items-center justify-center px-6 py-3 border border-gray-200 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              style={{
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#212B36'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7f7f7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share on LinkedIn
            </button>
            <button
              className="flex items-center justify-center px-6 py-3 border border-gray-200 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              style={{
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#212B36'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7f7f7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Share via Email
            </button>
          </div>
        </div>

        {/* Tiered Rewards System */}
        <div 
          className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-100"
          style={{ borderRadius: '24px' }}
        >
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: getCurrentTierInfo().color + '20' }}
            >
              <Crown className="w-8 h-8" style={{ color: getCurrentTierInfo().color }} />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#212B36', fontSize: '25px', fontWeight: '600' }}>
              {currentTier} Tier Member
            </h2>
            <p className="text-lg" style={{ color: '#878b91', fontSize: '16px' }}>
              You're earning ${getCurrentTierInfo().reward} per successful referral
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {referralTiers.map((tier, index) => (
              <div 
                key={tier.name}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  tier.name === currentTier 
                    ? 'border-current shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ 
                  borderColor: tier.name === currentTier ? tier.color : undefined,
                  backgroundColor: tier.name === currentTier ? tier.color + '10' : 'white'
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: tier.color + '20' }}
                >
                  {index === 0 && <Award className="w-4 h-4" style={{ color: tier.color }} />}
                  {index === 1 && <Star className="w-4 h-4" style={{ color: tier.color }} />}
                  {index === 2 && <Crown className="w-4 h-4" style={{ color: tier.color }} />}
                  {index === 3 && <Trophy className="w-4 h-4" style={{ color: tier.color }} />}
                </div>
                <h3 className="font-semibold mb-1" style={{ color: tier.color, fontSize: '16px' }}>
                  {tier.name}
                </h3>
                <p className="text-sm mb-2" style={{ color: '#878b91' }}>
                  {tier.minReferrals}+ referrals
                </p>
                <p className="font-bold" style={{ color: '#212B36', fontSize: '18px' }}>
                  ${tier.reward}/referral
                </p>
                {tier.bonusReward > 0 && (
                  <p className="text-xs mt-1" style={{ color: tier.color }}>
                    +${tier.bonusReward} tier bonus
                  </p>
                )}
              </div>
            ))}
          </div>

          {getNextTierInfo() && (
            <div className="p-4 bg-gradient-to-r from-[#4ADE80]/10 to-[#3AB7BF]/10 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold" style={{ color: '#212B36' }}>
                  Progress to {getNextTierInfo()!.name} Tier
                </h4>
                <span className="text-sm" style={{ color: '#878b91' }}>
                  {totalReferrals} / {getNextTierInfo()!.minReferrals} referrals
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(getProgressToNextTier(), 100)}%`,
                    backgroundColor: getNextTierInfo()!.color
                  }}
                />
              </div>
              <p className="text-sm" style={{ color: '#878b91' }}>
                {getNextTierInfo()!.minReferrals - totalReferrals} more referrals to unlock ${getNextTierInfo()!.reward}/referral
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowTierModal(true)}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-gray-200"
              style={{
                backgroundColor: 'white',
                color: '#212B36',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View All Tiers
            </button>
            <button
              onClick={() => setShowLeaderboard(true)}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-gray-200"
              style={{
                backgroundColor: 'white',
                color: '#212B36',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </button>
          </div>
        </div>

        {/* Email Invitation Section */}
        <div 
          className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-100"
          style={{ borderRadius: '24px' }}
        >
          <h3 className="text-xl font-semibold mb-6" style={{ color: '#212B36', fontSize: '20px', fontWeight: '500' }}>
            Invite via Email
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: '#212B36', fontSize: '14px', fontWeight: '500' }}>
                Email Addresses
              </label>
              <textarea
                value={emailForm.emails}
                onChange={(e) => setEmailForm({ ...emailForm, emails: e.target.value })}
                placeholder="Enter email addresses separated by commas&#10;example@company1.com, contact@business2.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none"
                style={{ 
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#212B36',
                  backgroundColor: 'white'
                }}
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailPreview(true)}
                className="flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-gray-200"
                style={{
                  backgroundColor: 'white',
                  color: '#212B36',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f7f7f7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Preview Email
              </button>
              <button
                onClick={handleEmailInvite}
                disabled={!emailForm.emails.trim()}
                className="flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#212B36',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#1a2028';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#212B36';
                  }
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Invitations
              </button>
            </div>
          </div>
        </div>

        {/* Recent Referrals */}
        <div 
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
          style={{ borderRadius: '24px' }}
        >
          <h3 className="text-xl font-semibold mb-6" style={{ color: '#212B36', fontSize: '20px', fontWeight: '500' }}>
            Recent Referrals
          </h3>
          
          <div className="space-y-4">
            {[
              { 
                business: 'TechStart Solutions', 
                email: 'contact@techstart.com', 
                status: 'signed_up', 
                date: '2 days ago',
                credit: '$5.00'
              },
              { 
                business: 'Global Manufacturing Co.', 
                email: 'finance@globalmanuf.com', 
                status: 'pending', 
                date: '1 week ago',
                credit: 'Pending'
              },
              { 
                business: 'Digital Marketing Agency', 
                email: 'admin@digitalmarketing.com', 
                status: 'signed_up', 
                date: '2 weeks ago',
                credit: '$5.00'
              },
              { 
                business: 'Healthcare Solutions Inc.', 
                email: 'cfo@healthcaresol.com', 
                status: 'invited', 
                date: '3 weeks ago',
                credit: 'Pending'
              }
            ].map((referral, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200"
                style={{ backgroundColor: '#f7f7f7', borderRadius: '12px' }}
              >
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: '#212B36' }}
                  >
                    <span className="text-white font-medium text-sm">
                      {referral.business.split(' ').map(word => word[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium mb-1" style={{ color: '#212B36', fontSize: '14px', fontWeight: '500' }}>
                      {referral.business}
                    </p>
                    <p style={{ color: '#878b91', fontSize: '12px' }}>
                      {referral.email} • {referral.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium" style={{ color: '#212B36', fontSize: '14px', fontWeight: '500' }}>
                    {referral.credit}
                  </span>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: referral.status === 'signed_up' ? '#4ADE8015' : 
                                     referral.status === 'pending' ? '#F59E0B15' : '#878b9115',
                      color: referral.status === 'signed_up' ? '#4ADE80' : 
                             referral.status === 'pending' ? '#F59E0B' : '#878b91',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {referral.status === 'signed_up' ? 'Signed Up' : 
                     referral.status === 'pending' ? 'Pending' : 'Invited'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Program Section */}
        <div 
          className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-100"
          style={{ borderRadius: '24px' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold" style={{ color: '#212B36', fontSize: '20px', fontWeight: '500' }}>
                Partner Program
              </h3>
              <p style={{ color: '#878b91', fontSize: '14px' }}>
                Join our partner network for enhanced earning opportunities
              </p>
            </div>
            <button
              onClick={() => setShowPartnerModal(true)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
              style={{
                backgroundColor: '#212B36',
                color: 'white',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Apply to Partner Program
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f7f7f7' }}>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: '#4ADE80' }}
              >
                <Users className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#212B36' }}>Accounting Firms</h4>
              <p className="text-sm mb-2" style={{ color: '#878b91' }}>15% commission on referrals</p>
              <p className="text-xs" style={{ color: '#878b91' }}>White-label solutions available</p>
            </div>
            
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f7f7f7' }}>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: '#3AB7BF' }}
              >
                <Target className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#212B36' }}>Consultants</h4>
              <p className="text-sm mb-2" style={{ color: '#878b91' }}>12% commission on referrals</p>
              <p className="text-xs" style={{ color: '#878b91' }}>Co-marketing opportunities</p>
            </div>
            
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f7f7f7' }}>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: '#F59E0B' }}
              >
                <Award className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#212B36' }}>Associations</h4>
              <p className="text-sm mb-2" style={{ color: '#878b91' }}>8% commission on referrals</p>
              <p className="text-xs" style={{ color: '#878b91' }}>Member exclusive benefits</p>
            </div>
          </div>
        </div>

        {/* Gamification Elements */}
        <div 
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
          style={{ borderRadius: '24px' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold" style={{ color: '#212B36', fontSize: '20px', fontWeight: '500' }}>
              Achievements & Badges
            </h3>
            <button
              onClick={() => setShowLeaderboard(true)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-gray-200"
              style={{
                backgroundColor: 'white',
                color: '#212B36',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Trophy className="w-4 h-4 mr-2" />
              View Leaderboard
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: 'First Referral', description: 'Made your first successful referral', earned: true, icon: Star },
              { name: 'Team Builder', description: 'Referred 5 businesses', earned: true, icon: Users },
              { name: 'Growth Champion', description: 'Referred 10 businesses', earned: false, icon: TrendingUp },
              { name: 'Network Master', description: 'Referred 25 businesses', earned: false, icon: Crown }
            ].map((badge, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg text-center transition-all ${
                  badge.earned ? 'border-2 border-[#4ADE80] bg-[#4ADE80]/5' : 'border border-gray-200 bg-gray-50'
                }`}
                style={{ borderRadius: '12px' }}
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    badge.earned ? 'bg-[#4ADE80]' : 'bg-gray-300'
                  }`}
                >
                  <badge.icon className={`w-6 h-6 ${badge.earned ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <h4 className={`font-semibold mb-1 ${badge.earned ? 'text-[#212B36]' : 'text-gray-500'}`}>
                  {badge.name}
                </h4>
                <p className={`text-xs ${badge.earned ? 'text-[#878b91]' : 'text-gray-400'}`}>
                  {badge.description}
                </p>
                {badge.earned && (
                  <div className="mt-2">
                    <CheckCircle className="w-4 h-4 text-[#4ADE80] mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Tier Details Modal */}
      {showTierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: '#212B36' }}>
                Referral Tier Benefits
              </h3>
              <button
                onClick={() => setShowTierModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <CloseIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {referralTiers.map((tier, index) => (
                <div 
                  key={tier.name}
                  className={`p-6 rounded-lg border-2 ${
                    tier.name === currentTier ? 'border-current shadow-md' : 'border-gray-200'
                  }`}
                  style={{ 
                    borderColor: tier.name === currentTier ? tier.color : undefined,
                    backgroundColor: tier.name === currentTier ? tier.color + '10' : 'white'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                        style={{ backgroundColor: tier.color + '20' }}
                      >
                        {index === 0 && <Award className="w-6 h-6" style={{ color: tier.color }} />}
                        {index === 1 && <Star className="w-6 h-6" style={{ color: tier.color }} />}
                        {index === 2 && <Crown className="w-6 h-6" style={{ color: tier.color }} />}
                        {index === 3 && <Trophy className="w-6 h-6" style={{ color: tier.color }} />}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold" style={{ color: tier.color }}>
                          {tier.name} Tier
                        </h4>
                        <p style={{ color: '#878b91', fontSize: '14px' }}>
                          {tier.minReferrals}+ successful referrals
                        </p>
                      </div>
                    </div>
                    {tier.name === currentTier && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#4ADE80] text-white">
                        Current Tier
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-[#4ADE80] mr-3" />
                        <span className="text-sm" style={{ color: '#212B36' }}>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: '#212B36' }}>
                Referral Leaderboard
              </h3>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <CloseIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div 
                  key={entry.rank}
                  className={`p-4 rounded-lg border transition-all ${
                    entry.name.includes('You') ? 'border-[#4ADE80] bg-[#4ADE80]/5' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                          entry.rank <= 3 ? 'bg-[#F59E0B]' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`font-bold text-sm ${entry.rank <= 3 ? 'text-white' : 'text-gray-600'}`}>
                          #{entry.rank}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: '#212B36' }}>{entry.name}</p>
                        <p className="text-sm" style={{ color: '#878b91' }}>
                          {entry.referrals} referrals • ${entry.earnings} earned
                        </p>
                      </div>
                    </div>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: referralTiers.find(t => t.name === entry.tier)?.color + '20',
                        color: referralTiers.find(t => t.name === entry.tier)?.color
                      }}
                    >
                      {entry.tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Partner Program Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: '#212B36' }}>
                Partner Program
              </h3>
              <button
                onClick={() => setShowPartnerModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <CloseIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#212B36' }}
                >
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2" style={{ color: '#212B36' }}>
                  Join Our Partner Network
                </h4>
                <p style={{ color: '#878b91', fontSize: '16px' }}>
                  Unlock higher commissions and exclusive benefits
                </p>
              </div>
              
              <div className="space-y-4">
                {partnerPrograms.map(partner => (
                  <div key={partner.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold" style={{ color: '#212B36' }}>{partner.name}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        partner.status === 'active' ? 'bg-[#4ADE80]/20 text-[#4ADE80]' :
                        partner.status === 'pending' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {partner.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p style={{ color: '#878b91' }}>Commission Rate</p>
                        <p className="font-semibold" style={{ color: '#212B36' }}>{partner.commissionRate}%</p>
                      </div>
                      <div>
                        <p style={{ color: '#878b91' }}>Total Referrals</p>
                        <p className="font-semibold" style={{ color: '#212B36' }}>{partner.totalReferrals}</p>
                      </div>
                      <div>
                        <p style={{ color: '#878b91' }}>Total Earnings</p>
                        <p className="font-semibold" style={{ color: '#212B36' }}>${partner.totalEarnings}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold" style={{ color: '#212B36', fontSize: '20px', fontWeight: '600' }}>
                Email Preview
              </h3>
              <button
                onClick={() => setShowEmailPreview(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <CloseIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {/* Email Content */}
            <div className="border border-gray-200 rounded-lg p-6" style={{ backgroundColor: '#f7f7f7' }}>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#212B36', fontSize: '25px', fontWeight: '600' }}>
                  @name has invited you to give Visio a try
                </h2>
                
                <div className="space-y-4" style={{ fontSize: '16px', lineHeight: '1.6', color: '#212B36' }}>
                  <p>
                    Nisio is the modern financial portal that lets you offer clients a unified place for budgeting, analysis, messaging, help centers, custom app access, and more.
                  </p>
                  
                  <p>
                    You can try it out for free by accepting your invite below.
                  </p>
                  
                  <div className="my-6 text-center">
                    <button
                      className="px-8 py-3 rounded-lg font-medium text-white"
                      style={{
                        backgroundColor: '#212B36',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '500'
                      }}
                    >
                      Accept Invitation
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p style={{ color: '#878b91', fontSize: '14px' }}>
                      Musoud,<br/>
                      Visio Cofounder
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEmailPreview(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralProgram;