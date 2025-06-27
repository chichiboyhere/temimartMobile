import { Stack } from "expo-router";
import { StoreProvider } from "@/Store";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StripeProvider } from "@stripe/stripe-react-native";

// Create a query client instance
const queryClient = new QueryClient();
// merchantIdentifier="merchant.com.yourapp" // To be applied to IOS build

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StripeProvider publishableKey=" pk_test_51RdKfW09LEBwNVaETBVlcRPEhtwDO5EPaDCwDsOJo2MhpqBPK6dBtVtJBTTrODWUWHXO9hFb0JsCx3Fu2rQASIBs0063b1DCBs">
        <StoreProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#ff9900", //#ff9900
              },
              //contentStyle: { backgroundColor: "white" },
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
              options={{
                title: "Product",
              }}
            />
            <Stack.Screen name="signin" options={{ title: "SignIn" }} />
            <Stack.Screen name="signup" options={{ title: "SignUp" }} />
            <Stack.Screen name="shipping" options={{ title: "Shipping" }} />
            <Stack.Screen
              name="paymentMethod"
              options={{ title: "Choose a payment method" }}
            />
            <Stack.Screen name="order" options={{ title: "Order" }} />
            <Stack.Screen
              name="orderDetail/[id]"
              options={{ title: "Order Detail" }}
            />
            <Stack.Screen
              name="orderSuccessScreen/[id]"
              options={{ title: "Order Success!" }}
            />
            <Stack.Screen
              name="orderHistory"
              options={{ title: "Order History" }}
            />
          </Stack>
          <StatusBar style="light" />
        </StoreProvider>
      </StripeProvider>
    </QueryClientProvider>
  );
}
