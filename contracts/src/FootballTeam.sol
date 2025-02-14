// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FootballTeam {

    // Define a structure for each player with their name and level
    struct Player {
        string name;
        uint256 level;
    }

    // Define a structure for the Team
    struct Team {
        string name;
        Player goalkeeper;
        Player[] defense;
        Player[] middle;
        Player[] attack;
    }

    // Mapping from team ID (uint256) to the team structure
    mapping(uint256 => Team) public teams;

    // Function to add a team
    function addTeam(
        string memory teamName,
        Player memory goalkeeper,
        Player[] memory defense,
        Player[] memory middle,
        Player[] memory attack
    ) public returns (uint256) {
        // Initialize the team
        uint256 teamHash = uint256(keccak256(
            abi.encode(
                teamName,
                goalkeeper,
                defense,
                middle,
                attack
            )
        ));
        Team storage team = teams[teamHash];
        team.name = teamName;

        // Set the goalkeeper
        team.goalkeeper = goalkeeper;

        // Add defense players
        for (uint256 i = 0; i < defense.length; i++) {
            team.defense.push(defense[i]);
        }

        // Add middle players
        for (uint256 i = 0; i < middle.length; i++) {
            team.middle.push(middle[i]);
        }

        // Add attack players
        for (uint256 i = 0; i < attack.length; i++) {
            team.attack.push(attack[i]);
        }

        return teamHash;
    }

    // Function to get a team name by team ID
    function getTeamName(uint256 teamId) public view returns (string memory) {
        return teams[teamId].name;
    }

    // Function to get the goalkeeper of a team
    function getGoalkeeper(uint256 teamId) public view returns (string memory, uint256) {
        Player memory goalkeeper = teams[teamId].goalkeeper;
        return (goalkeeper.name, goalkeeper.level);
    }

    // Function to get defense players of a team
    function getDefense(uint256 teamId) public view returns (Player[] memory) {
        return teams[teamId].defense;
    }

    // Function to get middle players of a team
    function getMiddle(uint256 teamId) public view returns (Player[] memory) {
        return teams[teamId].middle;
    }

    // Function to get attack players of a team
    function getAttack(uint256 teamId) public view returns (Player[] memory) {
        return teams[teamId].attack;
    }
}
