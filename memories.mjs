import crypto from "node:crypto";
const COOKIE = "amal_love_session";
function sign(value, secret) { return crypto.createHmac("sha256", secret).update(value).digest("base64url"); }
function isValid(token, secret) {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  const expected = sign(payload, secret);
  const a = Buffer.from(signature), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) return false;
  try { return Number(JSON.parse(Buffer.from(payload,"base64url").toString("utf8")).exp) > Math.floor(Date.now()/1000); }
  catch { return false; }
}
export default async (request) => {
  const raw = request.headers.get("cookie") || "";
  const part = raw.split(";").map(v=>v.trim()).find(v=>v.startsWith(COOKIE+"="));
  const token = part ? decodeURIComponent(part.slice(COOKIE.length+1)) : "";
  if (!isValid(token, process.env.LOVE_SESSION_SECRET)) return new Response(JSON.stringify({error:"Please unlock the site first."}), {status:401,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
  let memories = [];
  try { memories = JSON.parse(process.env.LOVE_MEMORIES_JSON || "[]"); if (!Array.isArray(memories)) memories=[]; } catch { memories=[]; }
  return new Response(JSON.stringify({memories}), {status:200,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
};
