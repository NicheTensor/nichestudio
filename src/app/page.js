"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import clsx from "clsx";
import { useSearchParams, useRouter } from 'next/navigation';

import { chatModels, features } from "./data";
import Input from "@/components/Input";
import Output from "@/components/Output";
import MessageList from "@/components/ChatCompletions/MessageList";
import History from "@/components/ChatCompletions/History";
import InteractBar from "@/components/ChatCompletions/InteractBar";
import Logo from "@/components/Logo";
import PreviousGenerations from "@/components/PreviousGenerations";
import {
  goJourney,
  faceToMany,
  stickerMaker,
  textToImage,
  personalize,
  imageToImage,
  imageUpscaling,
} from "./data";
import storageSeed from "@/seed/storage.json";

const Feature = ({
  feature,
  setFeature,
  settings,
  setSettings,
  setFirstGen,
}) => {
  const { isGenerating } = settings;

  const handleChange = (feature) => {
    setFeature(feature.key);
    setFirstGen(true);

    switch (feature.key) {
      case "goJourney":
        setSettings(goJourney);
        break;
      case "faceToMany":
        setSettings(faceToMany);
        break;
      case "stickerMaker":
        setSettings(stickerMaker);
        break;
      case "textToImage":
        setSettings(textToImage);
        break;
      case "personalize":
        setSettings(personalize);
        break;
      case "imageToImage":
        setSettings(imageToImage);
        break;
      case "imageUpscaling":
        setSettings(imageUpscaling);
        break;
    }
  };

  return (
    <Select
      isDisabled={isGenerating}
      placeholder="Select a feature"
      selectedKeys={[feature]}
      aria-label="Select a feature"
      style={{
        backgroundColor: "white",
        borderRadius: "100px",
        paddingTop: "25px",
        paddingBottom: "25px",
      }}
    >
      {features.map((feature) => (
        <SelectItem
          key={feature.key}
          className="text-primary"
          onClick={() => handleChange(feature)}
        >
          {feature.label}
        </SelectItem>
      ))}
    </Select>
  );
};

const FeatureSelector = ({ onFeatureSelect }) => {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const featureParam = searchParams.get('feature');
    if (featureParam && features.some(f => f.key === featureParam)) {
      onFeatureSelect(featureParam);
    }
  }, [searchParams, onFeatureSelect]);

  return null;
};

