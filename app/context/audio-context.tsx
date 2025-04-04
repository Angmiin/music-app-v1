import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Audio } from "expo-av";
import { Track } from "../types/track";
import { AVPlaybackStatus } from "expo-av";

type AudioContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  isBuffering: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  duration: number;
  position: number;
  playlist: Track[];
  playTrack: () => Promise<void>;
  pauseTrack: () => Promise<void>;
  stopTrack: () => Promise<void>;
  loadTrack: (track: Track) => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setPlaylist: (tracks: Track[]) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [playlist, setPlaylistState] = useState<Track[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);

  const updatePlaybackStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
      setIsLoaded(true);

      if (status.didJustFinish) {
        playNext();
      }
    } else {
      setIsLoaded(false);
    }
  };

  const loadTrack = async (track: Track) => {
    try {
      setIsLoading(true);
      setIsBuffering(true);
      setIsLoaded(false);

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: false },
        updatePlaybackStatus
      );

      soundRef.current = sound;
      setCurrentTrack(track);
    } catch (error) {
      console.error("Failed to load track", error);
      setIsLoaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  const playTrack = async () => {
    if (!soundRef.current || !isLoaded) return;
    try {
      setIsBuffering(true);
      await soundRef.current.playAsync();
    } catch (error) {
      console.error("Failed to play track", error);
    }
  };

  const pauseTrack = async () => {
    if (!soundRef.current || !isLoaded) return;
    try {
      await soundRef.current.pauseAsync();
    } catch (error) {
      console.error("Failed to pause track", error);
    }
  };

  const stopTrack = async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setCurrentTrack(null);
      setIsPlaying(false);
      setIsLoaded(false);
      setPosition(0);
      setDuration(0);
    } catch (error) {
      console.error("Failed to stop track", error);
    }
  };

  const seekTo = async (position: number) => {
    if (!soundRef.current || !isLoaded) return;
    try {
      await soundRef.current.setPositionAsync(position);
    } catch (error) {
      console.error("Failed to seek", error);
    }
  };

  const playNext = async () => {
    if (!currentTrack || playlist.length === 0 || !isLoaded) return;
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    await loadTrack(playlist[nextIndex]);
    if (isPlaying) await playTrack();
  };

  const playPrevious = async () => {
    if (!currentTrack || playlist.length === 0 || !isLoaded) return;
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    await loadTrack(playlist[prevIndex]);
    if (isPlaying) await playTrack();
  };

  const setPlaylist = (tracks: Track[]) => {
    setPlaylistState(tracks);
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isBuffering,
        isLoading,
        isLoaded,
        duration,
        position,
        playlist,
        playTrack,
        pauseTrack,
        stopTrack,
        loadTrack,
        seekTo,
        setPlaylist,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
