import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Modal,
  ActionSheetIOS,
  Alert,
  Pressable,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ChatDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { chat } = route.params;
  const [message, setMessage] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'provider',
      timestamp: '10:00 AM',
      read: true,
      type: 'text'
    },
    {
      id: '2',
      text: 'Hi, I need some assistance',
      sender: 'user',
      timestamp: '10:01 AM',
      read: true,
      type: 'text'
    },
  ]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageOptions, setShowMessageOptions] = useState(false);

  const flatListRef = useRef(null);
  const swipeableRefs = useRef(new Map()).current;

  const handleAttachment = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Photo Library', 'Camera', 'Document'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) pickImage();
          if (buttonIndex === 2) takePhoto();
          if (buttonIndex === 3) pickDocument();
        }
      );
    } else {
      setShowAttachMenu(true);
    }
  };

  const pickImage = async () => {
    try {
      setIsLoading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled) {
        sendMediaMessage(result.assets[0].uri, 'image');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setIsLoading(false);
      setShowAttachMenu(false);
    }
  };

  const takePhoto = async () => {
    try {
      setIsLoading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to use camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled) {
        sendMediaMessage(result.assets[0].uri, 'image');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setIsLoading(false);
      setShowAttachMenu(false);
    }
  };

  const pickDocument = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        const newMessage = {
          id: Date.now().toString(),
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          type: 'document',
          fileName: result.name,
          uri: result.uri,
          size: result.size,
          read: false,
        };
        setChatMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    } finally {
      setIsLoading(false);
      setShowAttachMenu(false);
    }
  };

  const sendMediaMessage = (uri, type) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: type,
      uri: uri,
      read: false,
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        read: false,
        type: 'text'
      };
      setChatMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleLongPress = (message) => {
    if (message.sender === 'user') {
      Alert.alert(
        'Delete Message',
        'Do you want to delete this message?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            onPress: () => deleteMessage(message.id),
            style: 'destructive'
          }
        ]
      );
    }
  };

  const deleteMessage = (messageId) => {
    setChatMessages(prevMessages => 
      prevMessages.filter(msg => msg.id !== messageId)
    );
  };

  const renderRightActions = (progress, dragX, message) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => {
          swipeableRefs.get(message.id)?.close();
          handleLongPress(message);
        }}
      >
        <Animated.View
          style={[
            styles.deleteActionContent,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <Icon name="trash-outline" size={24} color="#fff" />
          <Text style={styles.deleteActionText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const MessageContent = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'user' ? styles.userBubble : styles.providerBubble,
      item.deleted && styles.deletedMessage
    ]}>
      {!item.deleted ? (
        <>
          {item.type === 'text' && (
            <Text style={[
              styles.messageText,
              item.sender === 'user' ? styles.userMessageText : styles.providerMessageText
            ]}>{item.text}</Text>
          )}
          
          {item.type === 'image' && (
            <Image 
              source={{ uri: item.uri }} 
              style={styles.mediaMessage} 
              resizeMode="cover"
            />
          )}

          {item.type === 'document' && (
            <View style={styles.documentContainer}>
              <Icon name="document-text" size={24} color="#666" />
              <View style={styles.documentInfo}>
                <Text style={styles.documentName} numberOfLines={1}>
                  {item.fileName}
                </Text>
                <Text style={styles.documentSize}>
                  {(item.size / 1024).toFixed(1)} KB
                </Text>
              </View>
            </View>
          )}
        </>
      ) : (
        <View style={styles.deletedMessageContent}>
          <Icon name="information-circle-outline" size={16} color="#666" />
          <Text style={styles.deletedMessageText}>{item.text}</Text>
        </View>
      )}

      <View style={styles.messageFooter}>
        <Text style={[
          styles.messageTime,
          item.sender === 'user' ? styles.userMessageTime : styles.providerMessageTime
        ]}>
          {item.timestamp}
        </Text>
        {item.sender === 'user' && !item.deleted && (
          <Icon 
            name={item.read ? "checkmark-done" : "checkmark"} 
            size={16} 
            color={item.read ? "#4CAF50" : "#666"}
            style={styles.readReceipt}
          />
        )}
      </View>
    </View>
  );

  const renderMessage = ({ item }) => (
    <Pressable
      onLongPress={() => handleLongPress(item)}
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.providerMessage
      ]}
    >
      {item.sender === 'provider' && (
        <Image 
          source={{ uri: chat.avatar || 'https://via.placeholder.com/50' }} 
          style={styles.messageAvatar} 
        />
      )}
      
      {item.sender === 'user' && !item.deleted ? (
        <Swipeable
          ref={ref => {
            if (ref && !swipeableRefs.has(item.id)) {
              swipeableRefs.set(item.id, ref);
            }
          }}
          renderRightActions={(progress, dragX) => 
            renderRightActions(progress, dragX, item)
          }
          rightThreshold={40}
          overshootRight={false}
        >
          <MessageContent item={item} />
        </Swipeable>
      ) : (
        <MessageContent item={item} />
      )}
    </Pressable>
  );

  useEffect(() => {
    flatListRef.current?.scrollToEnd();
  }, [chatMessages]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#2B2B2B" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image source={{ uri: chat.avatar }} style={styles.headerAvatar} />
          <View>
            <Text style={styles.headerName}>{chat.name}</Text>
            <Text style={styles.headerStatus}>
              {chat.isOnline ? 'Online' : 'Last seen recently'}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={handleAttachment}
          >
            <Icon name="add-circle-outline" size={24} color="#2B2B2B" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            multiline
            maxLength={500}
            placeholderTextColor="#666"
          />
          <TouchableOpacity 
            style={[styles.sendButton, message.trim() ? styles.sendButtonActive : null]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Icon 
              name="send" 
              size={24} 
              color={message.trim() ? "#007AFF" : "#666"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Attachment Menu Modal for Android */}
      <Modal
        visible={showAttachMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAttachMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowAttachMenu(false)}
        >
          <View style={styles.attachmentMenu}>
            <TouchableOpacity 
              style={styles.attachmentOption}
              onPress={() => {
                setShowAttachMenu(false);
                pickImage();
              }}
            >
              <Icon name="images" size={24} color="#2B2B2B" />
              <Text style={styles.attachmentOptionText}>Photo Library</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.attachmentOption}
              onPress={() => {
                setShowAttachMenu(false);
                takePhoto();
              }}
            >
              <Icon name="camera" size={24} color="#2B2B2B" />
              <Text style={styles.attachmentOptionText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.attachmentOption}
              onPress={() => {
                setShowAttachMenu(false);
                pickDocument();
              }}
            >
              <Icon name="document" size={24} color="#2B2B2B" />
              <Text style={styles.attachmentOptionText}>Document</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Message Options Modal */}
      <Modal
        visible={showMessageOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMessageOptions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowMessageOptions(false)}
        >
          <View style={styles.messageOptionsContainer}>
            <TouchableOpacity 
              style={styles.messageOption}
              onPress={deleteMessage}
            >
              <Icon name="trash" size={24} color="#FF3B30" />
              <Text style={[styles.messageOptionText, { color: '#FF3B30' }]}>
                Delete Message
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B2B2B',
  },
  headerStatus: {
    fontSize: 12,
    color: '#666',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  providerMessage: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  providerBubble: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  providerMessageText: {
    color: '#2B2B2B',
  },
  mediaMessage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  providerMessageTime: {
    color: '#666',
  },
  readReceipt: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  attachButton: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    color: '#2B2B2B',
  },
  sendButton: {
    marginLeft: 12,
    opacity: 0.5,
  },
  sendButtonActive: {
    opacity: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  attachmentMenu: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  attachmentOptionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#2B2B2B',
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 8,
  },
  documentName: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  documentSize: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  messageOptionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  messageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  messageOptionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagePressed: {
    opacity: 0.7,
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteActionContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  deletedMessage: {
    backgroundColor: '#F8F8F8',
    borderColor: '#E8E8E8',
    borderWidth: 1,
  },
  deletedMessageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deletedMessageText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    marginLeft: 4,
  },
}); 