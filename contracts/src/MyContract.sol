// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../lib/coprocessor-base-contract/src/CoprocessorAdapter.sol";

contract MyContract is CoprocessorAdapter {
    event ResultReceived(bytes32 payloadHash, bytes output);

    constructor(address _taskIssuerAddress, bytes32 _machineHash)
        CoprocessorAdapter(_taskIssuerAddress, _machineHash)
    {}

    function setTeam(bytes memory teamHash) external {
        // match.hash = teamHash;
    }

    function runExecution(bytes memory input) external {

        callCoprocessor(input);
    }

    function handleNotice(bytes32 payloadHash, bytes memory notice) internal override {
        emit ResultReceived(payloadHash, notice);
    }

    // Add your other app logic here
}
