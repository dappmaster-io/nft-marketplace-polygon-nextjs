// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract NFT is ERC721URIStorage {
    // Counters.counter has a uint256 value that is unwrapped.
    // What happens if I overflow?
    using Counters for Counters.Counter;
    Counters.Counter private _tokensIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC721('Metaverse Tokens', 'METT') {
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokensIds.increment();
        uint256 newItemId = _tokensIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}
