import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { usePlaylists } from "../context/playlist-context";
import Navbar from "../components/Navbar";

export function PlaylistScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { playlists } = usePlaylists();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1a1a1a", "#000000"]} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Playlists</Text>
        </View>

        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.playlistItem}
              onPress={() =>
                navigation.navigate("PlaylistDetail", { playlistId: item.id })
              }
            >
              <Text style={styles.playlistName}>{item.name}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />

        <Navbar />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  list: {
    padding: 16,
  },
  playlistItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistName: {
    color: "#fff",
    fontSize: 16,
  },
});
