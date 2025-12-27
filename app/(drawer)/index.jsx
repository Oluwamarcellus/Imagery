import CustomBottomSheetBackdrop from "@components/CustomBottomSheetBackdrop";
import HomeHeader from "@components/HomeHeader";
import ImageCard from "@components/ImageCard";
import ListEmpty from "@components/ListEmpty";
import SheetView from "@components/SheetView";
import Colors from "@constants/Colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useDrawerStatus } from "@react-navigation/drawer";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut, ZoomOut } from "react-native-reanimated";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const index = () => {
  // Hooks and States
  const [photos, setPhotos] = useState([]);
  const [queries, setQueries] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [numOfColumns, setNumOfColumns] = useState(3);
  const [numPhotosPerPage, setNumPhotosPerPage] = useState(50);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["60%"], []);
  const reloadTriggered = useRef(false);
  const page = useRef(1);
  const listRef = useRef(null);
  const [sheetRender, setSheetRender] = useState(false);

  const router = useRouter();
  const isDrawerOpen = useDrawerStatus() === "open";

  // Constants
  const padding = 10;
  const categories = [
    "all",
    "backgrounds",
    "fashion",
    "nature",
    "science",
    "education",
    "feelings",
    "health",
    "people",
    "religion",
    "places",
    "animals",
    "industry",
    "computer",
    "food",
    "sports",
    "transportation",
    "travel",
    "buildings",
    "business",
    "music",
  ];

  // USE-EFFECTS
  useEffect(() => {
    // Fethc Photos with debouncing
    let timer = setTimeout(() => {
      fetchPhotos({ rawFetch: true });
    }, 500);
    return () => clearTimeout(timer);
  }, [queries]);

  // Functions
  const fetchPhotos = async (
    { append, rawFetch } = { append: false, rawFetch: false }
  ) => {
    try {
      setLoading(true);
      rawFetch ? (page.current = 1) : page.current++;
      const url = queryResolve();
      const response = await fetch(url);
      const data = await response.json();
      isFirstFetch && setIsFirstFetch(false);
      append
        ? setPhotos((prev) => [...prev, ...data.hits])
        : setPhotos([...data.hits]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const queryResolve = () => {
    const api_key = process.env.EXPO_PUBLIC_PIXABAY_API;
    let api = `https://pixabay.com/api/?key=${api_key}&page=${page.current}&per_page=${numPhotosPerPage}`;
    Object.entries(queries).forEach(([key, value]) => {
      api = api + `&${key}=${key !== "q" ? value : encodeURIComponent(value)}`;
    });
    return api;
  };

  const handleSheetChanges = useCallback((index) => {
    // Force close the sheet
    index === 0 && bottomSheetRef.current?.close();
  }, []);

  const getTotalFilters = () => {
    let total = 0;
    Object.keys(queries).forEach((key) => {
      if (key !== "category" && key !== "q") total++;
    });
    return total;
  };

  const handlePagination = async (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollY = Math.floor(event.nativeEvent.contentOffset.y);

    const totalScrollableHeight = Math.floor(contentHeight - screenHeight);

    const reloadThreshold = 500;

    if (
      scrollY + reloadThreshold >= totalScrollableHeight &&
      !reloadTriggered.current
    ) {
      reloadTriggered.current = true;
      setIsLoadingMore(true);

      fetchPhotos({ append: true }).finally(() => {
        setTimeout(() => (reloadTriggered.current = false), 500);
        setIsLoadingMore(false);
      });
    }
  };

  const AnimatedView = Animated.createAnimatedComponent(View);

  return (
    <View style={styles.container}>
      {/** Programatically set headerLeft  */}
      <Drawer.Screen
        options={{
          headerLeft: () => {
            return isDrawerOpen ? null : (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  listRef.current?.scrollToOffset({
                    offset: 0,
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
            );
          },
        }}
      />

      {/* Loader for Fetching */}
      {loading && !isFirstFetch && !isLoadingMore && (
        <AnimatedView
          style={{
            position: "absolute",
            right: 0,
            left: 0,
            zIndex: 10,
            top: heightPercentageToDP("10%"),
            justifyContent: "center",
            flexDirection: "row",
          }}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(1000)}
        >
          <ActivityIndicator
            size="small"
            style={{
              borderRadius: 100,
              backgroundColor: Colors.tint,
              alignSelf: "center",
              padding: 6,
            }}
            color={"fff"}
          />
        </AnimatedView>
      )}

      {/* PHOTOS SECTION */}
      <FlashList
        data={photos}
        numColumns={numOfColumns}
        keyExtractor={(item) => item.id.toString()}
        masonry={true}
        onScroll={handlePagination}
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
        ref={listRef}
        contentContainerStyle={{
          paddingHorizontal: padding / 2,
          paddingBottom: 30,
        }}
        ListEmptyComponent={<ListEmpty isFirstFetch={isFirstFetch} />}
        ListFooterComponent={
          isLoadingMore &&
          !isFirstFetch && (
            <ActivityIndicator
              size="large"
              style={{ marginTop: 10, color: Colors.dark }}
            />
          )
        }
        ListHeaderComponent={
          <HomeHeader
            padding={padding}
            bottomSheetRef={bottomSheetRef}
            setQueries={setQueries}
            categories={categories}
            activeCategory={queries["category"] || "all"}
            filterCount={getTotalFilters()}
            setSheetRender={setSheetRender}
            setLoading={setLoading}
          />
        }
        renderItem={({ item }) => (
          <ImageCard photo={item} padding={padding} router={router} />
        )}
      />

      {/* FILTER BOTTOM SHEET MODAL*/}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        enableOverDrag={false}
        backdropComponent={(props) => <CustomBottomSheetBackdrop {...props} />}
      >
        <BottomSheetView style={{ padding: 20 }}>
          <SheetView
            key={sheetRender}
            setQueries={setQueries}
            bottomSheetRef={bottomSheetRef}
            setLoading={setLoading}
          />
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
