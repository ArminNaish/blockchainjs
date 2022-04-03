import { v4 as uuid} from "https://deno.land/std@0.119.0/uuid/mod.ts";
import { Blockchain } from './blockchain.js';

const nodeId = String(uuid.generate()).replace('-', '');
const blockchain = new Blockchain(nodeId);

const INVALID_JSON_ERROR = "Please provide a valid JSON body.";

export const newTransaction = async (context) => {
    if (!context.request.hasBody) {
        context.response.status = 400;
        context.response.body = { message: INVALID_JSON_ERROR};
        return;
    }

    let transaction;
    try {
        transaction = await context.request.body().value;
    } catch {
        context.response.status = 400;
        context.response.body = INVALID_JSON_ERROR;
        return;
    }

    const { sender, recipient, amount } = transaction;
    if (!sender || !recipient || !amount)
    {
        context.response.status = 400;
        context.response.body = { message: "Missing values in json body."};
        return;
    }

    const newTransaction = blockchain.newTransaction(transaction);

    context.response.status = 200;
    context.response.body = newTransaction;
}

export const mine = (context) => {
    const block = blockchain.mine();
    context.response.status = 200;
    context.response.body = block;
}

export const getBlockchain = (context) => {
    context.response.status = 200;
    context.response.body = blockchain.chain;    
}