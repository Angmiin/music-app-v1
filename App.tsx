import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./app/screens/HomeScreen";
import { PlayerScreen } from "./app/screens/PlayerScreen";
import { FavoritesScreen } from "./app/screens/FavoritesScreen";
import { PlaylistScreen } from "./app/screens/PlaylistScreen";
import { PlaylistDetailScreen } from "./app/screens/PlaylistDetailScreen";
import { CategoryScreen } from "./app/screens/CategoryScreen";
import { ProfileScreen } from "./app/screens/ProfileScreen";
import { AudioProvider } from "./app/context/audio-context";
import { FavoritesProvider } from "./app/context/favorites-context";
import { PlaylistProvider } from "./app/context/playlist-context";
import { RootStackParamList } from "./app/types/navigation";
import Navbar from "./app/components/Navbar";

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
        animation: "fade",
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Playlists" component={PlaylistScreen} />
      <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <FavoritesProvider>
        <PlaylistProvider>
          <NavigationContainer>
            <View style={{ flex: 1 }}>
              <MainStack />
              <Navbar />
            </View>
          </NavigationContainer>
        </PlaylistProvider>
      </FavoritesProvider>
    </AudioProvider>
  );
}
