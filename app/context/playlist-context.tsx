import React, { createContext, useContext, useState, ReactNode } from "react";
import { Track } from "../types/track";

type PlaylistContextType = {
  playlists: Playlist[];
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  getPlaylistTracks: (playlistId: string) => Track[];
};

type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: Date;
  latestArtwork?: string;
};

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined
);

export const PlaylistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: new Date(),
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const deletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((playlist) => playlist.id !== id));
  };

  const addToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              tracks: [...playlist.tracks, track],
              latestArtwork: track.artwork || playlist.latestArtwork,
            }
          : playlist
      )
    );
  };

  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              tracks: playlist.tracks.filter((track) => track.id !== trackId),
            }
          : playlist
      )
    );
  };

  const getPlaylistTracks = (playlistId: string) => {
    return (
      playlists.find((playlist) => playlist.id === playlistId)?.tracks || []
    );
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
        deletePlaylist,
        addToPlaylist,
        removeFromPlaylist,
        getPlaylistTracks,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error("usePlaylists must be used within a PlaylistProvider");
  }
  return context;
};
