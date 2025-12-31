import Colors from "@constants/Colors";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const CustomImageViewer = ({ url }) => {
  const [loaded, setLoaded] = useState(false);

  const router = useRouter();

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ width: "100%", height: "100%" }}
        onPress={() => {
          router.push({
            pathname: "/image_viewer",
            params: { imageUrl: url },
          });
        }}
      >
        <Image
          source={{ uri: url }}
          style={{
            width: "100%",
            height: "100%",
            contentFit: "cover",
          }}
          onLoad={() => setLoaded(true)}
        />
      </TouchableOpacity>

      {!loaded && (
        <ActivityIndicator
          size="small"
          color={Colors.dark}
          style={StyleSheet.absoluteFill}
        />
      )}
    </View>
  );
};

export default CustomImageViewer;
