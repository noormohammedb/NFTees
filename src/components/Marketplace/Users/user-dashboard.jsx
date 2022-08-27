import React, { useEffect, useState } from "react";

import ProfileCover from "./../../designNFTpage/sections/ProfileCover/ProfileCover.jsx";
import Sidebar from "./../../designNFTpage/sections/Sidebar/Sidebar.jsx";
import Navbar from "./../../designNFTpage/sections/Navbar/Navbar.jsx";
import Footer from "./../../designNFTpage/sections/Footer/Footer.jsx";
import { ethers } from "ethers";
import axios from "axios";
import { nftAddress } from "../../../blockchain/config";
import NFTEE from "../../../blockchain/artifacts/contracts/NFTEE.sol/NFTEE.json";

function home () {
	const [nfts, setNfts] = useState([]);
	const [clickeddata, setClickedData] = useState(null);
	useEffect(() => {
		loadNFTs();
	}, []);
	async function loadNFTs() {
		const provider = new ethers.providers.JsonRpcProvider();
		const contract = new ethers.Contract(
			nftAddress,
			NFTEE.abi,
			provider
		);
		console.log(contract);
		
		const round = await contract.roundNumber();
		console.log(round.toNumber());
		const data = await contract.foo(round.toNumber());
		console.log(data);

		const items = await Promise.all(
			data.map(async (candidate) => {
				const tokenUri = await contract.tokenURI(candidate);
				const meta = await axios.get(tokenUri);
				console.log(meta.data);
				// let price = ethers.utils.formatUnits(i.price.toString(), "ether");
				let item = {
					// price,
					tokenId: candidate.toNumber(),
					// seller: i.seller,
					owner: await contract.ownerOf(candidate),
					image: meta.data.image,
					name: meta.data.name,
					description: meta.data.description,
					nftstorage: meta.data.nftstorage,
					nftstoragedata: meta.data.nftstoragedata,
					wallet_address: meta.data.wallet_address,
				};
				console.log(item);
				return item;
			})
		);
		setNfts(items);
	}
	return (
		<div className="">
			{clickeddata === null ? (
				<div>
					<div>
						<h1 className="text-2xl font-bold mx-10 mt-5">Designs</h1>
						<section className="pb-10">
							<div className="grid lg:grid-cols-3 grid-cols-1 md:px-4">
								{nfts.map((nft, i) => (
									<div className="w-full ">
										<div className="my-4 md:mx-4 shadow p-6 rounded-md bg-white group hover:shadow-md">
											<div className="relative mb-6 w-full h-56 bg-purple-200 rounded-md overflow-hidden">
												<img
													src={nft.image}
													alt="creatorImage"
													className="w-full h-full object-cover object-center transform group-hover:scale-125 group-hover:rotate-6 transition duration-200"
												/>
											</div>
											<h3>
												<a
													onClick={() => setClickedData(nft)}
													className="block text-lg font-medium text-gray-800 hover:text-purple-600 mb-2"
												>
													{nft.name}
												</a>
											</h3>
											<p className="text-gray-400">{nft.description}</p>
										</div>
									</div>
								))}
							</div>
						</section>
					</div>
				</div>
			) : (
				<>
				<main className="min-h-screen relative bg-gray-50 pb-10">
					<ProfileCover />
					<div className="container px-4">
						<div className="flex flex-wrap px-4">
							<div className="w-full lg:w-1/3 ">
								<Sidebar clickeddata={clickeddata} />
							</div>
							<div className="w-full lg:w-2/3 ">
								<Navbar wallet_address={clickeddata.wallet_address} />
							</div>
						</div>
					</div>
					<Footer />
				</main>
				</>
			)}
		</div>
	);
}

export default home;
