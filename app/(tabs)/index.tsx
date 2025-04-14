import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Rating from "../../components/Rating";
import { useGetProductsQuery } from "@/hooks/productHooks";
import NetInfo from "@react-native-community/netinfo";
import AnimatedNoInternetBanner from "@/components/AnimatedNoInternetBanner";

import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StatusBar,
} from "react-native";

export default function Index() {
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);
  const filteredProducts = (products || []).filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  {
    !isConnected && (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#FFA500" />
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
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#FFA500" />
      <AnimatedNoInternetBanner visible={!isConnected} />

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        />
      ) : error ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Error fetching data</Text>
        </View>
      ) : (
        <>
          <View
            style={{
              backgroundColor: "#ff9900",
              marginBottom: 10,
              padding: 10,
              position: "relative",
              display: "flex",
            }}
          >
            <Ionicons
              name={"search"}
              size={22}
              color={"gray"}
              style={{ position: "absolute", left: 15, top: 15, zIndex: 1 }}
            />
            <TextInput
              style={{
                backgroundColor: "white",
                width: "80%",
                height: 35,
                borderRadius: 15,
                paddingLeft: 30,
              }}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              style={{ padding: 10 }}
              numColumns={2}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    margin: 5,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    padding: 10,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 3,
                  }}
                >
                  <Link
                    href={{
                      pathname: "/productdetailscreen",
                      params: { slug: `${item.slug}` },
                    }}
                  >
                    <View>
                      <Image
                        source={{ uri: item.image }}
                        style={{ width: 150, height: 150, borderRadius: 10 }}
                        resizeMode="contain"
                      />
                    </View>

                    <Text style={{ fontWeight: "bold", marginTop: 5 }}>
                      {item.name}
                    </Text>
                    <Rating rating={item.rating} numReviews={item.numReviews} />
                    <Text>${item.price}</Text>
                  </Link>
                </TouchableOpacity>
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
        </>
      )}
    </View>
  );
}
