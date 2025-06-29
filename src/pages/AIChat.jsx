import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Lightbulb } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { getAIResponse } from '../utils/aiResponses';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your KALAMS assistant. I can help you with questions about using the dashboard, marking attendance, managing families, and more. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = await getAIResponse(inputValue, user?.role);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question) => {
    setInputValue(question);
  };

  const quickQuestions = user?.role === 'admin' ? [
    "How to mark attendance?",
    "How to add a new family?",
    "How to view analytics?",
    "How to export data?",
    "How to manage students?",
    "How to track women's progress?"
  ] : [
    "How to mark attendance?",
    "How to add a new family?",
    "How to record test scores?",
    "How to manage students?",
    "How to track women's progress?",
    "What can I do as a tutor?"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="h-6 w-6 mr-3 text-kalams-blue" />
            AI Assistant
          </h1>
          <p className="text-gray-600">Get help with dashboard features and common tasks</p>
        </div>
        <Badge variant="kalam" className="flex items-center">
          <Bot className="h-4 w-4 mr-1" />
          {user?.role === 'admin' ? 'Admin Assistant' : 'Tutor Assistant'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Questions Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Quick Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full text-left justify-start text-sm h-auto p-3 whitespace-normal"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="bg-gradient-to-r from-kalams-orange to-kalams-blue text-white rounded-t-xl">
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                KALAMS Assistant
                <span className="ml-auto text-sm font-normal">Always here to help</span>
              </CardTitle>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-kalams-orange to-kalams-blue text-white'
                        : 'bg-gray-100 text-gray-900 neumorphic-card'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.type === 'ai' && (
                        <Bot className="h-5 w-5 mt-0.5 text-kalams-blue flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.type === 'user' && (
                        <User className="h-5 w-5 mt-0.5 text-white flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 neumorphic-card rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 text-kalams-blue" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about the dashboard..."
                  className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kalams-blue focus:border-transparent"
                  rows="1"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-kalams-orange to-kalams-blue text-white hover:shadow-lg px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
