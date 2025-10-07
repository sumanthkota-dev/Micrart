'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, LayoutDashboard, LogOut, Home, Image, Edit3 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  isDesktop?: boolean;
}

export default function AdminSidebar({ open, onClose, isDesktop = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const [loadingLogout, setLoadingLogout] = useState(false);

  const handleLogout = async () => {
    setLoadingLogout(true);
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  const links = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { label: 'Carvings', href: '/admin/artworks/new', icon: Image },
    { label: 'Blogs', href: '/admin/blogs/new', icon: Edit3 },
  ];

  const renderLinks = () =>
    links.map((link) => {
      const Icon = link.icon;
      const isActive = pathname === link.href;
      return (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition
            ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-indigo-50'}`}
          onClick={onClose}
        >
          <Icon className="w-5 h-5" />
          <span>{link.label}</span>
        </Link>
      );
    });

  if (isDesktop) {
    // Desktop Sidebar
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2 mb-4">
          <LayoutDashboard className="w-6 h-6 text-indigo-600" />
          <span className="font-semibold text-lg">Admin Panel</span>
        </div>
        <nav className="flex flex-col gap-2">
          {renderLinks()}
          <button
            onClick={handleLogout}
            disabled={loadingLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed mt-4"
          >
            {loadingLogout ? (
              <span className="animate-spin w-4 h-4 border-2 border-white rounded-full"></span>
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            Logout
          </button>
        </nav>
      </div>
    );
  }

  // Mobile Drawer Sidebar
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col p-6`}
      >
        <button
          className="self-end mb-4 p-1 rounded hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <LayoutDashboard className="w-6 h-6 text-indigo-600" />
          <span className="font-semibold text-lg">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-2">
          {renderLinks()}
          <button
            onClick={handleLogout}
            disabled={loadingLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed mt-4"
          >
            {loadingLogout ? (
              <span className="animate-spin w-4 h-4 border-2 border-white rounded-full"></span>
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
