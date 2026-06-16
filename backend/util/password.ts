import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const matchPassword = async (
  enteredPassword: string,
  hashedPassword?: string | null
): Promise<boolean> => {
  if (!hashedPassword) {
    return false;
  }
  return bcrypt.compare(enteredPassword, hashedPassword);
};
