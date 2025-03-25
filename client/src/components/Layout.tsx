import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  const userData = user ? {
    name: user.username || 'User',
    role: user.role || 'Free Account',
    profileImage: user.profileImage,
    id: user.id
  } : {
    name: 'Guest',
    role: 'Not Logged In'
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#121217] text-gray-100">
      {/* Sidebar */}
      <Sidebar user={userData} />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 px-4 py-6 md:px-8">
        {children}
      </div>
    </div>
  );
};

export default Layout; 