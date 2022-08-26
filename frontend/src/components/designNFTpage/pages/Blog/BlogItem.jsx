import React from "react";

function makeGatewayURL(ipfsURI) {
  return ipfsURI.replace(/^ipfs:\/\//, "https://nftstorage.link/ipfs/");
}

const BlogItem = (props) => {
	const { image, title, description, nftstorage, type, price } = props.blog;
	const [nftstoreimage, setNftstoreimage] = useState("");
	setNftstoreimage(makeGatewayURL(nftstorage.image));
	return (
		<div className="w-full lg:w-1/2">
			<div className="my-4 md:mx-4 shadow p-6 rounded-md bg-white group hover:shadow-md">
				<div className="relative mb-6 w-full h-56 bg-purple-200 rounded-md overflow-hidden">
					{type ? (
						<video
							className="w-full h-full object-cover object-center transform group-hover:scale-125 group-hover:rotate-6 transition duration-200"
							controls
							src={image}
						/>
					) : (
						<img
							src={image}
							alt="blogImage"
							className="w-full h-full object-cover object-center transform group-hover:scale-125 group-hover:rotate-6 transition duration-200"
						/>
					)}
				</div>
				<h3>
					<a
						href="#0"
						className="block text-lg font-medium text-gray-800 hover:text-purple-600 mb-2"
					>
						{title}
					</a>
				</h3>
				<p className="text-gray-400">{description}</p>
				<h1>IPFS</h1>
				<p>{nftstoreimage}</p>
        <div className="flex justify-between" >
          <p>{price} ETH</p>
          {/* <button onClick={() => props.buyNft(props.blog)}>Buy</button> */}
        </div>
			</div>
		</div>
	);
};

export default BlogItem;
