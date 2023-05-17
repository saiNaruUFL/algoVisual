import {React,useState} from "react";
import "./Header.css"; //import your custom css file for the header

function Header({bfsState,dfsState,diakState,setBFSState,setDFSState,setDiakState,speed,setSpeed}) {
  const [colors,setColors] = useState(5);

  const handleClick = (type) => {
    setDFSState(false);
    setDiakState(false);
    setBFSState(false);
  
    if(type === 'BFS')
      setBFSState(true);
    else if(type === 'DFS')
      setDFSState(true);
    else if(type === 'Diak')
      setDiakState(true);
    else if(type === 'Clear') {
      window.location.reload();
    }
    console.log("broddy clicked")
  }
  const modifySpeed = (speed) => {
    setSpeed(speed);
  }
  return (
    <div className="header-container">
      <div className="nav-title">Algorithm Visualizer</div>
      <div className="nav-tabs">
        <button className="tab" onClick={() => handleClick('BFS')} style={{backgroundColor: bfsState ? 'green' : ''}}>BFS</button>
        <button className="tab" onClick={() => handleClick('DFS')} style={{backgroundColor: dfsState ? 'green' : ''}}>DFS</button>
        <button className="tab" onClick={() => handleClick('Diak')} style={{backgroundColor: diakState ? 'green' : ''}}>Dijkstra's</button>
        <button className="tab" onClick={() => handleClick('Clear')}>Clear</button>
      </div>
      <div className="nav-tabs">
        <button className="tab" style={{ backgroundColor: speed === 15 ? "green" : "" }} onClick={() => modifySpeed(15)}>
          .50x
        </button>
        <button className="tab" style={{ backgroundColor: speed === 5 ? "green" : "" }} onClick={() => modifySpeed(5)}>
          1.0x
        </button>
        <button className="tab" style={{ backgroundColor: speed === 1 ? "green" : "" }} onClick={() => modifySpeed(1)}>
          2.0x
        </button>
      </div>      
    </div>
  );
}

export default Header;
