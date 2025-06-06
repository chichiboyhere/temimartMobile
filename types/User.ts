export type User = {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  token: string;
  isAdmin: boolean;
};
