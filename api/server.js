/** @format */

const express = require("express");
const {
  createAsset,
  readAsset,
  readAllAsset,
  updateAsset,
  deleteAsset,
} = require("./fabricClient");

const app = express();

const cors = require("cors");

app.use(cors()); // Enable CORS for all origins

// app.use(cors({
//     origin: 'http://localhost:3001' // React app ka origin
// }));

const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/create-asset", async (req, res) => {
  try {
    const { id, color, amount, owner } = req.body;
    await createAsset(id, color, amount, owner);
    res.status(200).json({ message: `Asset ${id} created successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/read-asset/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await readAsset(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/read-all-assets", async (req, res) => {
  try {
    const result = await readAllAsset();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/update-asset/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { color, amount, owner } = req.body;
    await updateAsset(id, color, amount, owner);
    res.status(200).json({ message: `Asset ${id} updated successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/delete-asset/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteAsset(id);
    res.status(200).json({ message: `Asset ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
