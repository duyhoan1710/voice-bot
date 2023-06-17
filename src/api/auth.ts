import api from "./index";

export const login = async (payload: { email: string; password: string }) => {
  const res = await api.post(
    `${process.env.REACT_APP_API_SERVER}/auth/login`,
    payload
  );

  return res.data?.data;
};

export const signUp = async (payload: { email: string; password: string }) => {
  const res = await api.post(
    `${process.env.REACT_APP_API_SERVER}/auth/register`,
    payload
  );

  return res.data?.data;
};
