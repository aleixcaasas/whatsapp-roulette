import { StyleSheet } from "react-native";

import { COLORS, SIZES } from "../../../constants";
import { isSearchBarAvailableForCurrentPlatform } from "react-native-screens";

const styles = StyleSheet.create({
  btnContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small / 1.25,
    justifyContent: "center",
    alignItems: "center",
  },
  btnImg: (dimension) => ({
    width: dimension,
    height: dimension,
    borderRadius: SIZES.small / 1.25,
  }),
  logoImg: () => ({
    width: 300,
    height: 200,
    borderRadius: SIZES.small / 1.25,
  }),
  logoFontStyle: () => ({
    width: 10,
  }),
});

export default styles;
