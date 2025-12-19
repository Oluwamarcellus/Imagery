import HomeHeader from "@components/HomeHeader";
import SheetView from "@components/SheetView";
import Colors from "@constants/Colors";
import Photos from "@constants/Photos";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useDrawerStatus } from "@react-navigation/drawer";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import Drawer from "expo-router/drawer";
import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, ZoomOut } from "react-native-reanimated";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const index = () => {
  // Hooks and States
  const [photos, setPhotos] = useState(Photos);
  const [numOfColumns, setNumOfColumns] = useState(3);
  const [padding, setPadding] = useState(10);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["60%"], []);
  const isSheetOpen = useRef(false);
  const isDrawerOpen = useDrawerStatus() === "open";

  // Constants
  const apiKey = process.env.EXPO_PUBLIC_PIXABAY_API;

  // Functions
  const handleSheetChanges = useCallback((index) => {
    // console.log(index);
    index >= 0 ? (isSheetOpen.current = true) : (isSheetOpen.current = false);

    // Force close the sheet
    index === 0 && bottomSheetRef.current?.close();
  }, []);

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
      {/** Programatically set headerLeft  */}
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

      {/* * Activates when filter panel opens
      {isSheetOpen && (
        <BlurView
          tint="light"
          intensity={10}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}
        />
      )} */}

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
        ListHeaderComponent={() => (
          <HomeHeader
            padding={padding}
            isSheetOpen={isSheetOpen}
            bottomSheetRef={bottomSheetRef}
          />
        )}
        renderItem={({ item }) => (
          <View
            style={{
              borderRadius: 5,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: Colors.input,
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
                contentFit: "cover",
              }}
              transition={400}
            />
          </View>
        )}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        enableOverDrag={false}
      >
        <BottomSheetView style={{ padding: 20 }}>
          <SheetView />
        </BottomSheetView>
      </BottomSheet>
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
