import jwt from "jsonwebtoken";

const getToken = (id: string) => {
  return jwt.sign({ id }, process.env.SECRET as string, {
    expiresIn: "5d",
  });
};

export default getToken;
