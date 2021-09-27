import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [numberOfWaves, setNumberOfWaves] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [allWaves, setAllWaves] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const contractAddress = "0xEAE903d2456692ea744de849F203eDa8Df406869";
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
      getAllWaves();
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
        let count = await wavePortalContract.getTotalWaves();
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

        console.log(userMessage);

        // STEP 3: This as we're using react, we can do this in the v-dom :D
        let waveTxn = await wavePortalContract.wave(userMessage);
        setUserMessage("");
        // STEP 4: Change message to our new state variable, in our case userMessage
        console.log(`Mining... ${waveTxn.hash}`);
        setIsMining(true);

        await waveTxn.wait();
        console.log(`Mined -- ${waveTxn.hash}`);
        setIsMining(false);

        let count = await wavePortalContract.getTotalWaves();
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

  const getAllWaves = async () => {
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

        const waves = await wavePortalContract.getAllWaves();
        let wavesCleaned = [];

        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
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

        <form>
          <div className="mb-3">
            <input
              id="inputMessage"
              type="text"
              className="form-control"
              required
              onChange={(e) => setUserMessage(e.target.value)}
            />
          </div>

          {!isMining && (
            <button className="waveButton" onClick={wave}>
              Wave at Me
            </button>
          )}
        </form>

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

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: "OldLace",
                marginTop: "16px",
                padding: "8px",
              }}
            >
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
