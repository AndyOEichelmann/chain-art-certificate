// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "./IERC721CoA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721CoA_Escrow is ERC721Holder, Context, ReentrancyGuard, Ownable{
    using Counters for Counters.Counter; 

    // =============================================================
    //                           VARIBLES
    // =============================================================

    enum Status {
        Unlisted,
        Listed,
        Claimed
    }

    struct Item{
        uint256 itemId;
        // 
        IERC721CoA nftContract;
        uint256 tokenId;
        // 
        address lister;
        address claimer;
        Status status;
    }

    // =============================================================
    //                           STORAGE
    // =============================================================

    Counters.Counter private _itemCounter;
    
    // itemId -> Item
    mapping(uint256 => Item) public _itemsListed;

    // =============================================================
    //                            EVENTS
    // =============================================================

    event ItemListed (uint256 itemId, address indexed nftContract, uint256 tokenId, address indexed lister, address indexed claimer);

    event ItemClaimed (uint256 itemId, address indexed nftContract, uint256 tokenId, address indexed claimer);

    event ItemUnlisted (uint256 itemId, address indexed nftContract, uint256 tokenId, address indexed unlister);

    // =============================================================
    //                     MODIFIER FUNCTIONS
    // =============================================================
    
    /**
     * @dev  List transferablo token / certificate ~ sender provide signe message from this contract owner
     */
    function listCertificate(IERC721CoA _nftContract, uint256 _tokenId, address _claimer) external nonReentrant {

        // sender must be the owner of the token to be listed
        require(_nftContract.ownerOf(_tokenId) == _msgSender(), string(abi.encodePacked("ERC721CoA_Escrow: account ", Strings.toHexString(_msgSender())," is not token owner")));
        
        // sender must have sent the signed message from this contract owner

        // thise contract must be appovedForAll in the nft contract by the sender 
        require(_nftContract.isApprovedForAll(_msgSender(), address(this)), string(abi.encodePacked("ERC721CoA_Escrow: ", Strings.toHexString(address(this)), " contract must be appove by token owner")));

        // obtain itemId & increment count
        uint256 _itemId = _itemCounter.current();
        _itemCounter.increment();

        // add new item to listedItems mapping
        _itemsListed[_itemId] = Item (
            _itemId,
            // 
            _nftContract, 
            _tokenId,
            // 
            _msgSender(), 
            _claimer, 
            Status.Listed
        );
        
        // listed events
        emit ItemListed (_itemId, address(_nftContract), _tokenId, _msgSender(), _claimer);
    }

    /**
     * @dev Claim certificate ~ sender provides a signd message from the lister to enable the clame functionality
     */
    function claimCertificate(uint256 _itemId) external nonReentrant {
        uint256 listed =  _itemCounter.current();
        
        // item must exist
        require(_itemId >= 0 && _itemId < listed, string(abi.encodePacked("ERC721CoA_Escrow: itemId ", Strings.toString(_itemId), " does not exist")));

        Item storage item = _itemsListed[_itemId];

        // change that the signd message is from the lister
        require(_msgSender() == item.claimer, string(abi.encodePacked("ERC721CoA_Escrow: ", Strings.toHexString(_msgSender()), " is not item permited claimer")));
        
        // verify that the item has not allready been climed or unlisted
        require(item.status == Status.Listed, string(abi.encodePacked("ERC721CoA_Escrow: itemId ", Strings.toString(_itemId), " has allready been claimed or unlisted")));

        // update item transfer status
        item.status = Status.Claimed;

        // transfer nft certificate to claimer in behaf of the ownwe
        item.nftContract.safeTransferFrom(item.lister , item.claimer, item.tokenId);

        // emit item claimed event
        emit ItemClaimed(_itemId, address(item.nftContract), item.tokenId, _msgSender());
    }

    /**
     * @dev Cancel listed certificate listing
     * 
     * Requirements:
     * -'msg.sender' must be the item lister
     */
    function cancellListing(uint256 _itemId) external nonReentrant {
        uint256 listed =  _itemCounter.current();
        
        require(_itemId >= 0 && _itemId < listed, string(abi.encodePacked("ERC721CoA_Escrow: itemId ", Strings.toString(_itemId), " does not exist")));

        Item storage item = _itemsListed[_itemId];

        require(_msgSender() == item.lister, string(abi.encodePacked("ERC721CoA_Escrow: ", Strings.toHexString(_msgSender()), " is not item lister")));
        
        require(item.status == Status.Listed, string(abi.encodePacked("ERC721CoA_Escrow: itemId ", Strings.toString(_itemId), " has allready been claimed or unlisted")));

        // update item transfer status
        item.status = Status.Unlisted;

        emit ItemUnlisted (_itemId, address(item.nftContract), item.tokenId, _msgSender());
    }

    // =============================================================
    //                         VEW FUNCTIONS
    // =============================================================

    /**
     * @dev view number of items listed
     */
    function listedAmount() external view returns (uint256 listed) {
        listed =  _itemCounter.current();
    }
}