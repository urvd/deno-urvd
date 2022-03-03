import { Application, Context } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { emprunt, reception, retour} from './src/service.ts';
export const app = new Application();

app.static('/', './src');

app.start({port:3100});

const content = {app: "web-api", name:"Bookinthèque-web-api"};
app.get('/', async(ctx: Context) => {
    await ctx.json(content);
});

app.post('api/user/emprunter', async(ctx: Context) => {
   await emprunt(ctx);
});

app.post('api/user/receptionner', async(ctx: Context) => {
    await reception(ctx);
});

app.post('api/user/retourner', async(ctx: Context) => {
    await retour(ctx);
});