export default function Home() {
  const [firstGen, setFirstGen] = useState(true);
  const [feature, setFeature] = useState("textToImage");
  const [settings, setSettings] = useState(textToImage);
  const [conversations, setConversations] = useState([
    {
      model: chatModels.at(0),
      messages: [],
    },
  ]);
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const [storage, setStorage] = useState({});
  const divRef = useRef(null);

  const isChatCompletions = feature === "chatCompletions";
  const currentConversation = conversations[currentConversationIndex];
  const router = useRouter();

  const setFeatureWithSearchParams = (feature) => {
    setFeature(feature);
    router.push(`/?feature=${feature}`);
  };

  const checkHeight = () => {
    const div = divRef.current;
    if (div) {
      const hasOverflow = div.scrollHeight > div.clientHeight;
      div.classList.toggle("md:justify-start", hasOverflow);
      div.classList.toggle("md:justify-center", !hasOverflow);
    }
  };

  const saveToStorage = (result) => {
    const jsonString = JSON.stringify(result);
    localStorage.setItem("conversations", jsonString);

    return result;
  };

  const changeConversation = (index) => setCurrentConversationIndex(index);
  const deleteConversation = (index) =>
    setConversations((prev) =>
      saveToStorage(prev.filter((_, i) => i !== index)),
    );
  const createNewConversation = () => {
    const newConversations = [
      ...conversations.filter(({ messages }) => messages.length > 0),
      {
        model: chatModels.at(0),
        messages: [],
      },
    ];

    saveToStorage(newConversations);
    setConversations(newConversations);
    setCurrentConversationIndex(newConversations.length - 1);
  };

  const updateModel = (model) =>
    setConversations((prev) =>
      saveToStorage(
        prev.map((c, i) =>
          i === currentConversationIndex ? { ...c, model } : c,
        ),
      ),
    );

  const setMessages = (messages) => {
    setConversations((prev) => {
      const result = prev.map((conversation, index) =>
        index === currentConversationIndex
          ? { ...conversation, messages }
          : conversation,
      );
      saveToStorage(result);

      return result;
    });
  };

  useEffect(() => {
    const settingsFromStorage =
      JSON.parse(localStorage.getItem("settings")) || {};
    if (!!Object.entries(settingsFromStorage).length)
      setStorage(settingsFromStorage);
    else {
      setStorage(storageSeed);
      localStorage.setItem("settings", JSON.stringify(storageSeed));
    }

    const conversationsFromStorage = localStorage.getItem("conversations");
    if (!conversationsFromStorage) return;
    const conversations = JSON.parse(conversationsFromStorage);
    setConversations(conversations);
  }, []);

  useEffect(() => {
    checkHeight();
  }, [feature, settings]);

  return (
    <div
      className={clsx(
        "w-full h-screen overflow-y-auto custom-scroll md:overflow-y-hidden md:w-auto grid grid-cols-1",
        isChatCompletions
          ? "!flex flex-col"
          : !firstGen
          ? "md:grid-cols-3 md:grid-flow-col"
          : "md:grid-cols-1",
      )}
    >
      <div
        className="flex flex-col items-center custom-scroll col-span-1 mt-3"
        ref={divRef}
      >
        <div
          className={clsx(
            "w-[95%] md:w-[330px] xl:w-[420px]",
            isChatCompletions && "flex items-center grow gap-4",
          )}
        >
          <Feature
            feature={feature}
            setFeature={setFeatureWithSearchParams}
            settings={settings}
            setSettings={setSettings}
            setFirstGen={setFirstGen}
          />
          {isChatCompletions && (
            <History
              history={conversations}
              currentConversationIndex={currentConversationIndex}
              onSelect={changeConversation}
              onDelete={deleteConversation}
            />
          )}
        </div>
        {!isChatCompletions && (
          <div className="w-[95%] md:w-[330px] xl:w-[420px] md:max-h-[80vh] overflow-auto mt-2 mb-2 md:mt-12">
            <Input
              feature={feature}
              settings={settings}
              setSettings={setSettings}
              setFirstGen={setFirstGen}
              setStorage={setStorage}
              checkHeight={checkHeight}
            />
          </div>
        )}
      </div>
      <Suspense fallback={null}>
        <FeatureSelector onFeatureSelect={(f) => {
          setFeature(f);
          setFirstGen(true);
        }} />
      </Suspense>
      {isChatCompletions ? (
        <div className="w-full max-w-[600px] px-4 h-full max-h-[calc(100dvh-62px)] mx-auto pt-6 pb-4 md:pb-8 flex flex-col justify-between gap-6">
          <MessageList messages={currentConversation?.messages} />
          <InteractBar
            createNewConversation={createNewConversation}
            conversation={currentConversation}
            setMessages={setMessages}
            updateModel={updateModel}
          />
        </div>
      ) : (
        !firstGen && (
          <div className="flex mt-3 col-span-2">
            <Output
              settings={settings}
              singleResult={feature === "imageUpscaling"}
            />
          </div>
        )
      )}
      <Logo
        className={clsx(
          "mx-auto p-4 md:fixed",
          isChatCompletions
            ? "fixed bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 md:bottom-6 md:left-10 md:-translate-x-0 md:translate-y-0"
            : "bottom-6 left-10",
        )}
      />
      <PreviousGenerations
        storage={storage}
        isGenerating={settings.isGenerating}
        setFeature={setFeatureWithSearchParams}
        setSettings={setSettings}
        setFirstGen={setFirstGen}
        setStorage={setStorage}
      />
    </div>
  );
}
