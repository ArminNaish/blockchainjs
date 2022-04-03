import { Sha256 } from "https://deno.land/std/hash/sha256.ts";

export class Blockchain {
    #nodeId;
    #chain = [];
    #currentTransactions = [];

    constructor(nodeId) {
        const genesis = this.#newBlock();
        this.#chain = [genesis];
        this.#nodeId = nodeId;
    }

    get id() {
        return this.#nodeId;
    }

    get chain() {
        return this.#chain;
    }

    newTransaction({ sender, recipient, amount}) {
        const transaction = {sender, recipient, amount}
        this.#currentTransactions.push(transaction);
        return transaction;
    }

    mine() {
        const lastBlock = this.#chain.at(-1);
        const proof = this.#proofOfWork(lastBlock.proof);
        this.newTransaction({
            sender: null, 
            recipient: this.#nodeId,
            amount: 1})
        return this.#newBlock({proof, previousHash: lastBlock.hash});
    }

    #newBlock({proof=1, previousHash=null}={}) {
        const block = {
            index: this.#chain.length + 1,
            proof: proof,
            previousHash: previousHash,
            timestamp: Date.now(),
            transactions: this.#currentTransactions,
        }
        const hash = this.#hash(block);
        const hashedBlock = {...block, hash};
        // reset the current list of transactions
        this.#currentTransactions = [];
        this.#chain.push(hashedBlock);
        return hashedBlock;
    }

    #hash(block) {
        const json = JSON.stringify(block, replacer);
        return new Sha256().update(json).hex();
    }
    
    #proofOfWork (lastProof) {
        for (let proof = 0; proof < Infinity; proof++) {
            if (this.#validateProof(lastProof, proof)) 
                return proof;
        }
    }
    
    #validateProof = (lastProof, proof) => {
        const guess = `${lastProof}${proof}`;
        const hashedGuess = new Sha256().update(guess).hex();   
        return hashedGuess.substring(0,4) === '0000';
    }
}

const replacer = (_, value) => 
    value instanceof Object && !(value instanceof Array)
        ? Object.keys(value)
            .sort()
            .reduce((sorted, key) => {
                sorted[key] = value[key];
                return sorted 
            }, {}) 
        : value;