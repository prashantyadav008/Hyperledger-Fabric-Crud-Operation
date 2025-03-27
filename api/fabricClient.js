/** @format */

require("dotenv").config();

const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

const ccpPath = path.resolve(
  __dirname,
  "../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"
);

const connectToNetwork = async () => {
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
  const walletPath = path.join(__dirname, "wallet");
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const identity = await wallet.get("admin");
  if (!identity) {
    throw new Error("Admin identity not found in wallet");
  }

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: "admin",
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork(process.env.CHANNEL_NAME);
  const contract = network.getContract(process.env.CHAINCODE_NAME);

  return { gateway, contract };
};

// CREATE
const createAsset = async (id, color, amount, owner) => {
  const { gateway, contract } = await connectToNetwork();
  try {
    await contract.submitTransaction("CreateAsset", id, color, amount, owner);
    console.log(`Asset ${id} created`);
  } finally {
    gateway.disconnect();
  }
};

// READ
const readAsset = async (id) => {
  const { gateway, contract } = await connectToNetwork();
  try {
    const result = await contract.evaluateTransaction("ReadAsset", id);
    console.log(`Asset ${id} details:`, result.toString());
    return JSON.parse(result.toString());
  } finally {
    gateway.disconnect();
  }
};

// READ
const readAllAsset = async () => {
  const { gateway, contract } = await connectToNetwork();
  try {
    const result = await contract.evaluateTransaction("GetAllAssets");
    console.log(`All Asset details:`, result.toString());
    return JSON.parse(result.toString());
  } finally {
    gateway.disconnect();
  }
};

// UPDATE
const updateAsset = async (id, color, amount, owner) => {
  const { gateway, contract } = await connectToNetwork();
  try {
    await contract.submitTransaction("UpdateAsset", id, color, amount, owner);
    console.log(`Asset ${id} updated`);
  } finally {
    gateway.disconnect();
  }
};

// DELETE
const deleteAsset = async (id) => {
  const { gateway, contract } = await connectToNetwork();
  try {
    await contract.submitTransaction("DeleteAsset", id);
    console.log(`Asset ${id} deleted`);
  } finally {
    gateway.disconnect();
  }
};

module.exports = {
  createAsset,
  readAsset,
  readAllAsset,
  updateAsset,
  deleteAsset,
};
