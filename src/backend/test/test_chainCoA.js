const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("Chain CoA + Escrow", function () { 
    
    async function deployContractsFixture() {
        // Contracts are deployed using the first signer/account by default
        const [deployer, account1, account2, account3] = await ethers.getSigners();

        // deply CoA Escrow
        const CoAEsrcow = await ethers.getContractFactory("ERC721CoA_Escrow");
        const coaescrow = await CoAEsrcow.deploy();

        // deply ACoA nft contract
        const CoA = await ethers.getContractFactory("ERC721CoA");
        const coa = await CoA.deploy();

        return { coaescrow, coa, deployer, account1, account2, account3 }
    } 

    async function listToken(coa, coaescrow, lister, tokenId, claimer, itemId) {
        // approve for all the contract
        const isApproved = await coa.isApprovedForAll(lister.address, coaescrow.target);
        if(!isApproved){
            await coa.connect(lister).setApprovalForAll(coaescrow.target, true);
        }

        // list token
        await expect(coaescrow.connect(lister).listCertificate(coa.target, tokenId, claimer)).to.emit(coaescrow, "ItemListed").withArgs(itemId, coa.target, tokenId, lister.address, claimer);
    }

    async function mintToken(coa, minter, to, artist, object, uri, authuri, id) {

        // grant roll
        const roleMint = await coa.MINTER_ROLE();
        const hasRoll = await coa.hasRole(roleMint, minter);
        if(!hasRoll){
            expect(await coa.grantRole(roleMint, minter.address)).to.emit(coa, 'RoleGranted');
        }

        // mint token
        await expect(coa.connect(minter).safeMintTo(to, uri, authuri, artist, object)).to.emit(coa, "Minted").withArgs(id, artist, object);
    }

    describe("Deployment", function () {
        it("should track name and symbol of CoA contract", async function () {
            const {coa} = await loadFixture(deployContractsFixture);

            // retrive token contract metadata information {name, symbol}
            expect(await coa.name()).to.equal("ERC721CoA");
            expect(await coa.symbol()).to.equal("COA");
        });

        it("should track the owner of the escrow contact", async function () {
            const {coaescrow, deployer} = await loadFixture(deployContractsFixture);

            // retrive contract owner information {address: owner}
            expect(await coaescrow.owner()).to.equal(deployer.address);
        });
    });

    describe("Chain CoA functionality", async function () {

        const artist = "Jon Dow";
        const object = "Painting";
        const uri = "ipfs://coa-uri";
        const authuri = "ipfs://suth-uri";

        it("address 1 should deply multiple tokens", async function () {
            const { coa, account1 } = await loadFixture(deployContractsFixture);

            const to = account1.address;

            for(let i = 0; i < 5; i++) {
                await mintToken(coa, account1, to, artist, `${object} ${i}`, uri, authuri, i);
            }

            expect(await coa.mintedTokens()).to.equal(5);
        });

        it("token owner should list token", async function () {
            const { coaescrow, coa, account1, account2 } = await loadFixture(deployContractsFixture);

            const to = account1.address;
            tokenId = 0

            await mintToken(coa, account1, to, artist, `${object} 1`, uri, authuri, tokenId);

            const claimer = account2.address;
            const itemId = 0;

            await listToken(coa, coaescrow, account1, tokenId, claimer, itemId);

            expect(await coaescrow.listedAmount()).to.equal(1);
        });

        it("should fail to list token, with all posible errors", async function () {
            const { coaescrow, coa, account1, account2 } = await loadFixture(deployContractsFixture);

            const to = account1.address;
            tokenId = 0

            await mintToken(coa, account1, to, artist, `${object} 1`, uri, authuri, tokenId);

            const claimer = account2.address;
            
            // list without being the owner
            await expect(coaescrow.connect(account2).listCertificate(coa.target, tokenId, claimer)).to.be.revertedWith(/ERC721CoA_Escrow: account .* is not token owner/);

            // list without approving for all
            await expect(coaescrow.connect(account1).listCertificate(coa.target, tokenId, claimer)).to.be.revertedWith(/ERC721CoA_Escrow: .* contract must be appove by token owner/);
        });

        it("listed claimer should claim listed item", async function () {
            const { coaescrow, coa, account1, account2 } = await loadFixture(deployContractsFixture);

            const to = account1.address;
            tokenId = 0

            await mintToken(coa, account1, to, artist, `${object} 1`, uri, authuri, tokenId);

            const claimer = account2.address;
            const itemId = 0;

            await listToken(coa, coaescrow, account1, tokenId, claimer, itemId);

            // claimer must clim certificate
            await expect(coaescrow.connect(account2).claimCertificate(itemId)).to.emit(coaescrow, "ItemClaimed").withArgs(itemId, coa.target, tokenId, claimer);

            // climer must be new token owner
            expect(await coa.ownerOf(tokenId)).to.equal(claimer);

            // listed item hass to be climed
            expect((await coaescrow._itemsListed(0)).status).to.equal(2);
        });

        it("should fail to cliam listed item, with all errors", async function () {
            const { coaescrow, coa, account1, account2, account3 } = await loadFixture(deployContractsFixture);

            const to = account1.address;
            tokenId = 0

            await mintToken(coa, account1, to, artist, `${object} 1`, uri, authuri, tokenId);

            const claimer = account2.address;
            const itemId = 0;

            await listToken(coa, coaescrow, account1, tokenId, claimer, itemId);

            // try to claim non existing listed item
            await expect(coaescrow.connect(account2).claimCertificate(itemId + 100)).to.be.revertedWith(/ERC721CoA_Escrow: itemId .* does not exist/);

            // non claimer trys clim certificate
            await expect(coaescrow.connect(account3).claimCertificate(itemId)).to.be.revertedWith(/ERC721CoA_Escrow: .* is not item permited claimer/);

            // try to clime climed item
            await coaescrow.connect(account2).claimCertificate(itemId);

            await expect(coaescrow.connect(account2).claimCertificate(itemId)).to.be.revertedWith (/ERC721CoA_Escrow: itemId .* has allready been claimed or unlisted/);
        });

        it("lister should unlist listed item", async function () {
            const { coaescrow, coa, account1, account2 } = await loadFixture(deployContractsFixture);

            const to = account1.address;
            tokenId = 0

            await mintToken(coa, account1, to, artist, `${object} 1`, uri, authuri, tokenId);

            const claimer = account2.address;
            const itemId = 0;

            await listToken(coa, coaescrow, account1, tokenId, claimer, itemId);

            // lister must ulist certificate
            await expect(coaescrow.connect(account1).cancellListing(tokenId)).to.emit(coaescrow, "ItemUnlisted").withArgs(itemId, coa.target, tokenId, to);

            // listed item has been unlisted
            expect((await coaescrow._itemsListed(0)).status).to.equal(0);
        });

        it("should fail to unlist listed item, with all errors & fail to claim unlisted item", async function () {
            const { coaescrow, coa, account1, account2, account3 } = await loadFixture(deployContractsFixture);

            const to = account1.address;
            tokenId = 0

            await mintToken(coa, account1, to, artist, `${object} 1`, uri, authuri, tokenId);

            const claimer = account2.address;
            const itemId = 0;

            await listToken(coa, coaescrow, account1, tokenId, claimer, itemId);

            // try to unlist non existing listed item
            await expect(coaescrow.connect(account1).cancellListing(tokenId + 100)).to.be.revertedWith(/ERC721CoA_Escrow: itemId .* does not exist/);

            // non lister trys to unlist certificates
            await expect(coaescrow.connect(account2).cancellListing(tokenId)).to.be.revertedWith(/ERC721CoA_Escrow: .* is not item lister/);

            // try to clame unlisted item & try to unlist unlisted item
            await coaescrow.connect(account1).cancellListing(itemId);

            await expect(coaescrow.connect(account2).claimCertificate(itemId)).to.be.revertedWith (/ERC721CoA_Escrow: itemId .* has allready been claimed or unlisted/);

            await expect(coaescrow.connect(account1).cancellListing(tokenId)).to.be.revertedWith(/ERC721CoA_Escrow: itemId .* has allready been claimed or unlisted/);
        });
    });
});