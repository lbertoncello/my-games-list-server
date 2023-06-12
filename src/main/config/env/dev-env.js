export const config = {
  secrets: {
    jwt: process.env.JWT_SECRET_DEV,
    jwtExp: process.env.JWT_EXPIRE_DEV,
  },
  dbUrl: process.env.MONGO_URI_DEV,
};
