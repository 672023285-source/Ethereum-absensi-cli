// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Absensi} from "../src/Absensi.sol";

contract DeployAbsensi is Script {
    function run() public {
        vm.startBroadcast();

        new Absensi();

        vm.stopBroadcast();
    }
}