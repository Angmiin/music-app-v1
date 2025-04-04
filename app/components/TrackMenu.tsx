// components/TrackMenu.tsx
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePlaylists } from "../context/playlist-context";
import { Track } from "../types/track";
import Modal from "react-native-modal";

interface TrackMenuProps {
  track: Track;
}

export const TrackMenu = ({ track }: TrackMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { playlists, addToPlaylist, createPlaylist } = usePlaylists();
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylist(playlistId, track);
    setIsVisible(false);
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName);
      setNewPlaylistName("");
      setIsVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
      </TouchableOpacity>

      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        style={styles.modal}
      >
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Add to Playlist</Text>

          {/* Existing playlists */}
          <Text style={styles.sectionTitle}>Your Playlists</Text>
          {playlists.map((playlist) => (
            <TouchableOpacity
              key={playlist.id}
              style={styles.menuItem}
              onPress={() => handleAddToPlaylist(playlist.id)}
            >
              <Text style={styles.menuItemText}>{playlist.name}</Text>
            </TouchableOpacity>
          ))}

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
    </>
  );
};

const styles = StyleSheet.create({
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
