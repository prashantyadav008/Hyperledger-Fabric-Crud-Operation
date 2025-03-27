/** @format */

const fs = require("fs");
const path = require("path");
const { Wallets } = require("fabric-network");

const importAdminIdentity = async () => {
  try {
    const walletPath = path.join(__dirname, "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if admin already exists
    const identity = await wallet.get("admin");
    if (identity) {
      console.log("Admin identity already exists in the wallet");
      return;
    }

    // Path to admin cert and key
    const credPath = path.join(
      __dirname,
      "../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp"
    );
    const cert = fs
      .readFileSync(
        path.join(credPath, "signcerts", "Admin@org1.example.com-cert.pem")
      )
      .toString();
    const key = fs
      .readFileSync(
        path.join(
          credPath,
          "keystore",
          fs.readdirSync(path.join(credPath, "keystore"))[0]
        )
      )
      .toString();

    // Create new identity
    const new_identity = {
      credentials: {
        certificate: cert,
        privateKey: key,
      },
      mspId: "Org1MSP",
      type: "X.509",
    };

    await wallet.put("admin", new_identity);
    console.log("Admin new_identity imported successfully");
  } catch (error) {
    console.error(`Failed to import admin new_identity: ${error}`);
    throw new Error(error);
  }
};

importAdminIdentity();
