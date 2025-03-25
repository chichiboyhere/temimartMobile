import apiClient from "@/apiClient";
import { useMutation } from "@tanstack/react-query";
import { Product } from "@/types/Product";

type Review = {
  rating: number;
  comment: string;
  name: string;
};

export const useCreateReviewMutation = (product: Product) =>
  useMutation({
    mutationFn: async (review: {
      rating: number;
      comment: string;
      name: string;
    }) =>
      (
        await apiClient.post<Product>(
          `/api/products/${product._id}/reviews`,
          review
        )
      ).data,
  });

export const useEditReviewMutation = (productId: string, reviewId: string) =>
  useMutation({
    mutationFn: async (review: {
      rating: number;
      comment: string;
      name: string;
    }) =>
      (
        await apiClient.put(
          `/api/products/${productId}/reviews/${reviewId}`,
          review
        )
      ).data,
  });
