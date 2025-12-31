import Colors from "@constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, ZoomOut } from "react-native-reanimated";
import { widthPercentageToDP } from "react-native-responsive-screen";

const HeaderPanel = ({ listRef, padding }) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, { paddingHorizontal: padding / 2 }]}>
      {/* Header Left */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          listRef.current?.scrollTo({
            y: 0,
            animated: true,
          })
        }
      >
        <Animated.Text
          exiting={ZoomOut.duration(200)}
          entering={FadeIn.duration(200)}
          style={styles.headerLeft}
        >
          Imagery
        </Animated.Text>
      </TouchableOpacity>

      {/* Header Right */}
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Ionicons
          name="menu"
          size={30}
          color={Colors.dark}
          style={styles.headerRight}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderPanel;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  headerLeft: {
    fontSize: widthPercentageToDP("9%"),
    fontWeight: "500",
    color: Colors.dark,
    marginLeft: 5,
  },
  headerRight: {
    fontSize: widthPercentageToDP("8%"),
    color: Colors.dark,
    marginRight: 5,
  },
});
