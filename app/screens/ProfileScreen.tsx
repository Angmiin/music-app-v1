import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/auth-context";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import { auth } from "../context/firebase/firebaseConfig";

export function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState({
    email: false,
    password: false,
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSaveEmail = async () => {
    try {
      setIsProcessing(true);

      // Validate inputs
      if (!newEmail || !currentPassword) {
        throw new Error("Please fill in all fields");
      }

      if (!validateEmail(newEmail)) {
        throw new Error("Please enter a valid email address");
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user?.email || "",
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser!, credential);

      // Update email
      await updateEmail(auth.currentUser!, newEmail);

      Alert.alert("Success", "Email updated successfully");
      setEditMode({ ...editMode, email: false });
      setNewEmail("");
      setCurrentPassword("");
    } catch (error: any) {
      let message = "Failed to update email";
      switch (error.code) {
        case "auth/wrong-password":
          message = "Incorrect password";
          break;
        case "auth/invalid-email":
          message = "Invalid email format";
          break;
        case "auth/email-already-in-use":
          message = "Email already in use";
          break;
        default:
          message = error.message || message;
      }
      Alert.alert("Error", message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setIsProcessing(true);

      // Validate inputs
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Please fill in all fields");
      }

      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords don't match");
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user?.email || "",
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser!, credential);

      // Update password
      await updatePassword(auth.currentUser!, newPassword);

      Alert.alert("Success", "Password changed successfully");
      setEditMode({ ...editMode, password: false });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      let message = "Failed to change password";
      switch (error.code) {
        case "auth/wrong-password":
          message = "Current password is incorrect";
          break;
        case "auth/weak-password":
          message = "Password should be at least 6 characters";
          break;
        default:
          message = error.message || message;
      }
      Alert.alert("Error", message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
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
        {/* Email Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          {editMode.email ? (
            <>
              <Text style={styles.subLabel}>New Email</Text>
              <TextInput
                style={styles.input}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Enter new email"
                placeholderTextColor="#b3b3b3"
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
              />

              <Text style={styles.subLabel}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter your password"
                placeholderTextColor="#b3b3b3"
                secureTextEntry
              />

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#333" }]}
                  onPress={() => {
                    setEditMode({ ...editMode, email: false });
                    setNewEmail("");
                    setCurrentPassword("");
                  }}
                  disabled={isProcessing}
                >
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleSaveEmail}
                  disabled={isProcessing}
                >
                  <Text style={styles.actionButtonText}>
                    {isProcessing ? "Processing..." : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => setEditMode({ ...editMode, email: true })}
            >
              <Text style={styles.changePasswordText}>Change Email</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Password Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Password</Text>
          {editMode.password ? (
            <>
              <Text style={styles.subLabel}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#b3b3b3"
                secureTextEntry
                autoFocus
              />

              <Text style={styles.subLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password (min 6 chars)"
                placeholderTextColor="#b3b3b3"
                secureTextEntry
              />

              <Text style={styles.subLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#b3b3b3"
                secureTextEntry
              />

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#333" }]}
                  onPress={() => {
                    setEditMode({ ...editMode, password: false });
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  disabled={isProcessing}
                >
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleChangePassword}
                  disabled={isProcessing}
                >
                  <Text style={styles.actionButtonText}>
                    {isProcessing ? "Processing..." : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => setEditMode({ ...editMode, password: true })}
            >
              <Text style={styles.changePasswordText}>Change Password</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isProcessing}
        >
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
    marginBottom: 30,
  },
  label: {
    color: "#b3b3b3",
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "500",
  },
  subLabel: {
    color: "#888",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    color: "#fff",
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#222",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#222",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
  },
  editButton: {
    padding: 5,
  },
  changePasswordButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#1DB954",
    borderRadius: 8,
    alignItems: "center",
  },
  changePasswordText: {
    color: "#1DB954",
    fontWeight: "500",
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#1DB954",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
