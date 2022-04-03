import { Application, Router } from "https://deno.land/x/oak@v10.4.0/mod.ts";

import { 
    newTransaction,
    getBlockchain,
    mine,
} from './blockchain.controller.js';


const port = 5000;
const app = new Application();
const router = new Router();

router.get('/blockchain', getBlockchain);
router.post('/blockchain/transactions', newTransaction);
router.put('/blockchain/mine', mine);

app.use(router.allowedMethods());
app.use(router.routes());

app.addEventListener('listen', () => console.log(`Listening on: localhost:${port}`));

await app.listen({port});