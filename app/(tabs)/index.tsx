import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import Rating from "../../components/Rating";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";

const API_URL = "https://temimartapi.onrender.com/api/products";

export default function Index() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
  //console.log(products.map((product) => console.log(product.image)));
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={products}
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
    </View>
  );
}
