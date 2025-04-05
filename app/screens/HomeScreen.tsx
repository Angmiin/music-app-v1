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
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "../context/audio-context";
import { useFavorites } from "../context/favorites-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { Track } from "../types/track";
import { deezerApi } from "../services/deezer-api";
import MiniPlayer from "../components/MiniPlayer";
import { TrackMenu } from "../components/TrackMenu";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

interface Category {
  id: string;
  name: string;
  color: string;
  gradient: [string, string];
  icon: keyof typeof Ionicons.glyphMap;
}

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    loadTrack,
    currentTrack,
    isPlaying,
    stopTrack,
    playlist,
    setPlaylist,
  } = useAudio();
  const { toggleFavorite, favorites, isFavorite } = useFavorites();
  const [greeting, setGreeting] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [allSongs, setAllSongs] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      try {
        const popularResults = await deezerApi.searchTracks("popular");
        const randomResults = await deezerApi.searchTracks("random");
        setAllSongs(randomResults);
        setPlaylist(randomResults);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsLoading(true);
      try {
        const results = await deezerApi.searchTracks(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching tracks:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleTrackPress = (track: Track) => {
    if (currentTrack?.id === track.id) {
      stopTrack();
    } else {
      loadTrack(track);
      navigation.navigate("Player", { track });
    }
  };

  const handleCategoryPress = async (category: Category) => {
    setIsLoading(true);
    try {
      let searchTerm = "";
      switch (category.name) {
        case "Popular":
          searchTerm = "popular";
          break;
        case "New Releases":
          searchTerm = "new";
          break;
        case "Trending":
          searchTerm = "trending";
          break;
        case "Chill Hits":
          searchTerm = "chill";
          break;
        default:
          searchTerm = category.name.toLowerCase();
      }

      const results = await deezerApi.searchTracks(searchTerm);
      setPlaylist(results);
      navigation.navigate("Category", {
        category: category.name,
        tracks: results,
      });
    } catch (error) {
      console.error("Error fetching category tracks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories: Category[] = [
    {
      id: "1",
      name: "Chill Hits",
      color: "#FF6B6B",
      gradient: ["#FF6B6B", "#FF6B6B80"],
      icon: "musical-note",
    },
    {
      id: "2",
      name: "Popular",
      color: "#4ECDC4",
      gradient: ["#4ECDC4", "#4ECDC480"],
      icon: "musical-note",
    },
    {
      id: "3",
      name: "New Releases",
      color: "#45B7D1",
      gradient: ["#45B7D1", "#45B7D180"],
      icon: "musical-note",
    },
    {
      id: "4",
      name: "Trending",
      color: "#96CEB4",
      gradient: ["#96CEB4", "#96CEB480"],
      icon: "musical-note",
    },
  ];

  const displayTracks = searchQuery ? searchResults : allSongs;

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
      <View style={styles.actions}>
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
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item: category }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(category)}
    >
      <LinearGradient
        colors={category.gradient}
        style={styles.categoryGradient}
      >
        <Ionicons name={category.icon} size={24} color="#fff" />
        <Text style={styles.categoryTitle}>{category.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1a1a1a", "#000000"]} style={styles.gradient}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{greeting}</Text>
            <View style={styles.headerButtons}></View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs or artists..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#1DB954"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={displayTracks}
            keyExtractor={(item) => item.id}
            renderItem={renderTrack}
            style={styles.content}
            ListHeaderComponent={() => (
              <>
                <View style={styles.categoriesContainer}>
                  <Text style={styles.sectionTitle}>Categories</Text>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCategory}
                    contentContainerStyle={styles.categoriesList}
                  />
                </View>
                <Text style={styles.sectionTitle}>
                  {searchQuery ? "Search Results" : "All Songs"}
                </Text>
              </>
            )}
          />
        )}
        <MiniPlayer />
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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
  headerButton: {
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    marginHorizontal: 16,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 16,
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
    width: 160,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
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
    marginTop: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
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
  categoriesContainer: {
    marginBottom: 24,
  },
  loader: {
    marginTop: 16,
  },
  playlistButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  playlistButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
