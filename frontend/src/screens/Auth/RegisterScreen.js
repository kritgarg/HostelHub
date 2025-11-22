import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { register as registerApi, getMe } from "../../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";
import { setUser } from "../../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function RegisterScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return alert("Please fill in all fields");
    }
    if (password !== confirmPassword) {
      return alert("Passwords don't match");
    }
    
    try {
      setSubmitting(true);
      console.log('Attempting to register with:', { name, email });
      
      // Make the registration API call
      const response = await registerApi({ name, email, password });
      console.log('Registration response:', JSON.stringify(response, null, 2));
      
      // Check if registration was successful
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      // Try to extract token from different possible response structures
      let token;
      if (response.data.token) {
        token = response.data.token;
      } else if (response.data.data && response.data.data.token) {
        token = response.data.data.token;
      }
      
      if (token) {
        console.log('Token found in registration response, saving...');
        await AsyncStorage.setItem("token", token);
        
        // Get user data
        console.log('Fetching user data after registration...');
        const me = await getMe();
        console.log('User data after registration:', JSON.stringify(me, null, 2));
        
        let userData = me?.data?.data || me?.data;
        if (userData) {
          setUser(userData);
          alert('Registration successful! You are now logged in.');
          return { success: true };
        }
      }
      
      // If auto-login with token didn't work, try traditional login
      console.log('Attempting traditional login after registration...');
      const loginResult = await login(email, password);
      if (!loginResult.success) {
        throw new Error(loginResult.error || 'Registration successful but failed to log in. Please try logging in manually.');
      }
      
      alert('Registration successful! You are now logged in.');
      return { success: true };
      
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      alert(`Registration failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Header / Logo Area */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="person-add" size={40} color="#fff" />
            </View>
            <Text style={styles.appName}>HostelHub</Text>
            <Text style={styles.welcomeText}>Join Us! 🚀</Text>
            <Text style={styles.subtitleText}>Create your account to get started</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  placeholder="John Doe"
                  placeholderTextColor="#aaa"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  placeholder="student@example.com"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#aaa"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={submitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#8fb3ff", "#6b9eff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                <Text style={styles.buttonText}>{submitting ? "Creating Account..." : "Create Account"}</Text>
                {!submitting && <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.replace("Login")}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f0e7", // Cream background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },
  registerButton: {
    marginTop: 10,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#8fb3ff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    flexDirection: "row",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
    color: "#666",
  },
  linkText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4285F4", // Google Blue or match primary
  },
});
