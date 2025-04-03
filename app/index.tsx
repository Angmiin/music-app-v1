// import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";
// import { StyleSheet } from "react-native";

// import { HomeScreen } from "./screens/HomeScreen";
// import { ProfileScreen } from "./screens/ProfileScreen";
// import { FavoritesScreen } from "./screens/FavoritesScreen";
// import { AudioProvider } from "./context/audio-context";
// import { FavoritesProvider } from "./context/favorites-context";

// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <FavoritesProvider>
//       <AudioProvider>
//         <NavigationContainer>
//           <Tab.Navigator
//             initialRouteName="HomeScreen" 
//             screenOptions={({ route }) => ({
//               headerShown: false,
//               tabBarActiveTintColor: "#037D49",
//               tabBarInactiveTintColor: "gray",
//               tabBarShowLabel: false,
//               tabBarStyle: {
//                 flex: 1,
//                 position: "absolute",
//                 backgroundColor: "#1c1c1c", 
//                 borderTopWidth: 0,
//                 paddingBottom: 10,
//                 height: 60,
//               },
//               tabBarIcon: ({ focused, color, size }) => {
//                 let iconName;
//                 if (route.name === "Home") {
//                   iconName = focused ? "home" : "home-outline";
//                 } else if (route.name === "Favorites") {
//                   iconName = focused ? "heart" : "heart-outline";
//                 } else if (route.name === "Profile") {
//                   iconName = focused ? "person" : "person-outline";
//                 }
//                 return (
//                   <Ionicons
//                     name={iconName as keyof typeof Ionicons.glyphMap}
//                     size={size}
//                     color={color}
//                   />
//                 );
//               },
//             })}
//           >
//             <Tab.Screen
//               name="Home" 
//               component={HomeScreen}
//               options={{
//                 title: "Home", 
//               }}
//             />

//             <Tab.Screen
//               name="Favorites"
//               component={FavoritesScreen}
//               options={{
//                 title: "Favorites", 
//               }}
//             />

//             <Tab.Screen
//               name="Profile"
//               component={ProfileScreen}
//               options={{
//                 title: "Profile", 
//               }}
//             />
//           </Tab.Navigator>
//         </NavigationContainer>
//       </AudioProvider>
//     </FavoritesProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
