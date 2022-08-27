// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTEE is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Nftee", "NTE") {
        // _tokenIds = new Counters.(1);
    }

    uint256 listing_cost = 20;
    uint256 defautl_fractions = 100;

    struct NFT_liquidity_pool {
        // some data about the NFT

        // uint256 initial_liqidity;
        uint256 nft_liquidity;
        uint256 token_liquidity;
    }

    mapping(uint256 => NFT_liquidity_pool) nft_liquidity_pools;

    struct pair {
        uint256 no_of_votes;
        uint256 no_of_tokens;
    }

    // round_no => voter => nft id => pair { vote and tokens }
    mapping(uint256 => mapping(address => mapping(uint256 => pair))) round_info;

    uint256[] round_numbers;

    function mint(uint256 initial_liq) public returns (uint256) {
        // _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        nft_data[newItemId].nft_liquidity = initial_liq;
        nft_data[newItemId].remaining_vote = defautl_fraction;

        _mint(msg.sender, newItemId);

        _tokenIds.increment();
        return newItemId;
    }

    function vote(uint256 nftId, uint256 token) public {
        uint256 round_no = current_round();

        uint256 current_liquidity = nft_data[nftId].current_liqiudity;
        uint256 remaining_vote = nft_data[nftId].remaining_vote;

        uint256 no_of_votes_with_the_token = (CONSTANT /
            (current_liquidity + token)) + remaining_vote;

        // updating the liquidity data
        nft_data[nftId].current_liqiudity = round_info[round_no][msg.sender][
            nftId
        ].no_of_votes = 0;

        // nft_data[nftId].current_liqiudity =
        //     nft_data[nftId].current_liqiudity -
        //     token;

        // round_info[round_no][msg.sender][nftId].no_of_votes += token;
        // round_info[round_no][msg.sender][nftId].no_of_tokens += token;
    }

    function update_round() public {
        // update the round number
        // round_numbers[0] = round_numbers[round_numbers.length - 1] + 1;
        // round_numbers.push(round_numbers[round_numbers.length - 1] + 1);
        round_numbers.push(round_numbers[round_numbers.length - 1] + 1);
    }

    function current_round() public view returns (uint256) {
        return round_numbers[round_numbers.length - 1];
    }
}
