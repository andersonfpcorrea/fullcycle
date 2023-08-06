import crypto from "crypto";
import session, { Session } from "express-session";
import express, { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

// OBS: for the 'authorization code' flow we must define in the
// KeyCloak dashboard the realm "Access settings" "root url"
// In this case, "root URL" is "http://localhost:3000"

interface CustomRequest extends Request {
  session: { nonce?: string; user?: string; state?: string } & Session;
}

const app = express();
const memoryStore = new session.MemoryStore();

app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
    store: memoryStore,
  })
);

const middlewareIsAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //@ts-expect-error - type mismatch
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/login", (req: CustomRequest, res: Response) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  const state = crypto.randomBytes(16).toString("base64");

  req.session.nonce = nonce;
  req.session.state = state;
  req.session.save();

  const loginParams = new URLSearchParams({
    client_id: "fullcycle-client",
    redirect_uri: "http://localhost:3000/callback",
    response_type: "code",
    scope: "openid",
    nonce,
    state,
  });
  const url = `http://localhost:8080/realms/fullcycle-realm/protocol/openid-connect/auth?${loginParams.toString()}`;
  res.redirect(url);
});

app.get("/callback", async (req: CustomRequest, res) => {
  if (req.session.user) return res.redirect("/admin");
  if (req.query.state !== req.session.state) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const bodyParams = new URLSearchParams({
    client_id: "fullcycle-client",
    grant_type: "authorization_code",
    code: req.query.code?.toString() ?? "",
    redirect_uri: "http://localhost:3000/callback",
  });
  const url = `http://keycloak:8080/realms/fullcycle-realm/protocol/openid-connect/token`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });
  const result = await response.json();
  const payloadAccessToken = jwt.decode(result.access_token) as jwt.JwtPayload;
  const refreshToken = jwt.decode(result.refresh_token) as jwt.JwtPayload;
  const idToken = jwt.decode(result.id_token) as jwt.JwtPayload;

  if (
    req.session.nonce &&
    ![payloadAccessToken.nonce, refreshToken.nonce, idToken.nonce].includes(
      req.session?.nonce
    )
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json(result);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
