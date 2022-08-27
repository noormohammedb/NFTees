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
    uint256 listing_cost = 20;
    uint256 default_fractions = 10_000;

    struct Pair {
        uint256 vote_count;
        uint256 token_count;
    }
    struct NFTLiquidityPool {
        uint256 nft_liq;
        uint256 token_liq;
    }

    uint256[] roundNumber;

    // Round number => list of candidate tokenIds
    mapping(uint256 => uint256[]) candidates;
    // Round number => tokenId => Whether it is listed in the protocol
    mapping(uint256 => mapping(uint256 => bool)) isCandidate;
    // NFT tokenId => NFTLiquidityPool
    mapping(uint256 => NFTLiquidityPool) nft_liq_pools;

    // round_no => nft id => voter address => pair { vote and tokens }
    mapping(uint256 => mapping(uint256 => mapping(address => Pair))) round_info;

    function mint(uint256 creater_percent) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        uint256 creater_fraction = (default_fractions * creater_percent) / 100;

        nft_liq_pools[newItemId].nft_liq = default_fractions - creater_fraction;
        nft_liq_pools[newItemId].token_liq = 20;
        return newItemId;
    }

    // ----------------------------------------------------
    function vote(uint256 nftId, uint256 token) public {
        uint256 round_no = current_round();

        uint256 current_nfg_liq = round_info[round_no][nftId][msg.sender]
            .vote_count;

        // uint256 current_token_liq = round_info[round_no][nftId][msg.sender]
        // .token_liq;

        // uint256 no_of_fraction_with_the_token = (CONSTANT /
        //     (current_liquidity + token)) + remaining_vote;

        // updating the liquidity data
        // round_info[nftId].current_liqiudity = round_info[round_no][msg.sender][
        //     nftId
        // ].no_of_votes = 0;

        // round_info[nftId].current_liqiudity =
        //     round_info[nftId].current_liqiudity -
        //     token;

        // round_info[round_no][msg.sender][nftId].no_of_votes += token;
        // round_info[round_no][msg.sender][nftId].no_of_tokens += token;
    }

    function update_round() public {
        // update the round number
        // round_numbers[0] = round_numbers[round_numbers.length - 1] + 1;
        // round_numbers.push(round_numbers[round_numbers.length - 1] + 1);
        roundNumber.push(roundNumber[roundNumber.length - 1] + 1);
    }

    function current_round() public view returns (uint256) {
        return roundNumber[roundNumber.length - 1];
    }
}
