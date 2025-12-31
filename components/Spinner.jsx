import { ActivityIndicator, View } from "react-native";
import Animated from "react-native-reanimated";
import { heightPercentageToDP } from "react-native-responsive-screen";

const Spinner = () => {
  const AnimatedView = Animated.createAnimatedComponent(View);
  return (
    <AnimatedView
      style={{
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: heightPercentageToDP("35%"),
        left: 0,
        right: 0,
      }}
    >
      <ActivityIndicator size="small" color={"#000"} />
    </AnimatedView>
  );
};

export default Spinner;
