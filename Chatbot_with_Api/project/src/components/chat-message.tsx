import React from "react";
import { Bot, User } from "lucide-react";
import { cn } from "../lib/utils";
import { Message } from "../types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "assistant";

  return (
    <div
      className={cn(
        "group flex gap-4 transition-opacity animate-in fade-in-0 duration-200",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center ring-2 ring-background">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          "flex-1 max-w-2xl rounded-2xl px-4 py-3 transition-colors",
          isBot
            ? "bg-muted dark:bg-muted/50"
            : "bg-primary text-primary-foreground"
        )}
      >
        <div className="text-sm font-medium mb-1 opacity-70">
          {isBot ? "Assistant" : "You"}
        </div>
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center ring-2 ring-background">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}