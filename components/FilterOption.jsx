import Colors from "@constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { widthPercentageToDP } from "react-native-responsive-screen";

const FilterOption = ({ name, options, isColorType }) => {
  const AnimatedView = Animated.createAnimatedComponent(View);
  return (
    <AnimatedView
      entering={FadeInRight.duration(200).delay(100)}
      style={{ marginTop: 15 }}
    >
      <Text style={styles.categoryTitle}>{name}</Text>
      <View
        style={[
          { flexDirection: "row", gap: 5, flexWrap: "wrap" },
          isColorType && { gap: 10 },
        ]}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.categoryCard,
              isColorType && {
                backgroundColor: option.toLowerCase(),
                paddingHorizontal: 20,
                paddingVertical: 15,
              },
            ]}
            onPress={() => {}}
          >
            {!isColorType && <Text style={styles.optionTitle}>{option}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </AnimatedView>
  );
};

export default FilterOption;

const styles = StyleSheet.create({
  categoryTitle: {
    fontSize: widthPercentageToDP("5%"),
    fontWeight: "400",
    color: Colors.dark,
    marginBottom: 5,
  },
  optionTitle: {
    color: Colors.lightGrey,
    fontSize: widthPercentageToDP("4%"),
    fontWeight: "500",
  },
  categoryCard: {
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
});
