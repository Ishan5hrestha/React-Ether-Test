// Basic React
// import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

// For etherJS and metamask provider
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

function App() {
  const [meroAddress, setMeroAddress] = useState("Biratnagar");
  const [address, setAddress] = useState("0x00000000");

  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [providerStats, setProviderStats] = useState("Loading");

  const contractAddress = ''

  useEffect(() =>{
    if (provider && !contract) console.log('sabai aaisakyo');
    else init();
    console.log('init called');
  },[provider])

  const init = async () => {
    // Return the provider or null if it isn't detected
    const provider = await detectEthereumProvider();
    if (provider) {
      setProviderStats("Ready");
      provider.enable();
      await provider.request({ method: 'eth_requestAccounts' });
      const signer = new ethers.providers.Web3Provider(provider).getSigner();
      const address = await signer.getAddress();
      setAddress(address);

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
        setAddress('Please install MetaMask');
    }
  }

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
      <button onClick={reactiveness}>Test Reactiveness</button><br></br>
      <button onClick={connectWallet}>Connect Wallet</button><br></br>
      <button>Increment Count</button>
      <button>Decrement Count</button>
      <button>Refresh Count</button>
    </div>
  );
}

export default App;
