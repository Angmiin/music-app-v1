import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { useAudio } from "../context/audio-context";
import { useFavorites } from "../context/favorites-context";
import { Track } from "../types/track";

export function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { playlist } = useAudio();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Filter tracks that are in favorites
  const favoriteTracks = playlist.filter((track) =>
    favorites.includes(track.id)
  );

  const handleTrackPress = (track: Track) => {
    navigation.navigate("Player", { track });
  };

  const handleFavoritePress = (trackId: string) => {
    toggleFavorite(trackId);
  };

  const renderTrack = ({ item: track }: { item: Track }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => handleTrackPress(track)}
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
        onPress={() => handleFavoritePress(track.id)}
        style={styles.favoriteButton}
      >
        <Ionicons
          name={isFavorite(track.id) ? "heart" : "heart-outline"}
          size={24}
          color={isFavorite(track.id) ? "#FF4B4B" : "#666"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1a1a1a", "#000000"]} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Favorites</Text>
        </View>

        {favoriteTracks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#666" />
            <Text style={styles.emptyStateText}>No favorite songs yet</Text>
          </View>
        ) : (
          <FlatList
            data={favoriteTracks}
            renderItem={renderTrack}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  list: {
    padding: 16,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginBottom: 8,
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  defaultArtwork: {
    backgroundColor: "#282828",
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
  },
  emptyStateText: {
    color: "#666",
    fontSize: 16,
    marginTop: 16,
  },
});
