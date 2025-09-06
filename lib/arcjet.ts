import arcjet, {
  shield,
  detectBot,
  fixedWindow,
  sensitiveInfo,
  slidingWindow,
  protectSignup,
} from "@arcjet/next";
export {
  shield,
  detectBot,
  fixedWindow,
  sensitiveInfo,
  slidingWindow,
  protectSignup,
};
export default arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["fingerprint"],
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});
