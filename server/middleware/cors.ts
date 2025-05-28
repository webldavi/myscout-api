export default defineEventHandler((event) => {
  console.log("CORS middleware rodando...");
  const res = event.node.res;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (event.node.req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
  }
});
