"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Send } from "lucide-react";
import { Card, CardFooter } from "components/ui/card";
import { ScrollArea } from "components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI coding assistant. How can I help you today?",
      timestamp: "01:19 PM",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'd be happy to help you with that! What specific coding task would you like assistance with?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isUser: false,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Card className="h-full flex flex-col bg-accent/30 border-1 border-accent overflow-hidden">
      <ScrollArea className="flex-1 p-4 space-y-2 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col space-y-1 ${message.isUser ? "items-end" : "items-start"}`}
          >
            <div className={"max-w-[85%] rounded-xl p-4"}>
              <p className="text-sm">{message.content}</p>
            </div>
            <span className="text-xs text-muted-foreground">
              {message.timestamp}
            </span>
          </div>
        ))}
      </ScrollArea>

      <CardFooter className="border-t p-2 flex flex-col space-y-2">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-lg border-border/50 bg-background/50 focus:bg-background transition-all"
          />
          <Button onClick={handleSend} size="sm" className="rounded-lg px-4">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Obby may make mistakes. Please use with discretion.
        </p>
      </CardFooter>
    </Card>
  );
}
