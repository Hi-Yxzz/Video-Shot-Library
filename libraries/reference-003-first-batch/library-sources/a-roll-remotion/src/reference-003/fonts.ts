import { loadFont as loadNotoSansSC } from "@remotion/google-fonts/NotoSansSC";
import { loadFont as loadNotoSerifSC } from "@remotion/google-fonts/NotoSerifSC";

const { fontFamily: R03_SANS } = loadNotoSansSC("normal", {
  subsets: ["chinese-simplified", "latin"],
  weights: ["400", "600", "700", "800"],
});

const { fontFamily: R03_SERIF } = loadNotoSerifSC("normal", {
  subsets: ["chinese-simplified", "latin"],
  weights: ["600"],
});

export { R03_SANS, R03_SERIF };
