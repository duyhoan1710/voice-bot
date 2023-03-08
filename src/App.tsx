import React, { useState } from "react";
import "./App.css";

interface IMessage {
  id: number;
  content: string;
  sender: "user" | "gpt";
}

function App() {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      id: Date.now(),
      content: "hello",
      sender: "gpt",
    },
  ]);
  const [message, setMessage] = useState("");

  const onSendMessage = () => {
    setMessages((oldMessages) => [
      { id: Date.now(), content: message, sender: "user" },
      ...oldMessages,
    ]);
  };

  return (
    <div className="App">
      <div className="header h-20"></div>

      <div className="body h-body flex px-5 pb-4">
        <div className="w-1/4"></div>

        <div className="flex-grow chat-box flex flex-col px-6">
          <div className="messages flex-grow">
            {messages?.map((message: IMessage) => (
              <div
                key={message.id}
                className={`message bg-white w-fit px-6 py-2 mb-2 text-base ${message.sender}`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className="form-send-message relative">
            <div className="call-icon bg-grey-400 w-fit p-2 rounded-full text-grey-600 absolute top-2 left-8">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.3526 20.7014C18.0796 21.6562 16.4682 22.0722 14.9806 21.5072C13.0763 20.784 10.2706 19.3414 7.46491 16.5357C4.6592 13.73 3.21667 10.9243 2.49342 9.02006C1.9284 7.53245 2.34445 5.92103 3.29923 4.648L4.4507 3.1127C5.2507 2.04603 6.8507 2.04603 7.6507 3.1127L9.25259 5.24855C9.84977 6.04479 9.77058 7.15898 9.0668 7.86276L8.01701 8.91255C7.69254 9.23702 7.63285 9.73866 7.89693 10.1139C8.39055 10.8154 9.30721 12.0141 10.6469 13.3537C11.9866 14.6934 13.1853 15.6101 13.8867 16.1037C14.262 16.3678 14.7636 16.3081 15.0881 15.9836L16.1379 14.9338C16.8417 14.23 17.9558 14.1509 18.7521 14.748L20.8879 16.3499C21.9546 17.1499 21.9546 18.7499 20.8879 19.5499L19.3526 20.7014Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>

            <input
              className="w-full h-14 rounded-md focus-visible:outline-none px-16"
              onChange={(e) => setMessage(e.target.value)}
            />

            {message && (
              <button
                className="text-gray-400 absolute top-2.5 right-8"
                onClick={onSendMessage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                  className="w-9"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M15.75 11.81l3.72 3.72a.75.75 0 0 0 1.06-1.06l-5-5a.75.75 0 0 0-1.06 0l-5 5a.75.75 0 0 0 1.06 1.06l3.72-3.72v9.69h1.5v-9.69zM15 30C6.716 30 0 23.284 0 15 0 6.716 6.716 0 15 0c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15z"
                  ></path>
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="w-1/4 chat-rooms">
          <div className="room bg-grey-400 p-4 rounded-lg cursor-pointer">
            <div className="flex justify-between mb-3">
              <div className="font-bold text-base">Room 1</div>
              <div className="text-grey-600">See All</div>
            </div>

            <div>
              <div className="mb-1">Content:</div>
              <div className="text-grey-600">
                {" "}
                - Explain quantum computing in simple terms
              </div>
            </div>
          </div>

          <div className="room bg-grey-400 p-4 rounded-lg cursor-pointer mt-3">
            <div className="flex justify-between mb-3">
              <div className="font-bold text-base">Room 2</div>
              <div className="text-grey-600">See All</div>
            </div>

            <div>
              <div className="mb-1">Content:</div>
              <div className="text-grey-600">
                {" "}
                - Explain quantum computing in simple terms
              </div>
            </div>
          </div>

          <div className="room bg-grey-400 p-4 rounded-lg cursor-pointer mt-3">
            <div className="flex justify-between mb-3">
              <div className="font-bold text-base">Room 1</div>
              <div className="text-grey-600">See All</div>
            </div>

            <div>
              <div className="mb-1">Content:</div>
              <div className="text-grey-600">
                {" "}
                - Explain quantum computing in simple terms
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
