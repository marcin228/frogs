import React, { useState } from "react"
import './Lake.css'

type LakeProps = {
    children?:React.ReactNode,
}

type Gender = 'male' | 'female';
type Weight = 'fat' | 'slim';
type Height = 'tall' | 'short';
type Characteristics = [Weight, Height];
type Frog = {

    id: number
    alive:boolean
    checked:boolean
    gender:Gender
    characteristics:Characteristics
};

const LAKE_WIDTH:number = 10;
const LAKE_HEIGTH:number = 6;

const Lake:React.FC<LakeProps> = ({ children }) => {
  
  const onClickCheckboxHandler = function (pos:number) {

    const tmpLakeState = structuredClone(lakeState);
    tmpLakeState[Math.floor(pos / LAKE_WIDTH)][pos % LAKE_WIDTH].checked =
      !tmpLakeState[Math.floor(pos / LAKE_WIDTH)][pos % LAKE_WIDTH].checked;

    setLakeState(tmpLakeState); 
  };

  const [lakeState, setLakeState] = useState(
    new Array(LAKE_HEIGTH).fill(null).map((a, row) =>
      new Array(LAKE_WIDTH).fill(null).map((b, col) => {
        return {
          id: (parseInt(row) * LAKE_WIDTH) + parseInt(col),
          alive: false,
          checked: false,
          gender: "male",
          characteristics: ["fat", "tall"],
        };
      })
    )
  );

  return (
    <>
      {lakeState.map((row) =>
        row.map((cell) => (
          <div key={cell.id} className="frog">
            {JSON.stringify(cell)}
            <input
              type="checkbox"
              defaultChecked={(cell as Frog).checked ? true : false}
              onClick={() => onClickCheckboxHandler(cell.id)}
            ></input>
          </div>
        ))
      )}
    </>
  );
};

export default Lake;