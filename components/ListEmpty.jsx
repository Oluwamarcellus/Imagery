import { ActivityIndicator, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";

const ListEmpty = (isFirstFetch) => {
  return isFirstFetch ? (
    <View
      style={{
        flex: 1,
      }}
    >
      <ActivityIndicator
        size="large"
        style={{ marginTop: heightPercentageToDP("25%") }}
      />
    </View>
  ) : null;
};

export default ListEmpty;
