import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as loginApi, getMe } from "../api/auth";
import { Alert } from "react-native";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const res = await loginApi({ email, password });
      
      if (!res || !res.data) {
        throw new Error('Invalid response from server');
      }

      // Extract token from different possible response structures
      let token;
      if (res.data.token) {
        token = res.data.token;
      } else if (res.data.data?.token) {
        token = res.data.data.token;
      } else {
        throw new Error('Token not found in response');
      }
      
      if (!token) {
        throw new Error('Received empty token from server');
      }
      
      try {
        await AsyncStorage.setItem('@HostelHub:token', token);
        // Also save user data if available
        if (res.data.data) {
             await AsyncStorage.setItem('@HostelHub:user', JSON.stringify(res.data.data));
        }
      } catch (storageError) {
        Alert.alert("Storage Error", "Failed to save authentication data");
        throw new Error('Failed to save authentication data');
      }
      
      // Verify token was saved
      const savedToken = await AsyncStorage.getItem('@HostelHub:token');
      if (savedToken !== token) {
        throw new Error('Failed to verify saved token');
      }
      
      const me = await getMe();
      
      // Handle different response formats
      const userData = me?.data?.data || me?.data;
      if (!userData) {
        throw new Error('Invalid user data format received from server');
      }
      
      // Save user data to state
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      Alert.alert("Login Failed", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['@HostelHub:token', '@HostelHub:user']);
      setUser(null);
    } catch (error) {
      Alert.alert("Logout Error", "Failed to logout completely");
      throw error;
    }
  };

  const loadUser = async (showLoading = true) => {
    try {
      const [token, savedUser] = await AsyncStorage.multiGet(['@HostelHub:token', '@HostelHub:user']);
      const tokenValue = token[1];
      const userValue = savedUser[1];

      if (!tokenValue) {
        if (showLoading) setLoading(false);
        return;
      }

      // Optimistically set user if available
      if (userValue) {
        try {
            setUser(JSON.parse(userValue));
        } catch (e) {
            // Silent fail for parsing error
        }
      }
      
      const me = await getMe();
      
      if (!me || !me.data) {
        throw new Error('Failed to load user data');
      }
      
      const userData = me.data?.data || me.data;
      if (!userData) {
        throw new Error('Invalid user data format');
      }
      
      setUser(userData);
      // Update saved user data
      await AsyncStorage.setItem('@HostelHub:user', JSON.stringify(userData));
      
    } catch (error) {
      // Silent fail for loading user
      try {
        await AsyncStorage.removeItem('@HostelHub:token');
      } catch (e) {
        // Silent fail
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadUser(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: () => loadUser(false) }}>
      {children}
    </AuthContext.Provider>
  );
}
