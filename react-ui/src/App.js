/** @format */

import React, { useState } from "react";
import axios from "axios";

function App() {
  const [id, setId] = useState("");
  const [color, setColor] = useState("");
  const [amount, setAmount] = useState("");
  const [owner, setOwner] = useState("");
  const [result, setResult] = useState("");
  const [resultArr, setResultArr] = useState([]);

  const createAsset = async () => {
    try {
      const res = await axios.post("http://localhost:3000/create-asset", {
        id,
        color,
        amount,
        owner,
      });
      setResult(res.data.message);
    } catch (error) {
      setResult(error.response.data.error);
    }
  };

  const readAsset = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/read-asset/${id}`);

      setResult(JSON.stringify(res.data));
    } catch (error) {
      setResult(error.response.data.error);
    }
  };

  const readAllAsset = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/read-all-assets`);
      setResultArr(res.data);
    } catch (error) {
      setResult(error.response.data.error);
    }
  };

  const updateAsset = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/update-asset/${id}`, {
        color,
        amount,
        owner,
      });
      setResult(res.data.message);
    } catch (error) {
      setResult(error.response.data.error);
    }
  };

  const deleteAsset = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/delete-asset/${id}`
      );
      setResult(res.data.message);
    } catch (error) {
      setResult(error.response.data.error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Hyperledger Fabric CRUD</h2>
      <div>
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={createAsset}>Create Asset</button>
        <button onClick={readAsset}>Read Asset</button>
        <button onClick={readAllAsset}>Read All Asset</button>
        <button onClick={updateAsset}>Update Asset</button>
        <button onClick={deleteAsset}>Delete Asset</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <strong>Result:</strong>
        <pre>{result}</pre>
      </div>

      {resultArr.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <strong>Result Array:</strong>
          <pre>{JSON.stringify(resultArr, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
