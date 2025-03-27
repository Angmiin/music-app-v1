"use client";

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useAudio } from "../context/audio-context";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    error,
    volume,
    togglePlayPause,
    playNextTrack,
    playPreviousTrack,
    seekTo,
    setVolume,
  } = useAudio();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {currentTrack ? (
        <View style={styles.playerContainer}>
          {/* Track Info */}
          <View style={styles.trackInfo}>
            <View style={styles.albumArtContainer}>
              {currentTrack.artwork ? (
                <Image
                  source={{ uri: currentTrack.artwork }}
                  style={styles.albumArt}
                />
              ) : (
                <View style={[styles.albumArt, styles.defaultAlbumArt]}>
                  <Ionicons name="musical-note" size={24} color="#666" />
                </View>
              )}
            </View>
            <View style={styles.trackDetails}>
              <Text style={styles.title} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
            <TouchableOpacity style={styles.heartButton}>
              <Ionicons name="heart-outline" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.time}>{formatTime(position)}</Text>
            <Slider
              style={styles.progressBar}
              value={position}
              maximumValue={duration}
              minimumValue={0}
              onValueChange={seekTo}
              minimumTrackTintColor="#1DB954"
              maximumTrackTintColor="#333"
              thumbTintColor="#1DB954"
            />
            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="shuffle" size={24} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={playPreviousTrack}
            >
              <Ionicons name="play-skip-back" size={24} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playButton}
              onPress={togglePlayPause}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={30}
                color="#000"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={playNextTrack}
            >
              <Ionicons name="play-skip-forward" size={24} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="repeat" size={24} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.noTrackText}>Select a track to play</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#181818",
    borderTopWidth: 1,
    borderTopColor: "#282828",
    padding: 16,
  },
  playerContainer: {
    gap: 16,
  },
  trackInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  albumArtContainer: {
    width: 56,
    height: 56,
    marginRight: 12,
    marginTop: 2,
  },
  albumArt: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  defaultAlbumArt: {
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  trackDetails: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  artist: {
    color: "#999",
    fontSize: 14,
  },
  heartButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  time: {
    color: "#999",
    fontSize: 12,
    width: 40,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    backgroundColor: "#fff",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff4444",
    textAlign: "center",
    padding: 16,
  },
  noTrackText: {
    color: "#999",
    textAlign: "center",
  },
});
