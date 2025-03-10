import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Store } from "@/Store";
import { useContext, useState, useEffect } from "react";
import { Badge } from "react-native-elements";
import { View } from "react-native";

export default function TabLayout() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const calcCartItems = () => {
      if (cart.cartItems.length > 0) {
        const count = cart.cartItems.reduce((a, c) => a + c.quantity, 0);
        setCartItemsCount(count);
      }
    };

    calcCartItems();
  }, [cartItemsCount, setCartItemsCount, cart]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#0A5C36",
          height: 120,
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Products",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: "relative" }}>
              <Ionicons
                name={focused ? "cart-sharp" : "cart-outline"}
                color={color}
                size={24}
              />
              {cartItemsCount > 0 && (
                <Badge
                  value={cartItemsCount}
                  containerStyle={{ position: "absolute", top: -5, right: -5 }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
