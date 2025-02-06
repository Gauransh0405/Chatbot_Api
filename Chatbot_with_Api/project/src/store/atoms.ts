import { atom } from "recoil";
import { Message } from "../types";

export const messagesState = atom<Message[]>({
  key: "messagesState",
  default: [
    {
      id: "1",
      content: "Hi! I'm your AI assistant powered by Mistral-7B. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ],
});

export const isTypingState = atom<boolean>({
  key: "isTypingState",
  default: false,
});

export const themeState = atom<"light" | "dark">({
  key: "themeState",
  default: "light",
});