// ===============================
// ABSENSI HADIR
// ===============================
async function hadir(){
    kirimAbsensi("Hadir");
}


// ===============================
// ABSENSI IZIN
// ===============================
async function izin(){
    kirimAbsensi("Izin");
}


// ===============================
// KIRIM ABSENSI KE BLOCKCHAIN
// ===============================
async function kirimAbsensi(status){

    const nama = document.getElementById("nama").value.trim();

    if(nama === ""){
        alert("Masukkan nama mahasiswa");
        return;
    }

    try{
        const response = await fetch(
            "/api/" + status.toLowerCase(),
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nama: nama })
            }
        );

        const data = await response.json();

        if(data.sukses){
            alert("Absensi berhasil!\n\nHash Blockchain:\n" + data.hash);
            document.getElementById("nama").value = "";
            jumlah();
        } else {
            alert(data.error);
        }

    } catch(error){
        console.log(error);
        alert("Tidak dapat terhubung server");
    }
}


// ===============================
// JUMLAH ABSENSI
// ===============================
async function jumlah(){
    try{
        const res = await fetch("/api/jumlah");
        const data = await res.json();

        document.getElementById("jumlah").innerHTML =
            "Jumlah Absensi : " + data.jumlah;

    } catch(err){
        console.log(err);
    }
}


// ===============================
// WALLET ADMIN
// ===============================
async function walletAdmin(){
    try{
        const res = await fetch("/api/wallet");
        const data = await res.json();

        document.getElementById("wallet").innerHTML = data.wallet;

    } catch(err){
        console.log(err);
    }
}


// ===============================
// LIHAT DATA TERAKHIR
// ===============================
async function lihatTerakhir(){
    try{
        const res = await fetch("/api/terakhir");
        const data = await res.json();

        if(data.kosong){
            document.getElementById("hasil").innerHTML = "Belum ada data absensi";
            return;
        }

        document.getElementById("hasil").innerHTML = `
            <h5>Data Absensi Terakhir</h5>
            <hr>
            <table class="table table-sm table-borderless mb-0">
              <tr>
                <td><b>Nama Mahasiswa</b></td>
                <td>: ${data.nama}</td>
              </tr>
              <tr>
                <td><b>Status</b></td>
                <td>: ${data.status}</td>
              </tr>
              <tr>
                <td><b>Tanggal</b></td>
                <td>: ${data.tanggal}</td>
              </tr>
              <tr>
                <td><b>Timestamp</b></td>
                <td>: ${data.timestamp}</td>
              </tr>
              <tr>
                <td><b>Blockchain</b></td>
                <td>: Tersimpan ✅</td>
              </tr>
            </table>
        `;

    } catch(error){
        console.log(error);
        document.getElementById("hasil").innerHTML = "Terjadi error mengambil data";
    }
}


// ===============================
// LIHAT SEMUA RIWAYAT ABSENSI
// ===============================
async function lihatSemua(){
    try{
        const res = await fetch("/api/absensi");
        const data = await res.json();

        if(data.length === 0){
            document.getElementById("riwayat").innerHTML =
                "<p class='text-muted'>Belum ada data absensi.</p>";
            return;
        }

        let html = `
            <table class="table table-striped table-bordered table-sm">
              <thead class="table-dark">
                <tr>
                  <th>#</th>
                  <th>Nama</th>
                  <th>Status</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
        `;

        data.forEach((item, index) => {
            html += `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.nama}</td>
                  <td>${item.status}</td>
                  <td>${item.waktu}</td>
                </tr>
            `;
        });

        html += `
              </tbody>
            </table>
        `;

        document.getElementById("riwayat").innerHTML = html;

    } catch(error){
        console.log(error);
        document.getElementById("riwayat").innerHTML =
            "<p class='text-danger'>Terjadi error mengambil riwayat data</p>";
    }
}


// ===============================
// LOAD AWAL
// ===============================
window.onload = function(){
    jumlah();
    walletAdmin();
};