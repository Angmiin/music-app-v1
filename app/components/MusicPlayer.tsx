import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "../context/audio-context";

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    isLoading,
    playTrack,
    pauseTrack,
    playlist,
    playNext,
    playPrevious,
    duration,
    position,
    seekTo,
  } = useAudio();

  const [error, setError] = useState<string | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!currentTrack) return null;

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await pauseTrack();
      } else {
        await playTrack();
      }
    } catch (err) {
      setError("Playback error. Please try again.");
      console.error("Play/Pause error:", err);
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = async (newPosition: number) => {
    try {
      await seekTo(newPosition);
    } catch (err) {
      setError("Failed to seek");
      console.error("Seek error:", err);
    } finally {
      setIsSeeking(false);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const isActive = isPlaying || isBuffering || isLoading || isSeeking;

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {currentTrack.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {currentTrack.artist}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(position / Math.max(duration, 1)) * 100}%` },
            ]}
          />
          {(isBuffering || isLoading) && (
            <View style={styles.bufferingOverlay}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={playPrevious}
          style={styles.controlButton}
          disabled={!isActive || playlist.length <= 1}
        >
          <Ionicons
            name="play-skip-back"
            size={24}
            color={!isActive || playlist.length <= 1 ? "#666" : "#fff"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlayPause}
          style={styles.playButton}
          disabled={isLoading}
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
          disabled={!isActive || playlist.length <= 1}
        >
          <Ionicons
            name="play-skip-forward"
            size={24}
            color={!isActive || playlist.length <= 1 ? "#666" : "#fff"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    borderRadius: 16,
    margin: 8,
  },
  trackInfo: {
    marginBottom: 16,
  },
  trackTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  trackArtist: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF4B4B",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
  },
  errorContainer: {
    backgroundColor: "rgba(255, 75, 75, 0.2)",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    alignItems: "center",
  },
  errorText: {
    color: "#FF4B4B",
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#444",
    borderRadius: 2,
    marginHorizontal: 8,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF4B4B",
    position: "absolute",
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  timeText: {
    color: "#aaa",
    fontSize: 12,
    minWidth: 40,
    textAlign: "center",
  },
});
