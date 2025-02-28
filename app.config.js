const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  name: IS_DEV ? "FoodNet-DEV" : "FoodNet",
  slug: "foodnet-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./app/assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./app/assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#CC7638",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV ? "com.futureworkshosp.foodnet.dev" : "com.futureworkshosp.foodnet",
  },
  android: {
    package: IS_DEV ? "com.futureworkshosp.foodnet.dev" : "com.futureworkshosp.foodnet",
    adaptiveIcon: {
      foregroundImage: "./app/assets/adaptive-icon.png",
      backgroundColor: "#CC7638",
    },
    icon: "./app/assets/icon.png",
  },
  web: {
    favicon: "./app/assets/favicon.png",
  },
  plugins: ["expo-sqlite"],
  extra: {
    eas: {
      projectId: "c6ad181a-46d1-4fe3-9e51-291f4cad2dfd",
    },
  },
};
