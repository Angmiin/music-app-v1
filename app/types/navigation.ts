import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Playlists: undefined;
  PlaylistDetail: { playlistId: string };
  Favorites: undefined;
  Profile: undefined;
  Player: { track: Track };
  Category: { category: string; tracks: Track[] };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type Track = {
  id: string;
  title: string;
  artist: string;
  duration: number;
  artwork?: string;
  url: string;
};