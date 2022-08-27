const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const nftMarketplace = await NFTMarketplace.deploy();
  const mockERC20 = await MockERC20.deploy();
  const myToken = await MyToken.deploy();
  await nftMarketplace.deployed();
  await mockERC20.deployed();
  await myToken.deployed();
  console.log("nftMarketplace deployed to:", nftMarketplace.address);
  console.log("erc20 deployed to:", mockERC20.address);
  console.log("myToken deployed to:", myToken.address);

  fs.writeFileSync(
    "./config.js",
    `
  export const marketplaceAddress = "${nftMarketplace.address}"
  export const erc20Address = "${mockERC20.address}"
  export const myTokenAddress = "${myToken.address}"
  `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
