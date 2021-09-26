const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();

  await waveContract.deployed();
  console.log("Smart contract deployed to -- ", waveContract.address);
  console.log("Smart contract owned by -- ", owner.address);

  let waveCount = await waveContract.getWaveCount();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getWaveCount();

  waveTxn = await waveContract.connect(randomPerson).wave();
  await waveTxn.wait();

  waveCount = await waveContract.getWaveCount();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log("Oops, there was an error -- ", error);
    process.exit(1);
  }
};

runMain();
