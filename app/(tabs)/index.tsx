import React, { useState, useEffect, useRef, useContext } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useGetProductsQuery } from "@/app/hooks/productHooks";
import NetInfo from "@react-native-community/netinfo";
import AnimatedNoInternetBanner from "@/components/AnimatedNoInternetBanner";
import Banner from "@/components/Banner";

import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";

import ProductCard from "../../components/ProductCard";
import { Store } from "@/Store";
import { useRouter } from "expo-router";
import { Product } from "@/app/types/Product";

export default function Index() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const router = useRouter();

  const { data: products, isLoading, error } = useGetProductsQuery();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isConnected, setIsConnected] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  let filteredProducts = (products || []).filter(
    (product) =>
      product.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (searchQuery.toLowerCase().trim() === "all") {
    filteredProducts = products || [];
  }

  const handleAddToCart = (product: Product) => {
    const existItem = cart.cartItems.find((x) => x._id === product?._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      Alert.alert("Product out of stock!", "Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    router.navigate("/cart");
  };

  // Automatically populate unique categories
  const prodCategories = Array.from(
    new Set(["All", ...(products?.map((product) => product.category) || [])])
  );

  return (
    <View style={{ flex: 1 }}>
      {!isConnected && (
        <>
          <AnimatedNoInternetBanner visible={!isConnected} />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <ActivityIndicator size="large" color="#FFA500" />
          </View>
        </>
      )}

      {isConnected && isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        />
      ) : isConnected && error ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Error fetching data</Text>
        </View>
      ) : isConnected ? (
        <View style={{ flex: 1 }}>
          {/* Search bar */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
              position: "relative",
            }}
          >
            <TextInput
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "black",
                width: "100%",
                height: 40,
                borderRadius: 18,
                paddingLeft: 30,
              }}
              placeholder="Search Temi"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                position: "absolute",
                right: 12,
                top: 12,
                zIndex: 1,
              }}
            >
              <Ionicons
                name={"camera-outline"}
                size={30}
                color={"gray"}
                outline
              />
              <View
                style={{
                  backgroundColor: "black",
                  borderRadius: 18,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                }}
              >
                <Ionicons name={"search"} size={22} color={"white"} />
              </View>
            </View>
          </View>
          {/* Search bar ends */}

          {/* Category list */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 10 }}
          >
            <View style={styles.menuContainer}>
              {prodCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    setSearchQuery(category);
                    setSelectedCategory(category);
                  }}
                >
                  <View
                    style={
                      selectedCategory === category && styles.selectedMenuItem
                    }
                  >
                    <Text style={styles.menuText}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {/* Category list ends */}
          <Banner />

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              numColumns={2}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <ProductCard item={item} onAddToCart={handleAddToCart} />
              )}
            />
          ) : (
            <Text
              style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                color: "gray",
              }}
            >
              No products
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: "row",
    gap: 40,
    height: 60,

    paddingHorizontal: 15,
  },
  menuItem: { justifyContent: "center", alignItems: "center" },
  selectedMenuItem: {
    //backgroundColor: "#FF9900", // Highlight color #007BFF"
    //borderRadius: 10, // Highlight border radius
    borderBottomColor: "gray", // Color of the underline
    borderBottomWidth: 4, // Thickness of the underline
    paddingBottom: 2, // Spacing between text and underline
  },

  menuText: {
    fontSize: 16,
    color: "gray",
    fontWeight: "bold",
  },
});
