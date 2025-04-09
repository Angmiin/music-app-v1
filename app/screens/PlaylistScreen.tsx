import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { usePlaylists } from "../context/playlist-context";

export function PlaylistScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { playlists } = usePlaylists();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LinearGradient colors={["#1a1a1a", "#000000"]} style={styles.gradient}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Playlists</Text>
          </View>
          {playlists.length > 0 ? (
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.playlistItem}
                  onPress={() =>
                    navigation.navigate("PlaylistDetail", {
                      playlistId: item.id,
                    })
                  }
                >
                  <Text style={styles.playlistName}>{item.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.list}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="musical-notes" size={48} color="#666" />
              <Text style={styles.emptyText}>No Playlists</Text>
            </View>
          )}
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    color: "#666",
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
});
