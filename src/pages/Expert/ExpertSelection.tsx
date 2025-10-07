import React, { useState } from 'react';
import { Calculator, FileText, MessageCircle, Clock, Star, ArrowRight, User, Shield, Award, Calendar, Phone, Video, Mail, CheckCircle, Users, Brain, Target, X } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface Expert {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  experience: string;
  certifications: string[];
  rating: number;
  reviewCount: number;
  responseTime: string;
  availability: 'available' | 'busy' | 'offline';
  hourlyRate: number;
  languages: string[];
  timezone: string;
  avatar?: string;
}

interface ExpertSession {
  id: string;
  expertId: string;
  expertName: string;
  date: Date;
  duration: number;
  topic: string;
  notes: string;
  recommendations: string[];
  followUpRequired: boolean;
  rating?: number;
  documents: string[];
}

const ExpertSelection: React.FC = () => {
  const [selectedExpertType, setSelectedExpertType] = useState<'tax' | 'finance' | null>(null);
  const [showExpertProfiles, setShowExpertProfiles] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    duration: '60',
    topic: '',
    urgency: 'normal',
    preferredMethod: 'video'
  });

  const [taxExperts] = useState<Expert[]>([
    {
      id: 'tax1',
      name: 'Jennifer Martinez, CPA',
      title: 'Senior Tax Strategist',
      specializations: ['Corporate Tax Planning', 'R&D Credits', 'International Tax', 'M&A Tax'],
      experience: '15+ years',
      certifications: ['CPA', 'MST', 'Enrolled Agent'],
      rating: 4.9,
      reviewCount: 127,
      responseTime: '< 2 hours',
      availability: 'available',
      hourlyRate: 350,
      languages: ['English', 'Spanish'],
      timezone: 'PST'
    },
    {
      id: 'tax2',
      name: 'Robert Chen, EA',
      title: 'Tax Compliance Expert',
      specializations: ['Tax Compliance', 'Audit Defense', 'State & Local Tax', 'Payroll Tax'],
      experience: '12+ years',
      certifications: ['Enrolled Agent', 'CPA'],
      rating: 4.8,
      reviewCount: 89,
      responseTime: '< 4 hours',
      availability: 'busy',
      hourlyRate: 275,
      languages: ['English', 'Mandarin'],
      timezone: 'EST'
    }
  ]);

  const [financeExperts] = useState<Expert[]>([
    {
      id: 'fin1',
      name: 'Sarah Thompson, CFA',
      title: 'Financial Planning Director',
      specializations: ['Financial Modeling', 'Valuation', 'Investment Analysis', 'Strategic Planning'],
      experience: '18+ years',
      certifications: ['CFA', 'FRM', 'MBA Finance'],
      rating: 4.9,
      reviewCount: 156,
      responseTime: '< 1 hour',
      availability: 'available',
      hourlyRate: 425,
      languages: ['English'],
      timezone: 'EST'
    },
    {
      id: 'fin2',
      name: 'Michael Rodriguez, CFP',
      title: 'Business Finance Consultant',
      specializations: ['Cash Flow Management', 'Budgeting', 'Financial Controls', 'Growth Planning'],
      experience: '14+ years',
      certifications: ['CFP', 'CPA', 'CMA'],
      rating: 4.7,
      reviewCount: 98,
      responseTime: '< 3 hours',
      availability: 'available',
      hourlyRate: 325,
      languages: ['English', 'Spanish'],
      timezone: 'CST'
    }
  ]);

  const [sessionHistory] = useState<ExpertSession[]>([
    {
      id: 's1',
      expertId: 'fin1',
      expertName: 'Sarah Thompson, CFA',
      date: new Date(Date.now() - 604800000), // 1 week ago
      duration: 60,
      topic: 'Q1 Financial Planning Strategy',
      notes: 'Discussed revenue forecasting methodology and cash flow optimization strategies',
      recommendations: [
        'Implement rolling 13-week cash flow forecast',
        'Review pricing strategy for premium products',
        'Consider invoice factoring for improved liquidity'
      ],
      followUpRequired: true,
      rating: 5,
      documents: ['Q1_Financial_Model.xlsx', 'Cash_Flow_Analysis.pdf']
    },
    {
      id: 's2',
      expertId: 'tax1',
      expertName: 'Jennifer Martinez, CPA',
      date: new Date(Date.now() - 1209600000), // 2 weeks ago
      duration: 45,
      topic: 'R&D Tax Credit Optimization',
      notes: 'Reviewed R&D activities and identified additional credit opportunities',
      recommendations: [
        'Document software development activities for credits',
        'Implement time tracking for R&D personnel',
        'File amended returns for previous years'
      ],
      followUpRequired: false,
      rating: 5,
      documents: ['RD_Credit_Analysis.pdf']
    }
  ]);

  const experts = [
    {
      type: 'tax',
      title: 'Tax Expert',
      description: 'Get help with tax planning, compliance, and optimization strategies',
      icon: Calculator,
      features: [
        'Tax planning and strategy',
        'Compliance guidance',
        'Deduction optimization',
        'Quarterly tax estimates',
        'Year-end tax preparation'
      ],
      availability: 'Available now',
      rating: 4.9,
      responseTime: '< 2 hours'
    },
    {
      type: 'financial',
      title: 'Financial Expert',
      description: 'Expert guidance on financial planning, analysis, and business strategy',
      icon: FileText,
      features: [
        'Financial analysis and reporting',
        'Cash flow management',
        'Budget planning and forecasting',
        'Investment strategy',
        'Business growth planning'
      ],
      availability: 'Available now',
      rating: 4.8,
      responseTime: '< 1 hour'
    }
  ];

  const handleExpertSelect = (expertType: string) => {
    setSelectedExpertType(expertType as 'tax' | 'finance');
    setShowExpertProfiles(true);
  };

  const handleBookExpert = (expert: Expert) => {
    setSelectedExpert(expert);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = () => {
    if (bookingForm.date && bookingForm.time && bookingForm.topic.trim()) {
      console.log('Booking submitted:', { expert: selectedExpert, booking: bookingForm });
      alert(`Session booked with ${selectedExpert?.name} for ${bookingForm.date} at ${bookingForm.time}`);
      setBookingForm({ date: '', time: '', duration: '60', topic: '', urgency: 'normal', preferredMethod: 'video' });
      setShowBookingModal(false);
      setSelectedExpert(null);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-[#4ADE80] text-white';
      case 'busy': return 'bg-[#F59E0B] text-white';
      case 'offline': return 'bg-gray-400 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#101010] mb-4">Talk to an Expert</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get personalized advice from our certified financial and tax professionals. 
          Choose the type of expertise you need for your business.
        </p>
      </div>

      {/* How it works section */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="text-center">
            <h3 className="text-xl font-bold text-[#101010] mb-4">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#3AB7BF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#3AB7BF] font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-[#101010] mb-2">Choose Your Expert</h4>
                <p className="text-xs text-gray-600">Select the type of expertise you need for your specific situation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#4ADE80] font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-[#101010] mb-2">Share Your Details</h4>
                <p className="text-xs text-gray-600">Provide context about your business and specific questions or challenges</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#F59E0B] font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-[#101010] mb-2">Get Expert Advice</h4>
                <p className="text-xs text-gray-600">Receive personalized guidance and actionable recommendations</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {experts.map((expert) => (
          <Card key={expert.type} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-[#3AB7BF]/30">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] rounded-full flex items-center justify-center mx-auto mb-4">
                <expert.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#101010] mb-2">{expert.title}</h3>
              <p className="text-gray-600">{expert.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#4ADE80] rounded-full mr-2"></div>
                  <span className="text-[#4ADE80] font-medium">{expert.availability}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-[#F59E0B] mr-1" />
                  <span className="font-medium">{expert.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Response time: {expert.responseTime}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Live chat available</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-[#101010] mb-3">What you'll get:</h4>
              <ul className="space-y-2">
                {expert.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-xs text-gray-700">
                    <div className="w-1.5 h-1.5 bg-[#3AB7BF] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center">
              <Button
                variant="primary"
                size="sm"
                className="py-2 px-4 text-xs"
                onClick={() => handleExpertSelect(expert.type)}
              >
                Connect with {expert.title}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Expert Profiles Modal */}
      {showExpertProfiles && selectedExpertType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[900px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">
                {selectedExpertType === 'tax' ? 'Tax' : 'Finance'} Experts
              </h3>
              <button
                onClick={() => setShowExpertProfiles(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {(selectedExpertType === 'tax' ? taxExperts : financeExperts).map(expert => (
                <div key={expert.id} className="p-6 border border-gray-200 rounded-lg hover:border-[#3AB7BF] transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] rounded-full flex items-center justify-center mr-4">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-[#101010]">{expert.name}</h4>
                        <p className="text-gray-600 mb-2">{expert.title}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-[#F59E0B] mr-1" />
                            <span className="font-medium">{expert.rating}</span>
                            <span className="text-gray-500 ml-1">({expert.reviewCount} reviews)</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-1" />
                            <span>{expert.responseTime}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(expert.availability)}`}>
                            {expert.availability}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#3AB7BF]">${expert.hourlyRate}/hr</p>
                      <p className="text-xs text-gray-600">{expert.timezone}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-[#101010] mb-2">Specializations</h5>
                      <div className="flex flex-wrap gap-1">
                        {expert.specializations.map((spec, index) => (
                          <span key={index} className="px-2 py-1 bg-[#3AB7BF]/10 text-[#3AB7BF] rounded text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-[#101010] mb-2">Certifications</h5>
                      <div className="flex flex-wrap gap-1">
                        {expert.certifications.map((cert, index) => (
                          <span key={index} className="px-2 py-1 bg-[#4ADE80]/10 text-[#4ADE80] rounded text-xs">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{expert.experience} experience</span>
                      <span>Languages: {expert.languages.join(', ')}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleBookExpert(expert)}
                        disabled={expert.availability === 'offline'}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Session
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline"
                onClick={() => setShowSessionHistory(true)}
              >
                <Clock className="w-4 h-4 mr-2" />
                Session History
              </Button>
              <button
                onClick={() => setShowExpertProfiles(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Book Session with {selectedExpert.name}</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Time</label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    value={bookingForm.duration}
                    onChange={(e) => setBookingForm({...bookingForm, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Method</label>
                  <select
                    value={bookingForm.preferredMethod}
                    onChange={(e) => setBookingForm({...bookingForm, preferredMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                    <option value="chat">Live Chat</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Topic/Question</label>
                <textarea
                  value={bookingForm.topic}
                  onChange={(e) => setBookingForm({...bookingForm, topic: e.target.value})}
                  placeholder="Describe what you'd like to discuss..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Urgency</label>
                <select
                  value={bookingForm.urgency}
                  onChange={(e) => setBookingForm({...bookingForm, urgency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent (within 24 hours)</option>
                  <option value="emergency">Emergency (ASAP)</option>
                </select>
              </div>
              
              <div className="p-4 bg-[#3AB7BF]/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#101010]">Estimated Cost:</span>
                  <span className="text-lg font-bold text-[#3AB7BF]">
                    ${(selectedExpert.hourlyRate * parseInt(bookingForm.duration) / 60).toFixed(0)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {bookingForm.duration} minutes at ${selectedExpert.hourlyRate}/hour
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingSubmit}
                disabled={!bookingForm.date || !bookingForm.time || !bookingForm.topic.trim()}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Book Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session History Modal */}
      {showSessionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Expert Session History</h3>
              <button
                onClick={() => setShowSessionHistory(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {sessionHistory.map(session => (
                <div key={session.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[#101010]">{session.topic}</h4>
                      <p className="text-xs text-gray-600">with {session.expertName}</p>
                      <p className="text-xs text-gray-500">
                        {session.date.toLocaleDateString()} • {session.duration} minutes
                      </p>
                    </div>
                    <div className="flex items-center">
                      {session.rating && (
                        <div className="flex items-center mr-3">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < session.rating! ? 'text-[#F59E0B] fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      )}
                      {session.followUpRequired && (
                        <span className="px-2 py-1 bg-[#F59E0B]/20 text-[#F59E0B] rounded-full text-xs">
                          Follow-up needed
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-[#101010] mb-1">Session Notes:</h5>
                      <p className="text-xs text-gray-700">{session.notes}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-[#101010] mb-2">Recommendations:</h5>
                      <ul className="space-y-1">
                        {session.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start text-xs text-gray-700">
                            <CheckCircle className="w-3 h-3 text-[#4ADE80] mr-2 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {session.documents.length > 0 && (
                      <div>
                        <h5 className="font-medium text-[#101010] mb-2">Shared Documents:</h5>
                        <div className="flex flex-wrap gap-2">
                          {session.documents.map((doc, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSessionHistory(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Expert Matching */}
      <Card title="AI-Powered Expert Matching">
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-[#8B5CF6]/10 to-[#3AB7BF]/10 rounded-lg">
            <div className="flex items-center mb-3">
              <Brain className="w-5 h-5 text-[#8B5CF6] mr-2" />
              <h4 className="font-semibold text-[#101010]">Smart Expert Recommendations</h4>
            </div>
            <p className="text-xs text-gray-700 mb-3">
              Based on your business profile, recent questions, and industry, we recommend:
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                <div>
                  <p className="font-medium text-[#101010]">Jennifer Martinez, CPA</p>
                  <p className="text-xs text-gray-600">Best match for your R&D tax credit questions</p>
                </div>
                <span className="text-xs font-bold text-[#8B5CF6]">94% match</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                <div>
                  <p className="font-medium text-[#101010]">Sarah Thompson, CFA</p>
                  <p className="text-xs text-gray-600">Ideal for financial modeling and forecasting</p>
                </div>
                <span className="text-xs font-bold text-[#8B5CF6]">91% match</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Secure Document Exchange */}
      <Card title="Secure Document Exchange">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#101010]">Encrypted Document Portal</h3>
              <p className="text-xs text-gray-600">Share sensitive financial documents securely with experts</p>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-[#4ADE80] mr-2" />
              <span className="text-xs text-[#4ADE80] font-medium">256-bit encryption</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-[#101010] mb-2">Recent Uploads</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-700">Financial_Statements_Q4.pdf</span>
                  <span className="text-gray-500">2 days ago</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-700">Tax_Documents_2024.zip</span>
                  <span className="text-gray-500">1 week ago</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-[#101010] mb-2">Access Permissions</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Jennifer Martinez</span>
                  <span className="text-[#4ADE80]">Full access</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Sarah Thompson</span>
                  <span className="text-[#3AB7BF]">View only</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Manage Access
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExpertSelection;