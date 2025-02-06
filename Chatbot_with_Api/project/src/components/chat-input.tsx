import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-muted-foreground/10 focus:border-primary/50 focus:ring-0 focus:outline-none transition-colors disabled:opacity-50 pr-12 dark:bg-muted/20"
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !input.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
}