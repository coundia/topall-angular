export type ChatMessage = {
  id: string;
  user: 'me' | 'bot';
  content: string;
  createdAt: Date;
  files?: File[];
};
