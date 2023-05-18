import StateGrid from './StateGrid';
import Header from "./Header"
import Footer from "./Footer"
import {React,useState} from "react"

function App() {
  const [bfsState,setBFSState] = useState(false);
  const [dfsState,setDFSState] = useState(false);
  const [diakState,setDiakState] = useState(false);

  const [speed,setSpeed] = useState(5);
  const height = parseInt(window.innerHeight / 47);
  const width = parseInt(window.innerWidth / 41);

  return (
   <div>
      <Header dfsState ={dfsState} diakState={diakState} bfsState={bfsState} setBFSState={setBFSState} setDFSState={setDFSState} setDiakState={setDiakState}  speed={speed} setSpeed={setSpeed}/>
      <StateGrid dfsState ={dfsState} diakState={diakState} bfsState={bfsState} setBFSState={setBFSState} setDFSState={setDFSState} setDiakState={setDiakState}  height={height} width={width} speed={speed}/> 
      <Footer/>
   </div>
  );
}

export default App;
