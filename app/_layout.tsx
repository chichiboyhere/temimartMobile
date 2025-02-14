import { Stack } from "expo-router";
import { StoreProvider } from "@/Store";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a query client instance
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#0A5C36",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="productdetailscreen"
            options={{ title: "Product" }}
          />
          <Stack.Screen name="signin" options={{ title: "SignIn" }} />
          <Stack.Screen name="signup" options={{ title: "SignUp" }} />
        </Stack>
        <StatusBar style="light" />
      </StoreProvider>
    </QueryClientProvider>
  );
}
