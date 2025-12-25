import GlassyButton from "@components/GlassyButton";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Download, Forward, X } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";

const ImageViewer = () => {
  const router = useRouter();
  const imageUrl = useLocalSearchParams().imageUrl;
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
          <ImageZoom
            source={{ uri: imageUrl }}
            resizeMode="cover"
            minScale={1}
            maxScale={3}
            doubleTapScale={2}
            isDoubleTapEnabled
            style={styles.imageCard}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <GlassyButton icon={X} buttonFn={() => router.back()} />
          <GlassyButton icon={Download} />
          <GlassyButton icon={Forward} />
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
  },
});
