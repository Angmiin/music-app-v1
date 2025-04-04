import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";

export function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [user, setUser] = React.useState({
    username: "BeatFlowy",
    email: "user@example.com",
    password: "********",
  });

  const handleLogout = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile Settings</Text>
      </View>

      {/* Profile Content */}
      <View style={styles.content}>
        {/* Username Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={user.username}
              onChangeText={(text) => setUser({ ...user, username: text })}
              placeholderTextColor="#b3b3b3"
            />
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#1DB954" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Email Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={user.email}
              onChangeText={(text) => setUser({ ...user, email: text })}
              placeholderTextColor="#b3b3b3"
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#1DB954" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={user.password}
              onChangeText={(text) => setUser({ ...user, password: text })}
              placeholderTextColor="#b3b3b3"
              secureTextEntry
            />
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#1DB954" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    color: "#b3b3b3",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 8,
  },
  editButton: {
    padding: 8,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#1DB954",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
