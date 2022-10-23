import ytdl from "ytdl-core";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(404);
    res.end();
    return;
  }

  const info = await ytdl.getInfo(req.query.link);
  const selectedFormat = ytdl.chooseFormat(info.formats, {
    quality: "highestaudio",
  });

  const options = {
    format: selectedFormat,
  };

  if (req.headers.range) {
    const parts = req.headers.range.replace(/bytes=/, "").split("-");
    const partialstart = parts[0];
    const partialend = parts[1] || false;
    const start = parseInt(partialstart, 10);
    let end;

    if (partialend) {
      end = parseInt(partialend, 10);
    }

    options.range = {
      start,
      end,
    };
  }

  ytdl(req.query.link, options).pipe(res);
};

export default handler;
