import express, { Request, Response } from "express";

const app = express();

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
