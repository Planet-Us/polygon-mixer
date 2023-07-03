import react, { Component, useEffect, useState } from 'react';
import { TextField, Button } from "@mui/material";
import contractData from "../Contract.json";
import Web3 from 'web3';

import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

// const ipcRenderer = window.require('electron').ipcRenderer;
const web3 = new Web3('https://polygon-mumbai.infura.io/v3/ca00b968b9834974a18d5a892796a7f9');
const contractAddress = contractData.contractAddress;
const contractABI = contractData.contractABI;
const contract = new web3.eth.Contract(contractABI,contractAddress) ;


export default function Wallet(props) {

    const [address, setAddress] = useState("");
    const [address2, setAddress2] = useState("");
    const [amount, setAmount] = useState("");
    const [amount2, setAmount2] = useState("");
    const [balance, setBalance] = useState(0);
    const [balance2, setBalance2] = useState(0);
    const [loading, setLoading] = useState(false);
    const [privateKey, setPrivateKey] = useState("");
    const [privateKey2, setPrivateKey2] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const getSendBalance = async () => {
        if(address.length > 0){
            let balanceFromAcc = await web3.eth.getBalance(address);
            setBalance(web3.utils.fromWei(balanceFromAcc, 'ether'));
        }
    }
    const getAddress = async (_privateKey) =>{
        let addressFromPK = web3.eth.accounts.privateKeyToAccount(_privateKey);
        setAddress(addressFromPK.address);
    }
    
    const getReceiveAddress = async (_privateKey) =>{
        let addressFromPK = web3.eth.accounts.privateKeyToAccount(_privateKey);
        setAddress2(addressFromPK.address);
    }
    useEffect(() => {
        getSendBalance();
    },[address])

    const amountChange = (e) => {
        setAmount(e.target.value);
    }
    const passwordChange = (e) => {
        setPassword(e.target.value);
    }
    const amount2Change = (e) => {
        setAmount2(e.target.value);
    }
    const password2Change = (e) => {
        setPassword2(e.target.value);
    }
    const privateKeyChange = (e) => {
        setPrivateKey(e.target.value);
    }
    const privateKey2Change = (e) => {
        setPrivateKey2(e.target.value);
    }
    const sendTransfer = async () => {
        await web3.eth.accounts.wallet.add(privateKey);
        const hashedPassword = web3.utils.soliditySha3(password);
        const block = await web3.eth.getBlock('latest');
        const next_gas_price = Math.ceil(Number(block.baseFeePerGas)*1.1);
        const rawTx = {
            from: address,
            to: contractAddress,
            data: contract.methods.depositMixer(hashedPassword).encodeABI(),
            value: web3.utils.toWei(amount.toString(), "ether"),
            // maxFeePerGas: next_gas_price,
            gas: "200000"
        }
        console.log(rawTx);

        console.log(hashedPassword);
        let ret = await web3.eth.sendTransaction(rawTx)
        .then(function (receipt) {
            console.log(receipt);
        })
        .catch((err) => {
            console.log(err);
        })
        
    }
    
    const receiveMoney = async () => {
        await web3.eth.accounts.wallet.add(privateKey2);
        const block = await web3.eth.getBlock('latest');
        const next_gas_price = Math.ceil(Number(block.baseFeePerGas)*1.1);
        let ret = await web3.eth.sendTransaction({
            from: address2,
            to: contractAddress,
            data: contract.methods.withdrawMixer(password2).encodeABI(),
            // maxFeePerGas: next_gas_price,
            gas: "200000"
        })
        .then(function (receipt) {
            console.log(receipt);
        })
        .catch((err) => {
            alert(err);
        })
        
    }
    const importSendWallet = async (action) => {
            getAddress(privateKey);
    }
    const importReceiveWallet = async (action) => {
            getReceiveAddress(privateKey2);
    }

    return (
        <div style={{ display: "flex", width: "100%", backgroundColor: "#363940" }}>
            <div style={{ width: "100%", marginLeft: "40%", margin: "10px", backgroundColor: "#363940" }}>
                <div>
                    <span style={{ width: "100%", fontSize: "20px", marginRight: "10px" }}>Private Key</span>
                    <TextField style={{ width: '35%' }} value={privateKey} onChange={(e) => privateKeyChange(e)} id="outlined-basic" label="PrivateKey" variant="outlined" /><br />
                    <Button onClick={importSendWallet} variant="contained">Import Sending Wallet</Button>
                </div>
                <span style={{ width: "100%", fontSize: "20px" }}>{address}</span><br />
                <span style={{ width: "100%", fontSize: "30px" }}>{balance} MATIC</span>    
                <div>
                    <TextField style={{ width: '35%' }} value={amount} onChange={(e) => amountChange(e)} id="outlined-basic" label="Amount" variant="outlined" /><br />
                    <TextField style={{ width: '35%' }} value={password} onChange={(e) => passwordChange(e)} id="outlined-basic" label="password" variant="outlined" /><br />
                    <Button onClick={sendTransfer} variant="contained">Send</Button>
                </div>
                <div>
                    <span style={{ width: "100%", fontSize: "20px", marginRight: "10px" }}>Private Key2</span>
                    <TextField style={{ width: '35%' }} value={privateKey2} onChange={(e) => privateKey2Change(e)} id="outlined-basic" label="PrivateKey" variant="outlined" /><br />
                    <Button onClick={importReceiveWallet} variant="contained">Import Receiving Wallet</Button>
                </div>
                <span style={{ width: "100%", fontSize: "20px" }}>{address2}</span><br />
                <span style={{ width: "100%", fontSize: "30px" }}>{balance2} MATIC</span>    
                <div>
                    <TextField style={{ width: '35%' }} value={amount2} onChange={(e) => amount2Change(e)} id="outlined-basic" label="Amount" variant="outlined" /><br />
                    <TextField style={{ width: '35%' }} value={password2} onChange={(e) => password2Change(e)} id="outlined-basic" label="password" variant="outlined" /><br />
                    <Button onClick={receiveMoney} variant="contained">Receive</Button>
                </div>
            </div>
        </div>
    );
}