import React, { useEffect,useState} from 'react'
import StateTile from './StateTile'

const StateGrid = ({dfsState,setDFSState,bfsState,setBFSState,height,width,speed}) => {
  const [tiles,setTiles] = useState([]);
  const [oldStartCoord,setOldStartCoord] = useState([15,5]);
  const [startCoord,setStartCoord] = useState([15,5]);
  const [oldEndCoord,setOldEndCoord] = useState([2,30]);
  const [endCoord,setEndCoord]  = useState([2,30]);
  const [oldCurrentCoord,setOldCurrentCoord] = useState([0,0]);
  const [currentCoord,setCurrentCoord] = useState([0,0]);
  const [isMouseDown,setIsMouseDown] = useState(false);
  const [changeStart,setChangeStart] = useState(false);
  const [endStart,setEndStart] = useState(false);
  const [wallStart,setWallStart] = useState(false);
  

  /*
    Delay function for shortest path visualization
  */
    function delayBFS(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  /*
    simulates bfs visualization
  */
    const BFS = async() => { 
       
      let queue = [startCoord];
      let visited = new Set();
      const parents = new Map();
      visited.add(`${startCoord[0]},${startCoord[1]}`);
      parents.set(`${startCoord[0]},${startCoord[1]}`, null);
      let flag = false;
  
      const macros = [
        [1,0],
        [0,1],
        [-1,0],
        [0,-1]
      ]
  
      let qLen = 1;
  
      while(qLen !== 0) {
        const tempCoord = queue.shift();
       
        for(const macro of macros) {
          const neighbor = [tempCoord[0] + macro[0],tempCoord[1] + macro[1]];
         
          if(neighbor[0] < 0 || neighbor[0] >= 20 || neighbor[1] < 0 || neighbor[1] >= 45 || document.querySelector(`#tile-${neighbor[0]}-${neighbor[1]}`).style.backgroundColor ===
          "rgb(0, 0, 0)" || visited.has(`${neighbor[0]},${neighbor[1]}`) === true) {
            continue;
          }
  
          visited.add(`${neighbor[0]},${neighbor[1]}`); 
          queue.push(neighbor);
          const neighborTile = document.getElementById(`tile-${neighbor[0]}-${neighbor[1]}`);
          neighborTile.style.backgroundColor = "red";
          parents.set(`${neighbor[0]},${neighbor[1]}`,`${tempCoord[0]},${tempCoord[1]}`);
          await delayBFS(speed);
  
          if(neighbor[0] === endCoord[0] && neighbor[1] === endCoord[1]) {
              flag = true;
              queue = [];
              qLen = 0;
              break;
          }
              
        }
  
         qLen = queue.length;
      } 
      
      let currCoord = endCoord;
  
      while(flag === true && (currCoord[0] !== startCoord[0] || currCoord[1] !== startCoord[1])){
         const pathParent = parents.get(`${currCoord[0]},${currCoord[1]}`);
         const pathTile = document.querySelector(`#tile-${currCoord[0]}-${currCoord[1]}`);
         if(currCoord[0] === endCoord[0] && currCoord[1] === endCoord[1])
            pathTile.style.backgroundColor = "#00ff00";
          else
          pathTile.style.backgroundColor = "yellow";
         currCoord = pathParent.split(",").map(Number);
         await delayBFS(speed);
      }
    }

    const DFS = async() => {
      let stack = [startCoord];
      let visited = new Set();
      const parents = new Map();
      visited.add(`${startCoord[0]},${startCoord[1]}`);
      parents.set(`${startCoord[0]},${startCoord[1]}`, null);
      let flag = false;
    
      const macros = [
        [0,-1],
        [1,0],
        [0,1],
        [-1,0]
      ]
    
      let qLen = 1;
    
      while(qLen !== 0) {
        let tempCoord = stack.pop();
        //console.log(tempCoord);
        //if(visited.has(`${tempCoord[0]},${tempCoord[1]}`) === true)
         // continue;
                
        const tempTile = document.getElementById(`tile-${tempCoord[0]}-${tempCoord[1]}`);
        if(tempCoord != startCoord)
        tempTile.style.backgroundColor = "red";
        visited.add(`${tempCoord[0]},${tempCoord[1]}`); 
        await delayBFS(speed);

        for(const macro of macros) {
          const neighbor = [tempCoord[0] + macro[0],tempCoord[1] + macro[1]];
         
          if(neighbor[0] < 0 || neighbor[0] >= 20 || neighbor[1] < 0 || neighbor[1] >= 45 || document.querySelector(`#tile-${neighbor[0]}-${neighbor[1]}`).style.backgroundColor ===
          "rgb(0, 0, 0)" || visited.has(`${neighbor[0]},${neighbor[1]}`) === true) {
            continue;
          }
          
          stack.push(neighbor);
          parents.set(`${neighbor[0]},${neighbor[1]}`,`${tempCoord[0]},${tempCoord[1]}`);
          
          if(neighbor[0] === endCoord[0] && neighbor[1] === endCoord[1]) {
              flag = true;
              stack = [];
              qLen = 0;
              break;
          }
            
        }
    
         qLen = stack.length;
      } 
      
      let currCoord = endCoord;
    
      while(flag === true && (currCoord[0] !== startCoord[0] || currCoord[1] !== startCoord[1])){
         const pathParent = parents.get(`${currCoord[0]},${currCoord[1]}`);
         const pathTile = document.querySelector(`#tile-${currCoord[0]}-${currCoord[1]}`);
         if(currCoord[0] === endCoord[0] && currCoord[1] === endCoord[1])
            pathTile.style.backgroundColor = "#00ff00";
          else
          pathTile.style.backgroundColor = "yellow";
         currCoord = pathParent.split(",").map(Number);
         await delayBFS(speed);
      }
    }

   /*
    Waits for user to press BFS and activates
  */
    useEffect(() => {
      async function runBFS() {
         await BFS();
        setBFSState(false);
      }
    
      if (bfsState) {
        runBFS();
      }
    }, [bfsState]);

    /*
      Waits for user to press DFS and activates
   */
    useEffect(() => {
      async function runDFS() {
         await DFS();
        setDFSState(false);
      }
    
      if (dfsState) {
        runDFS();
      }
    }, [dfsState]);

  function getTileCoordinate(event) {
    const [_,x, y] = (event.target.id).split('-');
    return [parseInt(x), parseInt(y)];
  }

  const handleMouseDown = (event) => {
    setIsMouseDown(true);
    const hitCoord = getTileCoordinate(event);

    if(hitCoord[0] === startCoord[0] && hitCoord[1] === startCoord[1]){
      setChangeStart(true);
    }
    else if(hitCoord[0] === endCoord[0] && hitCoord[1] === endCoord[1])
      setEndStart(true);
    else
      setWallStart(true);
  }

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setChangeStart(false);
    setEndStart(false);
    setWallStart(false);
  }


  useEffect(() => {

    if(isMouseDown && changeStart){ 
      let tempTiles = [];
      const [prevStartX, prevStartY] = oldStartCoord;
      const [newStartX, newStartY] = startCoord;
      
      if(prevStartX === newStartX && prevStartY === newStartY)
        return;
      
      for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
          const tile = tiles[i].props.children[j];
          let color = tile.props.color;
          
          if(i === prevStartX && j === prevStartY) 
            row.push(<StateTile id={`tile-${i}-${j}`} key={`${i}-${j}`} color={'#ffffff'} />);
          else if(i === newStartX && j === newStartY)
            row.push(<StateTile id={`tile-${i}-${j}`} key={`${i}-${j}`} color={'#00ffff'} />);
          else
            row.push(<StateTile id={`tile-${i}-${j}`} key={`${i}-${j}`} color={color} />);
        }
        tempTiles.push(<div className="row" style={{ display: "flex" }} id={`${i}`} key={`${i}`}>{row}</div>);
      }

      setTiles(tempTiles);
    }


  },[isMouseDown,changeStart,startCoord,oldStartCoord])

  useEffect(() => {

    if(isMouseDown && endStart){ 
      let tempTiles = [];
      const [prevStartX, prevStartY] = oldEndCoord;
      const [newStartX, newStartY] = endCoord;
      
      if(prevStartX === newStartX && prevStartY === newStartY)
        return;
      
      for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
          const tile = tiles[i].props.children[j];
          let color = tile.props.color;

          if(i === prevStartX && j === prevStartY) 
            row.push(<StateTile id={`tile-${i}-${j}`} key={`${i}-${j}`} color={'#ffffff'} />);
          else if(i === newStartX && j === newStartY)
            row.push(<StateTile id={`tile-${i}-${j}`} key={`${i}-${j}`} color={'#00ff00'} />);
          else
            row.push(<StateTile id={`tile-${i}-${j}`} key={`${i}-${j}`} color={color} />);
        }
        tempTiles.push(<div className="row" style={{ display: "flex" }} id={`${i}`} key={`${i}`}>{row}</div>);
      }

      setTiles(tempTiles);
    }


  },[isMouseDown,endStart,endCoord,oldEndCoord])

  useEffect(() => {

    if(isMouseDown && wallStart){ 
      let tempTiles = [];
      const [prevStartX, prevStartY] = oldCurrentCoord;
      const [newStartX, newStartY] = currentCoord;
      
      if(prevStartX === newStartX && prevStartY === newStartY)
        return;
      
      for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
          const tile = tiles[i].props.children[j];
          let color = tile.props.color;

          if(i === newStartX && j === newStartY && color === '#ffffff')
            row.push(<StateTile id={`tile-${i}-${j}`} key={`${i}-${j}`} color={'#000000'} />);
          else if(i === newStartX && j === newStartY && color === '#000000')
            row.push(<StateTile id={`tile-${i}-${j}`} key={`${i}-${j}`} color={'#ffffff'} />);
          else
            row.push(<StateTile id={`tile-${i}-${j}`} key={`${i}-${j}`} color={color} />);
        }
        tempTiles.push(<div className="row" style={{ display: "flex" }} id={`${i}`} key={`${i}`}>{row}</div>);
      }

      setTiles(tempTiles);
    }


  },[isMouseDown,wallStart,currentCoord])

  useEffect(() => {
    const handleMouseMove = (event) => {
      if(changeStart && isMouseDown){
        const hitCoord = getTileCoordinate(event);
       
        if(!(hitCoord[0] === startCoord[0] && hitCoord[1] === startCoord[1])) {
          setOldStartCoord(startCoord);
          setStartCoord(hitCoord);
        }
        }
    }
  

    if(changeStart && isMouseDown){
      window.addEventListener('mousemove', handleMouseMove);
    }
  
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  },[changeStart,startCoord,isMouseDown])

  useEffect(() => {
    const handleMouseMove = (event) => {
      if(endStart && isMouseDown){
        const hitCoord = getTileCoordinate(event);
       
        if(!(hitCoord[0] === endCoord[0] && hitCoord[1] === endCoord[1])) {
          setOldEndCoord(endCoord);
          setEndCoord(hitCoord);
        }
        }
    }
  

    if(endStart && isMouseDown){
      window.addEventListener('mousemove', handleMouseMove);
    }
  
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  },[endStart,endCoord,isMouseDown])

  useEffect(() => {
    const handleMouseMove = (event) => {
      if(wallStart && isMouseDown){
        const hitCoord = getTileCoordinate(event);
       
        if(!(hitCoord[0] === currentCoord[0] && hitCoord[1] === currentCoord[1])) {
          setOldCurrentCoord(currentCoord);
          setCurrentCoord(hitCoord);
        }
        }
    }
  

    if(wallStart && isMouseDown){
      window.addEventListener('mousemove', handleMouseMove);
    }
  
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  },[wallStart,currentCoord,isMouseDown])

  useEffect(() => {
    const newTiles = [];
   
    for(let x = 0;x < height;x++){
      const row = [];
      for(let y = 0;y < width;y++){

        let color = "#ffffff";
        if(x === 15 && y === 5) { 
            color = "#00ffff";
        }
        else if(x === 2 && y === 30)
            color = "#00ff00";
        row.push(<StateTile id={`tile-${x}-${y}`} key={`${x}-${y}`} color={color}/>);
      }
      newTiles.push(<div className="row" style={{ display: "flex" }} id={`${x}`} key={`${x}`}>{row}</div>);
    }
  
   
    setTiles(newTiles);
  },[height,width])
  


  return (
    <div 
    className="grid"
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
    >
       {tiles}
     </div>
  )
}

export default StateGrid;