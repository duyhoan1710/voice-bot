import React, { useEffect, useMemo, useRef, useState } from "react";

import iconMicrophone from "./assets/microphone.png";
import iconRecording from "./assets/voice-recorder.png";

import { sendMessage } from "./api/message";
import AWS from "./aws";
import {Loading} from './commons/Loading';

import "./App.css";

interface IMessage {
  id: number;
  content: string;
  sender: "user" | "gpt";
}

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [isGPTLoadingMessage, setIsGPTLoadingMessage] = useState(false);

  const [messages, setMessages] = useState<IMessage[]>([
    {
      id: Date.now(),
      content: "hello",
      sender: "gpt",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [GPTResponseMessage, setGPTResponseMessage] = useState("");

  const onSendMessage = () => {
    setMessages((oldMessages) => [
      ...oldMessages,
      { id: Date.now(), content: message, sender: "user" },
    ]);
    setMessage("");
    setIsRecording(false);
    setIsGPTLoadingMessage(true);

    sendMessage(message).then((msg) => {
      setMessages((oldMessages) => [
        ...oldMessages,
        { id: Date.now(), content: msg, sender: "gpt" },
      ]);

      setGPTResponseMessage(msg);
      setIsGPTLoadingMessage(false);
    });
  };

  const microphone = useMemo(() => {
    const $ = window as any;
    const SpeechRecognition = $.SpeechRecognition || $.webkitSpeechRecognition;
    const microphone = new SpeechRecognition();

    microphone.continuous = true;
    microphone.interimResults = true;
    microphone.lang = "en-US";

    let timer: any;

    microphone.onresult = (event: any) => {
      const recordingResult = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("");

      setMessage(recordingResult);

      clearTimeout(timer);

      timer = setTimeout(() => {}, 1500);

      microphone.onerror = (event: any) => {
        console.log(event.error);
      };
    };

    return microphone;
  }, []);

  useEffect(() => {
    if (isRecording) microphone.start();
    else microphone.stop();
  }, [isRecording, microphone]);

  useEffect(() => {
    const messagesDiv = messagesRef.current;

    messagesDiv?.scrollTo(0, messagesDiv.scrollHeight);
  }, [messages]);

  const signer = useMemo(() => {
    const Polly = new AWS.Polly();

    return new AWS.Polly.Presigner({ service: Polly });
  }, []);

  useEffect(() => {
    const input = {
      Engine: "neural",
      Text: GPTResponseMessage,
      OutputFormat: "ogg_vorbis",
      VoiceId: "Amy",
      LanguageCode: "en-IN",
    };

    signer.getSynthesizeSpeechUrl(input, function (err, outputUrl) {
      if (err) {
        console.log(err, err.stack);
      } else {
        const sound = document.createElement("audio");
        sound.id = "audio-player";
        sound.playbackRate = 0.5;
        sound.src = outputUrl;

        sound.play();
      }
    });
  }, [GPTResponseMessage, signer]);

  return (
    <div className="App" ref={containerRef}>
      <div className="header h-20"></div>

      <div className="body h-body flex px-5 pb-4">
        <div className="lg:w-1/4"></div>

        <div className="lg:max-w-[50%] lg:px-6 flex-grow chat-box flex flex-col ">
          <div className="py-3 flex-grow overflow-y-hidden">
            <div
              ref={messagesRef}
              className="messages h-full overflow-y-auto pr-2"
            >
              {messages?.map((message: IMessage) => (
                <div
                  key={message.id}
                  className={`message lg:max-w-[80%] whitespace-pre-wrap bg-white w-fit px-6 py-2 mb-2 text-base ${message.sender}`}
                >
                  {message.content.trim()}
                </div>
              ))}

              {isGPTLoadingMessage && (
                <div className="message max-w-[80%] bg-white w-fit px-6 py-2 mb-2 text-base gpt">
                  <Loading />
                </div>
              )}
            </div>
          </div>

          <div className="form-send-message relative z-20">
            <div
              className="call-icon bg-grey-400 w-fit p-2 rounded-full text-grey-600 absolute top-2 left-3 cursor-pointer"
              onClick={() => {
                setIsRecording(true);
              }}
            >
              <img
                src={isRecording ? iconRecording : iconMicrophone}
                alt=""
                className="w-6"
              />
            </div>

            <input
              className="w-full h-14 rounded-md focus-visible:outline-none px-16"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyUp={(e) => {
                const keyCode = e.code || e.key;
                if (keyCode === "Enter") {
                  onSendMessage();
                }
              }}
            />

            {message && (
              <button
                className="text-gray-400 absolute top-2.5 right-3"
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

        <div className="lg:w-1/4 chat-rooms overflow-y-auto pr-2">
          {/* <div className="room bg-grey-400 p-4 rounded-lg cursor-pointer">
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
          </div> */}
        </div>
      </div>

      {isRecording && (
        <div
          className="overlay-recording z-10"
          onClick={() => setIsRecording(false)}
        />
      )}
    </div>
  );
}

export default App;
