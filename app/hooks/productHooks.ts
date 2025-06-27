import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { Product } from "@/app/types/Product";

export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => (await apiClient.get<Product[]>(`api/products`)).data,
  });

export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ["products", slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/slug/${slug}`)).data,
  });
export const useGetProductByIdQuery = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/${id}`)).data,
  });

export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await apiClient.get<[]>(`/api/products/categories`)).data,
  });
