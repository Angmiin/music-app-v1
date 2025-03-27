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
import { Track, playlist } from "../data/playlist";

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  error: string | null;
  volume: number;
  playlist: Track[];
  loadTrack: (track: Track) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  playNextTrack: () => Promise<void>;
  playPreviousTrack: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  stopTrack: () => void;
  currentPosition: number;
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.3);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isLoadingRef = useRef(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log("Audio mode setup successful");
      } catch (error) {
        console.error("Error setting up audio:", error);
      }
    };

    setupAudio();

    return () => {
      isMounted.current = false;
      cleanupSound();
    };
  }, []);

  const cleanupSound = async () => {
    try {
      if (soundRef.current) {
        const sound = soundRef.current;
        soundRef.current = null;
        setSound(null);

        try {
          await sound.stopAsync();
          await sound.unloadAsync();
        } catch (error) {
          console.error("Error during sound cleanup:", error);
        }
      }
    } catch (error) {
      console.error("Error in cleanupSound:", error);
    }
  };

  const loadTrack = async (track: Track) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      // First cleanup any existing sound
      await cleanupSound();

      // Validate URL
      if (!track.url) {
        throw new Error("Invalid track URL");
      }

      // Configure audio mode before loading
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create and load the sound with minimal options
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.url },
        {
          shouldPlay: true,
          progressUpdateIntervalMillis: 100,
          positionMillis: 0,
          volume: 0.1,
          rate: 1.0,
          shouldCorrectPitch: true,
        },
        onPlaybackStatusUpdate
      );

      if (!isMounted.current) {
        await newSound.unloadAsync();
        return;
      }

      // Set the sound reference before any other operations
      soundRef.current = newSound;
      setSound(newSound);
      setCurrentTrack(track);
      setPosition(0);
      setDuration(track.duration);
      setIsPlaying(true);
      setError(null);
    } catch (error) {
      console.error("Error in loadTrack:", error);
      if (isMounted.current) {
        setError("Failed to load track");
      }
    } finally {
      isLoadingRef.current = false;
    }
  };

  const onPlaybackStatusUpdate = async (status: any) => {
    if (!isMounted.current) return;

    try {
      if (status.isLoaded) {
        setPosition(status.positionMillis / 1000);
        setDuration(status.durationMillis / 1000);
        setIsPlaying(status.isPlaying);

        if (status.didJustFinish) {
          setTimeout(async () => {
            await playNextTrack();
          }, 1000);
        }
      } else if (status.error) {
        setError(`Playback error: ${status.error}`);
      }
    } catch (error) {
      console.error("Error in onPlaybackStatusUpdate:", error);
    }
  };

  const togglePlayPause = async () => {
    try {
      if (!soundRef.current) {
        if (currentTrack) {
          await loadTrack(currentTrack);
        }
        return;
      }

      const sound = soundRef.current;
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Error in togglePlayPause:", error);
      setError("Failed to toggle playback");
    }
  };

  const playNextTrack = async () => {
    if (!currentTrack) return;
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    const nextIndex = (currentIndex + 1) % playlist.length;
    await loadTrack(playlist[nextIndex]);
  };

  const playPreviousTrack = async () => {
    if (!currentTrack) return;
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    const previousIndex =
      (currentIndex - 1 + playlist.length) % playlist.length;
    await loadTrack(playlist[previousIndex]);
  };

  const seekTo = async (position: number) => {
    try {
      if (!soundRef.current) return;
      await soundRef.current.setPositionAsync(position * 1000);
    } catch (error) {
      if (isMounted.current) {
        setError("Failed to seek");
        console.error("Error seeking:", error);
      }
    }
  };

  const setVolume = async (newVolume: number) => {
    try {
      if (!soundRef.current) return;
      await soundRef.current.setVolumeAsync(newVolume);
      if (isMounted.current) {
        setVolumeState(newVolume);
      }
    } catch (error) {
      if (isMounted.current) {
        setError("Failed to set volume");
        console.error("Error setting volume:", error);
      }
    }
  };

  const stopTrack = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setCurrentTrack(null);
      setIsPlaying(false);
      setCurrentPosition(0);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        position,
        duration,
        error,
        volume,
        playlist,
        loadTrack,
        togglePlayPause,
        playNextTrack,
        playPreviousTrack,
        seekTo,
        setVolume,
        stopTrack,
        currentPosition,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
