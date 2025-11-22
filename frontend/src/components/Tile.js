import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Tile({ color, label, onPress, icon, image, imageStyle }) {
  return (
    <TouchableOpacity style={[styles.tile, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.tileText}>{label}</Text>
      {image ? (
        <Image source={image} style={[styles.tileImage, imageStyle]} resizeMode="contain" />
      ) : null}
      <View style={styles.tileIcon}>
        <Ionicons name={icon} size={18} color="#111" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 22,
    padding: 16,
    justifyContent: "space-between",
    overflow: "hidden",
    marginBottom: 14,
  },
  tileText: { 
    color: "#111", 
    fontSize: 16, 
    fontWeight: "700" 
  },
  tileIcon: {
    alignSelf: "flex-end",
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  tileImage: {
    position: "absolute",
    top: 6,
    left: 5,
    width: 170,
    height: 170,
    opacity: 0.9,
  },
});
