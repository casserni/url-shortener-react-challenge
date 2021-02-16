// webpack expects a .env file to exists, but when the project is built in netlfiy
// no such file is found because it is .gitignored

// this is a small hack to take the netlify ENV vars and write them to a .env
// so when the project is built, the correct values will be injected from webpack

const fs = require("fs");

fs.writeFileSync("./.env", `API_KEY=${process.env.API_KEY}\n`);
