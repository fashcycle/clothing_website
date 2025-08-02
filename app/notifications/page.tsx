"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Bell,
  ShoppingCart,
  Package,
  Check,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";

const getNotifications = async () => {
  return {
    notifications: [
      {
        id: "3f5dc01d-5878-4e19-85eb-ea772f5ee753",
        title: "Product added to cart (rent)",
        body: 'Shubham test added your product "Test123" to their cart to rent.',
        type: "CART_RENT_ALERT",
        read: false,
        createdAt: "2025-07-15T18:58:27.877Z",
        userId: "406c2d30-d540-47a6-937f-ba4f7f6300bd",
      },
      {
        id: "4f5dc01d-5878-4e19-85eb-ea772f5ee754",
        title: "Product purchased",
        body: 'Your product "Gaming Laptop" has been purchased by John Doe.',
        type: "PURCHASE_ALERT",
        read: true,
        createdAt: "2025-07-15T16:30:15.123Z",
        userId: "406c2d30-d540-47a6-937f-ba4f7f6300bd",
      },
      {
        id: "5f5dc01d-5878-4e19-85eb-ea772f5ee755",
        title: "New message",
        body: "You have received a new message from Sarah about your listing.",
        type: "MESSAGE_ALERT",
        read: false,
        createdAt: "2025-07-15T14:22:45.456Z",
        userId: "406c2d30-d540-47a6-937f-ba4f7f6300bd",
      },
    ],
  };
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'

  useEffect(() => {
    const fetchNotifications = async () => {
      // const token = localStorage.getItem("token");
      // if (!token) return; 
      try {
        const data = await getNotifications();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "CART_RENT_ALERT":
        return <ShoppingCart className="w-5 h-5 text-blue-500" />;
      case "PURCHASE_ALERT":
        return <Package className="w-5 h-5 text-green-500" />;
      case "MESSAGE_ALERT":
        return <Bell className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b last:border-b-0 pb-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>

              {/* Filter buttons */}
              <div className="flex gap-2 overflow-x-auto">
                {["all", "unread", "read"].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      filter === filterType
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    {filterType === "unread" && unreadCount > 0 && (
                      <span className="ml-1 text-xs">({unreadCount})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No notifications found</p>
                <p className="text-gray-400 text-sm mt-2">
                  {filter === "unread"
                    ? "All caught up!"
                    : "Check back later for updates"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                            {notification.body}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-green-500" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            title="Delete notification"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  {filteredNotifications.length} notification
                  {filteredNotifications.length !== 1 ? "s" : ""}
                  {filter !== "all" && ` (${filter})`}
                </p>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Mark all as read
                  </button>
                  <span className="text-gray-300">•</span>
                  <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                    Clear all
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
