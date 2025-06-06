//And the ReviewFormModal
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// type HandleReviewSubmit = {
//   onSubmitReview: (
//     title: string,
//     comment: string,
//     rating: string | number
//   ) => void;
// };

type ReviewData = {
  title: string;
  comment: string;
  rating: string | number;
};

type HandleReviewSubmit = {
  onSubmitReview: (data: ReviewData) => void | Promise<void>;
};

type ReviewProp = {
  title: string | undefined;
  rating: number | undefined;
  comment: string | undefined;
};
//
const ReviewFormModal: React.FC<
  HandleReviewSubmit & { review?: ReviewProp }
> = ({ onSubmitReview, review }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [slideAnim] = useState(new Animated.Value(0));
  const [errors, setErrors] = useState<{
    title?: string;
    comment?: string;
    rating?: string;
  }>({});

  useEffect(() => {
    if (review) {
      setTitle(review.title || "");
      setComment(review.comment || "");
      setRating(review.rating || null);
    }
  }, [review]);

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.poly(4)),
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setTitle("");
      setComment("");
      setRating(null);
      setErrors({});
    });
  };

  const validate = () => {
    const newErrors: {
      title?: string;
      comment?: string;
      rating?: string;
    } = {};
    if (title.trim() === "") newErrors.title = "Title is required";
    if (comment.trim() === "") newErrors.comment = "Comment is required";
    if (rating === null || rating === undefined)
      newErrors.rating = "Rating is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmitReview({ title, comment, rating });
      console.log("Review submitted:", { title, comment, rating });
      closeModal();
    }
  };

  const slideInTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={openModal}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Leave a Review</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={styles.background}
            onPress={closeModal}
            activeOpacity={1}
          />
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideInTranslateY }] },
            ]}
          >
            <Text style={styles.modalTitle}>Leave a Review</Text>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
              style={{ width: "100%" }}
            >
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                onChangeText={setTitle}
                value={title}
                placeholder="Review title"
                placeholderTextColor="#999"
                maxLength={50}
              />
              {errors.title && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}

              <Text style={styles.label}>Comment</Text>
              <TextInput
                style={[styles.textArea, errors.comment && styles.inputError]}
                onChangeText={setComment}
                value={comment}
                placeholder="Write your comments here..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                maxLength={300}
              />
              {errors.comment && (
                <Text style={styles.errorText}>{errors.comment}</Text>
              )}

              <Text style={styles.label}>Rating</Text>
              <View
                style={[
                  Platform.OS === "android"
                    ? styles.androidPickerWrapper
                    : undefined,
                  errors.rating ? styles.inputError : undefined,
                ]}
              >
                <Picker
                  selectedValue={rating}
                  onValueChange={(itemValue) => setRating(itemValue)}
                  mode="dropdown"
                  style={Platform.OS === "ios" ? styles.pickerIOS : undefined}
                >
                  <Picker.Item label="Select rating" value={null} />
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Picker.Item
                      key={star}
                      label={star.toString()}
                      value={star}
                    />
                  ))}
                </Picker>
              </View>
              {errors.rating && (
                <Text style={styles.errorText}>{errors.rating}</Text>
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: "#ccc" }]}
                  onPress={closeModal}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.submitButtonText, { color: "#333" }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    position: "relative",
  },
  button: {
    backgroundColor: "#0066ff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
    shadowColor: "#0066ff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  background: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 25,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    height: 100,
    marginBottom: 10,
    color: "#333",
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#ff4d4d",
  },
  errorText: {
    color: "#ff4d4d",
    marginBottom: 10,
    marginLeft: 4,
  },
  androidPickerWrapper: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  pickerIOS: {
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#007bff",
    borderRadius: 25,
    paddingVertical: 14,
    marginTop: 10,
    paddingHorizontal: 20,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});

export default ReviewFormModal;
