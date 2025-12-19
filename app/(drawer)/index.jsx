import HomeHeader from "@components/HomeHeader";
import Colors from "@constants/Colors";
import Photos from "@constants/Photos";
import { useDrawerStatus } from "@react-navigation/drawer";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import Drawer from "expo-router/drawer";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, ZoomOut } from "react-native-reanimated";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const index = () => {
  const [photos, setPhotos] = useState(Photos);
  const [numOfColumns, setNumOfColumns] = useState(3);
  const [padding, setPadding] = useState(10);

  const isDrawerOpen = useDrawerStatus() === "open";
  const apiKey = process.env.EXPO_PUBLIC_PIXABAY_API;

  // check if image is portrait within thr FlashList renderItem
  const isPortrait = (item) => {
    return item.webformatHeight > item.webformatWidth;
  };

  const isFirstColumn = (index) => {
    return index % 2 === 0;
  };

  const testApi = async () => {
    const api = `https://pixabay.com/api/?key=${apiKey}`;
    const response = await fetch(api);
    const data = await response.json();
    console.log(data);
  };

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

      {/* HEADER */}

      {/* PHOTOS */}
      <FlashList
        data={photos}
        numColumns={numOfColumns}
        keyExtractor={(item) => item.id}
        masonry={true}
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          paddingHorizontal: padding / 2,
        }}
        ListHeaderComponent={() => <HomeHeader padding={padding} />}
        renderItem={({ item }) => (
          <View
            style={{
              borderRadius: 5,
              overflow: "hidden",
              flex: 1,
              margin: padding / 5,
              marginBottom: padding / 5,
              height: isPortrait(item)
                ? heightPercentageToDP("25%")
                : heightPercentageToDP("22%"),
            }}
          >
            <Image
              source={{ uri: item.webformatURL }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
              transition={400}
            />
          </View>
        )}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: heightPercentageToDP("12%"),
  },
  headerLeft: {
    fontSize: widthPercentageToDP("9%"),
    fontWeight: "500",
    color: Colors.dark,
    marginLeft: 5,
  },
});
