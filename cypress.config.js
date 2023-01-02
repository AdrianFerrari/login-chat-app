import { defineConfig } from "cypress";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  env: {
    'my-var': 'ok',
  },
  e2e: {
    baseUrl: 'http://localhost:4000',
    setupNodeEvents(on, config) {
      config.env = config.env || {}
      config.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
      config.env.MONGODB_URI = process.env.MONGODB_URI
      config.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

      return config
    },
    video: false,
  },
});
