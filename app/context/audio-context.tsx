"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Audio } from "expo-av";
import { Track } from "../types/track";

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  duration: number;
  position: number;
  playlist: Track[];
  setPlaylist: (tracks: Track[]) => void;
  loadTrack: (track: Track) => Promise<void>;
  playTrack: () => Promise<void>;
  pauseTrack: () => Promise<void>;
  stopTrack: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [playlist, setPlaylist] = useState<Track[]>([]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
    }
  };

  const loadTrack = async (track: Track) => {
    try {
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
      setPosition(0);
      setDuration(0);

      // Get initial duration
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
    } catch (error) {
      console.error("Error loading track:", error);
    }
  };

  const playTrack = async () => {
    try {
      if (!sound) return;
      await sound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const pauseTrack = async () => {
    try {
      if (!sound) return;
      await sound.pauseAsync();
      setIsPlaying(false);
    } catch (error) {
      console.error("Error pausing track:", error);
    }
  };

  const stopTrack = async () => {
    try {
      if (!sound) return;
      await sound.stopAsync();
      setIsPlaying(false);
      setPosition(0);
    } catch (error) {
      console.error("Error stopping track:", error);
    }
  };

  const seekTo = async (position: number) => {
    try {
      if (!sound) return;
      await sound.setPositionAsync(position);
    } catch (error) {
      console.error("Error seeking track:", error);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        duration,
        position,
        playlist,
        setPlaylist,
        loadTrack,
        playTrack,
        pauseTrack,
        stopTrack,
        seekTo,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
