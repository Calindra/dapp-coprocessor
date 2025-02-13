// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/coprocessor-base-contract/src/CoprocessorAdapter.sol";
import "./FootballTeam.sol";

contract MyContract is CoprocessorAdapter {
    mapping(address => bytes) internal matches;
    FootballTeam public footballTeam;

    event ResultReceived(bytes32 payloadHash, bytes output);
    event TeamSet(address indexed teamAddress, bytes teamHash);
    event TeamCreated(uint256 teamHash);

    constructor(address _taskIssuerAddress, bytes32 _machineHash)
        CoprocessorAdapter(_taskIssuerAddress, _machineHash)
    {
        footballTeam = new FootballTeam();
    }

    function createTeam(
        string memory teamName,
        FootballTeam.Player memory goalkeeper,
        FootballTeam.Player[] memory defense,
        FootballTeam.Player[] memory middle,
        FootballTeam.Player[] memory attack
    ) external {
        uint256 teamId = footballTeam.addTeam(
            teamName,
            goalkeeper,
            defense,
            middle,
            attack
        );

        emit TeamCreated(teamId);
    }

    // maybe change to msg.sender
    function setTeam(bytes memory teamHash, address me) external {
        matches[me] = teamHash;
        emit TeamSet(me, teamHash);
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
