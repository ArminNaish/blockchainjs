import { assert, assertEquals, assertStrictEquals } from "https://deno.land/std@0.132.0/testing/asserts.ts";
import { Blockchain } from './blockchain.js';

Deno.test('should make a new blockchain', () => {
    // arrange/act
    const blockchain = new Blockchain();

    // assert
    assert(blockchain);
});

Deno.test('should initialize blockchain with a genesis block', () => {
    // arrange
    const blockchain = new Blockchain();
    
    // act
    const actual = blockchain.chain[0];

    // assert
    assert(actual);
    assert(actual.hash);
    assert(actual.timestamp);
    assertStrictEquals(actual.index, 1);
    assertStrictEquals(actual.previousHash, null);
    assertStrictEquals(actual.proof, 1);
    assertEquals(actual.transactions,[]);
});

Deno.test('should add new transaction', () => {
    // arrange
    const blockchain = new Blockchain();
    
    // act
    const actual = blockchain.newTransaction({
        sender:'a', 
        recipient:'b',
        amount:5
    });

    // assert
    assert(actual);
    assertStrictEquals(actual.sender, 'a');
    assertStrictEquals(actual.recipient, 'b');
    assertStrictEquals(actual.amount, 5)
});

Deno.test('should mine block with reward', () => {
    // arrange
    const blockchain = new Blockchain();
    const genesis = blockchain.chain[0];

    // act
    const actual = blockchain.mine();

    // assert
    assert(actual);
    assert(actual.hash);
    assert(actual.timestamp);
    assertStrictEquals(actual.index, genesis.index+1);
    assertStrictEquals(actual.previousHash, genesis.hash);
    assertStrictEquals(actual.proof, 72608);
    assert(actual.transactions)
    assert(actual.transactions.length === 1);
    assertEquals(actual.transactions,[{sender: null, recipient: blockchain.id, amount: 1}]);
});

Deno.test('should mine block with other transactions', () => {
    // arrange
    const blockchain = new Blockchain();
    const genesis = blockchain.chain[0];

    // act
    blockchain.newTransaction({sender: 'a', recipient: 'b', amount: 5})
    const actual = blockchain.mine();

    // assert
    assert(actual);
    assert(actual.hash);
    assert(actual.timestamp);
    assertStrictEquals(actual.index, genesis.index+1);
    assertStrictEquals(actual.previousHash, genesis.hash);
    assertStrictEquals(actual.proof, 72608);
    assert(actual.transactions)
    assert(actual.transactions.length === 2);
    assertEquals(actual.transactions,[
        {sender: 'a', recipient: 'b', amount: 5},
        {sender: null, recipient: blockchain.id, amount: 1}
    ]);
});