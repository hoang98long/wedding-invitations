import { z } from "zod";

export const wishInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, "Bạn hãy điền tên nhé.").max(80, "Tên tối đa 80 ký tự."),
  message: z.string().trim().min(1, "Bạn hãy viết một lời chúc nhé.").max(600, "Lời chúc tối đa 600 ký tự."),
  website: z.string().max(0).optional()
}).strict();

export type WishInput = z.infer<typeof wishInputSchema>;
export type WeddingWish = { id: string; name: string; message: string; createdAt: string };
