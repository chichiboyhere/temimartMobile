import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { Review } from "../types/Review";
import { Product } from "../types/Product";

export const useEditPersonalReviewMutation = () =>
  useMutation({
    //Todo
  });

// export const useCreateReviewMutation = (product: Product) => {
//   const queryClient = useQueryClient();
//   useMutation({
//     mutationFn: async (review: {
//       name: string;
//       rating: number;
//       comment: string;
//     }) =>
//       (
//         await apiClient.post<{ message: string; review: Review }>(
//           `api/products/${product._id}/reviews`,
//           review
//         )
//       ).data,
//     onError: (error) => console.error("Error deleting order:", error),
//     onSuccess: () => {
//       // Invalidate and refetch the orders query

//       queryClient.invalidateQueries(["review", product._id]);
//     },
//     networkMode: "online",
//     retry: 1,
//   });
// };

//import { useMutation, useQueryClient } from '@tanstack/react-query';
//import apiClient from 'your-api-client-path'; // Adjust the import based on your project structure

export const useCreateReviewMutation = (product: Product) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: {
      name: string;
      rating: number;
      comment: string;
    }) => {
      const response = await apiClient.post<{
        message: string;
        review: Review;
      }>(`api/products/${product._id}/reviews`, review);
      return response.data.review; // Return the new review
    },
    onError: (error) => console.error("Error posting review:", error),
    onSuccess: (newReview) => {
      // Update the cache directly
      queryClient.setQueryData(["review", product._id], (oldData: Review[]) => {
        return [...(oldData || []), newReview]; // Append the new review to the existing ones
      });
    },
    networkMode: "online",
    retry: 1,
  });
};

export const useGetReview = (productId: string, reviewId: string) => {
  return useQuery(["review", productId, reviewId], async () => {
    const response = await apiClient.get(
      `api/products/${productId}/reviews/${reviewId}`
    );
    console.log(response.data);
    return response.data; // Adjust based on your API response structure
  });
};

// export const useGetReview = (productId: string, reviewId: string) => {
//   useQuery({
//     queryKey: ["review", productId, reviewId],
//     queryFn: async () =>
//       (
//         await apiClient.get<Review>(
//           `api/products/${productId}/reviews/${reviewId}`
//         )
//       ).data,
//   });
// };

// export const useGetProductsQuery = () =>
//   useQuery({
//     queryKey: ["products"],
//     queryFn: async () => (await apiClient.get<Product[]>(`api/products`)).data,
//   });

export const useUpdateReviewMutation = () =>
  useMutation({
    mutationFn: async (
      review: {
        reviewId: string;
        name: string;
        rating: number;
        comment: string;
      },
      product: { productId: string }
    ) =>
      (
        await apiClient.put<{
          message: string;
          product: Product;
          review: Review;
        }>(`api/products/${product.productId}/${review.reviewId}`, review)
      ).data,
  });
export const usePayOrderMutation = () =>
  useMutation({
    mutationFn: async (details: { orderId: string }) =>
      (
        await apiClient.put<{ message: string; order: Order }>(
          `api/orders/${details.orderId}/pay`,
          details
        )
      ).data,
  });
