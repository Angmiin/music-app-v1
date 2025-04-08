import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./app/screens/HomeScreen";
import { PlayerScreen } from "./app/screens/PlayerScreen";
import { FavoritesScreen } from "./app/screens/FavoritesScreen";
import { PlaylistScreen } from "./app/screens/PlaylistScreen";
import { PlaylistDetailScreen } from "./app/screens/PlaylistDetailScreen";
import { CategoryScreen } from "./app/screens/CategoryScreen";
import { ProfileScreen } from "./app/screens/ProfileScreen";
import LoginScreen from "./app/screens/LoginScreen";
import SignUpScreen from "./app/screens/SignupScreen";
import { AudioProvider } from "./app/context/audio-context";
import { FavoritesProvider } from "./app/context/favorites-context";
import { PlaylistProvider } from "./app/context/playlist-context";
import { AuthProvider, useAuth } from "./app/context/auth-context";
import { RootStackParamList } from "./app/types/navigation";
import Navbar from "./app/components/Navbar";
import MiniPlayer from "./app/components/MiniPlayer";
import Welcome from "./app/screens/Welcome";

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
      <Stack.Screen name="Home" component={HomeScreenWrapper} />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="Favorites" component={FavoritesScreenWrapper} />
      <Stack.Screen name="Playlists" component={PlaylistScreenWrapper} />
      <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

// Wrapper component for HomeScreen that includes MiniPlayer
function HomeScreenWrapper() {
  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
      <MiniPlayer />
    </View>
  );
}

// Wrapper component for FavoritesScreen that includes MiniPlayer
function FavoritesScreenWrapper() {
  return (
    <View style={{ flex: 1 }}>
      <FavoritesScreen />
      <MiniPlayer />
    </View>
  );
}

// Wrapper component for PlaylistScreen that includes MiniPlayer
function PlaylistScreenWrapper() {
  return (
    <View style={{ flex: 1 }}>
      <PlaylistScreen />
      <MiniPlayer />
    </View>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
        animation: "fade",
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#037D49" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <View style={{ flex: 1 }}>
          <MainStack />
          <Navbar />
        </View>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <FavoritesProvider>
          <PlaylistProvider>
            <RootNavigator />
          </PlaylistProvider>
        </FavoritesProvider>
      </AudioProvider>
    </AuthProvider>
  );
}
