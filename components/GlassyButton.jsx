import Colors from "@constants/Colors";
import { BlurView } from "expo-blur";
import { StyleSheet, TouchableOpacity } from "react-native";

const GlassyButton = (props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => props.buttonFn()}>
      <BlurView tint="light" intensity={10} style={StyleSheet.absoluteFill} />
      <props.icon color={Colors.input} size={20} strokeWidth={3} />
    </TouchableOpacity>
  );
};

export default GlassyButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
});
