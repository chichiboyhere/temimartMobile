import React, { useState, useContext, useReducer, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
} from "react-native";
import Rating from "./Rating";
import { Product } from "@/types/Product";
import { Review } from "@/app/types/Review";
import axios from "axios";
import { Store } from "@/Store";
import Ionicons from "@expo/vector-icons/Ionicons";
import SelectDropdown from "react-native-select-dropdown";
import { getError } from "@/utils";
import { useGetProductByIdQuery } from "@/app/hooks/productHooks";

interface ReviewFormatProps {
  item: Review;
  product: Product;
}

type Action =
  | { type: "REFRESH_PRODUCT"; payload: Product }
  | { type: "CREATE_REQUEST" }
  | { type: "CREATE_SUCCESS" }
  | { type: "CREATE_FAIL"; payload: string };

const reducer = (state: any, action: Action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    default:
      return state;
  }
};

function ReviewFormat({ item, product }: ReviewFormatProps) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const { data: updatedProduct } = useGetProductByIdQuery(
    product._id as string
  );

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(1);
  //const [forceRender, setForceRender] = useState(false);

  const [{ loadingCreateReview }, dispatch] = useReducer(reducer, {
    product: {} as Product,
    loading: true,
    error: "",
  });

  useEffect(() => {
    dispatch({ type: "REFRESH_PRODUCT", payload: product });
  }, [product?.reviews]);

  const data = [
    { title: "1 - Poor" },
    { title: "2 - Fair" },
    { title: "3 - Good" },
    { title: "4 - Very Good" },
    { title: "5 - Excellent" },
  ];

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setReviewId(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const handleCancelEdit = () => {
    setSelectedReview(null);
    setReviewId(null);
    setEditComment("");
    setEditRating(1);
  };

  const handleDelete = async (reviewId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              console.log("Deleting review with ID:", reviewId);
              let remainingReviews = product.reviews.filter(
                (review) => review.name !== userInfo!.name
              );
              // Remove the deleted review from the local state
              product.reviews = [...remainingReviews];

              const { data } = await axios.delete(
                `https://temimartapi.onrender.com/api/products/${product._id}/reviews/${reviewId}`,
                { headers: { Authorization: `Bearer ${userInfo!.token}` } }
              );

              Alert.alert("Deleted", "Review deleted successfully");

              // Use the updated product data from the response
              dispatch({ type: "REFRESH_PRODUCT", payload: data.product });
              console.log("Updated product:", data.product);
            } catch (err) {
              Alert.alert("Error", getError(err));
            }
          },
        },
      ]
    );
  };

  return (
    <View
      style={{
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginVertical: 10,
        }}
      >
        {item.name}
      </Text>
      <Text>
        <Rating rating={item.rating} caption=" "></Rating>
      </Text>
      <Text>{item.createdAt.substring(0, 10)}</Text>
      <Text>{item.comment}</Text>
      {userInfo?.name === item.name && (
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Ionicons
              name={"pencil"}
              size={24}
              onPress={() => handleEdit(item)}
              //onPress={(e) => selectElement(e, item)}
            />
            <Ionicons
              name={"trash"}
              size={24}
              onPress={() => handleDelete(item._id)}
            />
          </View>
        </View>
      )}
    </View>
  );
}
export default ReviewFormat;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "green",
    width: "45%",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  cancelButton: {
    backgroundColor: "red",
    width: "45%",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
