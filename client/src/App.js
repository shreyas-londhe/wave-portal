import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get Metamask!");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    console.log(`Connected to account : ${accounts[0]}`);
    setCurrentAccount(accounts[0]);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-6 offset-3 text-center">
          <h1 className="display-1 mt-5">
            <strong>Hey there!</strong>
          </h1>

          <button className="btn btn-secondary my-4">Wave at me! 👋</button>

          {!currentAccount && (
            <button onClick={connectWallet} className="btn btn-primary">
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
