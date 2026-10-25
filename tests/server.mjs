import { createServer } from 'node:http';
import { createFixtureResponder } from './fixture.mjs';
const respond = await createFixtureResponder();
createServer(async (req, res) => {
  const result = await respond(new URL(req.url, 'http://127.0.0.1:43279'));
  res.writeHead(result.status, { 'content-type': result.contentType }); res.end(result.body);
}).listen(43279, '127.0.0.1');
