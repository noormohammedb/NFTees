
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import BlogItem from "./BlogItem";
import { marketplaceAddress } from "../../../../blockchain/config";
import NFTMarketplace from "../../../../blockchain/artifacts/contracts/nftMarketplace.sol/NFTMarketplace.json";
import Web3Modal from 'web3modal'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Blog = ({ wallet_address }) => {
	const [nfts, setNfts] = useState([]);
	useEffect(() => {
		loadNFTs();
	}, []);
	async function loadNFTs() {
		const provider = new ethers.providers.JsonRpcProvider();
		const contract = new ethers.Contract(
			marketplaceAddress,
			NFTMarketplace.abi,
			provider
		);
		console.log(contract);
		const data = await contract.fetchMarketItems();

		const items = await Promise.all(
			data.map(async (i) => {
				const tokenUri = await contract.tokenURI(i.tokenId);
				const meta = await axios.get(tokenUri);
				console.log(meta.data);
				let price = ethers.utils.formatUnits(i.price.toString(), "ether");
				let item = {
					price,
					tokenId: i.tokenId.toNumber(),
					seller: i.seller,
					owner: i.owner,
					image: meta.data.image,
					name: meta.data.name,
					description: meta.data.description,
					wallet_address: meta.data.wallet_address,
					type: meta.data.type,
					email_id: meta.data.email_id,

				};
				if (item.wallet_address === wallet_address) return item;
				else return null;
			})
		);
		setNfts(items);
	}
// 	async function buyNft(nft) {
//     /* needs the user to sign the transaction, so will use Web3Provider and sign it */
//     const web3Modal = new Web3Modal()
//     const connection = await web3Modal.connect()
//     const provider = new ethers.providers.Web3Provider(connection)
//     const signer = provider.getSigner()
//     const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

//     /* user will be prompted to pay the asking proces to complete the transaction */
//     const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
//     const transaction = await contract.createMarketSale(nft.tokenId, {
//       value: price
//     })
//     await transaction.wait()
// 	toast("NFT Purchased Successfully");
//     loadNFTs()
//   }
	return (
		<section className="pb-10">
			<div className="flex flex-wrap md:px-4">
				{nfts.map((blog, id) => (
					// <BlogItem blog={blog} key={id} buyNft={buyNft} />
					<BlogItem blog={blog} key={id} buyNft={buyNft} />
				))}
			</div>
		</section>
	);
};

export default Blog;
