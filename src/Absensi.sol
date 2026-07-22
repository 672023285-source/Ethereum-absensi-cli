// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;


contract Absensi {


    struct DataAbsensi {

        string nama;

        string status;

        uint timestamp;

    }



    DataAbsensi[] private daftarAbsensi;



    event AbsensiDicatat(

        string nama,

        string status,

        uint timestamp

    );




    function tambahAbsensi(
        string memory _nama,
        string memory _status
    )
    public
    {


        daftarAbsensi.push(

            DataAbsensi(

                _nama,

                _status,

                block.timestamp

            )

        );



        emit AbsensiDicatat(

            _nama,

            _status,

            block.timestamp

        );


    }





    function jumlahAbsensi()

    public

    view

    returns(uint)

    {

        return daftarAbsensi.length;

    }






    function lihatAbsensi(uint index)

    public

    view

    returns(

        string memory,

        string memory,

        uint

    )

    {


        require(

            index < daftarAbsensi.length,

            "Data tidak ditemukan"

        );



        DataAbsensi memory data =

        daftarAbsensi[index];



        return(

            data.nama,

            data.status,

            data.timestamp

        );


    }





}