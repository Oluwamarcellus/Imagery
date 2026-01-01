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
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";
import { widthPercentageToDP } from "react-native-responsive-screen";

const HomeHeader = ({
  padding,
  bottomSheetRef,
  setQueries,
  categories,
  activeCategory,
  filterCount,
  setSheetRender,
  setLoading,
  drawerInput,
}) => {
  const [headerInputFocused, setHeaderInputFocused] = useState(false);
  const [headerInput, setHeaderInput] = useState("");
  const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
  const AnimatedView = Animated.createAnimatedComponent(View);
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  const bottomSheetToggler = () => {
    bottomSheetRef.current?.expand();
    setSheetRender((prev) => !prev);
  };

  const handleOnInputExit = () => {
    setHeaderInputFocused(false);
  };

  const headerInputHandler = (text) => {
    setHeaderInput(text);
    setQueries((prev) => ({ ...prev, q: text }));
  };

  const manageCategorySwitch = (category) => {
    setLoading(true);
    if (category !== "all")
      setQueries((prev) => ({ ...prev, category: category }));
    else {
      const fn = (queries) => {
        const { category: _, ...rest } = queries;
        return rest;
      };
      setQueries((prev) => fn(prev));
    }
  };

  return (
    <View style={{ paddingHorizontal: padding / 5 }}>
      {/* SEARCH BAR */}
      <View style={styles.headerContainer}>
        {!headerInputFocused && headerInput.length === 0 && (
          <AnimatedIonicons
            entering={FadeInLeft.duration(300)}
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
          onBlur={() => handleOnInputExit()}
          value={drawerInput ?? headerInput}
          onChangeText={headerInputHandler}
        />
        <AnimatedTouchableOpacity
          entering={FadeInRight.duration(300)}
          onPress={() => bottomSheetToggler()}
        >
          {filterCount > 0 && (
            <Text style={styles.filterCount}>{filterCount}</Text>
          )}
          <SlidersHorizontal size={22} color={Colors.grey} />
        </AnimatedTouchableOpacity>
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
        {categories.map((category, index) => (
          <AnimatedView
            entering={FadeInRight.duration(200).delay(100 * index)}
            key={category}
            style={[
              styles.categoryCard,
              {
                backgroundColor:
                  activeCategory === category ? Colors.dark : Colors.input,
              },
            ]}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => manageCategorySwitch(category)}
            >
              <Text
                style={{
                  color:
                    activeCategory === category
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
  filterCount: {
    position: "absolute",
    right: 0,
    top: -5,
    backgroundColor: Colors.tint,
    color: Colors.input,
    width: 15,
    height: 15,
    borderRadius: 50,
    textAlign: "center",
    zIndex: 2,
  },
});
