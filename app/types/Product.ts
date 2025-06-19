import { Review } from "./Review";
export type Product = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  brand: string;
  price: number;
  countInStock: number;
  description: string;
  rating: number;
  reviews: Review[] | null;
  numReviews: number;
};
