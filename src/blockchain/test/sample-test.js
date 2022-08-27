/* test/sample-test.js */
describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    /* deploy the marketplace */
    const NFTEE = await ethers.getContractFactory("NFTEE");
    const NFTEE = await NFTEE.deploy();
    await NFTEE.deployed();

    let listingPrice = await NFTEE.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create two tokens */
    await NFTEE.createToken("https://www.mytokenlocation.com", auctionPrice, {
      value: listingPrice,
    });
    await NFTEE.createToken("https://www.mytokenlocation2.com", auctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    /* execute sale of token to another user */
    await NFTEE.connect(buyerAddress).createMarketSale(1, {
      value: auctionPrice,
    });

    /* resell a token */
    await NFTEE.connect(buyerAddress).resellToken(1, auctionPrice, {
      value: listingPrice,
    });

    /* query for and return the unsold items */
    items = await NFTEE.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await NFTEE.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);
  });
  it("Should create and execute Creator NFTs", async function () {
    /* deploy the marketplace */
    const NFTEE = await ethers.getContractFactory("CreatorNFT");
    const NFTEE = await NFTEE.deploy();
    await NFTEE.deployed();

    let listingPrice = await NFTEE.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create two tokens */
    await NFTEE.createToken("https://www.mytokenlocation.com", auctionPrice, {
      value: listingPrice,
    });
    await NFTEE.createToken("https://www.mytokenlocation2.com", auctionPrice, {
      value: listingPrice,
    });

    /* query for and return the unsold items */
    items = await NFTEE.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await NFTEE.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);
  });
});
