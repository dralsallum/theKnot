// TabNavigator.js
import React from "react";
import { useWindowDimensions, Platform } from "react-native";
import { Tabs } from "expo-router";
import styled, { ThemeProvider } from "styled-components/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Replace with your own icons
import { icons } from "../../constants";

const theme = {
  colors: {
    activeTint: "#FF4081",
    inactiveTint: "#666e7e",
    background: "#ffffff",
    borderTop: "#b2b2b2",
    shadow: "#000",
    textActive: "#FF4081",
    textInactive: "#666e7e",
  },
  sizes: {
    tabBarHeight: 65,
    tabBarHeightTablet: 90,
    paddingTop: 8,
    paddingTopTablet: 12,
    paddingBottom: 8,
    paddingBottomTablet: 12,
    iconSize: 24,
    iconSizeTablet: 32,
    fontSize: 11,
    fontSizeTablet: 13,
    fontWeightActive: "600",
    fontWeightInactive: "400",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  spacing: {
    gap: 4,
  },
  fonts: {
    primary: "System",
  },
};

// Tab Icon Component for each tab
const TabIcon = ({ icon, name, focused, isTablet, color }) => (
  <IconContainer>
    <StyledImage source={icon} isTablet={isTablet} tintColor={color} />
    <StyledText
      focused={focused}
      isTablet={isTablet}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {name}
    </StyledText>
  </IconContainer>
);

// Main Tab Navigator
const TabNavigator = () => {
  const { width, height } = useWindowDimensions();

  // Determine if the device is a tablet based on screen dimensions
  const isTablet =
    Platform.OS === "ios"
      ? width >= 768 && height >= 1024
      : width >= 600 && height >= 960;

  const tabBarOptions = {
    tabBarShowLabel: false,
    tabBarActiveTintColor: theme.colors.activeTint,
    tabBarInactiveTintColor: theme.colors.inactiveTint,
    tabBarStyle: {
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderTop,
      height: isTablet
        ? theme.sizes.tabBarHeightTablet
        : theme.sizes.tabBarHeight,
      paddingTop: isTablet
        ? theme.sizes.paddingTopTablet
        : theme.sizes.paddingTop,
      paddingBottom: isTablet
        ? theme.sizes.paddingBottomTablet
        : theme.sizes.paddingBottom,
      shadowColor: theme.colors.shadow,
      shadowOffset: theme.sizes.shadowOffset,
      shadowOpacity: theme.sizes.shadowOpacity,
      shadowRadius: theme.sizes.shadowRadius,
      elevation: theme.sizes.elevation,
    },
  };

  const screens = [
    {
      name: "home",
      title: "الرئيسية",
      icon: icons.home,
    },
    {
      name: "creative",
      title: "قاعات",
      icon: icons.words,
    },
    {
      name: "planning",
      title: "التخطيط",
      icon: icons.stories,
    },
    {
      name: "stories",
      title: "المتجر",
      icon: icons.stories,
    },
    {
      name: "profile",
      title: "الملف الشخصي",
      icon: icons.profile,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
          <Tabs screenOptions={tabBarOptions}>
            {screens.map(({ name, title, icon }) => (
              <Tabs.Screen
                key={name}
                name={name}
                options={{
                  title,
                  headerShown: false,
                  tabBarIcon: ({ color, focused }) => (
                    <TabIcon
                      icon={icon}
                      color={color}
                      name={title}
                      focused={focused}
                      isTablet={isTablet}
                    />
                  ),
                }}
              />
            ))}
          </Tabs>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default TabNavigator;

// Styled Components
const IconContainer = styled.View`
  justify-content: center;
  align-items: center;
  gap: ${(props) => props.theme.spacing.gap}px;
  flex-direction: column;
  flex: 1;
  width: 100%;
`;

const StyledImage = styled.Image.attrs((props) => ({
  tintColor: props.tintColor,
  resizeMode: "contain",
}))`
  width: ${(props) =>
    props.isTablet
      ? props.theme.sizes.iconSizeTablet
      : props.theme.sizes.iconSize}px;
  height: ${(props) =>
    props.isTablet
      ? props.theme.sizes.iconSizeTablet
      : props.theme.sizes.iconSize}px;
`;

const StyledText = styled.Text`
  width: 300%;
  font-size: ${(props) =>
    props.isTablet
      ? props.theme.sizes.fontSizeTablet
      : props.theme.sizes.fontSize}px;
  font-weight: ${(props) =>
    props.focused
      ? props.theme.sizes.fontWeightActive
      : props.theme.sizes.fontWeightInactive};
  text-align: center;
  color: ${(props) =>
    props.focused
      ? props.theme.colors.textActive
      : props.theme.colors.textInactive};
  font-family: ${(props) => props.theme.fonts.primary};
`;
