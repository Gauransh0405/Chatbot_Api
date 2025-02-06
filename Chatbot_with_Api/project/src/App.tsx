import React from "react";
import { useRecoilState } from "recoil";
import { Bot, Sun, Moon, AlertCircle } from "lucide-react";
import { ChatMessage } from "./components/chat-message";
import { ChatInput } from "./components/chat-input";
import { ScrollArea } from "./components/ui/scroll-area";
import { Button } from "./components/ui/button";
import { messagesState, isTypingState, themeState } from "./store/atoms";
import { generateChatResponse } from "./lib/together-ai";
import type { Message } from "./types";

function App() {
  const [messages, setMessages] = useRecoilState(messagesState);
  const [isTyping, setIsTyping] = useRecoilState(isTypingState);
  const [theme, setTheme] = useRecoilState(themeState);
  const [error, setError] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleError = (error: Error) => {
    setError(error.message);
    setTimeout(() => setError(null), 5000);
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const updatedMessages = [...messages, userMessage];
      const response = await generateChatResponse(updatedMessages);

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: response,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error("Failed to generate response"));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">AI Chat Assistant</h1>
            <p className="text-sm text-muted-foreground">Powered by Mistral-7B</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
          {error && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="max-w-4xl mx-auto pt-6 pb-24">
            <div className="space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="p-4 rounded-2xl bg-muted/50 w-fit">
                  <div className="flex gap-2 items-center text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background to-background/80 pt-6 pb-4 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4">
          <ChatInput onSend={handleSendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}

export default App