import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

// Create context within the same file
const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Appointment Confirmed',
      message: 'Your appointment with Dr. Smith is confirmed for tomorrow at 10 AM',
      time: '2 minutes ago',
      icon: 'calendar-outline',
      color: '#34a853',
      isRead: false,
      status: 'unread',
      details: 'Location: Manhattan Medical Center\nRoom: 302\nDuration: 30 minutes'
    },
    {
      id: '2',
      title: 'New Message',
      message: 'You have a new message from CleanPro Services',
      time: '1 hour ago',
      icon: 'chatbubble-outline',
      color: '#1a73e8',
      isRead: true,
      status: 'read'
    },
    // Add more sample notifications
  ]);

  const [unreadCount, setUnreadCount] = useState(0);
  const [viewedIds, setViewedIds] = useState(new Set());

  useEffect(() => {
    updateUnreadCount();
  }, [notifications]);

  const updateUnreadCount = () => {
    const count = notifications.filter(notif => notif.status === 'unread').length;
    setUnreadCount(count);
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsViewed = (id) => {
    setViewedIds(prev => new Set(prev).add(id));
  };

  const moveViewedToRead = () => {
    if (viewedIds.size > 0) {
      setNotifications(prev =>
        prev.map(notif =>
          viewedIds.has(notif.id) && notif.status === 'unread'
            ? { ...notif, status: 'read', isRead: true }
            : notif
        )
      );
      setViewedIds(new Set());
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, status: 'read', isRead: true }
          : notif
      )
    );
  };

  const moveToTrash = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, status: 'trash' }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => 
        notif.status === 'unread' 
          ? { ...notif, status: 'read', isRead: true }
          : notif
      )
    );
  };

  const restoreFromTrash = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, status: 'read' }
          : notif
      )
    );
  };

  const permanentlyDelete = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const emptyTrash = () => {
    setNotifications(prev =>
      prev.filter(notif => notif.status !== 'trash')
    );
  };

  const restoreAllFromTrash = () => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.status === 'trash'
          ? { ...notif, status: 'read' }
          : notif
      )
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        moveToTrash,
        restoreFromTrash,
        permanentlyDelete,
        emptyTrash,
        restoreAllFromTrash,
        markAsViewed,
        moveViewedToRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// Hook to use notifications
export function useNotifications() {
  return useContext(NotificationContext);
}

// Main NotificationsScreen component
export default function NotificationsScreen() {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    moveToTrash,
    restoreFromTrash,
    permanentlyDelete,
    emptyTrash,
    restoreAllFromTrash,
    unreadCount,
    markAsViewed,
    moveViewedToRead
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('unread');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      return () => moveViewedToRead();
    }, [])
  );

  const filterNotifications = () => {
    return notifications.filter(notif => notif.status === activeTab);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const renderTab = (tabName, count) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tabName && styles.activeTab]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>
        {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
      </Text>
      {(tabName !== 'read' && count > 0) && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const handleNotificationPress = (id) => {
    markAsViewed(id);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item.id)}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.notificationIcon, { backgroundColor: `${item.color}15` }]}>
          <Icon name={item.icon} size={24} color={item.color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
          
          {expandedId === item.id && item.details && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>{item.details}</Text>
            </View>
          )}
        </View>
        
        {activeTab === 'trash' ? (
          <View style={styles.trashActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => restoreFromTrash(item.id)}
            >
              <Icon name="refresh-outline" size={20} color="#1a73e8" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => permanentlyDelete(item.id)}
            >
              <Icon name="trash-outline" size={20} color="#ea4335" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.trashButton}
            onPress={() => moveToTrash(item.id)}
          >
            <Icon name="trash-outline" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {renderTab('unread', unreadCount)}
        {renderTab('read', notifications.filter(n => n.status === 'read').length)}
        {renderTab('trash', notifications.filter(n => n.status === 'trash').length)}
      </View>

      {activeTab === 'unread' && unreadCount > 0 && (
        <TouchableOpacity
          style={styles.markAllButton}
          onPress={markAllAsRead}
        >
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      )}

      {activeTab === 'trash' && notifications.filter(n => n.status === 'trash').length > 0 && (
        <View style={styles.trashActions}>
          <TouchableOpacity
            style={styles.trashActionButton}
            onPress={restoreAllFromTrash}
          >
            <Icon name="refresh-outline" size={20} color="#1a73e8" />
            <Text style={styles.trashActionText}>Restore All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.trashActionButton, styles.emptyTrashButton]}
            onPress={emptyTrash}
          >
            <Icon name="trash-outline" size={20} color="#ea4335" />
            <Text style={[styles.trashActionText, styles.emptyTrashText]}>Empty Trash</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filterNotifications()}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="notifications-off-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>
              No {activeTab} notifications
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1a73e8',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: '#1a73e8',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  markAllButton: {
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  markAllText: {
    color: '#1a73e8',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationItem: {
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  trashButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  detailsContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  trashActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  trashActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#fff',
  },
  trashActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1a73e8',
  },
  emptyTrashButton: {
    backgroundColor: '#fef2f2',
  },
  emptyTrashText: {
    color: '#ea4335',
  },
}); 