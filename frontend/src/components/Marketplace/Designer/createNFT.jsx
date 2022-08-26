import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import { NFTStorage, File, Blob } from "nft.storage";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Buffer } from 'buffer'; 
window.Buffer = Buffer;
// import makeRequest from "./videoCrop";

const projectId = '2DtK23NMPYkajvUB2oDFHLLuRPv'
const projectSecret = '4a45e46645c5eab8f415af8087bf59f9'
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

 const client = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
      authorization: auth
    }
  })
import { marketplaceAddress } from "../../../blockchain/config";
import NFTMarketplace from "../../../blockchain/artifacts/contracts/nftMarketplace.sol/NFTMarketplace.json";

function CreateNFT () {
    const [fileUrl, setFileUrl] = useState(null);
	const [formInput, updateFormInput] = useState({
		price: "",
		name: "",
		description: "",
    });
    	const [nfttype, setNfttype] = useState(0);
    async function onChange(e) {
		const file = e.target.files[0];
		try {
			const added = await client.add(file, {
				progress: (prog) => console.log(`received: ${prog}`),
			});
			const url = `https://nftees.infura-ipfs.io/ipfs/${added.path}`;
			setFileUrl(url);
		} catch (error) {
			console.log("Error uploading file: ", error);
		}
	}
	async function uploadToIPFS () {
		
		const { name, description, price } = formInput;
		if (!name || !description || !price || !fileUrl) return;

		/* upload to NFT.storage */

		const clientnft = new NFTStorage({
      	token:
        	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweERCNWY1ODg0QjVENjY2Mjk4QzgwZGNmNEEzMDUxMTcyQzgyZGM3OEMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MTQ1Mzk4NjE2NiwibmFtZSI6InRyYWlsMSJ9.deWJ3U60Ydi6hh-9XW2EVk9xlz7VKm03fxvrYqcovoQ",
		});
		
		const metadata = await clientnft.store({
			name,
			description,
			image: new File([fileUrl], name, { type: "image/jpg" }),
		});
		console.log(metadata.url);

		/* upload to IPFS */
		
		try {
			const data = JSON.stringify({
				name,
				description,
				image: fileUrl,
				type: nfttype,
			});
			const added = await client.add(data);
			const url = `https://nftees.infura-ipfs.io/ipfs/${added.path}`;
			console.log(url);
			/* after file is uploaded to IPFS, return the URL to use it in the transaction */
			return url;
		} catch (error) {
			console.log("Error uploading file: ", error);
		}
    }
    async function listNFTForSale() {
		const url = await uploadToIPFS();
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		/* next, create the item */
		const price = ethers.utils.parseUnits(formInput.price, "ether");
		let contract = new ethers.Contract(
			marketplaceAddress,
			NFTMarketplace.abi,
			signer
		);
		let listingPrice = await contract.getListingPrice();
		listingPrice = listingPrice.toString();
		let transaction = await contract.createToken(url, price, {
			value: listingPrice,
		});
		toast("NFT Token Created Successfully");
		await transaction.wait();
		
		console.log("Transaction complete!");
	}

  return (
      <div>
          <div className="flex justify-center">
				<div className="w-1/2 flex flex-col pb-12">
					<input
						placeholder="Asset Name"
						className="mt-8 border rounded p-4"
						onChange={(e) =>
							updateFormInput({ ...formInput, name: e.target.value })
						}
					/>
					<textarea
						placeholder="Asset Description"
						className="mt-2 border rounded p-4"
						onChange={(e) =>
							updateFormInput({ ...formInput, description: e.target.value })
						}
					/>
					<input
						placeholder="Asset Price in Eth"
						className="mt-2 border rounded p-4"
						onChange={(e) =>
							updateFormInput({ ...formInput, price: e.target.value })
						}
					/>
					<div>
						<div className="flex mt-4 ">
							<button
								name="nfttype"
								value="1"
								onClick={(e) => setNfttype(e.target.value)}
								className="bg-gray-800 p-2 mr-4 text-white focus:outline-none focus:ring focus:ring-green-500"
							>
								Video
							</button>
							<button
								name="nfttype"
								value="2"
								onClick={(e) => setNfttype(e.target.value)}
								className="bg-gray-800 p-2 text-white focus:outline-none focus:ring focus:ring-green-500"
							>
								Highlights
							</button>
						</div>
					</div>

					<input
						type="file"
						name="Asset"
						className="my-4"
						onChange={onChange}
					/>
					{fileUrl &&
						(nfttype == 1 ? (
							<video src={fileUrl} controls />
						) : nfttype == 0 ? (
							<img src={fileUrl} />
						) : (
                            
							<video
								src="https://ipfs.infura.io/ipfs/QmfU34c2rffvLax4iGEUbvYbBY9fgJ6sugnQTAtuy2sjUS"
								controls
							/>
						))}
					<button
						onClick={listNFTForSale}
						className="font-bold mt-4 bg-gray-800 text-white rounded p-4 shadow-lg"
					>
						Create NFT
					</button>
				</div>
			</div>
    </div>
  )
}

export default CreateNFT