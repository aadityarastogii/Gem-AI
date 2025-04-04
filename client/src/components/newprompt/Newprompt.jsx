import React, { useEffect, useRef, useState } from "react";
import "./newprompt.css";
import Upload from "../uploads/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import MarkDown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Newprompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [ans, setAns] = useState("");

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    generationConfig: {
      // maxOutputTokens:100
    },
  });

  const endRef = useRef(null);
  const formRef = useRef(null);


  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data,question, ans, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          ans,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAns("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
      navigate(`/dashboard/chats/${id}`);
    },
    onError:(err) =>{
      console.log(err);
      
    }
  });

  const add = async (text,isInitial) => {

    if (!isInitial) setQuestion(text);

 try {
  const result = await chat.sendMessageStream(
    Object.entries(img.aiData).length ? [img.aiData, text] : [text]
  );
  let accumulatedText = "";
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    console.log(chunkText);
    accumulatedText += chunkText;
    setAns(accumulatedText);
  }
  mutation.mutate()
 } catch (error) {
  console.log(error);
  
 }
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;
    add(text);
  };

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {img.isLoading && <div className="loading">Loading...</div>}
      {img.dbData.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData.filePath}
          width="250"
          transformation={[{ width: 250 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {ans && (
        <div className="message">
          <MarkDown>{ans}</MarkDown>
        </div>
      )}

      <div className="endChat" ref={endRef}></div>

      <div className="newPrompt">
        <form action="" className="newForm" onSubmit={handleSubmit} ref={formRef}>
          <Upload setImg={setImg} />
          <input id="file" type="file" multiple={false} hidden />
          <input type="text" name="text" placeholder="Ask anything..." />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </>
  );
};

export default Newprompt;
