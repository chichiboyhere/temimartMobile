import React, { useState, useContext, useReducer } from "react";
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

import axios from "axios";
import { Store } from "@/Store";
import Ionicons from "@expo/vector-icons/Ionicons";
import SelectDropdown from "react-native-select-dropdown";
import styles from "@/constants/styles";
import { getError } from "@/utils";

type Action =
  | { type: "REFRESH_PRODUCT"; payload: Product }
  | { type: "CREATE_REQUEST" }
  | { type: "CREATE_SUCCESS" }
  | { type: "CREATE_FAIL"; payload: string };

const reducer = (state, action: Action) => {
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

function ReviewFormat({ item, product }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewId, setReviewId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(1);
  const [forceRender, setForceRender] = useState(false);

  const [{ loadingCreateReview }, dispatch] = useReducer(reducer, {
    product: {} as Product,
    loading: true,
    error: "",
  });

  const data = [
    { title: "1 - Poor" },
    { title: "2 - Fair" },
    { title: "3 - Good" },
    { title: "4 - Very Good" },
    { title: "5 - Excellent" },
  ];

  const handleEdit = (review) => {
    setSelectedReview(review);
    setReviewId(review._id);
    console.log(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const saveEdit = async () => {
    try {
      console.log({
        rating: editRating,
        comment: editComment,
        name: userInfo?.name,
        prodId: product._id,
        revId: reviewId,
      });
      const { data } = await axios.put(
        `https://temimartapi.onrender.com/api/products/${product._id}/reviews/${reviewId}`,

        { rating: editRating, comment: editComment, name: userInfo?.name },
        { headers: { Authorization: `Bearer ${userInfo!.token}` } }
      );

      Alert.alert("Success", "Review updated successfully");
      // dispatch({ type: "REFRESH_PRODUCT", payload: data.product });
      // Instead of just dispatching, manually refetch the product
      const { data: updatedProduct } = await axios.get(
        `https://temimartapi.onrender.com/api/products/${product._id}`
      );

      dispatch({ type: "REFRESH_PRODUCT", payload: updatedProduct });
      // Force re-render
      setForceRender((prev) => !prev);
      setSelectedReview(null); // Exit edit mode
    } catch (err) {
      Alert.alert("Error!", getError(err));
    }
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
              await axios.delete(
                `https://temimartapi.onrender.com/api/products/${product._id}/reviews/${reviewId}`,
                { headers: { Authorization: `Bearer ${userInfo!.token}` } }
              );

              Alert.alert("Deleted", "Review deleted successfully");
              dispatch({ type: "REFRESH_PRODUCT", payload: product });
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
      //   key={item._id}
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
              onPress={(e) => handleEdit(item)}
              //onPress={(e) => selectElement(e, item)}
            />
            <Ionicons
              name={"trash"}
              size={24}
              onPress={(e) => handleDelete(item._id)}
            />
          </View>
          {/* Start Edit Form */}
          {selectedReview && (
            <View
              style={{
                marginTop: 50,
                borderWidth: 2,
                borderColor: "gray",
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                Edit Your Review
              </Text>
              <Text style={styles.title}>Rating</Text>
              <SelectDropdown
                data={data}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  setEditRating(index + 1);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(selectedItem && selectedItem.title) ||
                          "Select a Rating"}
                      </Text>

                      {isOpened ? (
                        <Ionicons
                          name={"chevron-up"}
                          color={"#ffc000"}
                          size={24}
                          style={styles.dropdownButtonArrowStyle}
                        />
                      ) : (
                        <Ionicons
                          name={"chevron-down"}
                          size={24}
                          style={styles.dropdownButtonArrowStyle}
                        />
                      )}
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View
                      style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && {
                          backgroundColor: "#D2D9DF",
                        }),
                      }}
                    >
                      <Text style={styles.dropdownItemTxtStyle}>
                        {item.title}
                      </Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
              <TextInput
                value={editComment}
                onChangeText={setEditComment}
                style={{
                  borderColor: "gray",
                  borderWidth: 2,
                  padding: 10,
                  marginVertical: 8,
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <TouchableOpacity style={stylez.saveButton} onPress={saveEdit}>
                  <Text style={{ color: "white", fontWeight: "700" }}>
                    Save
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={stylez.cancelButton}
                  onPress={() => setSelectedReview(null)}
                >
                  <Text style={{ color: "white", fontWeight: "700" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {/* End Edit Form */}
        </View>
      )}
    </View>
  );
}
export default ReviewFormat;

const stylez = StyleSheet.create({
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
});
