const { artifacts } = require('hardhat');

const listingFee = 8200000000000001;

async function main() {

  // deply Art Codice Interediary
  const ACInt = await ethers.getContractFactory("ERC721ACoA_Intermediary");
  const intermediary = await ACInt.deploy(listingFee);

  await intermediary.waitForDeployment();

  console.log(
    `Test ERC721ACoA deployed to ${intermediary.target}`
  );

  saveFrontendFiles(intermediary, "ERC721ACoA_Intermediary");
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

// verify: npx hardhat verify --network sepolia 0x9Ec5d9B9d461F32a3b73Cd60beb0080D669B918f '8200000000000001'