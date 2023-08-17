import { ethers } from "hardhat";
import { Outlet } from "react-router-dom";

import Navbar from '../Navbar';

export default function RooLayout() {
  return (
    <div className='App'>
        <Navbar />
        <div className="content">
          <Outlet />
        </div>
    </div>
  )
}

export const connectWalletLoader = async () => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  // get provider for metamask
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const addr = await signer.getAddress();
}