// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IERC721CoA is IERC721{

    // =============================================================
    //                            EVENTS
    // =============================================================

    event Minted(uint256 indexed tokenId, string indexed artist, string indexed objectName);

    // =============================================================
    //                         SET FUNCTIONS
    // =============================================================

    function safeMint(address to, string memory uri, string memory authuri, string calldata artistName, string calldata objectName) external;

    // =============================================================
    //                         VEW FUNCTIONS
    // =============================================================

    function mintedTokens() external view returns(uint256 currentTokenId);

    function authnticateToken(uint256 tokenId) external view returns (string memory);

}