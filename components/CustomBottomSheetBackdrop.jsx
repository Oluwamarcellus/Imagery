import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const CustomBottomSheetBackdrop = ({ animatedIndex, style }) => {
  const animatedOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 1], [0, 1]),
  }));

  return (
    <Animated.View
      style={[
        style,
        StyleSheet.absoluteFill,
        { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        animatedOpacity,
      ]}
    />
  );
};

export default CustomBottomSheetBackdrop;
