const { ethers } = require("ethers");
const fs = require("fs");

// =========================
// KONFIGURASI
// =========================

const RPC_URL = "http://127.0.0.1:8545";

const PRIVATE_KEY =
"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// GANTI jika deploy ulang
const CONTRACT_ADDRESS =
"0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

const provider = new ethers.JsonRpcProvider(RPC_URL);

const wallet = new ethers.Wallet(
    PRIVATE_KEY,
    provider
);

const artifact = JSON.parse(
    fs.readFileSync("./out/Absensi.sol/Absensi.json", "utf8")
);

const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    artifact.abi,
    wallet
);

// =========================

async function hadir() {

    console.log("\nMengirim Absensi HADIR...\n");

    const tx = await contract.tambahAbsensi(
        "Elisabeth",
        "Hadir"
    );

    console.log("Transaction Hash:");
    console.log(tx.hash);

    const receipt = await tx.wait();

    console.log("\nGas Used:");
    console.log(receipt.gasUsed.toString());

    console.log("\nAbsensi HADIR berhasil.");
}

async function izin() {

    console.log("\nMengirim Absensi IZIN...\n");

    const tx = await contract.tambahAbsensi(
        "HERI",
        "Izin"
    );

    console.log("Transaction Hash:");
    console.log(tx.hash);

    const receipt = await tx.wait();

    console.log("\nGas Used:");
    console.log(receipt.gasUsed.toString());

    console.log("\nAbsensi IZIN berhasil.");
}

async function jumlah() {

    const total = await contract.jumlahAbsensi();

    console.log("\nJumlah Absensi:");
    console.log(total.toString());
}

async function lihat(index) {

    const data = await contract.lihatAbsensi(index);

    console.log("\n===== DATA ABSENSI =====");

    console.log("Nama   :", data[0]);
    console.log("Status :", data[1]);

    const waktu = new Date(Number(data[2]) * 1000);

    console.log("Timestamp :", Number(data[2]));
    console.log("Tanggal   :", waktu.toLocaleString());
}

async function menu() {

    const cmd = process.argv[2];

    if (!cmd) {

        console.log(`
=========================================
 SISTEM ABSENSI ETHEREUM
=========================================

Perintah:

node app.js hadir
node app.js izin
node app.js jumlah
node app.js lihat 0

        `);

        return;
    }

    switch (cmd.toLowerCase()) {

        case "hadir":
            await hadir();
            break;

        case "izin":
            await izin();
            break;

        case "jumlah":
            await jumlah();
            break;

        case "lihat":
            const index = Number(process.argv[3] || 0);
            await lihat(index);
            break;

        default:
            console.log("Perintah tidak dikenal.");
    }
}

menu()
.then(() => process.exit(0))
.catch((err) => {
    console.error(err);
    process.exit(1);
});