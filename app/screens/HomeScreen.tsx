import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "../context/audio-context";
import { useFavorites } from "../context/favorites-context";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { playlist, Track } from "../data/playlist";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; 

interface Category {
  id: string;
  name: string;
  color: string;
}

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { loadTrack, playlist, currentTrack, isPlaying, stopTrack } =
    useAudio();
  const { toggleFavorite, favorites } = useFavorites();
  const [greeting, setGreeting] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good Morning");
      } else if (hour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    // Update greeting immediately
    updateGreeting();

    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const categories: Category[] = [
    { id: "1", name: "Chill Hits", color: "#FF6B6B" },
    { id: "2", name: "Top Hits", color: "#4ECDC4" },
    { id: "3", name: "New Releases", color: "#45B7D1" },
    { id: "4", name: "Trending", color: "#96CEB4" },
  ];

  const filteredPlaylist = playlist.filter((track) =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrackPress = (track: Track) => {
    if (currentTrack?.id === track.id) {
      // If the same track is pressed, stop it
      stopTrack();
    } else {
      // If a different track is pressed, load and play it
      loadTrack(track);
      navigation.navigate("Player", { track });
    }
  };

  const renderTrack = ({ item: track }: { item: Track }) => (
    <TouchableOpacity
      style={[
        styles.trackItem,
        currentTrack?.id === track.id && styles.activeTrack,
      ]}
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

  const renderCategory = ({ item: category }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <LinearGradient
        colors={[category.color, `${category.color}80`]}
        style={styles.categoryGradient}
      >
        <Text style={styles.categoryTitle}>{category.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFavorite = ({ item: track }: { item: Track }) => (
    <TouchableOpacity
      style={styles.favoriteTrack}
      onPress={() => handleTrackPress(track)}
    >
      {track.artwork ? (
        <Image source={{ uri: track.artwork }} style={styles.favoriteArtwork} />
      ) : (
        <View style={[styles.favoriteArtwork, styles.defaultArtwork]}>
          <Ionicons name="musical-note" size={24} color="#666" />
        </View>
      )}
      <View style={styles.favoriteInfo}>
        <Text style={styles.favoriteTitle}>{track.title}</Text>
        <Text style={styles.favoriteArtist}>{track.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1e1e1e", "#121212"]} style={styles.gradient}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>{greeting}</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("Favorites")}
              >
                <Ionicons name="heart-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="person-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search songs, artists..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>

          {/* Playlist */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Songs</Text>
            <FlatList
              data={filteredPlaylist}
              renderItem={renderTrack}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.playlist}
            />
          </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#282828",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 8,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    padding: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginBottom: 8,
    marginRight: 8,
    width: width - 32, // Full width minus padding
  },
  activeTrack: {
    backgroundColor: "#2A2A2A",
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
  categoryCard: {
    marginLeft: 16,
    width: 160,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
  },
  categoryGradient: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  categoryTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  categoriesList: {
    padding: 16,
  },
  favoritesList: {
    padding: 16,
  },
  playlist: {
    padding: 16,
  },
  favoriteTrack: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginBottom: 8,
    marginRight: 8,
    width: width - 32, // Full width minus padding
  },
  favoriteArtwork: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  favoriteInfo: {
    flex: 1,
    marginLeft: 12,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  favoriteArtist: {
    fontSize: 14,
    color: "#999",
  },
  defaultArtwork: {
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
});
