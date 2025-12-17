import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import WelcomeImg from "@assets/images/welcome.webp";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";

const index = () => {
  return (
    <View>
      <Image
        source={WelcomeImg}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.container}
      >
        <Text>Imagery</Text>
        <Text>Every Image Tells a Story</Text>
      </LinearGradient>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    position: "absolute",
    bottom: 0,
    left: 0,
    height: hp("60%"),
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("5%"),
    justifyContent: "flex-end",
    alignItems: "center",
  },
  title: {},
  subTitle: {},
  button: {},
  buttonTitle: {},
});
