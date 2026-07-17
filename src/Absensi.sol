// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Absensi {

    struct DataAbsensi {
        string nama;
        string status;
        uint waktu;
    }

    mapping(address => DataAbsensi[]) private daftarAbsensi;


    event AbsensiDicatat(
        address indexed user,
        string nama,
        string status,
        uint waktu
    );


    // WRITE FUNCTION
    function tambahAbsensi(
        string memory _nama,
        string memory _status
    ) public {

        daftarAbsensi[msg.sender].push(
            DataAbsensi(
                _nama,
                _status,
                block.timestamp
            )
        );

        emit AbsensiDicatat(
            msg.sender,
            _nama,
            _status,
            block.timestamp
        );
    }


    // READ FUNCTION
    function lihatAbsensi(
        uint index
    )
    public
    view
    returns(
        string memory,
        string memory,
        uint
    ){

        DataAbsensi memory data =
        daftarAbsensi[msg.sender][index];

        return(
            data.nama,
            data.status,
            data.waktu
        );
    }


    function jumlahAbsensi()
    public
    view
    returns(uint){

        return daftarAbsensi[msg.sender].length;
    }
}
