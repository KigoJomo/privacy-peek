import z from "zod";

export const QuickSearchSchema = z.object({
  search_term: z.string().min(2, {message: "Search term must have at least 2 characters."})
})