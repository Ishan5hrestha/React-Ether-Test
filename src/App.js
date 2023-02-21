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

  const reactiveness = () => {
    setMeroAddress("New Address");
  };

  async function connectWallet() {
    try {
      const provider = await detectEthereumProvider();
      console.log(provider);
      if (provider) {
      console.log(provider);

        await provider.request({ method: 'eth_requestAccounts' });
        const signer = new ethers.providers.Web3Provider(provider).getSigner();
        const address = await signer.getAddress();
        setAddress(address);
      } else {
        console.log('Please install MetaMask');
      }
    } catch (err) {
      console.log('Please connect your Wallet')
      setAddress("Please connect your Wallet");

      // console.error(err);
    }
  }

  // const connectWallet = async () => {
  //   if (window.ethereum) {
  //     try {
  //       await window.ethereum.request({ method: 'eth_requestAccounts' });
  //       const provider = new window.ethers.providers.Web3Provider(window.ethereum);
  //       const signer = provider.getSigner();
  //       const connectedAddress = await signer.getAddress();
  //       setAddress(connectedAddress);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else {
  //     console.log('Metamask not detected');
  //   }
  // };



  return (
    <div>
      <p>Reactiveness test gareko: {meroAddress}</p>
      <p>Address: {address}</p>
      <button onClick={reactiveness}>Test Reactiveness</button><br></br>
      <button onClick={connectWallet}>Connect Wallet</button><br></br>
      <button>Increment Count</button>
      <button>Decrement Count</button>
      <button>Refresh Count</button>
    </div>
  );
}

export default App;
