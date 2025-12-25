import Colors from "@constants/Colors";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";

const ImageCard = ({ photo, padding, router }) => {
  const BLURHASH_LOADING = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

  const isPortrait = (photo) => {
    return photo.webformatHeight > photo.webformatWidth;
  };

  return (
    <View
      style={{
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.input,
        overflow: "hidden",
        flex: 1,
        margin: padding / 5,
        marginBottom: padding / 5,
        height: isPortrait(photo)
          ? heightPercentageToDP("25%")
          : heightPercentageToDP("22%"),
      }}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          router.push({
            pathname: "/image_viewer",
            params: { imageUrl: photo.webformatURL },
          })
        }
      >
        <Image
          source={{ uri: photo.webformatURL }}
          transition={300}
          placeholder={{ blurhash: BLURHASH_LOADING }}
          style={{
            width: "100%",
            height: "100%",
            contentFit: "cover",
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ImageCard;
