import ytdl from "ytdl-core";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(404);
    res.end();
    return;
  }

  const info = await ytdl.getInfo(req.query.link);
  res.json({
    title: info.videoDetails.title,
  });
  return;
};

export default handler;
