export const config = {
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: process.env.JWT_EXPIRE,
  },
  dbUrl: process.env.MONGO_URI,
};
