// Basic React
// import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

// For etherJS and metamask provider
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

import countABI from "./contracts/Count.json";

function App() {
  const [meroAddress, setMeroAddress] = useState("Biratnagar");
  const [address, setAddress] = useState("0x00000000");
  const [count, setCount] = useState(0);

  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [providerStats, setProviderStats] = useState("Loading");

  const contractAddress = '0xCb09235a3D6cA50C04b0dF88e9619428FacE438c';

  useEffect(() =>{
    if (provider && !contract) initContract();
    else init();
    console.log('init called');
  },[provider])

  const init = async () => {
    // this returns the provider, or null if it wasn't detected
    const provider = await detectEthereumProvider();

    if (provider) {
      // startApp(provider); // Initialize your app
      setProvider(provider);
      provider.enable();

      provider
        .request({ method: "eth_accounts" })
        .then(handleAccountsChanged)
        .catch((err) => {
          // Some unexpected error.
          // For backwards compatibility reasons, if no accounts are available,
          // eth_accounts will return an empty array.
          console.error(err);
        });

      // Note that this event is emitted on page load.
      // If the array of accounts is non-empty, you're already
      // connected.
      provider.on("accountsChanged", handleAccountsChanged);

      // For now, 'eth_accounts' will continue to always return an array
      function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          console.log("Please connect to MetaMask.");
        } else if (accounts[0] !== address) {
          setAddress(accounts[0]);
        }
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const initContract = async () => {
    if (provider) {
      console.log("provider", provider);

      // Get the provider and signer from the browser window
      const metamaskProvider = new ethers.providers.Web3Provider(provider);
      const signer = metamaskProvider.getSigner();

      const countContract = new ethers.Contract(
        contractAddress,
        countABI,
        signer
      );

      setContract(countContract);
      console.log("Contract Obj", countContract);
    }
  };

  const refreshCount = async () => {
    const currentCount = await contract.getCount();
    setCount(currentCount.toString());
    console.log("Contract Count", currentCount.toString());
  };

  const increment = async () => {
    const txnStatus = await contract.incrementCount();
    const receipt = await txnStatus.wait();

    console.log("increment", receipt);
  };

  const decrement = async () => {
    const txnStatus = await contract.decrementCount();
    const receipt = await txnStatus.wait();

    console.log("decrement", receipt);
  };

  const reactiveness = () => {
    setMeroAddress("New Address");
  };

  async function connectWallet() {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        const signer = new ethers.providers.Web3Provider(provider).getSigner();
        const address = await signer.getAddress();
        setAddress(address);
      } else {
        setAddress('Please install MetaMask');

      }
    } catch (err) {
      setAddress("Please connect your Wallet");
    }
  }

  return (
    <div>
      <p>Reactiveness test gareko: {meroAddress}</p>
      <p>Address: {address}</p>
      <p>Provider: {providerStats}</p>
      {/* <p>Contract Obj: {contract}</p> */}
      <button onClick={reactiveness}>Test Reactiveness</button><br></br>
      <button onClick={connectWallet}>Connect Wallet</button><br></br>
      <button onClick={increment}>Increment Count </button>
      <button onClick={decrement}>Decrement Count </button>
      <p>{count}</p>
      <button onClick={refreshCount}>Refresh Count </button>
    </div>
  );
}

export default App;
