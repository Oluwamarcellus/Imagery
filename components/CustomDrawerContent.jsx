import Colors from "@constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { StyleSheet, Text } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      {/** Header */}
      <Text style={styles.headerTitle}>Imagery</Text>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: wp("10%"),
    fontWeight: "500",
    color: Colors.dark,
    marginBottom: 15,
  },
});
