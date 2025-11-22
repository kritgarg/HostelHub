import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ApplyComplaintScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await API.post("/complaints", {
        title,
        description
      });
      Alert.alert("Success", "Complaint submitted successfully", [
        { text: "OK", onPress: () => {
            setTitle("");
            setDescription("");
            navigation.navigate("History"); 
        }}
      ]);
    } catch (e) {
      const msg = e.response?.data?.message || "Failed to submit complaint";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={styles.container} 
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
      enableAutomaticScroll={true}
    >
      <View style={styles.card}>
        <Text style={styles.title}>New Complaint</Text>
        <Text style={styles.subtitle}>Describe the issue you are facing. We'll look into it ASAP.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="alert-circle-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Fan not working"
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Provide more details..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, loading && styles.disabledBtn]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitBtnText}>Submit Complaint</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f2f0e7ff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#111",
    fontWeight: "500",
  },
  textAreaWrapper: {
    alignItems: "flex-start",
    paddingVertical: 16,
    height: "auto",
    minHeight: 120,
  },
  textArea: {
    height: "100%",
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 18,
    marginTop: 12,
    gap: 8,
    shadowColor: "#111",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    opacity: 0.7,
    shadowOpacity: 0,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
