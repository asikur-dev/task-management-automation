// src/services/chatService.js
import api from "./api";

export async function createChat(chatData) {
  // Manager role: POST /gpt/chat
  const response = await api.post("/openai/chat", chatData);
  return response.data; // array of chats
}

//stream
export async function chatOnly(messages) {
  // Manager role: POST /gpt/chat-stream
  const response = await api.post("/openai/chat-only", {messages });
  return response.data; // array of chats
}
export async function getChatHistory(sessionId, cursor) {
  // Manager role: GET /gpt/get-chat-history/{sessionId}
  const response = await api.get(`/openai/get-chat-history/${sessionId}?cursor=${cursor}`);
  return response.data; // array of chats
}

export async function deleteChat(chatId) {
  // Manager role: DELETE /gpt/chat/{id}
  const response = await api.delete(`/openai/chat/${chatId}`);
  return response.data; // { message: 'Chat deleted' }
}