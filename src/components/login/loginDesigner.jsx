import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import logo from "../../logo.svg";

function LoginDesigner() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  useEffect(() => {
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      sethaveMetamask(true);
    };
    checkMetamaskAvailability();
  }, []);

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance);
      setAccountAddress(accounts[0]);
      localStorage.setItem("wallet_address", accounts[0]);
      setAccountBalance(bal);
      setIsConnected(true);
      setTimeout(() => {
        window.location.href = "/createNFT";
      }, 2000);
      // CreateItem();
    } catch (error) {
      setIsConnected(false);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        {haveMetamask ? (
          <div className="App-header">
            {isConnected ? (
              <div className="card">
                <div className="card-row text-black">
                  <h3>Wallet Address:</h3>
                  <p>
                    {accountAddress.slice(0, 4)}...
                    {accountAddress.slice(38, 42)}
                  </p>
                </div>
                <div className="card-row text-black">
                  <h3>Wallet Balance:</h3>
                  <p>{accountBalance}</p>
                </div>
              </div>
            ) : (
              <img src={logo} className="App-logo" alt="logo" />
            )}
            {isConnected ? (
              <p className="info text-black">🎉 Connected Successfully</p>
            ) : (
              <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 text-xl rounded"
                onClick={connectWallet}
              >
                Connect
              </button>
            )}
          </div>
        ) : (
          <p>Please Install MataMask</p>
        )}
      </header>
    </div>
  );
}

export default LoginDesigner;
