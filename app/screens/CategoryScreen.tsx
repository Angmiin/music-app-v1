import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { useAudio } from "../context/audio-context";
import { useFavorites } from "../context/favorites-context";
import { Track } from "../types/track";
import MiniPlayer from "../components/MiniPlayer";
import { TrackMenu } from "../components/TrackMenu";

type RouteParams = {
  category: string;
  tracks: Track[];
};

export function CategoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { category, tracks } = route.params as RouteParams;
  const { loadTrack, currentTrack, stopTrack } = useAudio();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleTrackPress = (track: Track) => {
    if (currentTrack?.id === track.id) {
      stopTrack();
    } else {
      loadTrack(track);
      navigation.navigate("Player", { track });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LinearGradient colors={["#1a1a1a", "#000000"]} style={styles.gradient}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{category}</Text>
              <Text style={styles.subtitle}>
                {tracks.length} {tracks.length === 1 ? "song" : "songs"}
              </Text>
            </View>
          </View>

          <FlatList
            data={tracks}
            renderItem={({ item: track }) => (
              <TouchableOpacity
                key={track.id}
                style={styles.trackItem}
                onPress={() => handleTrackPress(track)}
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
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <Text style={styles.trackArtist}>{track.artist}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleFavorite(track)}
                  style={styles.favoriteButton}
                >
                  <Ionicons
                    name={isFavorite(track.id) ? "heart" : "heart-outline"}
                    size={24}
                    color={isFavorite(track.id) ? "#FF4B4B" : "#666"}
                  />
                </TouchableOpacity>
                <TrackMenu track={track} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        </LinearGradient>
        <MiniPlayer />
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
    backgroundColor: "#000",
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerContent: {
    marginLeft: 16,
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
});
