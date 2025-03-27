import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { useAudio } from "../context/audio-context";
import { useFavorites } from "../context/favorites-context";
import { playlist } from "../data/playlist";

export function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { currentTrack } = useAudio();
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteTracks = playlist.filter((track) =>
    favorites.includes(track.id)
  );

  const renderTrack = ({ item: track }) => (
    <TouchableOpacity
      style={[
        styles.trackItem,
        currentTrack?.id === track.id && styles.activeTrack,
      ]}
      onPress={() => {
        navigation.navigate("Player", { track });
      }}
    >
      {track.artwork ? (
        <Image source={{ uri: track.artwork }} style={styles.artwork} />
      ) : (
        <View style={[styles.artwork, styles.defaultArtwork]}>
          <Ionicons name="musical-note" size={24} color="#666" />
        </View>
      )}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{track.title}</Text>
        <Text style={styles.trackArtist}>{track.artist}</Text>
      </View>
      <TouchableOpacity
        onPress={() => toggleFavorite(track.id)}
        style={styles.favoriteButton}
      >
        <Ionicons
          name={favorites.includes(track.id) ? "heart" : "heart-outline"}
          size={24}
          color={favorites.includes(track.id) ? "#FF4B4B" : "#666"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1e1e1e", "#121212"]} style={styles.gradient}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Favorites</Text>
            <Text style={styles.subtitle}>
              {favoriteTracks.length} songs in your favorites
            </Text>
          </View>

          {favoriteTracks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={64} color="#666" />
              <Text style={styles.emptyStateText}>
                No favorite songs yet. Start adding some!
              </Text>
            </View>
          ) : (
            <FlatList
              data={favoriteTracks}
              renderItem={renderTrack}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.playlist}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
  },
  playlist: {
    padding: 16,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#282828",
    borderRadius: 8,
    marginBottom: 8,
  },
  activeTrack: {
    backgroundColor: "#383838",
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  defaultArtwork: {
    backgroundColor: "#383838",
    justifyContent: "center",
    alignItems: "center",
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  trackArtist: {
    fontSize: 14,
    color: "#999",
  },
  favoriteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
});
