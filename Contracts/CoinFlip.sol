// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0<0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CoinFlips{
   
   address manager;
   IERC20 public Token;
   
    constructor(address _token){
      manager = msg.sender;
      Token = IERC20(_token);
    }

    mapping(address=>bool) public CheckGetCoins;
    mapping(address=>uint) public win;
    mapping(address=>uint) public lose;

    function GetCoins() public {
        require(CheckGetCoins[msg.sender]==false,"You already get free coins");
        bool success =  Token.transfer(msg.sender,100*1e18);
       require(success,"Fail Bhaiya ...Transaction ");
       CheckGetCoins[msg.sender] = true;
    }
   
     function Random() private view returns(uint){
        uint randNo = 0;
      return uint(keccak256(abi.encodePacked (msg.sender, block.timestamp,randNo)))%10;
    }

   function FlipCoin() public {
      uint check = 5;
      uint number = Random(); 
      
      if(number<check){
       bool success =  Token.transfer(msg.sender,10*1e18);
       require(success,"Fail Bhaiya ...Transaction ");
       win[msg.sender]+=1;
      }
      else{
        bool success =  Token.transferFrom(msg.sender,address(this),10*1e18);
       require(success,"Fail Bhaiya ...Transaction ");
       lose[msg.sender]+=1;
      }
   }

   function BalanceCoins() public view returns(uint256){
      return Token.balanceOf(msg.sender);
   }
   

