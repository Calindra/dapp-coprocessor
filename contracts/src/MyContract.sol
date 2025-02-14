// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/coprocessor-base-contract/src/CoprocessorAdapter.sol";
import "./FootballTeam.sol";

interface INFTPlayers {
    function addXp(uint256 tokenId, uint256 amount) external;
}

contract MyContract is CoprocessorAdapter {
    INFTPlayers public nftContract;
    mapping(address => bytes32) internal matches;
    FootballTeam public footballTeam;

    struct Beacon {
        uint256 round;
        bytes32 randomness;
        bytes32 signature;
        bytes32 previousSignature;
    }

    struct Match {
        Beacon beacon;
        FootballTeam.Team teamA;
        FootballTeam.Team teamB;
    }

    event ResultReceived(bytes32 payloadHash, bytes output);
    event TeamSet(address indexed teamAddress, bytes teamHash);
    event TeamCreated(uint256 teamHash);
    event MatchCreated();

    constructor(
        address _taskIssuerAddress,
        bytes32 _machineHash
    ) CoprocessorAdapter(_taskIssuerAddress, _machineHash) {
        footballTeam = new FootballTeam();
    }

    function playMatch(Beacon memory beacon, bytes memory team) external {
        require(matches[msg.sender] == keccak256(team), "Team is different");
        bytes memory groupEncoded = abi.encode(beacon, team);
        callCoprocessor(groupEncoded);
        emit MatchCreated();
    }

    function createTeam(
        string memory teamName,
        FootballTeam.Player memory goalkeeper,
        FootballTeam.Player[] memory defense,
        FootballTeam.Player[] memory middle,
        FootballTeam.Player[] memory attack
    ) external returns (uint256) {
        uint256 teamHash = footballTeam.addTeam(
            teamName,
            goalkeeper,
            defense,
            middle,
            attack
        );

        emit TeamCreated(teamHash);
        return teamHash;
    }

    function setTeam(bytes memory teamPayload) external {
        matches[msg.sender] = keccak256(teamPayload);
        emit TeamSet(msg.sender, teamPayload);
        // match.hash = teamHash;
    }

    function runExecution(bytes memory input) external {
        callCoprocessor(input);
    }

    /**
     * protect it in the future
     */
    function setNFTPlayersContract(address nftAddress) public {
        nftContract = INFTPlayers(nftAddress);
    }

    function handleNotice(
        bytes32 payloadHash,
        bytes memory notice
    ) internal override {
        (uint256[] memory tokenIds, uint256[] memory xpAmounts) = abi.decode(
            notice,
            (uint256[], uint256[])
        );

        for (uint256 i = 0; i < tokenIds.length; i++) {
            nftContract.addXp(tokenIds[i], xpAmounts[i]);
        }
        emit ResultReceived(payloadHash, notice);
    }

    // Add your other app logic here
}
