export default defineEventHandler(async (event) => {
  return {
    routes: [
      {
        description: "Ping the server to check status",
        url: "api/ping",
      },
      {
        description:
          "Return a partial supported response for audio tags to play the track",
        url: "api/play",
        queryParams: ["audioId"],
      },
      {
        description: "Search for tracks",
        url: "api/search",
        queryParams: ["searchTerm"],
      },
      {
        description:
          "Import a playlist from external sources, (supports only spotify right now)",
        url: "api/import",
        queryParams: ["url"],
      },
    ],
  };
});
