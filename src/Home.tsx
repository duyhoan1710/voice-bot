import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import TextareaAutosize from "react-textarea-autosize";

import iconMicrophone from "./assets/microphone.png";
import iconRecording from "./assets/voice-recorder.png";
import phone from "./assets/phone-call.png";
import phoneCall from "./assets/telephone-call.png";

import { Loading } from "./commons/Loading";
import { getRooms, createRoom } from "./api/room";
import { getMessages, sendMessage } from "./api/message";

import "./App.css";
import { useNavigate, useParams } from "react-router-dom";

interface IMessage {
  id: number;
  content: string;
  role: "user" | "assistant";
}

function Home() {
  const { roomId }: { roomId?: number } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: rooms, isLoading: isLoadingRoom } = useQuery(["ROOMS"], () =>
    getRooms()
  );

  const { data: messages, isLoading: isLoadingMessage } = useQuery(
    ["MESSAGES", roomId],
    () => getMessages(roomId),
    { enabled: !!roomId }
  );

  const { mutate: handleCreateRoom } = useMutation(
    () => createRoom("New Chat"),
    {
      onSuccess: (res) => {
        const roomId = res.data.id;
        queryClient.invalidateQueries("ROOMS");
        navigate("/rooms/" + roomId);
      },
    }
  );

  const { mutate: handleSendMessage } = useMutation(
    () => {
      setLocalMessages((oldMessages) => [
        ...oldMessages,
        { id: Date.now(), content: message, role: "user" },
      ]);
      setMessage("");
      setIsGPTLoadingMessage(true);

      if (!isCalling) {
        setIsRecording(false);
      }

      if (isCalling) {
        microphoneCalling.stop(); //stop recoginition

        //try to give a bit delay and then start again with the same instance
        setTimeout(function () {
          microphoneCalling.start();
        }, 500);
      }

      return sendMessage(roomId, message);
    },
    {
      onSuccess: (msg) => {
        setIsGPTLoadingMessage(false);
        setLocalMessages((oldMessages) => [
          ...oldMessages,
          { id: Date.now(), content: msg.message, role: "assistant" },
        ]);

        const sound = document.querySelector("#audio-player") as any;
        sound.pause();

        sound.src = msg.voice;

        sound.play();
      },
      onError: () => {
        setIsGPTLoadingMessage(false);
        setLocalMessages((oldMessages) => [
          ...oldMessages,
          {
            id: Date.now(),
            content: "Sorry, something went wong! Please try again.",
            role: "assistant",
          },
        ]);
      },
    }
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputSendMessage = useRef<HTMLTextAreaElement>(null);

  const [isGPTLoadingMessage, setIsGPTLoadingMessage] = useState(false);
  const [localMessages, setLocalMessages] = useState<IMessage[]>([
    {
      id: Date.now(),
      content: "hello",
      role: "assistant",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  const microphoneRecording = useMemo(() => {
    const $ = window as any;
    const SpeechRecognition = $.SpeechRecognition || $.webkitSpeechRecognition;
    const microphone = new SpeechRecognition();

    microphone.continuous = true;
    microphone.interimResults = true;
    microphone.lang = "en-US";

    microphone.onresult = (event: any) => {
      const recordingResult = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("");

      setMessage(recordingResult);

      microphone.onerror = (event: any) => {
        console.log(event.error);
      };
    };

    return microphone;
  }, []);

  const microphoneCalling = useMemo(() => {
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

      timer = setTimeout(() => {
        if (recordingResult) {
          handleSendMessage();
        }
      }, 2500);

      microphone.onerror = (event: any) => {
        console.log(event.error);
      };
    };

    return microphone;
  }, []);

  useEffect(() => {
    if (isCalling) microphoneCalling.start();
    else microphoneCalling.stop();
  }, [isCalling, microphoneCalling]);

  useEffect(() => {
    if (isRecording) microphoneRecording.start();
    else microphoneRecording.stop();
  }, [isRecording, microphoneRecording]);

  // useEffect(() => {
  //   if (isGPTAnswering === null) return;

  //   if (isGPTAnswering) {
  //     microphoneCalling.stop();
  //     return;
  //   }

  //   if (isCalling) {
  //     microphoneCalling.start();
  //   }
  // }, [isCalling, isGPTAnswering]);

  useEffect(() => {
    if (messages) {
      setLocalMessages([...messages]);
    }
  }, [messages]);

  useEffect(() => {
    const messagesDiv = messagesRef.current;

    messagesDiv?.scrollTo(0, messagesDiv.scrollHeight);
  }, [localMessages]);

  useEffect(() => {
    if (!roomId && rooms) {
      navigate(`/rooms/${rooms[0].id}`);
    }
  }, [rooms, roomId]);

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
              {localMessages?.map((message: IMessage) => (
                <div
                  key={message.id}
                  className={`message lg:max-w-[80%] whitespace-pre-wrap bg-white w-fit px-6 py-2 mb-2 text-base ${message.role}`}
                >
                  {message.content}
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
              className="absolute bottom-3.5 left-3"
              onClick={() => setIsCalling((preValue) => !preValue)}
            >
              <img
                src={isCalling ? phoneCall : phone}
                className="w-10 cursor-pointer"
                alt=""
              />
            </div>

            <TextareaAutosize
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={(e) => {
                const keyCode = e.code || e.key;
                if (keyCode === "Enter" && message) {
                  handleSendMessage();
                }
              }}
              ref={inputSendMessage}
              maxRows={4}
              className="w-full min-h-[3.5rem] rounded-md focus-visible:outline-none pl-16 pr-28 py-4 resize-none"
            />

            <div className="absolute bottom-3.5 right-3 flex">
              <div
                className="call-icon bg-grey-400 w-fit p-2 rounded-full text-grey-600  cursor-pointer"
                onClick={() => {
                  setIsRecording(true);
                  inputSendMessage.current?.focus();
                }}
              >
                <img
                  src={isRecording ? iconRecording : iconMicrophone}
                  alt=""
                  className="w-6"
                />
              </div>

              <button
                className="text-gray-400 ml-2"
                onClick={() => {
                  message && handleSendMessage();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                  className="w-9"
                >
                  <path
                    fill="currentColor"
                    d="M15.75 11.81l3.72 3.72a.75.75 0 0 0 1.06-1.06l-5-5a.75.75 0 0 0-1.06 0l-5 5a.75.75 0 0 0 1.06 1.06l3.72-3.72v9.69h1.5v-9.69zM15 30C6.716 30 0 23.284 0 15 0 6.716 6.716 0 15 0c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:w-1/4 chat-rooms overflow-y-auto pr-2">
          <div className={`room bg-grey-400 p-4 rounded-lg mb-2 flex`}>
            <button
              className="w-full py-2 border border-gray-400"
              onClick={() => handleCreateRoom()}
            >
              New Chat
            </button>
          </div>
          {rooms?.map((room: any, index: number) => (
            <div
              key={room.id}
              className={`room bg-grey-400 p-4 rounded-lg cursor-pointer mb-2 border-2 ${
                Number(room.id) === Number(roomId)
                  ? "border-gray-400"
                  : "border-transparent"
              }`}
              onClick={() => navigate("/rooms/" + room.id)}
            >
              <div className="flex justify-between mb-3">
                <div className="font-bold text-base">{room.name}</div>
                {/* <div className="text-grey-600">See All</div> */}
              </div>

              <div>
                <div className="text-grey-600 three-dot">
                  Last Message: {room.latestMessage?.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(isRecording || isCalling) && (
        <div
          className="overlay-recording z-10"
          onClick={() => {
            setIsRecording(false);
            setIsCalling(false);
          }}
        />
      )}

      <audio id="audio-player" className="hidden" />
    </div>
  );
}

export default Home;
