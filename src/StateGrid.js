import React, { useEffect,useState} from 'react'
import StateTile from './StateTile'

const StateGrid = ({diakState,setDiakState,dfsState,setDFSState,bfsState,setBFSState,height,width,speed}) => {
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
  const diakColors = ['#b4b9fa','#8f96f7','#646efa','#2d3bfa'];
  const [diakProcess,setDiakProcess] = useState(false);
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

  const Diak = async() => {
    const visited = new Set(); // Set of visited nodes
    const distances = new Map(); // Map of distances to start node
    const parents = new Map();
    parents.set(`${startCoord[0]},${startCoord[1]}`, null);
    let flag = false;

    for(let x = 0;x < height;x++){
      for(let y = 0;y < width;y++){
        
         if(x === startCoord[0] && y === startCoord[1])
            distances.set(`tile-${x}-${y}`,0);
          else
            distances.set(`tile-${x}-${y}`,Infinity);
      }
    }
    
    while (true) {
      // Find the unvisited node with the shortest distance to the start node
      let minDistance = Infinity;
      let minTile = null;

      for(let x = 0;x < height;x++){
        for(let y = 0;y < width;y++){
          const tile = tiles[x].props.children[y];
          const id = tile.props.id;

          if (!visited.has(id) && distances.get(id) < minDistance) {
            minDistance = distances.get(id);
            minTile = tile;
          }
        }
      }

      
      if(minDistance === Infinity) {
        break;
      }
      // If the end node has been reached, exit the loop
      if (minTile.props.id === `tile-${endCoord[0]}-${endCoord[1]}`) {
        flag = true;
        break;
      }
    
     visited.add(minTile.props.id);
     const visTile = document.getElementById(minTile.props.id);

     if(minTile.props.id !== `tile-${startCoord[0]}-${startCoord[1]}`)
        visTile.style.backgroundColor = "red";

     // Update the distances of neighboring nodes
     const neighbors = getNeighbors(minTile);
     console.log(neighbors);
      neighbors.forEach((neighbor) => {
        const neighborId = neighbor.props.id;
        const neighborTile = document.getElementById(neighborId);
        const neighborColor = neighborTile.style.backgroundColor;

        if (!visited.has(neighborId) && neighborColor != '#000000') {
          parents.set(neighborId,minTile.props.id);
          const distance = distances.get(minTile.props.id) + getCost(neighborId); 
          if (distance < distances.get(neighborId)) {
            distances.set(neighborId, distance);
          }
        }
      });
     
    await delayBFS(speed);
    }

    //write code to find reverse path
    let currCoord = endCoord;
    
    while(flag === true && (currCoord[0] !== startCoord[0] || currCoord[1] !== startCoord[1])){
        const pathParent = parents.get(`tile-${currCoord[0]}-${currCoord[1]}`);
        console.log(pathParent);
        const pathTile = document.querySelector(`#tile-${currCoord[0]}-${currCoord[1]}`);
        if(currCoord[0] === endCoord[0] && currCoord[1] === endCoord[1])
          pathTile.style.backgroundColor = "#00ff00";
        else
          pathTile.style.backgroundColor = "yellow";
        currCoord = currCoord = getCoordsFromString(pathParent);
        await delayBFS(speed);
    }
  }

  function getCoordsFromString(tileString) {
    console.log(tileString);
    const [_, xStr, yStr] = tileString.split("-");
    const x = Number(xStr);
    const y = Number(yStr);
    return [x, y];
  }

  function rgbToHex(rgbString) {
    const rgbArray = rgbString.slice(4, -1).split(",");
    const r = parseInt(rgbArray[0].trim()).toString(16).padStart(2, "0");
    const g = parseInt(rgbArray[1].trim()).toString(16).padStart(2, "0");
    const b = parseInt(rgbArray[2].trim()).toString(16).padStart(2, "0");
    const hexCode = `#${r}${g}${b}`;
    return hexCode;
  }

  function getCost(tileId) {
    const tile = document.getElementById(tileId);
    const color = rgbToHex(tile.style.backgroundColor);
    console.log("Color",color);

    if(color === '#b4b9fa')
      return 1;
    else if(color === '#8f96f7')
      return 2;
    else if(color === '#646efa')
      return 3;
    else if(color === '#2d3bfa')
      return 4;
    else if(color === '#00ff00')
      return 0;
  }
  /* gets neighbors in the four cardinal directions */
  function getNeighbors(tile) {
    const id = tile.props.id;
    const [x, y] = id.substring(5).split("-");
    const [x1,y1] = [parseInt(x),parseInt(y)];
    const neighbors = [];
    
    // Get the tiles to the left, right, top, and bottom
    if (x1 > 0) {
      neighbors.push(tiles[x1-1].props.children[y1]);
    }
    if (x1 < height - 1) {
      neighbors.push(tiles[x1+1].props.children[y1]);
    }
    if (y1 > 0) {
      neighbors.push(tiles[x1].props.children[y1-1]);
    }
    if (y1 < width - 1) {
      neighbors.push(tiles[x1].props.children[y1+1]);
    }
   
    return neighbors;
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


     /*
      Waits for user to press DFS and activates
   */
      useEffect(() => {
        if (diakState) {
          let tempTiles = [];
          for (let i = 0; i < height; i++) {
            const row = [];
            for (let j = 0; j < width; j++) {
              const tile = tiles[i].props.children[j];
              let color = tile.props.color;
              
                if(!(color === '#00ffff' || color === '#00ff00' || color === '#000000')) {
                  let randomInt = Math.floor(Math.random() * 4); // generates a random integer between 0 and 3 (inclusive)
                  row.push(<StateTile id={`tile-${i}-${j}`} key={`${i}-${j}`} color={diakColors[randomInt]} />);
                }
                else
                  row.push(<StateTile id={`tile-${i}-${j}`} key={`${i}-${j}`} color={color} />)
              }
              tempTiles.push(<div className="row" style={{ display: "flex" }} id={`${i}`} key={`${i}`}>{row}</div>);
            }
      
            setTiles(tempTiles);
            setDiakProcess(true);
        }
      }, [diakState]);

    useEffect(() => {
      async function runDiak() {
       await Diak();
       setDiakProcess(false);
       setDiakState(false);
     }
   
     if (diakProcess && diakState && tiles) {
       runDiak();
     }
    },[diakProcess,tiles])

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