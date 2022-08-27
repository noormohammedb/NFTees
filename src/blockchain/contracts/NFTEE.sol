// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTEE is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _poolIds;
    Counters.Counter private _farmIds;
    uint256 public constant SECONDS_PER_BLOCK = 2;
    uint256 public constant SECONDS_PER_ROUND = 30;
    uint256 public constant WINNERS_PER_ROUND = 2;
    uint256 public constant DEFAULT_FRACTIONS_COUNT = 10_000;
    uint256 public constant MINIMUM_INITIAL_LIQUIDITY = 20;
    address private admin;

    constructor() ERC721("Nftee", "NTE") {
        admin = msg.sender;
    }

    modifier _onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    modifier _isValidTokenId(uint256 tokenId) {
        require(tokenId <= _tokenIds.current(), "Invalid token Id");
        _;
    }
    modifier _isValidFarmId(uint256 farmId) {
        require(farmId <= _farmIds.current(), "Invalid farm id");
        _;
    }
    struct NFTLiquidityPoolData {
        uint256 tokenId;
        uint256 poolId;
        bool exists;
        uint256 nft_fractions;
        uint256 token_liq;
    }
    struct FarmData {
        uint256 farmId;
        uint256 tokenId;
        bool exists;
        // Total amount that is locked inside this farm
        uint256 totalLiquidity;
    }
    // Pool id => NFTLiquidityPoolData
    mapping(uint256 => NFTLiquidityPoolData) public pool_data;
    // tokenId => poolId
    mapping(uint256 => uint256) public tokenToPoolMap;
    // address => tokenId => fractions held
    mapping(address => mapping(uint256 => uint256)) public fractionBalances;
    // Farm id => Farm data
    mapping(uint256 => FarmData) public farm_data;
    //  tokenId => farm id
    mapping(uint256 => uint256) public tokenIdToFarmMap;
    // farmid => balance map
    mapping(uint256 => mapping(address => uint256)) public farmBalances;
    // farmId => profit balance map
    mapping(uint256 => mapping(address => uint256)) public farmProfits;

    function lastTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    function mint(string calldata _tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        emit MintingEvent(newItemId, msg.sender);
        return newItemId;
    }

    function createPool(uint256 tokenId, uint256 authorCutPercent)
        public
        payable
        _isValidTokenId(tokenId)
    {
        require(authorCutPercent <= 100, "Cannot claim more than 100%");
        require(
            msg.value < MINIMUM_INITIAL_LIQUIDITY,
            "No initial liquidity provided"
        );
        require(msg.sender == ownerOf(tokenId), "Only owner can list an asset");
        require(
            _isApprovedOrOwner(address(this), tokenId),
            "Contract is not an owner or approved address"
        );
        safeTransferFrom(msg.sender, address(this), tokenId);
        // Now create a new pool data structure
        _poolIds.increment();
        uint256 currentPoolId = _poolIds.current();
        uint256 authorCut = (DEFAULT_FRACTIONS_COUNT * authorCutPercent) / 100;
        pool_data[currentPoolId] = NFTLiquidityPoolData({
            tokenId: tokenId,
            poolId: currentPoolId,
            exists: true,
            nft_fractions: DEFAULT_FRACTIONS_COUNT - authorCut,
            token_liq: msg.value
        });
        tokenToPoolMap[tokenId] = currentPoolId;
        fractionBalances[msg.sender][tokenId] = authorCut;
        // TODO: Emit relevant event
    }

    function swap(uint256 poolId, uint256 fractionCount) public payable {
        require(
            !(msg.value > 0 && fractionCount > 0),
            "Invalid call. Cannot decide which side"
        );
        uint256 NFT_constant = pool_data[poolId].nft_fractions *
            pool_data[poolId].token_liq;
        uint256 farmId = tokenIdToFarmMap[pool_data[poolId].tokenId];

        if (msg.value > 0) {
            // Swap FROM MATIC to Fractions
            stakeToFarm(farmId);
        } else {
            // Swap TO MATIC from Fractions
            require(
                fractionBalances[msg.sender][pool_data[poolId].tokenId] >=
                    fractionCount,
                "Not enough fractions in balance"
            );
        }
    }

    function stakeToFarm(uint256 farmId) public payable _isValidFarmId(farmId) {
        uint256 tokenId = farm_data[farmId].tokenId;
        // farmId=>FarmData{tokenId} tokenId => poolId
        uint256 poolId = tokenToPoolMap[tokenId];
        uint256 NFT_constant = pool_data[poolId].nft_fractions *
            pool_data[poolId].token_liq;

        uint256 fraction_i_get = pool_data[poolId].nft_fractions -
            (NFT_constant / (msg.value - pool_data[poolId].token_liq));

        // update the pool data
        pool_data[poolId].nft_fractions -= fraction_i_get;
        pool_data[poolId].token_liq += msg.value;

        fractionBalances[msg.sender][tokenId] += fraction_i_get;
        // TODO: Emit relevant event
    }

    function unstakeFromFarm(uint256 farmId) public _isValidFarmId(farmId) {}

    function claimFarmRewards(uint256 farmId) public _isValidFarmId(farmId) {}

    function makeNewFarm(uint256 tokenId)
        public
        _onlyAdmin
        _isValidTokenId(tokenId)
    {
        _farmIds.increment();
        uint256 newFarmId = _farmIds.current();
        tokenIdToFarmMap[tokenId] = newFarmId;
        farm_data[newFarmId] = FarmData({
            farmId: newFarmId,
            tokenId: tokenId,
            exists: true,
            totalLiquidity: 0
        });
    }

    function addProfitToFarm(uint256 farmId)
        public
        payable
        _isValidFarmId(farmId)
    {}

    // function vote(uint256 nftId) public payable {
    //     uint256 my_token_count = msg.value;

    //     uint256 current_nft_liq = nft_liq_pools[nftId].nft_liq;
    //     uint256 current_token_liq = nft_liq_pools[nftId].token_liq;

    //     uint256 NFT_constant = current_nft_liq * current_token_liq;

    //     uint256 my_vote = current_nft_liq -
    //         (NFT_constant / (current_token_liq + my_token_count));

    //     // update the liquidity pool of the nft
    //     nft_liq_pools[nftId].nft_liq = current_nft_liq - my_vote;
    //     nft_liq_pools[nftId].token_liq = current_token_liq + my_token_count;

    //     emit VotedForAnNFTEvent(nftId, msg.sender, my_vote, my_token_count);
    // }

    event MintingEvent(uint256 indexed tokenId, address indexed owner);
    event ListingEvent(uint256 indexed nftId, uint256 indexed roundNumber);

    event VotedForAnNFTEvent(
        uint256 indexed nftId,
        address indexed voter,
        uint256 vote,
        uint256 tokenCount
    );
}
