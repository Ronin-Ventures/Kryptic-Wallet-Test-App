import { SigningCosmosClient } from '@cosmjs/launchpad'

import {
    assertIsBroadcastTxSuccess,
    SigningStargateClient,
} from '@cosmjs/stargate'

let account = {}
window.onload = async () => {
   account = await window.kryptic.getWalletAddress();
    if (!window.kryptic) {
        alert("Please install kryptic extension");
    }

    // const chainId = "pulsar-2";

    // Gets the signer
    const offlineSigner = await window.kryptic.getSigner();

    // Gets wallet all accounts
    const accounts = await offlineSigner.getAccounts();

    const cosmJS = new SigningCosmosClient(
        "http://rpc.pulsar.griptapejs.com",
        accounts.key,
        offlineSigner,
    );
};

document.sendForm.onsubmit = () => {
    let recipient = document.sendForm.recipient.value;
    let amount = document.sendForm.amount.value;
    // let memo = document.sendForm.memo.value;

    amount = parseFloat(amount);
    if (isNaN(amount)) {
        alert("Invalid amount");
        return false;
    }

    amount *= 1000000;
    amount = Math.floor(amount);

    (async () => {
        // const chainId = "pulsar-2";
        const offlineSigner = await window.kryptic.getSigner();
        const accounts = await offlineSigner.getAccounts();

        const client = await SigningStargateClient.connectWithSigner(
            "http://rpc.pulsar.griptapejs.com",
            offlineSigner
        )

        const amountFinal = {
            denom: 'uscrt',
            amount: amount.toString(),
        }
        const fee = {
            amount: [{
                denom: 'uscrt',
                amount: '5000',
            }, ],
            gas: '200000',
        }

        const memo = "Test"
        const result = await client.sendTokens(account[0].address, recipient, [amountFinal], fee, memo)

        if (result.code !== undefined &&
            result.code !== 0) {
            alert("Failed to send tx: " + result.log || result.rawLog);
        } else {
            alert("Succeed to send tx:" + result.transactionHash);
        }
    })();

    return false;
};
