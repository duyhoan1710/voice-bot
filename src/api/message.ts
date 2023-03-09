import api from "./index";

export const sendMessage = async (message: string) => {
  const res = await api.post("https://api.openai.com/v1/chat/completions", {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  });

  console.log(res);

  return res.data.choices[0].message.content;
};
