import { httpRouter } from "convex/server";
import { health } from "./httpActions";

const http = httpRouter();

http.route({
  path: "/health",
  method: "GET",
  handler: health
});

http.route({
  path: "/health",
  method: "DELETE",
  handler: health
});

http.route({
  path: "/health",
  method: "OPTIONS",
  handler: health
});

http.route({
  path: "/health",
  method: "PATCH",
  handler: health
});

http.route({
  path: "/health",
  method: "POST",
  handler: health
});

http.route({
  path: "/health",
  method: "PUT",
  handler: health
});

export default http;