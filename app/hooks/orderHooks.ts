import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { CartItem, ShippingAddress } from "@/app/types/Cart";
import { Order } from "@/app/types/Order";

export const useGetOrderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ["orders", id],
    queryFn: async () => (await apiClient.get<Order>(`api/orders/${id}`)).data,
  });

export const useGetOrderSummaryQuery = () =>
  useQuery({
    queryKey: ["order-summary"],
    queryFn: async () => (await apiClient.get(`api/orders/summary`)).data,
  });
export const useGetOrderListQuery = () =>
  useQuery({
    queryKey: ["order-list"],
    queryFn: async () => (await apiClient.get(`api/orders`)).data,
  });

// export const useDeleteOrderMutation = () =>
//   useMutation({
//     mutationFn: async (details: { orderId: string }) =>
//       (
//         await apiClient.delete<{ message: string; order: Order }>(
//           `/api/orders/${details.orderId}`
//         )
//       ).data,
//   });
// export const useDeleteOrderMutation = () =>
//   useMutation({
//     mutationFn: async ({ orderId }: { orderId: string }) => {
//       const response = await apiClient.delete<{
//         message: string;
//         order: Order;
//       }>(`/api/orders/${orderId}`);
//       return response.data;
//     },
//     onError: (error) => {
//       console.error("Error deleting order:", error);
//     },
//   });

export const useDeleteOrderMutation = () =>
  useMutation({
    mutationFn: async (details: { orderId: string }) => {
      //console.log("Deleting order:", orderId); // Debugging
      //if (!orderId) throw new Error("Order ID is missing!");
      return (
        await apiClient.delete<{ message: string; order: Order }>(
          `/api/orders/${details.orderId}`
        )
      ).data;
    },
    onError: (error) => console.error("Error deleting order:", error),
    onSuccess: () => {
      // Invalidate and refetch the orders query
      const queryClient = useQueryClient();
      queryClient.invalidateQueries(["order-list"]);
    },

    networkMode: "online",
    retry: 1,
  });

export const useGetPaypalClientIdQuery = () =>
  useQuery({
    queryKey: ["paypal-clientId"],
    queryFn: async () =>
      (await apiClient.get<{ clientId: string }>(`/api/keys/paypal`)).data,
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

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: string;
      itemsPrice: number;
      shippingPrice: number;
      taxPrice: number;
      totalPrice: number;
    }) =>
      (
        await apiClient.post<{ message: string; order: Order }>(
          `api/orders`,
          order
        )
      ).data,
  });

export const useGetOrderHistoryQuery = () =>
  useQuery({
    queryKey: ["order-history"],
    queryFn: async () =>
      (await apiClient.get<Order[]>(`/api/orders/mine`)).data,
  });
