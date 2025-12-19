import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Drawer from "expo-router/drawer";
import Animated, { FadeIn, ZoomOut } from "react-native-reanimated";
import { useDrawerStatus } from "@react-navigation/drawer";
import Colors from "@constants/Colors";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const Dalle = () => {
  const isDrawerOpen = useDrawerStatus() === "open";

  return (
    <View style={styles.container}>
      <Drawer.Screen
        options={{
          headerLeft: () => {
            return isDrawerOpen ? null : (
              <Animated.Text
                exiting={ZoomOut.duration(200)}
                entering={FadeIn.duration(200)}
                style={styles.headerLeft}
              >
                Imagery
              </Animated.Text>
            );
          },
        }}
      />
      <Text>Dalle</Text>
    </View>
  );
};

export default Dalle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: heightPercentageToDP("12%"),
  },
  headerLeft: {
    fontSize: widthPercentageToDP("9%"),
    fontWeight: "500",
    color: Colors.dark,
    marginLeft: 10,
  },
});
