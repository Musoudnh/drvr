import React from 'react';
import { Calculator, FileText, MessageCircle, Clock, Star, ArrowRight } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const ExpertSelection: React.FC = () => {
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
    // In a real app, this would navigate to a chat interface or booking system
    console.log(`Selected ${expertType} expert`);
    // For now, we'll just show an alert
    alert(`Connecting you with a ${expertType} expert...`);
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1E2A38] mb-4">Talk to an Expert</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get personalized advice from our certified financial and tax professionals. 
          Choose the type of expertise you need for your business.
        </p>
      </div>

      {/* How it works section */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="text-center">
            <h3 className="text-xl font-bold text-[#1E2A38] mb-4">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#3AB7BF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#3AB7BF] font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-[#1E2A38] mb-2">Choose Your Expert</h4>
                <p className="text-sm text-gray-600">Select the type of expertise you need for your specific situation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#4ADE80] font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-[#1E2A38] mb-2">Share Your Details</h4>
                <p className="text-sm text-gray-600">Provide context about your business and specific questions or challenges</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#F59E0B] font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-[#1E2A38] mb-2">Get Expert Advice</h4>
                <p className="text-sm text-gray-600">Receive personalized guidance and actionable recommendations</p>
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
              <h3 className="text-2xl font-bold text-[#1E2A38] mb-2">{expert.title}</h3>
              <p className="text-gray-600">{expert.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#4ADE80] rounded-full mr-2"></div>
                  <span className="text-[#4ADE80] font-medium">{expert.availability}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-[#F59E0B] mr-1" />
                  <span className="font-medium">{expert.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
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
              <h4 className="font-semibold text-[#1E2A38] mb-3">What you'll get:</h4>
              <ul className="space-y-2">
                {expert.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
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
                className="py-2 px-4 text-sm"
                onClick={() => handleExpertSelect(expert.type)}
              >
                Connect with {expert.title}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExpertSelection;