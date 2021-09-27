const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();

  await waveContract.deployed();
  console.log("Smart contract deployed to -- ", waveContract.address);
  console.log("Smart contract owned by -- ", owner.address);

  let waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave("Message from owner");
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  for (i = 0; i < 5; i++) {
    waveTxn = await waveContract
      .connect(randomPerson)
      .wave(`Message number ${i + 2}`);
    await waveTxn.wait();
  }

  let waves = await waveContract.getAllWaves();
  console.log(waves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error("Oops, there was an error -- ", error);
    process.exit(1);
  }
};

runMain();
