import React, { useState } from 'react';
import { Gift, Users, Mail, Link, Copy, Check, DollarSign, Share2, Send, Star, TrendingUp, Award, X as CloseIcon } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const ReferralProgram: React.FC = () => {
  const [referralLink, setReferralLink] = useState('https://financeflow.com/ref/johndoe123');
  const [copied, setCopied] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailForm, setEmailForm] = useState({
    emails: ''
  });

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

      </div>

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