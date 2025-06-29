import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatBot from '../ai/ChatBot';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatBotMinimized, setChatBotMinimized] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleChatBot = () => setChatBotMinimized(!chatBotMinimized);

  // Don't show floating chatbot on the AI Chat page
  const showFloatingChatBot = location.pathname !== '/ai-chat';

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onMenuToggle={toggleSidebar} />
      
      <div className="flex">
        {user?.role === 'admin' && (
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        )}
        
        <main className={`flex-1 p-6 ${user?.role === 'admin' ? 'lg:ml-64' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Floating ChatBot - only show when not on AI Chat page */}
      {showFloatingChatBot && (
        <ChatBot
          isMinimized={chatBotMinimized}
          onToggleMinimize={toggleChatBot}
        />
      )}
    </div>
  );
};

export default Layout;
