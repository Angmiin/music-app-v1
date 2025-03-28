"use client";

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "../context/audio-context";

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    pauseTrack,
    playlist,
    loadTrack,
  } = useAudio();

  if (!currentTrack) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  };

  const handleNext = () => {
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    const nextIndex = (currentIndex + 1) % playlist.length;
    loadTrack(playlist[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    const previousIndex =
      (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(playlist[previousIndex]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButton: {
    padding: 8,
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
});
