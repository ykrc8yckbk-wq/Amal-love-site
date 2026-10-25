import crypto from "node:crypto";

const COOKIE = "amal_love_session";
const SESSION_SECONDS = 60 * 60 * 12;
function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}
function safeEqual(a, b) {
  const aa = Buffer.from(String(a)), bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}
function json(status, data, headers = {}) {
  return new Response(JSON.stringify(data), {status, headers: {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store", ...headers}});
}
export default async (request) => {
  const password = process.env.LOVE_PASSWORD;
  const secret = process.env.LOVE_SESSION_SECRET;
  if (!password || !secret) return json(500, {error:"Site setup is incomplete. Ask the site owner to configure its environment variables."});
  if (request.method === "DELETE") {
    return json(200, {ok:true}, {"Set-Cookie":`${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`});
  }
  if (request.method !== "POST") return json(405, {error:"Method not allowed."}, {"Allow":"POST, DELETE"});
  let body;
  try { body = await request.json(); } catch { return json(400, {error:"Invalid request."}); }
  if (!safeEqual(String(body.password || ""), password)) return json(401, {error:"Incorrect passcode."});
  const expires = Math.floor(Date.now()/1000) + SESSION_SECONDS;
  const payload = Buffer.from(JSON.stringify({exp:expires, nonce:crypto.randomBytes(12).toString("hex")})).toString("base64url");
  const token = `${payload}.${sign(payload, secret)}`;
  return json(200, {ok:true}, {"Set-Cookie":`${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_SECONDS}`});
};
