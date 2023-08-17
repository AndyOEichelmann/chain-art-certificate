// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721CoA is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    // =============================================================
    //                        ROLE CONSTANTS
    // =============================================================
    
    // Permited rolle to mint tokens
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Permited rolle to authenticate the phisical object
    bytes32 public constant AUTHENTICATOR_ROLE = keccak256("AUTHENTICATOR_ROLE");

    // =============================================================
    //                           STORAGE
    // =============================================================

    // Counter traking the number of tokens, corresponds to the latest token id
    Counters.Counter private _tokenIdCounter;

    // Mapping token ID to the authenftificattion data uri
    mapping (uint256 => string) private _authenticationURI;

    // =============================================================
    //                            EVENTS
    // =============================================================

    /**
     * @dev Emitted when a new certificate of authenticity token is created
     */
    event Minted(uint256 indexed tokenId, string indexed artist, string indexed objectName);

    // =============================================================
    //                          CONSTRUCTOR
    // =============================================================

    constructor() ERC721("ERC721CoA", "COA") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(AUTHENTICATOR_ROLE, msg.sender);
    }

    // =============================================================
    //                          OPERATIONS
    // =============================================================

    /**
     * @dev Sets the unic uri of the authentication information that helps to identify the 
     * phisical object the token certificate is representing.
     * 
     * Requirements:
     * -`tokenId` token must exist
     */
    function _setAuthenticationURI(uint256 tokenId, string memory authenticationURI) internal {
        require(_exists(tokenId), "ERC721CoA: URI set to non existing token");

        _authenticationURI[tokenId] = authenticationURI;
    }

    // =============================================================
    //                         SET FUNCTIONS
    // =============================================================

    /**
     * @dev Safly mints new token asigning its new token to `to` address
     * 
     * Requirements:
     * -`msg.sender` must have {MINTER_ROLE}
     * 
     * Emits a {Minted} event
     */
    function safeMintTo(address to, string memory uri, string memory authuri, string calldata artistName, string calldata objectName) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _setAuthenticationURI(tokenId, authuri);

        emit Minted(tokenId, artistName, objectName);
    }

    // =============================================================
    //                         VEW FUNCTIONS
    // =============================================================

    /**
     * @dev Retursn the number of minted certificate tokens
     */
    function mintedTokens() external view returns(uint256 currentTokenId){
        currentTokenId = _tokenIdCounter.current();
    }

    /**
     * @dev Retuns the authentication data URI
     * 
     * Requirements:
     * -`tokenId` must be minted
     * -`msg.sender` must be the owner or has the {AUTHENTICATOR_ROLE}
     */
   function authnticateToken(uint256 tokenId) external view returns (string memory) {
        _requireMinted(tokenId);

        address owner = ERC721.ownerOf(tokenId);
        require(owner == msg.sender || hasRole(AUTHENTICATOR_ROLE, _msgSender()), "ERC721CoA: must be owner or registered authenticator");

        return _authenticationURI[tokenId];
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
