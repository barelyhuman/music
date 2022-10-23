const handler = (req, res) => {
  if (req.method !== "GET") {
    res.status(404);
    res.end();
    return;
  }

  res.send({ pong: "pong" });
};

export default handler;
