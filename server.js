const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const fs = require("fs");

// Tambahan Solusi Global: Mengizinkan Node.js mengubah BigInt menjadi String secara otomatis saat dikirim sebagai JSON
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const RPC_URL = "http://127.0.0.1:8545";

const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// PENTING: ganti dengan address kontrak hasil deploy (BUKAN private key!)
const CONTRACT_ADDRESS = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

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

    console.error(err);

    res.status(400).json({
      sukses: false,
      error:
        err.reason ||
        err.shortMessage ||
        err.message
    });
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

    console.error(err);

    res.status(400).json({
      sukses: false,
      error:
        err.reason ||
        err.shortMessage ||
        err.message
    });
  }
});
// =============================
// JUMLAH DATA
// =============================
app.get("/api/jumlah", async (req, res) => {
  try {
    const jumlah = await contract.jumlahAbsensi();
    // Mengirim objek dengan key 'jumlah' bernilai angka murni (string)
    res.json({ jumlah: jumlah.toString() }); 
  } catch (err) {
    console.error("ERROR /api/jumlah:", err);
    res.status(500).json({ error: err.message });
  }
});


// =============================
// SEMUA DATA ABSENSI
// =============================
app.get("/api/absensi", async (req, res) => {
  try {
    const total = await contract.jumlahAbsensi();
    const data = [];

    for (let i = 0; i < Number(total.toString()); i++) {
      const item = await contract.lihatAbsensi(i);
      data.push({
        nama: item[0],   // Kembalikan ke item[0] untuk Nama
        status: item[1], // Kembalikan ke item[1] untuk Status
        waktu: new Date(Number(item[2].toString()) * 1000).toLocaleString("id-ID") // item[2] untuk Timestamp
      });
    }

    res.json(data);
  } catch (err) {
    console.error("ERROR /api/absensi:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// DATA TERAKHIR
// =============================
app.get("/api/terakhir", async (req, res) => {
  try {
    const total = await contract.jumlahAbsensi();

    if (total == 0n || total == 0) {
      return res.json({ kosong: true });
    }

    const index = Number(total.toString()) - 1;
    const data = await contract.lihatAbsensi(index);

    res.json({
      nama: data[0],   // Kembalikan ke data[0]
      status: data[1], // Kembalikan ke data[1]
      timestamp: Number(data[2].toString()),
      tanggal: new Date(Number(data[2].toString()) * 1000).toLocaleString("id-ID")
    });
  } catch (error) {
    console.error("ERROR /api/terakhir:", error);
    res.status(500).json({ error: error.message });
  }
});
app.listen(3000, () => {
  console.log("Server aktif http://localhost:3000");
});
