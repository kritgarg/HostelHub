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
import { AuthContext } from "../../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please fill in all fields");
    }
    
    try {
      setSubmitting(true);
      const result = await login(email, password);
      
      if (!result.success) {
        alert(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      alert(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/pic1.png")}
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

              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>

              <View style={styles.inputWrap}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="rgba(255,255,255,0.6)"
                  style={styles.inputIcon}
                />
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
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="rgba(255,255,255,0.6)"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.authButton}
                onPress={handleLogin}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#c1dbad", "#456031"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>{submitting ? "..." : "LOGIN"}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.replace("Register") }>
                  <Text style={styles.switchButton}>Sign Up</Text>
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
  forgotPassword: { alignSelf: "flex-end", marginBottom: 18 },
  forgotPasswordText: { color: "#c1dbad", fontSize: 14 },
  authButton: { marginTop: 4, borderRadius: 14, overflow: "hidden", height: 54, justifyContent: "center" },
  gradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
  switchContainer: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
  switchText: { color: "rgba(255,255,255,0.7)" },
  switchButton: { color: "#c1dbad", fontWeight: "700" },
});
