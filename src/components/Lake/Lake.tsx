import React, { MouseEvent, useState } from "react"
import './Lake.css'
import '../../helpers/Helpers'
import Helpers, { Point } from "../../helpers/Helpers";

type LakeProps = {
    children?:React.ReactNode,
}

enum Gender {
    male = 'male',
    female = 'female'
}

enum Weight {
    fat = 'fat', 
    slim = 'slim'
}

enum Height {
    tall = 'tall', 
    short = 'short'
}

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

const MALE_DISTANCE: number = 3;
const FEMALE_DISTANCE: number = 2;

const Lake:React.FC<LakeProps> = () => {

    const checkAdjacentCellsInMatrix = function(pos:Point, matrix:Array<Array<Frog>>):Point | null{

        const adjacencyOrder = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        let result:Point|null = null;

        adjacencyOrder.forEach(_ => { 

            const y = pos.y + _[0];
            const x = pos.x + _[1];
            
            if(x >= 0 && x < LAKE_WIDTH && y >= 0 && y < LAKE_HEIGTH)
                if(!matrix[y][x].alive){
                    
                    result = { x: x, y: y };
                    return;
                }
        });

        return result;
    }

    const getCellStyle = function(alive:boolean, gender:Gender){

        if(alive){
            if(gender == Gender.male) return 'frog male'
            else return 'frog female'
        }
        else return 'frog'
    }

    const onClickJumpHandler = function():void{

        const [id1, id2] = [...selectedFrogsIds.values()].map(Number);
        const tmpLakeState = structuredClone(lakeState);

        const pos1 = { y: Math.floor(id1 / LAKE_WIDTH), x: id1 % LAKE_WIDTH }
        const pos2 = { y: Math.floor(id2 / LAKE_WIDTH), x: id2 % LAKE_WIDTH }

        const distance = Helpers.calculateDistance(pos1, pos2);
        
        const cell1 = tmpLakeState[pos1.y][pos1.x];
        const cell2 = tmpLakeState[pos2.y][pos2.x];
        const aliveCell = (cell1.alive) ? cell1 : cell2;

        if(aliveCell.gender == Gender.male && distance > MALE_DISTANCE)
            return;

        if(aliveCell.gender == Gender.female && distance > FEMALE_DISTANCE)
            return;

        if (
          (tmpLakeState[pos1.y][pos1.x]?.alive == true &&
            tmpLakeState[pos2.y][pos2.x]?.alive == false) ||
          (tmpLakeState[pos1.y][pos1.x]?.alive == false &&
            tmpLakeState[pos2.y][pos2.x]?.alive == true)
        ) {
          const tmp = structuredClone(tmpLakeState[pos1.y][pos1.x]);

          tmpLakeState[pos1.y][pos1.x] = tmpLakeState[pos2.y][pos2.x];
          tmpLakeState[pos2.y][pos2.x] = tmp;

          [tmpLakeState[pos1.y][pos1.x].id, tmpLakeState[pos2.y][pos2.x].id] = [
            tmpLakeState[pos2.y][pos2.x].id,
            tmpLakeState[pos1.y][pos1.x].id,
          ];

          setLakeState(tmpLakeState);
        }
    }

    const onClickReproduce = function():void{

        const [id1, id2] = [...selectedFrogsIds.values()].map(Number);
        const tmpLakeState = structuredClone(lakeState);

        const pos1 = { y: Math.floor(id1 / LAKE_WIDTH), x: id1 % LAKE_WIDTH };
        const pos2 = { y: Math.floor(id2 / LAKE_WIDTH), x: id2 % LAKE_WIDTH };

        const distance = Helpers.calculateDistance(pos1, pos2);

        const cell1 = tmpLakeState[pos1.y][pos1.x];
        const cell2 = tmpLakeState[pos2.y][pos2.x];
        const femalePos = cell1.gender == Gender.female ? pos1 : pos2;

        if(cell1.alive && cell2.alive && cell1.gender != cell2.gender && distance == 1){

            const childPos = checkAdjacentCellsInMatrix(femalePos, tmpLakeState);
            
            if(childPos == null)
                return;

            tmpLakeState[childPos.y][childPos.x] = {
                id: childPos.x + (childPos.y * LAKE_WIDTH),
                alive: true,
                gender: Helpers.getRandomNumber(0, 1) == 0 ? Gender.female : Gender.male,
                checked: false,
                characteristics: ([cell1.characteristics[0], cell2.characteristics[1]] as Characteristics)
            };

            setLakeState(tmpLakeState);
        }
        else
            return;
    }

    const onClickCheckboxHandler = function (event:MouseEvent, id:number) {

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

                let isAlive:boolean = false;
                let defaultGender:Gender = Gender.male;

                if(row * LAKE_WIDTH + col == 0 || row * LAKE_WIDTH + col == 1)
                    isAlive = true;

                if (row * LAKE_WIDTH + col == 1)
                    defaultGender = Gender.female;

                return {
                  id: row * LAKE_WIDTH + col,
                  alive: isAlive,
                  checked: false,
                  gender: defaultGender,
                  characteristics: [
                    Helpers.getRandomNumber(0, 1) == 0
                      ? Weight.fat
                      : Weight.slim,
                    Helpers.getRandomNumber(0, 1) == 0
                      ? Height.tall
                      : Height.short
                  ] as Characteristics,
                };
            })
        )
    );

    return (
      <div className="lake">
        <div className="buttons">
            <button onClick={onClickJumpHandler}>JUMP</button>
            <button onClick={onClickReproduce}>REPRODUCE</button>
        </div>

        {lakeState.map((row) =>
          row.map((cell) => (
            <div key={cell.id} 
                className={getCellStyle(cell.alive, cell.gender)}>
              {JSON.stringify(cell)}
              <br /><br />
              <input
                type="checkbox"
                checked={(cell as Frog).checked ? true : false}
                onClick={(event:MouseEvent) => onClickCheckboxHandler(event, cell.id)}
                data-id={cell.id}
              ></input>
            </div>
          ))
        )}
      </div>
    );
};

export default Lake;