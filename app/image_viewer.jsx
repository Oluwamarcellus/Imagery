import { CustomToastError, CustomToastSuccess } from "@components/CustomToast";
import CustomZoomableImage from "@components/CustomZoomableImage";
import GlassyButton from "@components/GlassyButton";
import Colors from "@constants/Colors";
import { BlurView } from "expo-blur";
import { Directory, File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { Download, Forward, X } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Toast from "react-native-toast-message";

const ImageViewer = () => {
  const router = useRouter();
  const imageUrl = useLocalSearchParams().imageUrl;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleOnLoaded = () => {
    if (isLoaded) return;
    setIsLoaded(true);
  };

  const toastConfig = {
    success_custom: (props) => <CustomToastSuccess {...props} />,
    error_custom: (props) => <CustomToastError {...props} />,
  };

  const commonToastProps = {
    position: "bottom",
    autoHide: true,
    visibilityTime: 2000,
    bottomOffset: heightPercentageToDP("8%"),
    onPress: () => Toast.hide(),
    swipeable: true,
  };

  const shareImage = async () => {
    setIsSharing(true);
    let imageName = Date.now().toString() + ".jpg";
    if (!(await Sharing.isAvailableAsync())) {
      Toast.show({
        type: "error_custom",
        text1: "Sharing is not available",
        ...commonToastProps,
      });
      return;
    }
    try {
      // Creating a directory
      const dir = new Directory(Paths.cache, "my-photos");
      if (!dir.exists) {
        dir.create();
      }
      const fileDir = new File(dir, imageName);

      // Downloading the image
      const file = await File.downloadFileAsync(imageUrl, fileDir, {
        idempotent: true,
      });

      // Sharing the image
      await Sharing.shareAsync(file.uri);
      // Deleting the file from filesystem
      fileDir.delete();
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error_custom",
        text1: "Error sharing file",
        ...commonToastProps,
      });
    } finally {
      setIsSharing(false);
    }
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

      // Toast a message on download
      Toast.show({
        type: "success_custom",
        text1: "Image saved",
        ...commonToastProps,
      });
      // Deleting the file from filesystem
      fileDir.delete();
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error_custom",
        text1: "Failed to save image",
        ...commonToastProps,
      });
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
            isLoading={isDownloading}
          />
          <GlassyButton
            animationDelay={3}
            icon={Forward}
            buttonFn={shareImage}
            isLoading={isSharing}
          />
        </View>
      </View>
      <Toast config={toastConfig} />
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
