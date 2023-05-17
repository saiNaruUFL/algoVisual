import {React} from 'react'

const StateTile = ({id,color}) => {
 
  return (
    <div
      className="tile"
      style={{ backgroundColor: color,width: "40px", height: "40px",border: "1px solid #ccc",display: "flex",justifyContent: "center",alignItems: "center",fontSize: "23px"}}
      id={id}
    >
    </div>
  )
}

export default StateTile