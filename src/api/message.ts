import api from "./index";

export const getMessages = async (roomId?: number) => {
  const res = await api.get(
    `${process.env.REACT_APP_API_SERVER}/rooms/${roomId}/messages`
  );

  return res.data?.data;
};

export const sendMessage = async (roomId?: number, message?: string) => {
  const res = await api.post(
    `${process.env.REACT_APP_API_SERVER}/rooms/${roomId}/messages`,
    {
      content: message,
    }
  );

  return res.data?.data;
};
