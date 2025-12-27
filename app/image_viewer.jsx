import GlassyButton from "@components/GlassyButton";
import Colors from "@constants/Colors";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Download, Forward, X } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { heightPercentageToDP } from "react-native-responsive-screen";

const ImageViewer = () => {
  const router = useRouter();
  const imageUrl = useLocalSearchParams().imageUrl;
  const [isLoaded, setIsLoaded] = useState(false);

  const AnimatedImage = Animated.createAnimatedComponent(Image);

  const handleOnLoaded = () => {
    if (isLoaded) return;
    setIsLoaded(true);
  };

  const SaveImage = async () => {
    // const localUrl = FileSystem.documentDirectory;
    // console.log(localUrl);
  };

  return (
    <BlurView style={styles.container} tint="dark" intensity={100}>
      <View
        style={{
          paddingHorizontal: 20,
          width: "100%",
          height: heightPercentageToDP("90%"),
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <View style={[styles.imageWrapper]}>
          {/* <ImageZoom
            source={{ uri: imageUrl }}
            resizeMode="cover"
            minScale={1}
            maxScale={3}
            doubleTapScale={2}
            isDoubleTapEnabled
            style={styles.imageCard}
          /> */}
          <Zoomable
            minScale={1}
            maxScale={3}
            doubleTapScale={2}
            isDoubleTapEnabled
          >
            <AnimatedImage
              entering={FadeIn.duration(500)}
              source={{ uri: imageUrl }}
              style={styles.imageCard}
              onLoad={() => handleOnLoaded()}
            />
          </Zoomable>
          {!isLoaded && (
            <ActivityIndicator
              size="large"
              color={Colors.input}
              style={StyleSheet.absoluteFill}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <GlassyButton animationDelay={1} icon={X} buttonFn={router.back} />
          <GlassyButton
            animationDelay={2}
            icon={Download}
            buttonFn={SaveImage}
          />
          <GlassyButton animationDelay={3} icon={Forward} />
        </View>
      </View>
      {/* <Button title="Back" onPress={() => router.back()} /> */}
    </BlurView>
  );
};

export default ImageViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: "100%",
    height: "70%",
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  imageCard: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    contentFit: "cover",
  },
});
