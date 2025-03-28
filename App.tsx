import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./app/screens/HomeScreen";
import { PlayerScreen } from "./app/screens/PlayerScreen";
import { FavoritesScreen } from "./app/screens/FavoritesScreen";
import { AudioProvider } from "./app/context/audio-context";
import { FavoritesProvider } from "./app/context/favorites-context";
import { RootStackParamList } from "./app/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <AudioProvider>
        <FavoritesProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Player" component={PlayerScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
          </Stack.Navigator>
        </FavoritesProvider>
      </AudioProvider>
    </NavigationContainer>
  );
}
