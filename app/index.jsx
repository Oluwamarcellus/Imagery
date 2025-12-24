import WelcomeImg from "@assets/images/welcome.webp";
import Colors from "@constants/Colors";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const index = () => {
  const AnimatedLinearGradient =
    Animated.createAnimatedComponent(LinearGradient);
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  const router = useRouter();

  return (
    <View>
      <Image
        source={WelcomeImg}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      <StatusBar hidden />

      <AnimatedLinearGradient
        entering={FadeInDown.duration(500)}
        colors={[
          "rgba(255, 255, 255, 0)",

          "rgba(255, 255, 255, 0.8)",
          "rgba(255, 255, 255)",
        ]}
        style={styles.container}
      >
        <Animated.Text
          entering={FadeInDown.delay(200)
            .springify()
            .damping(12)
            .stiffness(100)
            .mass(1.5)}
          style={styles.title}
        >
          Imagery
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(300)
            .springify()
            .damping(12)
            .stiffness(100)
            .mass(1.5)}
          style={styles.subTitle}
        >
          Every Image Tells a Story
        </Animated.Text>

        <AnimatedTouchableOpacity
          onPress={() => {
            router.replace("/(drawer)");
          }}
          entering={FadeInDown.delay(400)
            .springify()
            .damping(12)
            .stiffness(100)
            .mass(1.5)}
          style={styles.button}
        >
          <Text style={styles.buttonTitle}>Explore</Text>
        </AnimatedTouchableOpacity>
      </AnimatedLinearGradient>
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
    paddingHorizontal: wp("20%"),
    paddingBottom: hp("5%"),
    justifyContent: "flex-end",
    alignItems: "center",
  },
  title: {
    fontSize: wp("15%"),
    fontWeight: "500",
    color: Colors.dark,
    marginBottom: 2,
  },
  subTitle: {
    fontSize: wp("4%"),
    fontWeight: "500",
    color: Colors.dark,
  },
  button: {
    backgroundColor: Colors.dark,
    width: "100%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginTop: 30,
  },
  buttonTitle: {
    color: "white",
    fontSize: wp("4.5%"),
    fontWeight: "500",
  },
});
