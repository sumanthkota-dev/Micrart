'use client';

import { ReactNode, useState } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import Navbar from './Navbar';
import Footer from './Footer';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Sidebar Drawer for Mobile */}
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Desktop Sidebar as Small Card */}
        <div className="hidden md:flex md:flex-col fixed top-[64px] left-6 bg-white border border-gray-200 shadow-xl rounded-xl p-4 w-60 h-auto z-10">
          <AdminSidebar open={true} onClose={() => {}} isDesktop />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 ml-0 md:ml-[260px]">
          {/* Hamburger for Mobile */}
          <button
            className="md:hidden mb-4 p-2 rounded bg-gray-100 hover:bg-gray-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
