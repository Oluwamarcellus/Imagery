import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const CustomZoomableImage = ({ imageUrl, handleOnLoaded }) => {
  const AnimatedImage = Animated.createAnimatedComponent(Image);
  return (
    <Zoomable minScale={1} maxScale={3} doubleTapScale={2} isDoubleTapEnabled>
      <AnimatedImage
        entering={FadeIn.duration(500)}
        source={{ uri: imageUrl }}
        style={styles.imageCard}
        onLoad={() => handleOnLoaded()}
      />
    </Zoomable>
  );
};

export default CustomZoomableImage;

const styles = StyleSheet.create({
  imageCard: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    contentFit: "cover",
  },
});
