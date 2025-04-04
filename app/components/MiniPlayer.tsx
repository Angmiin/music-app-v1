import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { useAudio } from "../context/audio-context";

const MiniPlayer = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    isLoading,
    isLoaded,
    playTrack,
    pauseTrack,
    playNext,
    playPrevious,
    playlist,
  } = useAudio();

  const handlePlayPause = async () => {
    if (!isLoaded) return;
    try {
      if (isPlaying) {
        await pauseTrack();
      } else {
        await playTrack();
      }
    } catch (error) {
      console.error("Play/Pause error:", error);
    }
  };

  if (!currentTrack || playlist.length === 0) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("Player")}
      activeOpacity={0.8}
    >
      <View style={styles.player}>
        {/* Previous Button */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            playPrevious();
          }}
          style={styles.navButton}
          disabled={
            !isLoaded || isLoading || isBuffering || playlist.length <= 1
          }
        >
          <Ionicons
            name="play-skip-back"
            size={20}
            color={
              !isLoaded || isLoading || isBuffering || playlist.length <= 1
                ? "#666"
                : "#fff"
            }
          />
        </TouchableOpacity>

        {/* Album Art */}
        {currentTrack.artwork ? (
          <Image
            source={{ uri: currentTrack.artwork }}
            style={styles.artwork}
          />
        ) : (
          <View style={[styles.artwork, styles.defaultArtwork]}>
            <Ionicons name="musical-note" size={20} color="#666" />
          </View>
        )}

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>

        {/* Play/Pause Button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
          disabled={!isLoaded || isLoading || isBuffering}
        >
          {isLoading || isBuffering ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={20}
              color="#fff"
            />
          )}
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            playNext();
          }}
          style={styles.navButton}
          disabled={
            !isLoaded || isLoading || isBuffering || playlist.length <= 1
          }
        >
          <Ionicons
            name="play-skip-forward"
            size={20}
            color={
              !isLoaded || isLoading || isBuffering || playlist.length <= 1
                ? "#666"
                : "#fff"
            }
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  player: {
    flexDirection: "row",
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    borderRadius: 24,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  defaultArtwork: {
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  trackInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  trackTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  trackArtist: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  navButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MiniPlayer;
