// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTEE is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address private admin;

    constructor() ERC721("Nftee", "NTE") {
        admin = msg.sender;
    }

    modifier _onlyAdmin() {
        require(msg.sender == admin);
        _;
    }
    uint256 default_listing_cost = 20;
    uint256 default_fraction_count = 10_000;

    struct Pair {
        uint256 vote_count;
        uint256 token_count;
    }
    struct NFTLiquidityPool {
        uint256 nft_liq;
        uint256 token_liq;
    }

    // Round number => list of candidate tokenIds
    mapping(uint256 => uint256[]) public candidates;
    // Round number => tokenId => Whether it is listed in the protocol
    mapping(uint256 => mapping(uint256 => bool)) public is_candidate;
    // NFT tokenId => NFTLiquidityPool
    mapping(uint256 => NFTLiquidityPool) public nft_liq_pools;

    // round_no => nft id => voter address => pair { vote and tokens }
    mapping(uint256 => mapping(uint256 => mapping(address => Pair)))
        public round_info;

    uint256 public roundNumber;

    function mint(string calldata _tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        return newItemId;
    }

    function list(uint256 tokenId, uint256 authorCutPercent) public payable {
        require(authorCutPercent <= 100, "Cannot claim more than 100%");
        require(msg.sender == ownerOf(tokenId), "Only owner can list an asset");
        require(msg.value == default_listing_cost, "Incorrect amount sent");

        uint256 authorCut = (default_fraction_count * authorCutPercent) / 100;
        nft_liq_pools[tokenId] = NFTLiquidityPool({
            nft_liq: default_fraction_count - authorCut,
            token_liq: default_listing_cost
        });
        candidates[roundNumber].push(tokenId);
        is_candidate[roundNumber][tokenId] = true;
        // Add this listing to the current round
        round_info[roundNumber][tokenId][msg.sender] = Pair({
            vote_count: authorCut,
            token_count: default_listing_cost
        });
    }

    function vote(uint256 nftId) public payable {
        uint256 round_no = roundNumber;
        uint256 my_token_count = msg.value;

        // Check if nft is listed in the protocol
        require(
            is_candidate[round_no][nftId],
            "NFT is not listed in this round"
        );

        uint256 current_nft_liq = nft_liq_pools[nftId].nft_liq;
        uint256 current_token_liq = nft_liq_pools[nftId].token_liq;

        uint256 NFT_constant = current_nft_liq * current_token_liq;

        uint256 my_vote = current_nft_liq - (NFT_constant /
            (current_token_liq + my_token_count));

        // update the liquidity pool of the nft
        nft_liq_pools[nftId].nft_liq = current_nft_liq - my_vote;
        nft_liq_pools[nftId].token_liq = current_token_liq + my_token_count;

        round_info[round_no][nftId][msg.sender] = Pair({
            vote_count: my_vote,
            token_count: my_token_count
        });

        emit VotedForAnNFTEvent(nftId, msg.sender, my_vote, my_token_count);
    }

    function update_round() private _onlyAdmin {
        roundNumber++;
    }

    event ListingEvent(
        uint256 indexed nftId,
        uint256 indexed authorCutPercent,
        uint256 roundNumber
    );

    event VotedForAnNFTEvent(
        uint256 indexed nftId,
        address indexed voter,
        uint256 vote,
        uint256 tokenCount
    );
}
