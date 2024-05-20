import { useEffect, useState } from 'react'
import './App.css'
import abi from './assets/abi.json'
import {ethers} from 'ethers';
import {Container,Row,Col,Button} from 'react-bootstrap';
import Permit from './Component/Permit';


function App() {
  const [state,setState] = useState({
    Contract:null,
    Account:null,
    Signer:null
  })
  const[result,setResult] = useState({
    Win:0,
    Lose:0,
    flip:0
  })
  const[Connected,setConnected] = useState(false);
   const[Coins,setCoins] = useState(0);
   const[Get,setGet] = useState(false);
  const connect = async()=>{  
    try{
      const provider =  new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      let contractAddress = "0x02107d085aE3EAb41039BaA7098D1b37c4930A0f";
      const contract = new ethers.Contract(contractAddress,abi,signer);
      setState({Contract:contract , Account:address , Signer:signer});
      setConnected(true);
      console.log(state.Contract)
      console.log(state.Account)
      
    }
    catch(error){
      alert("Please install metamask");
    }

  }
  const Flipcoin = async() =>{
   await state.Contract.FlipCoin();
  }

  const Getcoin = async()=>{
    try{
    await state.Contract.GetCoins();
    const number = await state.Contract.BalanceCoins();
    const coin = Number(number/1e18)
    setCoins(coin);
    setGet(true);
    }
    catch{
      alert("You already got your Coins");
      setGet(true);
    }
  }
  
  useEffect(()=>{
    const func =async()=>{
    if(Connected==true){ 
    const win = await state.Contract.win(state.Account);
    const lose = await state.Contract.lose(state.Account);
    let totalflips = Number(win)+Number(lose)
    const number = await state.Contract.BalanceCoins();
    const coin = Number(number/1e18)
    setCoins(coin);
    setResult({Win:win , Lose:lose,flip:totalflips});
    
    }
  }
   Connected && func();
  },[Connected,Flipcoin])
  return (
    <>
    
      <Container >
        <h1 >Welcome to the Coin Flipper!</h1>
        <h2 hidden={Connected} >Please connect your wallet</h2>
        <h5 hidden={!Connected} >Connected account : {state.Account}</h5>
      <Button onClick={connect} hidden={Connected}  variant="dark">
          {!Connected? "Connect metamask" : "Connected" }
      </Button>
      
      {Connected && (
          <Container style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)', marginTop: '20px' }}>
             <h1 style={{ color: '#343a40', marginBottom: '20px' }}>Coin FLip</h1>
             <h3 style={{ color: '#6c757d', marginBottom: '20px' }}>Bet 10 coins per flip. Win 10 or lose them!</h3>
             <Permit state={state}/>
            <hr></hr>
        <Row s="auto" style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0px 2px 5px 0px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <Col>Coins</Col>
        <Col>Flips</Col>
        <Col>Win</Col>
        <Col>Lose</Col>
      </Row>
      <Row s="auto" style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0px 2px 5px 0px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <Col>{Coins}</Col>
        <Col>{Number(result.flip)}</Col>
        <Col>{Number(result.Win)}</Col>
        <Col>{Number(result.Lose)}</Col>
      </Row>
      <br></br><br></br><br></br>
      <Button variant="primary" size="lg" onClick={Flipcoin}>Flip</Button>{' '} 
      <Button variant="success" size="lg" onClick={Getcoin} disabled={Get}> Get Coins</Button>
          </Container>
      )

      }
      </Container>
    </>
  )
}

export default App
