import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./screens/HomeScreen";
import { PlayerScreen } from "./screens/PlayerScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { AudioProvider } from "./context/audio-context";
import { FavoritesProvider } from "./context/favorites-context";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <AudioProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#000" },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Player" component={PlayerScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AudioProvider>
    </FavoritesProvider>
  );
}
