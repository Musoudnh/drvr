import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Paperclip,
  Bot,
  User as UserIcon,
  BarChart3,
  DollarSign,
  Target
} from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  insights?: FinancialInsight;
  attachments?: FileAttachment[];
}

interface FileAttachment {
  name: string;
  type: string;
  size: number;
  url: string;
}

interface FinancialInsight {
  summary: {
    revenue: string;
    expenses: string;
    netIncome: string;
    margin: string;
  };
  risks: {
    level: 'high' | 'medium' | 'low';
    description: string;
  }[];
  recommendations: string[];
  ratios: {
    name: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }[];
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Financial Analyst. I can help you analyze financial statements, forecast cash flow, identify trends, and provide actionable insights. Upload your financial documents or ask me any questions about your business performance.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: FileAttachment[] = Array.from(files).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Simulate AI analysis of uploaded files
      setTimeout(() => {
        const analysisMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: `I've analyzed your uploaded ${newFiles.length > 1 ? 'documents' : 'document'}. Here's what I found:`,
          timestamp: new Date(),
          insights: generateMockInsights(),
          attachments: newFiles
        };
        setMessages(prev => [...prev, analysisMessage]);
      }, 2000);
    }
  };

  const generateMockInsights = (): FinancialInsight => ({
    summary: {
      revenue: '$847,245',
      expenses: '$623,180',
      netIncome: '$224,065',
      margin: '26.4%'
    },
    risks: [
      { level: 'high', description: 'Cash flow projection shows potential shortage in Q2' },
      { level: 'medium', description: 'Marketing spend increased 23% without proportional revenue growth' },
      { level: 'low', description: 'Accounts receivable aging within normal parameters' }
    ],
    recommendations: [
      'Consider extending payment terms with key suppliers to improve cash flow',
      'Implement cost controls on marketing spend or reallocate budget to higher-ROI channels',
      'Explore invoice factoring for immediate cash flow improvement',
      'Review pricing strategy - current margins suggest room for 5-8% increase'
    ],
    ratios: [
      { name: 'Gross Margin', value: '62.1%', trend: 'up' },
      { name: 'Net Margin', value: '26.4%', trend: 'up' },
      { name: 'Current Ratio', value: '2.3', trend: 'stable' },
      { name: 'ROE', value: '18.7%', trend: 'up' }
    ]
  });

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    if (input.includes('expense') || input.includes('cost')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "Based on your current data, your top expense drivers are: 1) Salaries & Benefits (45.7% of total expenses), 2) Operating costs (25.0%), and 3) Technology & Software (15.8%). I recommend reviewing your technology stack for potential consolidation opportunities.",
        timestamp: new Date()
      };
    }
    
    if (input.includes('cash flow') || input.includes('forecast')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "Your 6-month cash flow forecast shows strong positive trends. Expected inflows: $2.4M, outflows: $1.8M, resulting in $600K net positive cash flow. However, watch for seasonal dips in Q2. I recommend maintaining a 3-month cash reserve of $450K.",
        timestamp: new Date()
      };
    }
    
    if (input.includes('payroll') || input.includes('marketing')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "Payroll costs have remained stable at $128K/month (18% of revenue), while marketing spend increased 23% to $45K/month. Marketing ROI is currently 3.2:1. Consider reallocating 15% of marketing budget to higher-performing channels.",
        timestamp: new Date()
      };
    }
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: "I understand you're looking for financial insights. Could you be more specific? I can help with expense analysis, cash flow forecasting, ratio calculations, trend analysis, or provide recommendations based on your financial data.",
      timestamp: new Date()
    };
  };

  const renderInsightCard = (insights: FinancialInsight) => (
    <div className="mt-4 space-y-4">
      {/* Financial Summary */}
      <div className="bg-[#3AB7BF]/10 rounded-lg p-4">
        <h4 className="font-semibold text-[#1E2A38] mb-3 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          Financial Summary
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="font-bold text-[#4ADE80]">{insights.summary.revenue}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Expenses</p>
            <p className="font-bold text-[#F87171]">{insights.summary.expenses}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Net Income</p>
            <p className="font-bold text-[#3AB7BF]">{insights.summary.netIncome}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Profit Margin</p>
            <p className="font-bold text-[#F59E0B]">{insights.summary.margin}</p>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-[#1E2A38] mb-3 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Risk Assessment
        </h4>
        <div className="space-y-2">
          {insights.risks.map((risk, index) => (
            <div key={index} className="flex items-start">
              <div className={`w-3 h-3 rounded-full mt-1 mr-3 ${
                risk.level === 'high' ? 'bg-[#F87171]' :
                risk.level === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#4ADE80]'
              }`} />
              <p className="text-sm text-gray-700">{risk.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Ratios */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-[#1E2A38] mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Key Financial Ratios
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {insights.ratios.map((ratio, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{ratio.name}</span>
              <div className="flex items-center">
                <span className="font-medium text-[#1E2A38] mr-2">{ratio.value}</span>
                <div className={`w-2 h-2 rounded-full ${
                  ratio.trend === 'up' ? 'bg-[#4ADE80]' :
                  ratio.trend === 'down' ? 'bg-[#F87171]' : 'bg-gray-400'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-[#4ADE80]/10 rounded-lg p-4">
        <h4 className="font-semibold text-[#1E2A38] mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Recommendations
        </h4>
        <ul className="space-y-2">
          {insights.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="w-4 h-4 text-[#4ADE80] mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">{rec}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Export Options */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] rounded-full flex items-center justify-center mr-3">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1E2A38]">AI Financial Analyst</h3>
              <p className="text-sm text-gray-600">Your Fractional CFO on-demand</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-[#1E2A38]' 
                      : 'bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80]'
                  }`}>
                    {message.type === 'user' ? (
                      <UserIcon className="w-3 h-3 text-white" />
                    ) : (
                      <Bot className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg p-2.5 ${
                    message.type === 'user'
                      ? 'bg-[#3AB7BF] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-xs leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                {/* Render insights if available */}
                {message.insights && (
                  <div className="mt-2 ml-10">
                    {renderInsightCard(message.insights)}
                  </div>
                )}

                {/* Render attachments if available */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 ml-10">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <h5 className="font-medium text-[#1E2A38] mb-2">Analyzed Documents:</h5>
                      {message.attachments.map((file, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <FileText className="w-4 h-4 mr-2" />
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-2.5">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File Upload Area */}
        {uploadedFiles.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center bg-white rounded-lg px-3 py-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700">{file.name}</span>
                  <button
                    onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-end gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".pdf,.xlsx,.xls,.csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Upload financial documents"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your financials..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent pr-12"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              variant="primary"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Upload financial docs or ask questions
          </p>
        </div>
    </div>
  );
};

export default AIChat;