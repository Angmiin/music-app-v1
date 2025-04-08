import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "../context/audio-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { useFavorites } from "../context/favorites-context";
import Navbar from "../components/Navbar";

const { width } = Dimensions.get("window");

export function PlayerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    isLoading,
    isLoaded,
    playTrack,
    pauseTrack,
    seekTo,
    position,
    duration,
    playlist,
    playNext,
    playPrevious,
  } = useAudio();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isDragging, setIsDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (!isDragging && currentTrack && isLoaded) {
      setSliderValue(position);
    }
  }, [position, isDragging, isLoaded]);

  const handleSeek = (value: number) => {
    if (!isLoaded) return;
    setSliderValue(value);
  };

  const handleSlidingComplete = async (value: number) => {
    if (!isLoaded) return;
    setIsDragging(false);
    try {
      await seekTo(value);
    } catch (error) {
      console.error("Error seeking:", error);
    }
  };

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

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#1a1a1a", "#000000"]} style={styles.gradient}>
          <View style={styles.content}>
            <Text style={styles.noTrackText}>No track selected</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1a1a1a", "#000000"]} style={styles.gradient}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.albumArtContainer}>
          {currentTrack.artwork ? (
            <Image
              source={{ uri: currentTrack.artwork }}
              style={styles.albumArt}
            />
          ) : (
            <View style={[styles.albumArt, styles.defaultArtwork]}>
              <Ionicons name="musical-note" size={64} color="#666" />
            </View>
          )}
        </View>

        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
          <TouchableOpacity
            onPress={() => toggleFavorite(currentTrack)}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={isFavorite(currentTrack.id) ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite(currentTrack.id) ? "#FF4B4B" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(sliderValue)}</Text>
          {isLoaded ? (
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={sliderValue}
              onValueChange={handleSeek}
              onSlidingStart={() => setIsDragging(true)}
              onSlidingComplete={handleSlidingComplete}
              minimumTrackTintColor="#1DB954"
              maximumTrackTintColor="#666"
              thumbTintColor="#1DB954"
              disabled={isLoading || isBuffering}
            />
          ) : (
            <View style={styles.loadingPlaceholder}>
              <ActivityIndicator size="small" color="#666" />
            </View>
          )}
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            onPress={playPrevious}
            style={styles.controlButton}
            disabled={
              !isLoaded || isLoading || isBuffering || playlist.length <= 1
            }
          >
            <Ionicons
              name="play-skip-back"
              size={24}
              color={
                !isLoaded || isLoading || isBuffering || playlist.length <= 1
                  ? "#666"
                  : "#fff"
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePlayPause}
            style={styles.playButton}
            disabled={!isLoaded || isLoading || isBuffering}
          >
            {isLoading || isBuffering ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={32}
                color="#fff"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={playNext}
            style={styles.controlButton}
            disabled={
              !isLoaded || isLoading || isBuffering || playlist.length <= 1
            }
          >
            <Ionicons
              name="play-skip-forward"
              size={24}
              color={
                !isLoaded || isLoading || isBuffering || playlist.length <= 1
                  ? "#666"
                  : "#fff"
              }
            />
          </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
  },
  noTrackText: {
    color: "#fff",
    fontSize: 18,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  albumArtContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  albumArt: {
    width: Math.min(width * 0.8, 250),
    height: Math.min(width * 0.8, 250),
    borderRadius: 20,
    marginTop: 50,
  },
  defaultArtwork: {
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  trackInfo: {
    alignItems: "center",
    marginTop: 32,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    justifyContent: "center",
  },
  trackArtist: {
    fontSize: 18,
    color: "#999",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 32,
  },
  timeText: {
    color: "#fff",
    marginHorizontal: 10,
    width: 50,
    textAlign: "center",
  },
  slider: {
    flex: 1,
    height: 40,
  },
  loadingPlaceholder: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  controlButton: {
    padding: 16,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1DB954",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
  },
  favoriteButton: {
    marginTop: 8,
    padding: 8,
  },
});
