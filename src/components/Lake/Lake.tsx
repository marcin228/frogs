import React, { useState } from "react"
import './Lake.css'
import '../../helpers/Helpers'
import Helpers from "../../helpers/Helpers";

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

    const onClickJumpHandler = function():void{


        const [id1, id2] = [...selectedFrogsIds.values()].map(Number);
        const tmpLakeState = structuredClone(lakeState);

        const cell1 = { y: Math.floor(id1 / LAKE_WIDTH), x: id1 % LAKE_WIDTH }
        const cell2 = { y: Math.floor(id2 / LAKE_WIDTH), x: id2 % LAKE_WIDTH }

        const distance = Helpers.calculateDistance(cell1, cell2);

        console.log(distance);

        if (
          (tmpLakeState[cell1.y][cell1.x]?.alive == true &&
            tmpLakeState[cell2.y][cell2.x]?.alive == false) ||
          (tmpLakeState[cell1.y][cell1.x]?.alive == false &&
            tmpLakeState[cell2.y][cell2.x]?.alive == true)
        ) {
            const tmp = structuredClone(tmpLakeState[cell1.y][cell1.x]);
            tmpLakeState[cell1.y][cell1.x] = tmpLakeState[cell2.y][cell2.x];
            tmpLakeState[cell2.y][cell2.x] = tmp;

            [
              tmpLakeState[cell1.y][cell1.x].id,
              tmpLakeState[cell2.y][cell2.x].id,
            ] = [tmpLakeState[cell2.y][cell2.x].id, tmpLakeState[cell1.y][cell1.x].id];

            setLakeState(tmpLakeState);
        }
    }

    const onClickReproduce = function():void{

    }

    const onClickCheckboxHandler = function (event:Event, id:number) {

        if((event.currentTarget as HTMLInputElement).checked){
            if(selectedFrogsNum >= 2){
                event.preventDefault();
                return;
            }
            else{
                setSelectedFrogsNum((val) => val + 1);
                addSelectedFrogsIds(parseInt((event.currentTarget as HTMLInputElement).dataset['id']!));
            }
        }
        else{
            setSelectedFrogsNum((val) => val - 1);
            removeSelectedFrogsIds(parseInt((event.currentTarget as HTMLInputElement).dataset['id']!));
        }

        const tmpLakeState = structuredClone(lakeState);
        tmpLakeState[Math.floor(id / LAKE_WIDTH)][id % LAKE_WIDTH].checked =
          !tmpLakeState[Math.floor(id / LAKE_WIDTH)][id % LAKE_WIDTH].checked;

        setLakeState(tmpLakeState); 
    };

    const [selectedFrogsIds, setSelectedFrogsIds] = useState(new Set());
    const addSelectedFrogsIds = function(id:number){
        const tmpSelectedFrogsIds = structuredClone(selectedFrogsIds);
        tmpSelectedFrogsIds.add(id);
        setSelectedFrogsIds(tmpSelectedFrogsIds);
    }
    const removeSelectedFrogsIds = function(id:number){
        const tmpSelectedFrogsIds = structuredClone(selectedFrogsIds);
        tmpSelectedFrogsIds.delete(id);
        setSelectedFrogsIds(tmpSelectedFrogsIds);
    }
    const [selectedFrogsNum, setSelectedFrogsNum] = useState(0);
    const [lakeState, setLakeState] = useState(
        new Array(LAKE_HEIGTH).fill(null).map((a, row) =>
            new Array(LAKE_WIDTH).fill(null).map((b, col) => {
                return {
                  id: parseInt(row) * LAKE_WIDTH + parseInt(col),
                  alive:
                    parseInt(row) * LAKE_WIDTH + parseInt(col) == 3
                      ? true
                      : false,
                  checked: false,
                  gender: "male",
                  characteristics: ["fat", "tall"],
                };
            })
        )
    );

    return (
      <>
        <div className="buttons">
            <button onClick={onClickJumpHandler}>JUMP</button>
            <button onClick={onClickReproduce}>REPRODUCE</button>
        </div>

        {lakeState.map((row) =>
          row.map((cell) => (
            <div key={cell.id} className="frog">
              {JSON.stringify(cell)}
              <input
                type="checkbox"
                checked={(cell as Frog).checked ? true : false}
                onClick={(event) => onClickCheckboxHandler(event, cell.id)}
                data-id={cell.id}
              ></input>
            </div>
          ))
        )}
      </>
    );
};

export default Lake;