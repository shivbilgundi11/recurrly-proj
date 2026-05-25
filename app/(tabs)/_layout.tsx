import { tabs } from "@/constants/data";
import { colors, components } from "@/constants/theme";
import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabBar = components.tabBar;

const TabLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();
  const dockBottom =
    tabBar.bottomOffset + Math.max(insets.bottom - tabBar.safeAreaOverlap, 0);

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const TabIcon = ({ focused, icon }: TabIconProps) => {
    return (
      <View style={styles.iconSlot}>
        <View style={[styles.iconFrame, focused && styles.activeIconFrame]}>
          <Image source={icon} resizeMode="contain" style={styles.iconGlyph} />
        </View>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: dockBottom,
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          paddingHorizontal: tabBar.horizontalPadding,
          borderRadius: tabBar.radius,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          flex: 1,
          height: tabBar.height,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 0,
        },
        tabBarIconStyle: {
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      {tabs &&
        tabs.map((tab) => {
          return (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                title: tab.title,
                tabBarIcon: ({ focused }) => (
                  <TabIcon focused={focused} icon={tab.icon} />
                ),
              }}
            />
          );
        })}
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  iconSlot: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconFrame: {
    width: tabBar.iconFrame,
    height: tabBar.iconFrame,
    borderRadius: tabBar.iconFrame / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconFrame: {
    backgroundColor: colors.accent,
  },
  iconGlyph: {
    width: tabBar.glyphSize,
    height: tabBar.glyphSize,
  },
});
