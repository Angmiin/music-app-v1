import React, { useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../types/navigation";
import { useAuth } from "../context/auth-context";
import auth from "@react-native-firebase/auth";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { register, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const initialValues: FormValues = {
    name: "",
    email: "",
    password: "",
  };

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const result = await register(values.email, values.password, values.name);
    setSubmitting(false);

    if (result.success) {
      navigation.navigate("Login");
    } else {
      Alert.alert("Registration Failed", result.message || "An error occurred");
    }
  };

  return (
    <LinearGradient colors={["#343231", "#181616"]} style={styles.container}>
      <Image source={require("assets/images/logo.jpg")} style={styles.logo} />
      <View style={styles.formContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#6B6B6B"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                autoCapitalize="words"
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#6B6B6B"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                placeholderTextColor="#6B6B6B"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                autoCapitalize="none"
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit()}
                disabled={submitting || loading}
              >
                {submitting || loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginLink}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLinkText}> Log In</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
    marginTop: 50,
  },
  label: {
    color: "#E5E5E5",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#343231",
    color: "#E5E5E5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#FF4444",
    marginBottom: 10,
    fontSize: 12,
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
    fontWeight: "bold",
    textAlign: "center",
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#DADADA",
    fontSize: 16,
  },
  loginLinkText: {
    color: "#27ae60",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 0,
    borderRadius: 40,
    marginTop: 100,
  },
});

export default SignUpScreen;
