import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "../context/audio-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { MusicPlayer } from "../components/MusicPlayer";

const { width } = Dimensions.get("window");

export function PlayerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { currentTrack } = useAudio();

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#1e1e1e", "#121212"]} style={styles.gradient}>
          {/* <View style={styles.content}> */}
            {/* <Text style={styles.noTrackText}>No track selected</Text> */}
          {/* </View> */}
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1e1e1e", "#121212"]} style={styles.gradient}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Album Art */}
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

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
        </View>

        {/* Music Player Controls */}
        <View style={styles.playerContainer}>
          <MusicPlayer />
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
    marginTop: 20,
  },
  albumArt: {
    width: width * 0.8,
    height: width * 0.8,
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  trackArtist: {
    fontSize: 18,
    color: "#999",
  },
  playerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#282828",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
});
