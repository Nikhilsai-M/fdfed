import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from "../../assets/images/icons/logo1.png";

const SidebarLink = ({ to, iconClass, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors 
      ${isActive ? 'bg-blue-700 hover:bg-blue-600' : 'hover:bg-blue-700'}`}
  >
    <i className={iconClass}></i>
    <span>{label}</span>
  </Link>
);

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin-auth/admin-signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Logout failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        navigate('/sign-in');
      } else {
        alert('Failed to log out: ' + (data.message || 'Unknown server error'));
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert(`Error during logout: ${error.message}`);
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
      
      {/* Logo */}
      <div className="p-6 border-b border-blue-700">
        <Link to="/admin-dashboard" className="block">
          <img
            src={logo}
            alt="Smart Exchange Logo"
            className="w-36 md:w-48 object-contain"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">

          <SidebarLink
            to="/admin-dashboard"
            iconClass="fas fa-house"
            label="Dashboard"
            isActive={
              currentPath.startsWith('/admin-dashboard') ||
              currentPath === '/admin/home'
            }
          />

          <SidebarLink
            to="/admin/manage-supervisors"
            iconClass="fas fa-users"
            label="Manage supervisors"
            isActive={currentPath.startsWith('/admin/manage-supervisors')}
          />

          <SidebarLink
            to="/admin/analytics"
            iconClass="fas fa-chart-simple"
            label="Analytics"
            isActive={currentPath.startsWith('/admin/analytics')}
          />

          <SidebarLink
            to="/admin/product-analytics"
            iconClass="fas fa-chart-column"
            label="Product Analytics"
            isActive={currentPath.startsWith('/admin/product-analytics')}
          />

          <SidebarLink
            to="/admin/revenue"
            iconClass="fas fa-coins"
            label="Revenue Analytics"
            isActive={currentPath.startsWith('/admin/revenue')}
          />

          {/* ✅ NEW SELLER ACTIVITY MENU */}
          <SidebarLink
            to="/admin/seller-activity"
            iconClass="fas fa-store"
            label="Seller Activity"
            isActive={currentPath.startsWith('/admin/seller-activity')}
          />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full text-left"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>

        </div>
      </nav>
    </div>
  );
}