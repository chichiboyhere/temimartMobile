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
              backgroundColor: "#ff9900",
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
          <Stack.Screen name="shipping" options={{ title: "Shipping" }} />
          <Stack.Screen name="order" options={{ title: "Order" }} />
          <Stack.Screen
            name="orderDetail/[id]"
            options={{ title: "Order Detail" }}
          />
          <Stack.Screen
            name="orderHistory"
            options={{ title: "Order History" }}
          />
          <Stack.Screen name="reviews/[id]" options={{ title: "Reviews" }} />
        </Stack>
        <StatusBar style="light" />
      </StoreProvider>
    </QueryClientProvider>
  );
}
