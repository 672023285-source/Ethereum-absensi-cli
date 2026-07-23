// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Absensi {

    struct DataAbsensi {
        string nama;
        string status;
        uint256 timestamp;
    }

    DataAbsensi[] private daftarAbsensi;

    // Menyimpan apakah nama sudah pernah absen
    mapping(string => bool) private sudahAbsen;

    event AbsensiDicatat(
        string nama,
        string status,
        uint256 timestamp
    );

    function tambahAbsensi(
        string memory _nama,
        string memory _status
    ) public {

        require(bytes(_nama).length > 0, "Nama tidak boleh kosong");

        require(
            !sudahAbsen[_nama],
            "Nama sudah melakukan absensi"
        );

        daftarAbsensi.push(
            DataAbsensi(
                _nama,
                _status,
                block.timestamp
            )
        );

        sudahAbsen[_nama] = true;

        emit AbsensiDicatat(
            _nama,
            _status,
            block.timestamp
        );
    }

    function jumlahAbsensi()
        public
        view
        returns(uint256)
    {
        return daftarAbsensi.length;
    }

    function lihatAbsensi(uint256 index)
        public
        view
        returns(
            string memory,
            string memory,
            uint256
        )
    {

        require(
            index < daftarAbsensi.length,
            "Data tidak ditemukan"
        );

        DataAbsensi memory data = daftarAbsensi[index];

        return (
            data.nama,
            data.status,
            data.timestamp
        );
    }
}