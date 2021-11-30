export interface TagSchema {
  server: string;
  user: string;
  name: string;
  content: string;
  attachments: string[];
  global: boolean;
  nsfw: boolean;
}
