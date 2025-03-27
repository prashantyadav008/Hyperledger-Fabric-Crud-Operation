<!-- @format -->

# Run Basic CRUD Setup using Hyperledger Fabric Network

## Write the Chaincode

1.  Navigate to the chaincode/asset folder:

        cd chaincode/asset

2.  Initialize a Go module: Create Init File

        go mod init asset

3.  Create a Go file for your chaincode:

        go get github.com/hyperledger/fabric-contract-api-go/contractapi

        go get github.com/hyperledger/fabric-protos-go

## Set Up the Fabric Network

1.  Download the Fabric samples and binaries: (This will download `Fabric v2.5.5 and Fabric CA v1.5.2` and this package compatable with `go 1.23.5 version`)

        curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.5.5 1.5.2

    **or**

    If you have `go version 1.20` and les use this fabric version

        curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.4.4 1.5.2

2.  Navigate to the test-network folder:

        cd fabric-samples/test-network

3.  Bring down the existing network and then up the Fabric network: (This will start a basic Fabric network with two organizations `(Org1 and Org2)`, a channel named `prashantchannel`, and an ordering service)

        ./network.sh down

    • `./network.sh:` A script provided by Fabric to set up a basic network.

    • `down:` Bring down the existing network.

        ./network.sh up

    • `up`: Starts the network.

    <br>

    Create a Channel with `LevelDB` (Recommended for Now)

        ./network.sh createChannel -ca -c <channelname: prashantchannel>

    **or**

    Create a Channel with `CouchDB` (For Future Complex Queries)

        ./network.sh createChannel -ca -c <channelname: prashantchannel> -s couchdb

    • `./network.sh:` A script provided by Fabric to set up a basic network.

    • `up`: Starts the network.

    • `createChannel`: Creates a channel named **prashantchannel**.

    • `-c prashantchannel:` Specifies the channel name.

    • `-ca`: Creates a channel with a certificate authority.

    <br>

    👨‍💻 `LevelDB vs CouchDB`:

    ✅ LevelDB – Key-value store, faster, simple queries ke liye best.

    ✅ CouchDB – JSON-based store, complex queries, rich search ke liye best.

## Chaincode Lifecycle Commands

### Basic Flow fo perform CRUD operations in to the ledger

<table border="1" cellpadding="0" cellspacing="0" style="width:100%" >
<thead>
    <tr>
    <th style="width: 10%; text-align: center;">#</th>
      <th style="width: 15%; text-align: center;">Step</th>
      <th style="width: 25%; text-align: left;">Command Example</th>
      <th style="width: 65%; text-align: left;">Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: center;">1</td>
      <td style="text-align: center; font-weight:bold">Package</td>
      <td><code>peer lifecycle chaincode package</code></td>
      <td>Bundles the chaincode into a package</td>
    </tr>
    <tr>
      <td style="text-align: center;">2</td>
      <td style="text-align: center; font-weight:bold">Install</td>
      <td><code>peer lifecycle chaincode install</code></td>
      <td>Installs the chaincode on the peer</td>
    </tr>
    <tr>
      <td style="text-align: center;" >3</td>
      <td style="text-align: center; font-weight:bold">Query</td>
      <td><code>peer lifecycle chaincode queryinstalled</code></td>
      <td>Checks installed chaincode packages</td>
    </tr>
    <tr>
      <td style="text-align: center;">4</td>
      <td style="text-align: center; font-weight:bold">Approve</td>
      <td><code>peer lifecycle chaincode approveformyorg</code></td>
      <td>Approves the chaincode definition for the organization</td>
    </tr>
    <tr>
      <td style="text-align: center;">5</td>
      <td style="text-align: center; font-weight:bold">Query</td>
      <td><code>peer lifecycle chaincode queryapproved</code></td>
      <td>Checks the approval status of the chaincode definition</td>
    </tr>
    <tr>
      <td style="text-align: center;">6</td>
      <td style="text-align: center; font-weight:bold">Commit</td>
      <td><code>peer lifecycle chaincode commit</code></td>
      <td>Commits the chaincode definition to the ledger</td>
    </tr>
    <tr>
      <td style="text-align: center;">7</td>
      <td style="text-align: center; font-weight:bold">Query</td>
      <td><code>peer lifecycle chaincode querycommitted</code></td>
      <td>Checks the committed status of the chaincode</td>
    </tr>
    <tr>
      <td style="text-align: center;">8</td>
      <td style="text-align: center; font-weight:bold">Invoke</td>
      <td><code>peer chaincode invoke</code></td>
      <td>Executes a transaction using the chaincode</td>
    </tr>
    <tr>
      <td style="text-align: center;">9</td>
      <td style="text-align: center; font-weight:bold">Query</td>
      <td><code>peer chaincode query</code></td>
      <td>Reads data from the ledger using the chaincode</td>
    </tr>
  </tbody>
</table>

<br> <hr> <br>

## Node Server Setup

1.  Go to the `Crud-Operation-Hyperledger-Fabric/api` folder:

        cd Crud-Operation-Hyperledger-Fabric/api

2.  Install Fabric SDK & Essential Dependencies

        npm install

3.  Create a `.env` file and Set Environment Variables

        cp env.example .env

4.  Setup Admin Wallet Credentials (Private_Key)

    1.  Create a `wallet` folder inside the `api` folder

            mkdir wallet

    2.  Go back to the `fabric-samples/test-network` folder

            cd ../fabric-samples/test-network

    3.  Copy the `Admin` private key from the `organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore` folder to the `wallet` folder

            cp -r organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp ../../api/wallet/admin

5.  Run the Import the Admin and Server

        node importAdmin.js

        node server.js

## React Client Setup

1.  Go to the `Crud-Operation-Hyperledger-Fabric/react-ui` folder:

        cd Crud-Operation-Hyperledger-Fabric/react-ui

2.  Install Fabric SDK & Essential Dependencies

        npm install

3.  Start the React App

        npm start
