type Point = {
    x:number
    y:number
}
    
const Helpers = {
    getRandomNumber: (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    calculateDistance: (point1: Point, point2: Point): number => {
        const xDistance = Math.abs(point1.x - point2.x);
        const yDistance = Math.abs(point1.y - point2.y);

        return Math.max(xDistance, yDistance);
    }
};

export default Helpers;
