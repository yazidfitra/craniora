import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "academy.craniora.app",
  appName: "Craniora Academy",
  webDir: "out",
  server: {
    // Point to your deployed server URL
    // Change this to your actual deployed URL when ready
    url: "http://localhost:3000",
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
