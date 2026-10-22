import { createServer } from "#adapters/http/server";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const app = createServer();

app.listen(port);

console.log(`notification running at http://localhost:${port}`);
