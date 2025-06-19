export type Review = {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  likedBy: string[];
  numOfLikes: number;
  createdAt: string;
};
