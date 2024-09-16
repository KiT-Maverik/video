import { z } from "zod";
import { movie } from "api";

const request = z.object({ id: z.string() });

const response = z.array(movie);

export const updateMovieContract = { request, response };

export type UpdateMovie_Request = z.infer<typeof request>;
export type UpdateMovie_Response = z.infer<typeof response>;
