import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";

import { HomeScreen } from "./app/screens/HomeScreen";
import { ProfileScreen } from "./app/screens/ProfileScreen";
import { FavoritesScreen } from "./app/screens/FavoritesScreen";
import { AudioProvider } from "./app/context/audio-context";
import { FavoritesProvider } from "./app/context/favorites-context";
import { PlaylistScreen } from "./app/screens/PlaylistScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <AudioProvider>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor: "#000000",
              tabBarInactiveTintColor: "#6C7072",
              tabBarActiveBackgroundColor: "#6C7072",
              tabBarInactiveBackgroundColor: "#262626",
              tabBarShowLabel: false,
              tabBarPosition: "bottom",
              tabBarStyle: {
                flex: 1,
                position: "absolute",
                backgroundColor: "#1c1c1c",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
                borderTopWidth: 0,
                marginHorizontal: 15,
                height: 70,
                marginBottom: Platform.OS === "ios" ? 35 : 15,
              },
              tabBarIconStyle: {
                paddingTop: 5,
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              },
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === "Home") {
                  iconName = focused ? "home" : "home-outline";
                } else if (route.name === "Favorites") {
                  iconName = focused ? "heart" : "heart-outline";
                } else if (route.name === "Playlist") {
                  iconName = focused ? "musical-notes" : "musical-notes-outline";
                } else {
                  iconName = focused ? "person" : "person-outline";
                }
                return (
                  <Ionicons
                    name={iconName as keyof typeof Ionicons.glyphMap}
                    size={size}
                    color={color}
                  />
                );
              },
            })}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: "Home",
              }}
            />

            <Tab.Screen
              name="Favorites"
              component={FavoritesScreen}
              options={{
                title: "Favorites",
              }}
            />

            <Tab.Screen
              name="Playlist"
              component={PlaylistScreen}
              options={{
                title: "Playlist",
              }}
            />

            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: "Profile",
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </AudioProvider>
    </FavoritesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
