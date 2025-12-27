import Colors from "@constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { widthPercentageToDP } from "react-native-responsive-screen";

const FilterOption = ({
  name,
  options,
  selected,
  manageFilter,
  isColorType,
  index,
}) => {
  const AnimatedView = Animated.createAnimatedComponent(View);
  return (
    <AnimatedView
      entering={FadeInDown.duration(200)
        .delay(100 * index)
        .springify()
        .damping(30)
        .stiffness(80)
        .mass(0.8)}
      style={{ marginTop: 12 }}
    >
      <Text style={styles.categoryTitle}>
        {name !== "image_type"
          ? `${name[0].toUpperCase()}${name.slice(1)}`
          : "Type"}
      </Text>
      <View
        style={[
          {
            flexDirection: "row",
            gap: 8,
            flexWrap: "wrap",
          },
        ]}
      >
        {options.map((option) => (
          <TouchableOpacity
            activeOpacity={0.9}
            key={option}
            style={[
              styles.categoryCard,
              isColorType && {
                height: 35,
                width: 45,
                borderWidth: 2.5,
                borderColor: Colors.input,
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              },
              !isColorType && {
                padding: 6,
              },
              selected === option.toLowerCase() &&
                !isColorType && {
                  backgroundColor: Colors.tint,
                },
              selected === option.toLowerCase() &&
                isColorType && { borderColor: Colors.tint },
            ]}
            onPress={() => manageFilter(name, option)}
          >
            {isColorType ? (
              <View
                style={[
                  {
                    flex: 1,
                    height: "100%",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: option.toLowerCase(),
                  },
                  selected === option.toLowerCase() && { opacity: 0.8 },
                ]}
              >
                {option.toLowerCase() === "transparent" && (
                  <Image
                    source={require("@assets/images/transparent.webp")}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      contentFit: "cover",
                    }}
                  />
                )}
                <Ionicons
                  name={`${
                    selected === option.toLowerCase() ? "add-outline" : ""
                  }`}
                  size={30}
                  color={Colors.tint}
                />
              </View>
            ) : (
              <Text
                style={[
                  styles.optionTitle,
                  selected === option.toLowerCase() && {
                    color: "#fff",
                  },
                ]}
              >
                {option}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </AnimatedView>
  );
};

export default FilterOption;

const styles = StyleSheet.create({
  categoryTitle: {
    fontSize: widthPercentageToDP("4%"),
    fontWeight: "500",
    color: Colors.dark,
    marginBottom: 5,
  },
  optionTitle: {
    color: Colors.lightGrey,
    fontSize: widthPercentageToDP("3.5%"),
    fontWeight: "500",
  },
  categoryCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
});
