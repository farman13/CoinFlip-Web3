// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0<0.9.0;

import "@openzeppelin/contracts@5.0.2/access/Ownable.sol";
import "@openzeppelin/contracts@5.0.2/token/ERC20/extensions/ERC20Permit.sol";

contract MyToken is ERC20, Ownable, ERC20Permit {
    constructor(address initialOwner)
        ERC20("Kick&Lift","FTK")
        Ownable(initialOwner)
        ERC20Permit("Kick&Lift")
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount*1e18);
    }
}


