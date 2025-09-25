import userModel from "../models/userModels.js";

interface registerParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const register = async ({
  firstName,
  lastName,
  password,
  email,
}: registerParams) => {
  const findUser = await userModel.findOne({ email });

  if (findUser) {
    return { data: "User already exists" , statusCode:400 };
  }

  const newUser = new userModel({ email, password, firstName, lastName });

  await newUser.save();
  return { data: newUser , statusCode:200 };
};

interface loginparams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: loginparams) => {
  const findUser = await userModel.findOne({ email });

  if (!findUser) {
    return { data:"Incorrect email or password" , statusCode:400 };
  }

  const passwordMatch = password === findUser.password;
  if (passwordMatch) {
    return { data: findUser , statusCode:200 };
  }

  return { data:"Incorrect email or password" , statusCode:400 };
};
