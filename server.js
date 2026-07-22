const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const RPC_URL = "http://127.0.0.1:8545";

const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// PENTING: ganti dengan address kontrak hasil deploy (BUKAN private key!)
const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const artifact = JSON.parse(
  fs.readFileSync("./out/Absensi.sol/Absensi.json", "utf8")
);

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  artifact.abi,
  wallet
);

// =============================
// WALLET ADMIN
// =============================
app.get("/api/wallet", async (req, res) => {
  try {
    const address = await wallet.getAddress();
    res.json({ wallet: address });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// HADIR
// =============================
app.post("/api/hadir", async (req, res) => {
  try {
    const { nama } = req.body;
    const tx = await contract.tambahAbsensi(nama, "Hadir");
    const receipt = await tx.wait();

    res.json({
      sukses: true,
      hash: tx.hash,
      gasUsed: receipt.gasUsed.toString()
    });
  } catch (err) {
    res.status(500).json({ sukses: false, error: err.message });
  }
});

// =============================
// IZIN
// =============================
app.post("/api/izin", async (req, res) => {
  try {
    const { nama } = req.body;
    const tx = await contract.tambahAbsensi(nama, "Izin");
    const receipt = await tx.wait();

    res.json({
      sukses: true,
      hash: tx.hash,
      gasUsed: receipt.gasUsed.toString()
    });
  } catch (err) {
    res.status(500).json({ sukses: false, error: err.message });
  }
});

// =============================
// JUMLAH DATA
// =============================
app.get("/api/jumlah", async (req, res) => {
  try {
    const jumlah = await contract.jumlahAbsensi();
    res.json({ jumlah: Number(jumlah) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// SEMUA DATA ABSENSI (dari blockchain, bukan variabel lokal)
// =============================
app.get("/api/absensi", async (req, res) => {
  try {
    const total = await contract.jumlahAbsensi();
    const data = [];

    for (let i = 0; i < Number(total); i++) {
      const item = await contract.lihatAbsensi(i);
      data.push({
        nama: item[0],
        status: item[1],
        waktu: new Date(Number(item[2]) * 1000).toLocaleString("id-ID")
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// DATA TERAKHIR
// =============================
app.get("/api/terakhir", async (req, res) => {
  try {
    const total = await contract.jumlahAbsensi();

    if (total == 0) {
      return res.json({ kosong: true });
    }

    const index = Number(total) - 1;
    const data = await contract.lihatAbsensi(index);

    res.json({
      nama: data[0],
      status: data[1],
      timestamp: Number(data[2]),
      tanggal: new Date(Number(data[2]) * 1000).toLocaleString("id-ID")
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server aktif http://localhost:3000");
});