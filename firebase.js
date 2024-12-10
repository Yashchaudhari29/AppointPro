import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCslsIaKWL78LeLbqkiuIbfTBn3YaMw_yg",
  authDomain: "login-90c54.firebaseapp.com",
  projectId: "login-90c54",
  storageBucket: "login-90c54.firebasestorage.app",
  messagingSenderId: "172673115126",
  appId: "1:172673115126:web:9f0329c6f8a34fae3c1dd7",
  measurementId: "G-9LBCH31PV0"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };