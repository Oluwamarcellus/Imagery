import FilterOption from "@components/FilterOption";
import Colors from "@constants/Colors";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";

const BottomSheet = ({ setQueries, bottomSheetRef }) => {
  const [filters, setFilters] = useState({});

  const filterItems = {
    order: ["Popular", "Latest"],
    orientation: ["Horizontal", "Vertical"],
    image_type: ["Photo", "Illustration", "Vector"],
    colors: [
      "transparent",
      "red",
      "orange",
      "yellow",
      "green",
      "turquoise",
      "blue",
      "pink",
      "white",
      "gray",
      "black",
      "brown",
    ],
  };

  const manageFilter = (filterEntry, option) => {
    const optionLowerCase = option.toLowerCase();
    const filterEntryLowerCase = filterEntry.toLowerCase();

    if (
      filters[filterEntryLowerCase] &&
      filters[filterEntryLowerCase] === optionLowerCase
    ) {
      const { [filterEntryLowerCase]: _, ...rest } = filters;
      setFilters(rest);
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterEntryLowerCase]: optionLowerCase,
      }));
    }
  };

  const applyFilter = () => {
    const fn = (prev) => {
      let prevFilters = { ...prev, ...filters };
      const keys = Object.keys(prevFilters);
      keys.forEach((key) => {
        if (key !== "category" && key !== "q" && !filters[key]) {
          const { [key]: _, ...rest } = prevFilters;
          prevFilters = rest;
        }
      });

      return prevFilters;
    };

    setQueries((prev) => fn(prev));
  };

  const handleReset = () => {
    const fn = (prev) => {
      let prevFilters = { ...prev };
      const keys = Object.keys(prevFilters);
      keys.forEach((key) => {
        if (key !== "category" && key !== "q") {
          const { [key]: _, ...rest } = prevFilters;
          prevFilters = rest;
        }
      });

      return prevFilters;
    };

    bottomSheetRef.current?.close();
    setFilters({});
    setQueries((prev) => fn(prev));
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Filters</Text>
      {/* FILTER OPTIONS */}
      {Object.keys(filterItems).map((item) => (
        <FilterOption
          key={item}
          name={item}
          options={filterItems[item]}
          manageFilter={manageFilter}
          selected={filters[item] || ""}
          isColorType={item === "colors"}
        />
      ))}

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity style={styles.button} onPress={() => handleReset()}>
          <Text style={[styles.buttonTitle]}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.dark }]}
          onPress={() => {
            applyFilter();
            bottomSheetRef.current?.close();
          }}
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
