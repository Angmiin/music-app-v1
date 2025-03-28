import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Track } from "../data/playlist";

export type RootStackParamList = {
  Home: undefined;
  Player: { track: Track };
  Favorites: undefined;
  Category: { category: string; tracks: Track[] };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
