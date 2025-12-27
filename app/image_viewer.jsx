import CustomZoomableImage from "@components/CustomZoomableImage";
import GlassyButton from "@components/GlassyButton";
import Colors from "@constants/Colors";
import { BlurView } from "expo-blur";
import { Directory, File, Paths } from "expo-file-system";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Download, Forward, X } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { heightPercentageToDP } from "react-native-responsive-screen";

const ImageViewer = () => {
  const router = useRouter();
  const imageUrl = useLocalSearchParams().imageUrl;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const AnimatedImage = Animated.createAnimatedComponent(Image);

  const handleOnLoaded = () => {
    if (isLoaded) return;
    setIsLoaded(true);
  };

  const SaveImage = async () => {
    setIsDownloading(true);
    let imageName = Date.now().toString() + ".jpg";
    try {
      // Creating a directory
      const dir = new Directory(Paths.cache, "my-photos");
      if (!dir.exists) {
        dir.create();
      }

      imageName += ".jpg";
      const fileDir = new File(dir, imageName);

      // Downloading the image
      const file = await File.downloadFileAsync(imageUrl, fileDir, {
        idempotent: true,
      });

      // Saving to the gallery
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        return Alert.alert("Permission not granted");
      }
      await MediaLibrary.saveToLibraryAsync(file.uri);
    } catch (err) {
      console.error(err);
      Alert.alert("Failed to save image");
    } finally {
      setIsDownloading(false);
    }
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

          <CustomZoomableImage
            imageUrl={imageUrl}
            handleOnLoaded={handleOnLoaded}
          />

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
            isDownloading={isDownloading}
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
