import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { register as registerApi, getMe } from "../../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";
import { setUser } from "../../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    <ImageBackground
      source={require("../../../assets/pic2.png")}
      style={styles.backgroundImage}
      blurRadius={10}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0.95)"]}
        style={styles.overlay}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
              <View style={styles.logoContainer}>
                <Ionicons name="home" size={48} color="#fff" />
                <Text style={styles.logoText}>HostelHub</Text>
              </View>

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join us for the best hostel experience</Text>

              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.6)" style={styles.inputIcon} />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.6)" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" style={styles.inputIcon} />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" style={styles.inputIcon} />
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                style={styles.authButton}
                onPress={handleRegister}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#c1dbad", "#456031"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>{submitting ? "..." : "SIGN UP"}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.replace("Login") }>
                  <Text style={styles.switchButton}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)" },
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 20 },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  logoContainer: { alignItems: "center", marginBottom: 26 },
  logoText: { color: "white", fontSize: 26, fontWeight: "700", marginTop: 8 },
  title: { color: "white", fontSize: 26, fontWeight: "700", marginBottom: 6, textAlign: "center" },
  subtitle: { color: "rgba(255,255,255,0.7)", fontSize: 14, textAlign: "center", marginBottom: 22 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 14,
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, color: "#fff" },
  authButton: { marginTop: 6, borderRadius: 14, overflow: "hidden", height: 54, justifyContent: "center" },
  gradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
  switchContainer: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
  switchText: { color: "rgba(255,255,255,0.7)" },
  switchButton: { color: "#c1dbad", fontWeight: "700" },
});
