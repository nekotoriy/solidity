const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface: abi, bytecode } = require("../compile");

describe("Inbox", function () {
    let accounts;
    let inbox;

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();

        inbox = await new web3.eth.Contract(JSON.parse(abi))
            .deploy({
                data: bytecode,
                arguments: ["Hi there!"],
            })
            .send({ from: accounts[0], gas: "1000000" });
    });

    it("Is accounts exists", function () {
        assert.equal(Array.isArray(accounts) && accounts.length >= 1, true);
    });

    it("Check is contract deployed", function () {
        assert.ok(inbox.options.address);
    });

    it("Is initial message setted", async function () {
        const message = await inbox.methods.message().call();

        assert.equal(message, "Hi there!");
    });

    it("Is setMessage change message field", async function () {
        await inbox.methods.setMessage("Hola, Javascript").send({ from: accounts[0] });

        const message = await inbox.methods.message().call();

        assert.equal(message, "Hola, Javascript");
    });
});
