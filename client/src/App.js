import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [numberOfWaves, setNumberOfWaves] = useState(0);
  const [isMining, setIsMining] = useState(false);

  const contractAddress = "0x38603aB10F05671836474543207E94D490E53c42";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask enabled!");
      return;
    } else {
      console.log("We have the ethereum object : ", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length === 0) {
      console.log("No authorized account found");
    } else {
      const account = accounts[0];
      console.log(`Found an authorized account : ${account}`);
      setCurrentAccount(account);
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get Metamask!");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(`Connected to ${accounts[0]}`);
    setCurrentAccount(accounts[0]);
  };

  const getTotalNumberOfWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let count = await wavePortalContract.getTotalWaveCount();
        console.log(
          `Retrieved total number of waves which is : ${count.toNumber()}`
        );
        setNumberOfWaves(count.toNumber());
      } else {
        console.log("Ethereum object not found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let waveTxn = await wavePortalContract.wave();
        console.log(`Mining... ${waveTxn.hash}`);
        setIsMining(true);

        await waveTxn.wait();
        console.log(`Mined -- ${waveTxn.hash}`);
        setIsMining(false);

        let count = await wavePortalContract.getTotalWaveCount();
        console.log(
          `Retrieved total number of waves which is : ${count.toNumber()}`
        );
        setNumberOfWaves(count.toNumber());
      } else {
        console.log("Ethereum object not found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    getTotalNumberOfWaves();
  });

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">Hey there!</div>

        <div className="bio">
          Hi, I'm Shreyas Londhe and I worked on this WavePortal, pretty cool
          right!? Connect your Metamask to 👋 at me!
        </div>

        <h3 className="m-5 text-center">Wave Count: {numberOfWaves}</h3>

        {isMining && (
          <button className="btn btn-danger" type="button" disabled>
            <span
              className="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Mining...</span>
          </button>
        )}

        {!isMining && (
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        )}

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
