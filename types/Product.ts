export type Review = {
  _id: string;
  name: string;
  rating: number;
  createdAt: string;
  title: string;
  comment: string;
};

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
  reviews: Review[];
  numReviews: number;
  discount?: number;
  numSold?: number;
};
