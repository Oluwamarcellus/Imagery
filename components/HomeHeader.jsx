import Colors from "@constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";
import { widthPercentageToDP } from "react-native-responsive-screen";

const HomeHeader = ({ padding, isSheetOpen, bottomSheetRef }) => {
  const [headerInputFocused, setHeaderInputFocused] = useState(false);
  const [headerInput, setHeaderInput] = useState("");
  const [filterCategory, setFilterCategory] = useState([
    "all",
    "backgrounds",
    "nature",
    "people",
    "architecture",
    "food",
    "business",
  ]);
  const [filterCategoryActive, setFilterCategoryActive] = useState("all");

  const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
  const AnimatedView = Animated.createAnimatedComponent(View);

  const bottomSheetToggler = () => {
    isSheetOpen.current
      ? bottomSheetRef.current?.close()
      : bottomSheetRef.current?.expand();
  };

  return (
    <View style={{ paddingHorizontal: padding / 5 }}>
      {/* SEARCH BAR */}
      <View style={styles.headerContainer}>
        {!headerInputFocused && headerInput.length === 0 && (
          <AnimatedIonicons
            entering={FadeIn.duration(300)}
            exiting={FadeOutLeft.duration(200)}
            name="search"
            size={22}
            color={Colors.grey}
            style={styles.headerInputIcon}
          />
        )}
        <AnimatedTextInput
          entering={FadeInRight.duration(500)}
          placeholder={headerInputFocused ? "" : "Search for photos"}
          placeholderTextColor={Colors.lightGrey}
          style={[
            styles.headerTextInput,
            {
              paddingLeft:
                !headerInputFocused && headerInput.length === 0 ? 22 : 5,
            },
          ]}
          onFocus={() => setHeaderInputFocused(true)}
          onBlur={() => setHeaderInputFocused(false)}
          value={headerInput}
          onChangeText={setHeaderInput}
        />
        <TouchableOpacity onPress={() => bottomSheetToggler()}>
          <SlidersHorizontal size={22} color={Colors.grey} />
        </TouchableOpacity>
      </View>

      {/* CATEGORY */}
      <ScrollView
        horizontal
        contentContainerStyle={{
          gap: 10,
          marginBottom: 10,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {filterCategory.map((category, index) => (
          <AnimatedView
            entering={FadeInRight.duration(200).delay(100 * index)}
            key={category}
            style={[
              styles.categoryCard,
              {
                backgroundColor:
                  filterCategoryActive === category
                    ? Colors.dark
                    : Colors.input,
              },
            ]}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setFilterCategoryActive(category)}
            >
              <Text
                style={{
                  color:
                    filterCategoryActive === category
                      ? Colors.background
                      : Colors.grey,
                  fontSize: widthPercentageToDP("4%"),
                  fontWeight: "500",
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          </AnimatedView>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    borderRadius: 15,
    backgroundColor: Colors.input,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTextInput: {
    fontSize: 18,
    flex: 1,
    color: Colors.grey,
  },
  headerInputIcon: {
    position: "absolute",
    left: 10,
  },
  categoryCard: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
});
