import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { usePlaylists } from "../context/playlist-context";
import Modal from "react-native-modal";

export function PlaylistScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { playlists, createPlaylist } = usePlaylists();
  const [isVisible, setIsVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName);
      setNewPlaylistName("");
      setIsVisible(false);
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
                          activeOpacity={0.7}
                        >
                          <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
            
                        <View style={styles.headerContent}>
            <Text style={styles.title}>Your Playlists</Text>
                          
                        </View>
                        
            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <Text style={styles.createPlaylist}>Create</Text>
            </TouchableOpacity>
          </View>
          {playlists.length > 0 ? (
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.playlistItem}
                  onPress={() =>
                    navigation.navigate("PlaylistDetail", {
                      playlistId: item.id,
                    })
                  }
                >
                  <Text style={styles.playlistName}>{item.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.list}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="musical-notes" size={48} color="#666" />
              <Text style={styles.emptyText}>No Playlists</Text>
            </View>
          )}

          <Modal
            isVisible={isVisible}
            onBackdropPress={() => setIsVisible(false)}
            style={styles.modal}
          >
            <View style={styles.menuContainer}>
              <Text style={styles.menuTitle}>Add to Playlists</Text>
              {/* Create new playlist */}
              <Text style={styles.sectionTitle}>Create New</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Playlist name"
                  placeholderTextColor="#666"
                  value={newPlaylistName}
                  onChangeText={setNewPlaylistName}
                />
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreatePlaylist}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </LinearGradient>
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
    backgroundColor: "#121212",
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
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
  createPlaylist: {
    color: "#1DB954",
    fontSize: 16,
    textAlign: "right",
    marginRight: 16,
  },
  backButton: {
    padding: 8,
  },
  list: {
    padding: 16,
  },
  playlistItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistName: {
    color: "#fff",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    color: "#666",
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  menuContainer: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "60%",
  },
  menuTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  separator: {
    borderTopColor: "#aaa",
    borderTopWidth: 1,
  },
  menuItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#383838",
  },
  menuItemText: {
    color: "#fff",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#282828",
    borderRadius: 8,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    color: "#fff",
    padding: 14,
  },
  createButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
