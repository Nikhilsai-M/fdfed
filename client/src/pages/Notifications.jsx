// src/pages/Notifications.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import { useNotifications } from "../context/NotificationContext";

const Notifications = () => {
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    fetchNotifications
  } = useNotifications();

  // Force refresh when component mounts
  useEffect(() => {
    console.log('🔄 Notifications page mounted, forcing refresh');
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    console.log('🖱️ User clicked mark as read for:', id);
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    console.log('🖱️ User clicked mark all as read');
    await markAllAsRead();
  };

  const handleDelete = async (id) => {
    console.log('🖱️ User clicked delete for:', id);
    await deleteNotification(id);
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear all notifications? This action cannot be undone.")) {
      try {
        console.log('🖱️ User confirmed clear all');
        await clearAllNotifications();
      } catch (error) {
        console.error('Error clearing all notifications:', error);
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: 'fa-circle-check',
          label: 'Approved'
        };
      case 'rejected':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: 'fa-circle-xmark',
          label: 'Rejected'
        };
      case 'pending':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          icon: 'fa-clock',
          label: 'Pending Review'
        };
      case 'fulfilled':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: 'fa-circle-check',
          label: 'Fulfilled'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: 'fa-bell',
          label: 'Update'
        };
    }
  };
const iconMap = {
  "phone": "fa-mobile-screen",
  "laptop": "fa-laptop",
  "charger": "fa-plug",
  "earphone": "fa-headphones",
  "mouse": "fa-computer-mouse",
  "smartwatch": "fa-clock"
};
const typeMap = {
  "phone": "Smartphone",
  "laptop": "Laptop",
  "charger": "Charger",
  "earphone": "Earphone",
  "mouse": "Mouse",
  "smartwatch": "Smartwatch"
};

  console.log('🎨 Rendering Notifications page with:', {
    notificationCount: notifications.length,
    unreadCount: notifications.filter(n => !n.read).length,
    loading
  });

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Beautiful Header Section */}
          <div className="mb-10">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left side - Title and Icon */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <i className="fa-solid fa-bell text-white text-3xl"></i>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Your Notifications
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Stay updated with your device listing status
                    </p>
                  </div>
                </div>

                {/* Right side - Stats and Mark All Button */}
                <div className="flex items-center gap-6">
                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
                      <div className="text-sm text-gray-500">Total</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {notifications.filter(n => !n.read).length}
                      </div>
                      <div className="text-sm text-gray-500">Unread</div>
                    </div>
                  </div>

                  {/* Mark All as Read Button */}
                  {notifications.length > 0 && notifications.some(n => !n.read) && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                      <i className="fa-solid fa-check-double"></i>
                      <span className="hidden sm:inline">Mark All as Read</span>
                      <span className="sm:hidden">Mark All</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : (
            /* Notifications List */
            <div className="space-y-6">
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => {
                      console.log("Notification object:", notification); // 🔍 debug
                    const statusStyle = getStatusStyle(notification.status);

                    return (
                      <div key={notification.id || notification._id} className="group">
                        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden ${
                          !notification.read 
                            ? 'border-blue-500 ring-4 ring-blue-100' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}>
                          {/* Unread Indicator Badge */}
                          {!notification.read && (
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <span className="text-white text-sm font-semibold">New Notification</span>
                              </div>
                            </div>
                          )}

                          <div className="p-6">
                            {/* Header with Device Info and Status */}
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <i className={`fa-solid ${iconMap[notification.device_type] || "fa-box"} text-white text-xl`} />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                      {notification.brand} {notification.model}
                                    </h3>
                                   <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    {notification.title}
                                    {notification.status === "fulfilled" && "🎉"}
                                  </h3>
                                </div>
                                  {!notification.read && (
                                    <span className="ml-2 w-3 h-3 bg-blue-600 rounded-full"></span>
                                  )}
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-4">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <i className={`fa-solid ${iconMap[notification.device_type] || "fa-box"} text-white text-xl`} />
                                    <span className="font-medium">
                                     {notification.type === "request_update"
                                          ? "Device Request"
                                          : typeMap[notification.device_type] || "Product"}
                                    </span>
                                  </div>
                                  
                                  {notification.storage && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <i className="fa-solid fa-database text-gray-400"></i>
                                      <span>{notification.storage}</span>
                                    </div>
                                  )}
                                  
                                  {notification.ram && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <i className="fa-solid fa-memory text-gray-400"></i>
                                      <span>{notification.ram}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Time and Status Badge */}
                              <div className="flex flex-col items-start md:items-end gap-3">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                                  <i className={`fa-solid ${statusStyle.icon}`}></i>
                                  <span className="font-semibold text-sm">{statusStyle.label}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-gray-500">
                                  <i className="fa-solid fa-clock text-sm"></i>
                                  <span className="text-sm font-medium">
                                    {notification.time || 'Just now'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Message */}
                            <div className="mb-4">
                              <p className="text-gray-700 leading-relaxed">{notification.message}</p>
                            </div>

                            {/* Price and Rejection Reason */}
                            <div className="mb-5">
                              {notification.price > 0 && notification.status === 'approved' ? (
                                <div className="inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-indian-rupee-sign text-white"></i>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Offered Price</p>
                                    <p className="text-2xl font-bold text-green-700">
                                      ₹{notification.price.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ) : notification.rejection_reason && notification.status === 'rejected' ? (
                                <div className="inline-flex items-start gap-3 px-4 py-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
                                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                    <i className="fa-solid fa-exclamation-circle text-white"></i>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-red-700 mb-1">Rejection Reason</p>
                                    <p className="text-gray-700">{notification.rejection_reason}</p>
                                  </div>
                                </div>
                              ) : null}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-5 border-t border-gray-100">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id || notification._id)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm hover:shadow"
                                >
                                  <i className="fa-solid fa-check"></i>
                                  Mark as Read
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleDelete(notification.id || notification._id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm hover:shadow"
                              >
                                <i className="fa-solid fa-trash"></i>
                                Delete
                              </button>
                              
                              <Link
                                to="/listings"
                                className="ml-auto inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                              >
                                View Details
                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-xl"></div>
                    </div>
                    <div className="relative">
                      <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-2xl mb-6">
                        <i className="fa-regular fa-bell text-white text-4xl"></i>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No notifications yet
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-8">
                    You haven't received any notifications. Submit a device to get started!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/sell-phone"
                      className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <i className="fa-solid fa-mobile-screen-button text-lg"></i>
                      Sell a Phone
                    </Link>
                    <Link
                      to="/sell-laptop"
                      className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <i className="fa-solid fa-laptop text-lg"></i>
                      Sell a Laptop
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
