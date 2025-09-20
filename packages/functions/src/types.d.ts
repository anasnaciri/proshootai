export type AuthenticatedUser = {
  user: {
    name: string;
    email: string;
    sub: string;
  };
};
