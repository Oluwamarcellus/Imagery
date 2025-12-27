import { BlurView } from "expo-blur";
import { StyleSheet, Text } from "react-native";

export const CustomToastError = ({ text1, text2 }) => {
  return (
    <BlurView tint="light" intensity={50} style={styles.container}>
      <Text style={[styles.title, { color: "#ffb45fec" }]}>{text1}</Text>
    </BlurView>
  );
};

export const CustomToastSuccess = ({ text1, text2 }) => {
  return (
    <BlurView tint="light" intensity={50} style={styles.container}>
      <Text style={[styles.title, { color: "#56c899ff" }]}>{text1}</Text>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    overflow: "hidden",
    alignSelf: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
