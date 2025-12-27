import Colors from "@constants/Colors";
import { BlurView } from "expo-blur";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";

const GlassyButton = (props) => {
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  return (
    <AnimatedTouchableOpacity
      entering={FadeInDown.duration(400)
        .delay(100 * props.animationDelay)
        .easing(Easing.inOut(Easing.quad))}
      style={styles.container}
      onPress={() => props.buttonFn()}
      disabled={props.disabled ?? false}
    >
      <BlurView tint="light" intensity={10} style={StyleSheet.absoluteFill} />
      {props.isLoading ? (
        <ActivityIndicator size="small" color={Colors.input} />
      ) : (
        <props.icon
          color={Colors.input}
          size={20}
          strokeWidth={3}
          style={{ opacity: props.disabled ? 0.5 : 1 }}
        />
      )}
    </AnimatedTouchableOpacity>
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
