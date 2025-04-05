import { View, Text } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack, Slot } from "expo-router";

const ScreensLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="medications" options={{ headerShown: false }} />
        <Stack.Screen name="ads" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="products" options={{ headerShown: false }} />
        <Stack.Screen name="topics" options={{ headerShown: false }} />
        <Stack.Screen name="success" options={{ headerShown: false }} />
        <Stack.Screen name="subscription" options={{ headerShown: false }} />
        <Stack.Screen name="response" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ headerShown: false }} />
        <Stack.Screen name="article" options={{ headerShown: false }} />
        <Stack.Screen name="terms" options={{ headerShown: false }} />
        <Stack.Screen name="item" options={{ headerShown: false }} />
        <Stack.Screen name="category" options={{ headerShown: false }} />
        <Stack.Screen name="budget" options={{ headerShown: false }} />
        <Stack.Screen name="booking" options={{ headerShown: false }} />
        <Stack.Screen name="setting" options={{ headerShown: false }} />
        <Stack.Screen name="test" options={{ headerShown: false }} />

        <Stack.Screen name="prescription" options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor="#161622" style="dark" />
    </>
  );
};

export default ScreensLayout;
