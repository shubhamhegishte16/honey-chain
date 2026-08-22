import { apiRequest } from './api';

export const sendChatMessage = async (message, history, context) => {
  return await apiRequest('/chatbot/message', {
    method: 'POST',
    body: JSON.stringify({ message, history, context })
  });
};
