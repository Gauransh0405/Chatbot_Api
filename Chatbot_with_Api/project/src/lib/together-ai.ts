import type { Message } from '../types';

const TOGETHER_API_KEY = "d5ace9e73b6f6300a169d42c68270d3a15700e3e6745e725f489889fc4bffd29"; // Replace with your actual API key
const API_URL = "https://api.together.xyz/v1/chat/completions";

interface ApiMessage {
  role: string;
  content: string;
}

interface ApiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generateChatResponse(messages: Message[]): Promise<string> {
  try {
    // Convert messages to API format
    const apiMessages: ApiMessage[] = messages.map(msg => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content
    }));

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorData}`);
    }

    const data: ApiResponse = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate response');
  }
}