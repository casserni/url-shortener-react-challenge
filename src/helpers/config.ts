require("dotenv").config();

type Config = {
  API_KEY?: string;
};

export const config: Config = {
  API_KEY: process.env.API_KEY,
};
