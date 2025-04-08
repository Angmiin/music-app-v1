import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./screens/HomeScreen";
import { PlayerScreen } from "./screens/PlayerScreen";
import { FavoritesScreen } from "./screens/FavoritesScreen";
import { PlaylistScreen } from "./screens/PlaylistScreen";
import { PlaylistDetailScreen } from "./screens/PlaylistDetailScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { CategoryScreen } from "./screens/CategoryScreen";
import { AudioProvider } from "./context/audio-context";
import { FavoritesProvider } from "./context/favorites-context";
import { PlaylistProvider } from "./context/playlist-context";
import { RootStackParamList } from "./types/navigation";
import Welcome from "./screens/Welcome";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <FavoritesProvider>
      <AudioProvider>
        <PlaylistProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#000" },
                animation: "fade",
              }}
            >
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ gestureEnabled: false }}
              />
              <Stack.Screen
                name="Player"
                component={PlayerScreen}
                options={{ presentation: "modal" }}
              />
              <Stack.Screen name="Favorites" component={FavoritesScreen} />
              <Stack.Screen name="Playlists" component={PlaylistScreen} />
              <Stack.Screen
                name="PlaylistDetail"
                component={PlaylistDetailScreen}
                options={{ gestureEnabled: true }}
              />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen
                name="Category"
                component={CategoryScreen}
                options={{ title: "Category" }}
              />
              <Stack.Screen name="Welcome" component={Welcome} />
            </Stack.Navigator>
          </NavigationContainer>
        </PlaylistProvider>
      </AudioProvider>
    </FavoritesProvider>
  );
}
