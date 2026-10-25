const COOKIE = "amal_love_session";
function base64UrlDecode(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  return atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
}
async function hmac(value, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
async function validToken(token, secret) {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  const expected = await hmac(payload, secret);
  if (signature.length !== expected.length) return false;
  let mismatch = 0;
  for (let i=0;i<signature.length;i++) mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  if (mismatch !== 0) return false;
  try { return Number(JSON.parse(base64UrlDecode(payload)).exp) > Math.floor(Date.now()/1000); }
  catch { return false; }
}
export default async (request, context) => {
  const path = new URL(request.url).pathname;
  const publicPaths = new Set(["/", "/index.html", "/style.css", "/login.js", "/app.js", "/favicon.ico"]);
  if (publicPaths.has(path) || path.startsWith("/.netlify/functions/auth")) return context.next();
  const raw = request.headers.get("cookie") || "";
  const item = raw.split(";").map(v=>v.trim()).find(v=>v.startsWith(COOKIE+"="));
  const token = item ? decodeURIComponent(item.slice(COOKIE.length+1)) : "";
  if (await validToken(token, Netlify.env.get("LOVE_SESSION_SECRET"))) return context.next();
  return Response.redirect(new URL("/", request.url), 302);
};
export const config = { path: "/*" };
