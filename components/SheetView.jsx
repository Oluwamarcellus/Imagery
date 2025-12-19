import FilterOption from "@components/FilterOption";
import Colors from "@constants/Colors";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { widthPercentageToDP } from "react-native-responsive-screen";

const BottomSheet = () => {
  const [filterOptions, setFilterOptions] = useState({
    order: ["Popular", "Latest"],
    orientation: ["Horizontal", "Vertical"],
    type: ["Photo", "Illustration", "Vector"],
    colors: [
      "Red",
      "Green",
      "Blue",
      "Yellow",
      "Black",
      "White",
      "Gray",
      "Orange",
      "Purple",
      "Pink",
    ],
  });

  const AnimatedView = Animated.createAnimatedComponent(View);

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Filters</Text>
      {/* FILTER OPTIONS */}
      <FilterOption name="Order" options={filterOptions.order} />
      <FilterOption name="Orientation" options={filterOptions.orientation} />
      <FilterOption name="Type" options={filterOptions.type} />
      <FilterOption
        name="Colors"
        options={filterOptions.colors}
        isColorType={true}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity style={styles.button}>
          <Text style={[styles.buttonTitle]}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.dark }]}
        >
          <Text style={[styles.buttonTitle, { color: Colors.input }]}>
            Apply
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: Colors.dark,
    fontWeight: "500",
  },
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
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    gap: 5,
    borderRadius: 10,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    marginTop: 40,
  },
  buttonTitle: {
    fontSize: widthPercentageToDP("4.5%"),
    fontWeight: "400",
  },
});
