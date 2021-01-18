import Koa from "koa";
import serve from "koa-static";
import mount from "koa-mount";

function bootstrap() {
  const app = new Koa();

  app.use(mount("/", serve(__dirname + "/static/pages")));
  app.use(mount("/static", serve(__dirname + "/static")));

  return app;
}

export async function startup() {
  const app = bootstrap();

  await app.listen(3002);

  console.log("Listen server on 3002");
}
