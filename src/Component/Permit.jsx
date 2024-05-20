import { ethers } from "ethers";
import contractAbi from './abi.json';
import {Button} from 'react-bootstrap';
import { useState } from "react";
const Permit =({state})=>{
    
    const{Signer} = state;
    const[permitted,setpermitted] = useState(false);
    const permit = async()=>{
  
    const contractAddress = "0x67ed753cB72d26380c718816a6889c1d03184C1E";
    const contract = new ethers.Contract(contractAddress, contractAbi,Signer);

    // Define permit parameters
    const owner = await Signer.getAddress();
    const spender = "0x02107d085aE3EAb41039BaA7098D1b37c4930A0f";
    const value = ethers.utils.parseUnits("10.0", 18); // Replace with the value to be approved
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from the current time

    // Create the permit message
    const domain = {
        name: "Kick&Lift",
        version: "1",
        chainId: await Signer.getChainId(),
        verifyingContract: contractAddress
     };

    const types = {
        Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" }
        ]
    };

    const nonce = await contract.nonces(owner); // Replace with your contract's method to get nonce

    const message = {
        owner: owner,
        spender: spender,
        value: value.toString(),
        nonce: nonce.toNumber(),
        deadline: deadline
    };

    // Sign the permit message
    const signature = await Signer._signTypedData(domain, types, message);
    const { v, r, s } = ethers.utils.splitSignature(signature);

    // Send the permit transaction
    const tx = await contract.permit(owner, spender, value, deadline, v, r, s);
    await tx.wait();
   setpermitted(true);
    console.log('Permit transaction sent:', tx);
    }
return(
    <>
     <div hidden={permitted}>
     Permit us to deduct tokens from your account if you lose <Button variant="warning" size="md" onClick={permit} >Permit</Button>{' '} 
    </div>
    </>
)
}
export default Permit;