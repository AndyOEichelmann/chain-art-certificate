const { artifacts } = require('hardhat');

const tokenURI = 'ipfs://QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn';
// QmRpPF4BLTNVDDX6WGbJzhnMmN63rWBbHnPMkZAzts6QgM
// QmZKKKQh15pzZU5QTujHCwJZ7y2c7Cc9PSDWDQmKtXS6bb

async function main() {

  // deply ACoA nft contract
    const ACoA = await ethers.getContractFactory("ERC721ACoA");
    const testACoA = await ACoA.deploy(tokenURI);

  await testACoA.waitForDeployment();

  console.log(
    `Test ERC721ACoA deployed to ${testACoA.target}`
  );

  saveFrontendFiles(testACoA, "ERC721ACoA");
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

// npx hardhat verify --network sepolia 0xA7a30302549dF44162Ee9f88eFB5dD86F1edD569 'ipfs://QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn'