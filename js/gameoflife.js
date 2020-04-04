function seed() {
  return Array.prototype.slice.call(arguments);
}

function same([x, y], [j, k]) {
  return x===j && y ===k
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some(x=>same(x,cell));
}

const printCell = (cell, state) => {
  return contains.call(state,cell)? '\u25A3':'\u25A2';
};

const corners = (state = []) => {
  const minY = state.length > 0 ? Math.min.apply(null,state.map(y=>y[1])):0
  const maxY = state.length > 0 ? Math.max.apply(null,state.map(y=>y[1])):0
  const minX = state.length > 0 ? Math.min.apply(null,state.map(y=>y[0])):0
  const maxX = state.length > 0 ? Math.max.apply(null,state.map(y=>y[0])):0
  return {
    topRight:[maxX,maxY],
    bottomLeft:[minX,minY]
  };
};


const printCells = (state) => {
  let {bottomLeft,topRight} = corners(state);
  let xdiff = topRight[0] - bottomLeft[0] +1;
  let ydiff = topRight[1] - bottomLeft[1] +1;
  let xcoords = [...Array(xdiff).keys()].map(i => i + bottomLeft[0]);
  let ycoords = [...Array(ydiff).keys()].map(i => i + bottomLeft[1]);
  let result = ""
  ycoords.reverse().forEach((y)=>{
    xcoords.forEach((x)=> {
      result += printCell([x,y],state)
    });
    result += "\n";
  })
  return result
};

const getNeighborsOf = ([x, y]) => {
  acc = []
    for(let j = y-1; j<= y+1;j++){
  for(let i = x-1; i<= x+1;i++){
      if( i != x || j != y){acc.push([i,j])}
    }
  }
  return acc
};

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter(cell=>contains.call(state,cell))
};

const willBeAlive = (cell, state) => {
  const nrOfLivingNeighbors = getLivingNeighbors(cell,state).length;
  return (
    nrOfLivingNeighbors ===3 
    ||
    (contains.call(state,cell) && nrOfLivingNeighbors ===2)
  )
};

const calculateNext = (state) => {
  const {bottomLeft,topRight} = corners(state);
  let acc = []
  for(let y=bottomLeft[1] - 1;y<= topRight[1] + 1;y++){
  for(let x= bottomLeft[0] -1;x<=topRight[0] +1;x++){
      if(willBeAlive([x,y], state)){
        acc.push([x,y])
      }
    }
  }
  return acc;
};

const iterate = (state, iterations) => {
  let current_state = state
  let states = [current_state]
  for(let i=0; i< iterations;i++){
    current_state = calculateNext(current_state)
    states.push(current_state)
  }
  return states
};

const main = (pattern, iterations) => {
  all_states = iterate(startPatterns[pattern],iterations)
  all_states.forEach(state=>{
    console.log(printCells(state))
  }
  )
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;