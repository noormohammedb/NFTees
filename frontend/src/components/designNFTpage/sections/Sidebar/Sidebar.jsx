import React, { useState } from "react";
import {
  FaBehance,
  FaDribbble,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaSkype,
  FaTwitter,
} from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import profile from "./../../../../images/profile.jpg";
import { ethers } from 'ethers';
const socials = [
  {
    id: 1,
    icon: <FaFacebookF />,
    link: "#0",
  },
  {
    id: 2,
    icon: <FaGithub />,
    link: "#0",
  },
  {
    id: 3,
    icon: <FaLinkedinIn />,
    link: "#0",
  },
  {
    id: 4,
    icon: <FaInstagram />,
    link: "#0",
  },
  {
    id: 5,
    icon: <FaBehance />,
    link: "#0",
  },
  {
    id: 6,
    icon: <FaDribbble />,
    link: "#0",
  },
  {
    id: 7,
    icon: <FaSkype />,
    link: "#0",
  },
  {
    id: 7,
    icon: <FaTwitter />,
    link: "#0",
  },
];

const Sidebar = (props) => {
  const [amt, setAmt] = useState(1);
  const [account, setAccount] = useState("");
  const [value, setValue] = React.useState(0);
  const [txs, setTxs] = useState([]);
  const ethervalue = [];
  const { name, description, image, wallet_address, email_id } = props.clickeddata;

  const startPayment = async ({ setTxs, ether, to_addr }) => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      ethers.utils.getAddress(to_addr);
      const tx = await signer.sendTransaction({
        to: to_addr,
        value: ethers.utils.parseEther(ether)
      });
      ethervalue.push({
        ether, to_addr
      })
      const tx_from = tx.from;
      console.log({ ether, to_addr, tx_from });
      console.log("tx", tx);
      console.log("ethervalue", ethervalue);
      toast(`Donation of ${amt} ether Successful`);
      setTxs([tx]);
    } catch (err) {
      console.log(err)
      toast("Donation UnSuccessful");
    }
  };

  const stake = async () => {
    console.log(amt)
    // transactions.methods.send(wallet_address, amt).send({ from: account });
    await startPayment({
      setTxs,
      ether: amt.toString(),
      to_addr: wallet_address
    });
  }
  return (
    <aside className="sticky top-0 bg-white md:mx-8 lg:mx-4 mb-8 p-6 shadow-md rounded-md -mt-40">
      <div className="w-full h-3/4 rounded-md overflow-hidden mx-auto mb-5">
        <img src={image} alt="shafiqhammad" className="w-full" />
      </div>
      <div className="text-center">
        <h1 className="text-xl text-gray-800 font-bold mb-1"> {name}</h1>
        <input className="mt-5 border rounded p-2" type="number" onChange={
          (e) => {
            setAmt(e.target.value)
          }
        } />
        <button
          onClick={stake}
          className="inline-block mb-3 rounded bg-purple-600 text-center border-0 py-2 px-6 text-white leading-7 tracking-wide hover:bg-purple-800"
          download="Resume"
        >
          Stake
        </button>
        <ul className="flex flex-wrap justify-center">
          {socials.map((social, id) => (
            <SocialIcon social={social} key={id} />
          ))}
        </ul>
      </div>
      <div className="text-start pt-4">
        <h3 className="text-md mb-2 uppercase font-medium text-gray-800">
          About Me
        </h3>
        <p className="text-gray-400 text font-light leading-relaxed">
          {description}
        </p>
      </div>
      <ToastContainer />
    </aside>
  );
};

export default Sidebar;

const SocialIcon = (props) => {
  const { icon, link } = props.social;
  return (
    <li className="m-2">
      <a
        href={link}
        className="w-8 h-8 bg-purple-100 rounded text-purple-800 flex items-center justify-center hover:text-white hover:bg-purple-600"
      >
        {icon}
      </a>
    </li>
  );
};
