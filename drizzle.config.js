export default {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./studyapp.db"
  }
};
