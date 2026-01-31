// src/pages/Notifications/Notifications.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/customer/notifications', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      } else {
        setError(response.data.message || "Failed to load notifications");
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      if (error.response?.status === 401) {
        setError("Please login to view notifications");
      } else if (error.response?.status === 404) {
        const savedNotifications = localStorage.getItem('user_notifications');
        setNotifications(savedNotifications ? JSON.parse(savedNotifications) : []);
      } else {
        setError(error.response?.data?.message || "Error loading notifications");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark as read
  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/customer/notifications/${id}/read`, {}, {
        withCredentials: true
      });
      
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.put('/api/customer/notifications/read-all', {}, {
        withCredentials: true
      });
      
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/customer/notifications/${id}`, {
        withCredentials: true
      });
      
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Beautiful Header Section - IMPROVED LAYOUT */}
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

                  {/* Mark All as Read Button - Better Position */}
                  {notifications.length > 0 && notifications.some(n => !n.read) && (
                    <button
                      onClick={markAllAsRead}
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

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                <div>
                  <strong className="font-semibold">Error:</strong>
                  <span className="ml-2">{error}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {loading ? (
              <div className="text-center py-16">
                <div className="relative">
                  <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fa-solid fa-bell text-blue-500 text-xl"></i>
                  </div>
                </div>
                <p className="mt-4 text-gray-500 font-medium">Loading your notifications...</p>
                <p className="text-sm text-gray-400 mt-1">Getting the latest updates</p>
              </div>
            ) : notifications.length > 0 ? (
              <div>
                {notifications.map((notification, index) => {
                  // Get status styling
                  let statusStyle;
                  switch (notification.status) {
                    case 'approved': 
                      statusStyle = { 
                        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
                        border: 'border-green-200',
                        text: 'text-green-700',
                        icon: 'fa-check-circle',
                        label: 'Approved',
                        iconColor: 'text-green-500'
                      };
                      break;
                    case 'rejected': 
                      statusStyle = { 
                        bg: 'bg-gradient-to-br from-red-50 to-rose-50',
                        border: 'border-red-200',
                        text: 'text-red-700',
                        icon: 'fa-times-circle',
                        label: 'Rejected',
                        iconColor: 'text-red-500'
                      };
                      break;
                    case 'pending': 
                      statusStyle = { 
                        bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
                        border: 'border-yellow-200',
                        text: 'text-yellow-700',
                        icon: 'fa-clock',
                        label: 'Pending',
                        iconColor: 'text-yellow-500'
                      };
                      break;
                    case 'processing': 
                      statusStyle = { 
                        bg: 'bg-gradient-to-br from-blue-50 to-sky-50',
                        border: 'border-blue-200',
                        text: 'text-blue-700',
                        icon: 'fa-gear',
                        label: 'Processing',
                        iconColor: 'text-blue-500'
                      };
                      break;
                    default: 
                      statusStyle = { 
                        bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
                        border: 'border-gray-200',
                        text: 'text-gray-700',
                        icon: 'fa-bell',
                        label: 'Unknown',
                        iconColor: 'text-gray-500'
                      };
                  }
                  
                  return (
                    <div
                      key={notification.id}
                      className={`group relative p-6 transition-all duration-300 hover:shadow-md ${
                        index < notifications.length - 1 ? 'border-b border-gray-100' : ''
                      } ${!notification.read ? 'bg-gradient-to-r from-blue-50/50 to-indigo-50/50' : ''}`}
                    >
                      {/* Glow effect for unread */}
                      {!notification.read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full"></div>
                      )}
                      
                      <div className="flex items-start gap-5">
                        {/* Status Icon with gradient */}
                        <div className={`relative flex-shrink-0`}>
                          <div className={`absolute inset-0 ${statusStyle.bg} rounded-2xl blur-sm`}></div>
                          <div className={`relative w-14 h-14 rounded-xl ${statusStyle.bg} border ${statusStyle.border} flex items-center justify-center shadow-sm`}>
                            <i className={`fa-solid ${statusStyle.icon} ${statusStyle.iconColor} text-xl`}></i>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800">
                                  {notification.brand} {notification.model}
                                </h3>
                                {!notification.read && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full">
                                    <i className="fa-solid fa-circle text-[8px]"></i>
                                    NEW
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <i className={`fa-solid ${notification.device_type === 'phone' ? 'fa-mobile-screen' : 'fa-laptop'} text-gray-400`}></i>
                                  <span className="font-medium">
                                    {notification.device_type === 'phone' ? 'Smartphone' : 'Laptop'}
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
                                onClick={() => markAsRead(notification.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm hover:shadow"
                              >
                                <i className="fa-solid fa-check"></i>
                                Mark as Read
                              </button>
                            )}
                            
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm hover:shadow"
                            >
                              <i className="fa-sol id fa-trash"></i>
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
        </div>
      </div>
    </>
  );
  const clearAllNotifications = async () => {
    if (window.confirm("Are you sure you want to clear all notifications? This action cannot be undone.")) {
        try {
            await axios.delete('/api/customer/notifications/clear-all', {
                withCredentials: true
            });
            
            setNotifications([]);
        } catch (error) {
            console.error('Error clearing all notifications:', error);
            setError("Failed to clear notifications");
        }
    }
};
};

export default Notifications;