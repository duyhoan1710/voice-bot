import api from "./index";

export const createRoom = async (name: string) => {
  const res = await api.post(`${process.env.REACT_APP_API_SERVER}/rooms`, {
    name,
  });

  return res.data;
};

export const getRooms = async () => {
  const res = await api.get(`${process.env.REACT_APP_API_SERVER}/rooms`);

  return res.data?.data;
};
