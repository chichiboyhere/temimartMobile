import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Rating from "../../components/Rating";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import axios from "axios";

const API_URL = "https://temimartapi.onrender.com/api/products";

export default function Index() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(API_URL);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    products.forEach((product) => {
      Image.prefetch(product.image);
    });
  }, [products]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const filteredProducts = (products || []).filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#0A5C36",
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
            height: 30,
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
            <>
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
            </>
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
  );
}
