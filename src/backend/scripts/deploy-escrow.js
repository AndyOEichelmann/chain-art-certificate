const { artifacts } = require('hardhat');

async function main() {

  // deply CoA Escrow
  const CoAEsrcow = await ethers.getContractFactory("ERC721CoA_Escrow");
  const coaescrow = await CoAEsrcow.deploy();

  await coaescrow.waitForDeployment();

  console.log(
    `Test ERC721ACoA deployed to ${coaescrow.target}`
  );

  saveFrontendFiles(coaescrow, "ERC721ACoA_coaescrow");
}

function saveFrontendFiles(contract, name) {
  const fs = require('fs');
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if(!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.target }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// verify: npx hardhat verify --network sepolia {address}