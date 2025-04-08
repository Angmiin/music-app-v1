import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";

const Welcome = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <LinearGradient
      colors={["#FBFBFB", "#343231", "#181616"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Image source={require("assets/images/beatflowy.png")} />
      </View>

      <View style={styles.content}>
        <Image source={require("assets/images/logo.jpg")} style={styles.logo} />
        <Text style={styles.description}>Listen to Favorite music,</Text>
        <Text style={styles.description}>All day long.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>
        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginButtonText}> Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    marginTop: "40%",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#181616",
  },
  content: {
    alignItems: "center",
    marginTop: 100,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 60,
    borderRadius: 45,
  },
  description: {
    fontSize: 24,
    color: "#E5E5E5",
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#037D49",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 48,
    marginBottom: 13,
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  loginLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
  },
  loginText: {
    color: "#DADADA",
    fontSize: 16,
  },
  loginButtonText: {
    color: "#27ae60",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default Welcome;
