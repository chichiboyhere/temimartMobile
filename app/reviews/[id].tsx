import { Text, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getError } from "@/utils";
import { ApiError } from "@/types/ApiError";
import { useGetProductByIdQuery } from "../hooks/productHooks";
import ReviewFormat from "@/components/ReviewFormat";
//import { Review } from "@/types/Product";
import { Review } from "../types/Review";
const Reviews = () => {
  const { id: productId } = useLocalSearchParams();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId as string);

  return isLoading ? (
    <ActivityIndicator
      size="large"
      color="#0000ff"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  ) : error ? (
    Alert.alert("Error", getError(error as ApiError))
  ) : !product ? (
    Alert.alert("Error", "Product Reviews not found!")
  ) : (
    <ScrollView
      style={{
        flex: 1,
        padding: 15,
        backgroundColor: "#fff",
        marginBottom: 25,
      }}
    >
      {product.reviews?.map((item: Review) => (
        <ReviewFormat key={item._id} item={item} product={product} />
      ))}
    </ScrollView>
  );
};

export default Reviews;
