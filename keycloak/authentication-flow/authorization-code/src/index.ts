import express, { Request, Response, response } from "express";

// OBS: for the 'authorization code' flow we must define in the
// KeyCloak dashboard the realm "Access settings" "root url"
// In this case, "root URL" is "http://localhost:3000"

const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/login", (_req: Request, res: Response) => {
  const loginParams = new URLSearchParams({
    client_id: "fullcycle-client",
    redirect_uri: "http://localhost:3000/callback",
    response_type: "code",
    scope: "openid",
  });
  const url = `http://localhost:8080/realms/fullcycle-realm/protocol/openid-connect/auth?${loginParams.toString()}`;
  res.redirect(url);
});

app.get("/callback", async (req, res) => {
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
  res.json(result);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
