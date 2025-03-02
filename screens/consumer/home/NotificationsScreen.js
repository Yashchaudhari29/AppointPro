import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Create context within the same file
const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add this useEffect to load notifications from AsyncStorage
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const markAsRead = async (notificationId) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId
        ? { ...notif, status: 'read', isRead: true }
        : notif
    );
    setNotifications(updatedNotifications);
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map(notif => 
      notif.status === 'unread' 
        ? { ...notif, status: 'read', isRead: true }
        : notif
    );
    setNotifications(updatedNotifications);
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const moveToTrash = async (notificationId) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId
        ? { ...notif, status: 'trash' }
        : notif
    );
    setNotifications(updatedNotifications);
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
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

  const emptyTrash = async () => {
    const updatedNotifications = notifications.filter(notif => notif.status !== 'trash');
    setNotifications(updatedNotifications);
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const restoreAllFromTrash = async () => {
    try {
      const updatedNotifications = notifications.map(notif =>
        notif.status === 'trash'
          ? { ...notif, status: 'read', isRead: true }
          : notif
      );
      setNotifications(updatedNotifications);
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error restoring notifications from trash:', error);
    }
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
        moveViewedToRead,
        isLoading,
        loadNotifications
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
    moveViewedToRead,
    isLoading,
    loadNotifications
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('unread');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      return () => moveViewedToRead();
    }, [])
  );

  const filterNotifications = () => {
    return notifications.filter(notif => notif.status === activeTab);
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadNotifications();
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setRefreshing(false);
    }
  }, [loadNotifications]);

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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Notifications</Text>
      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1a73e8" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : (
          <>
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#1a73e8',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderRadius: 12,
  },
  activeTab: {
    // borderBottomWidth: 2,
    backgroundColor: '#f0f7ff',
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
    paddingHorizontal: 8,
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
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
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
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  trashActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  trashActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1a73e8',
  },
  emptyTrashButton: {
    backgroundColor: '#fff2f2',
  },
  emptyTrashText: {
    color: '#dc3545',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
}); 