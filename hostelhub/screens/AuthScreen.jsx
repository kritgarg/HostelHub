import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import InputComp from '../components/InputComp';

const { width, height } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAuth = () => {
    // Basic validation
    if (!email || !password || (!isLogin && (!name || !confirmPassword))) {
      alert('Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Handle authentication logic here
    console.log(isLogin ? 'Logging in' : 'Signing up', { email, name });
    // After successful auth, navigate to home
    // navigation.navigate('Home');
  };

  return (
    <ImageBackground
      source={require('../assets/pic1.png')}
      style={styles.backgroundImage}
      blurRadius={10}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
              <View style={styles.logoContainer}>
                <Ionicons name="home" size={50} color="#fff" />
                <Text style={styles.logoText}>HostelHub</Text>
              </View>

              <Text style={styles.title}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin
                  ? 'Sign in to continue'
                  : 'Join us for the best hostel experience'}
              </Text>

              {!isLogin && (
                <InputComp
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  icon={
                    <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.6)" />
                  }
                />
              )}

              <InputComp
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                icon={
                  <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.6)" />
                }
              />

              <InputComp
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon={
                  <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" />
                }
              />

              {!isLogin && (
                <InputComp
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  icon={
                    <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" />
                  }
                />
              )}

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => {}}
              >
                <Text style={styles.forgotPasswordText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.authButton}
                onPress={handleAuth}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#c1dbad', '#456031']}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>
                    {isLogin ? 'LOGIN' : 'SIGN UP'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>
                  {isLogin
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                </Text>
                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                  <Text style={styles.switchButton}>
                    {isLogin ? 'Sign Up' : 'Login'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: 'Inter-Bold',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Inter-Regular',
  },
  authButton: {
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
    height: 55,
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#c1dbad',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  switchText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter-Regular',
  },
  switchButton: {
    color: '#c1dbad',
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
});

export default AuthScreen;
