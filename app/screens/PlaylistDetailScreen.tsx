import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { usePlaylists } from "../context/playlist-context";
import { useAudio } from "../context/audio-context";
import { useFavorites } from "../context/favorites-context";
import Navbar from "../components/Navbar";
import { Track } from "../types/track";

const { width } = Dimensions.get("window");

export function PlaylistDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { playlistId } = route.params as { playlistId: string };

  const { playlists, removeFromPlaylist } = usePlaylists();
  const { loadTrack, currentTrack, stopTrack } = useAudio();
  const { toggleFavorite, isFavorite } = useFavorites();

  const playlist = playlists.find((p) => p.id === playlistId);
  const tracks = playlist?.tracks || [];

  const handleTrackPress = (track: Track) => {
    if (currentTrack?.id === track.id) {
      stopTrack();
    } else {
      loadTrack(track);
      navigation.navigate("Player", { track });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1a1a1a", "#000000"]} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {playlist?.name || "Playlist"}
            </Text>
            <Text style={styles.subtitle}>
              {tracks.length} {tracks.length === 1 ? "song" : "songs"}
            </Text>
          </View>
        </View>

        {tracks.length > 0 ? (
          <FlatList
            data={tracks}
            renderItem={({ item: track }) => (
              <TouchableOpacity
                style={[
                  styles.trackItem,
                  currentTrack?.id === track.id && styles.activeTrack,
                ]}
                onPress={() => handleTrackPress(track)}
                activeOpacity={0.7}
              >
                {track.artwork ? (
                  <Image
                    source={{ uri: track.artwork }}
                    style={styles.artwork}
                  />
                ) : (
                  <View style={[styles.artwork, styles.defaultArtwork]}>
                    <Ionicons name="musical-note" size={24} color="#666" />
                  </View>
                )}

                <View style={styles.trackInfo}>
                  <Text
                    style={styles.trackTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {track.title}
                  </Text>
                  <Text
                    style={styles.trackArtist}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {track.artist}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(track)}
                    style={styles.favoriteButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={isFavorite(track.id) ? "heart" : "heart-outline"}
                      size={24}
                      color={isFavorite(track.id) ? "#FF4B4B" : "#666"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => removeFromPlaylist(playlistId, track.id)}
                    style={styles.removeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes" size={48} color="#666" />
            <Text style={styles.emptyText}>No tracks in this playlist</Text>
          </View>
        )}

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
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 10,
  },
  headerContent: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginTop: 4,
  },
  backButton: {
    padding: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginBottom: 8,
    width: width - 32,
  },
  activeTrack: {
    backgroundColor: "#2A2A2A",
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
    marginRight: 12,
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
  actions: {
    flexDirection: "row",
  },
  favoriteButton: {
    padding: 8,
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
});
