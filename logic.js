let board;
let score = 0;
let rows = 4
let columns = 4;

// To congratulate the user once after reaching 2048, 4096, or 8192
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

let startX= 0;
let startY= 0;

function setGame(){

    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]; // goal - to use this backend board to create the frontend board

    //loop 
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // create and design a tile

            // created tile using div
            let tile = document.createElement("div");

            // each tile will have an invisible id
            tile.id = r.toString() + "-" + c.toString();

            // number of the tile
            let num = board[r][c];

            // updates the appearanc of the tile(that is should hace tile number and background color)
            updateTile(tile, num);

            document.getElementById("board").append(tile)
        }
    }

    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";

    tile.classList.add("tile");

    
    if(num > 0){
		tile.innerText = num.toString();
	
        // updateTile() uses the prepared style in style.css
		if(num <= 4096){

			tile.classList.add("x" + num.toString());
		}

		else{
			tile.classList.add("x8192");
		}
	}
}

window.onload = function() {
    setGame();
}


function handleSlide(event){
	console.log(event.code); // event.code - is the pressed key in our keyboard

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){

		event.preventDefault();

        if(event.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        }

        else if (event.code == "ArrowRight") {
            slideRight();
            setTwo();
        }

        else if (event.code == "ArrowUp") {
            slideUp();
            setTwo();
        }

        else if (event.code == "ArrowDown") {
            slideDown();
            setTwo();
        }
	}
    checkWin();

    if (hasLost() == true) {
        alert("Game Over! You have lost the game. Game will restart.")
        restartGame();
        alert("Click any arrow key to restart.")
    }

    document.getElementById("score").innerText = score;
}

document.addEventListener("keydown", handleSlide);

function slideLeft(){

	for(let r=0; r<rows; r++){

		let row = board[r]
        let originalRow = row.slice();

		row = slide(row); // slideLeft()  function uses slide() function to merge tiles with the same values

		board[r] = row;

		for(let c = 0; c<columns; c++){

            // retrieves the tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());
            
			let num = board[r][c];

            if(originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-right 0.3s"
                setTimeout(() => {
                    tile.style.snimstion = ""
                }, 300);
            }

            // updates the appearance of the tilw
			updateTile(tile, num);

		}
	}
}

function slideRight(){

	for(let r = 0; r < rows; r++){

        let row = board[r]
        let originalRow = row.slice();
        row.reverse();
		row = slide(row); // slideRight()  function uses slide() function to merge tiles with the same values
        row.reverse();

		board[r] = row;

		for(let c = 0; c<columns; c++){

            // retrieves the tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());

			let num = board[r][c];

            if(originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-left 0.3s"
                setTimeout(() => {
                    tile.style.snimstion = ""
                }, 300);
            } 

            // updates the appearance of the tilw
			updateTile(tile, num);

		}
	}
}

function slideUp(){

	for(let c=0; c<columns; c++){

		let col = [ board[0][c], board[1][c], board[2][c], board[3][c] ];

		let originalCol = col.slice();
		col = slide(col); // slideUp() function uses slide() function to merge tiles with the same values.

		let changeIndices = [];
		for(let r=0; r<rows; r++){
			if(originalCol[r] !== rows[r]){
				changeIndices.push(r);
			}
		}
		
		for(let r = 0; r<rows; r++){

			board[r][c] = col[r];

			// this code is the retrieve our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());

			let num = board[r][c];

			if(changeIndices.includes(r) && num !== 0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}

			// Updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}

function slideDown(){

	for(let c = 0; c < columns; c++){

		let col = [ board[0][c], board[1][c], board[2][c], board[3][c] ]; 

        let originalCol = col.slice();
        col.reverse();
        col = slide(col); // slideUp()  function uses slide() function to merge tiles with the same values
        col.reverse();

        let changeIndices = [];
		for(let r=0; r<rows; r++){
			if(originalCol[r] !== rows[r]){
				changeIndices.push(r);
			}
		}

		for(let r = 0; r<rows; r++){

            board[r][c] = col[r];

            // // retrieves the tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());
            
			let num = board[r][c];

            // Animation
            if(changeIndices.includes(r) && num !== 0){
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}

            // // updates the appearance of the tilw
			updateTile(tile, num);

		}
	}
}

// merge
// removes the zeroes
function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    //  0 2 2 0
    row = filterZero(row);
    //  2 2 
    for (let i = 0; i <row.length - 1; i++) {
        if (row[i] == row[i+1]) {
            row[i] *= 2; // 4 2
            row[i+1] = 0; // 4 0
            score += row[i];
        }
    }

    //add zeroes back
    while(row.length < columns) {
        row.push(0);
    }

    return row;
}

// checks the gameboard
function hasEmptyTile(){

	// loop
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c]==0){
				return true;
			}
		}
	}

	return false;

}

function setTwo() {
    if (hasEmptyTile() == false) {
        return; // will not generate anything
    }

    // if hasEmptyTile() returns true, codes below will be executed
    let found = false;

    while (!found) {

        // random row and column position and to generate random 2 tile
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if(board[r][c] == 0) {

            // the random vacant tile becomes 2
            board[r][c] = 2;

            let tile = document.getElementById(r.toString() + "-" + c.toString());


            tile.innerText = "2";
            tile.classList.add("x2");

            found = true;
        }
    }
}

function checkWin() {

    for(let r=0; r < rows; r++){
		for(let c=0; c < columns; c++){

            if(board[r][c] == 2048 && is2048Exist == false) {
                alert("You win! You got 2048.");
                is2048Exist = true;
            }

            else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096.");
                is4096Exist = true;
            }
            
            else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory! You have reached 8192! You are incredibly awesome.");
                is4096Exist = true;
            }

        }
    }
}

function hasLost(){
	for(let r=0; r < rows; r++){
		for(let c=0; c < columns; c++){

            // if there is an  empty tile, the player has not yet lose the game
			if(board[r][c]==0){
				return false;
			}

			const currentTile = board[r][c];

			if(
				
                // check the current board if it has a possible merge in its upper tile
				r > 0 && board[r-1][c] === currentTile ||
                // checks the lower tile
				r < rows - 1 && board[r+1][c] === currentTile ||
				// checks the left tile
                c > 0 && board[r][c-1] === currentTile ||
				//checks the right tile
                c < columns - 1 && board[r][c+1] === currentTile
			) {
				return false;
			}
		}
	}

    return true;
}

// RestartGame by replacing all values into zero.
function restartGame() {
    // this loop is responsible to change each tile values to zero
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;    // change all values to 0
        }
    }

    score = 0;
    setTwo();    // new tile   
}

document.addEventListener('touchstart', (event) =>{
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;
})

document.addEventListener('touchend', (event) => {

    if(!event.target.className.includes("tile")) {
        return;
    }
    
    // touchstart - touchend 
    let diffX = startX - event.changedTouches[0].clientX;
    let diffY = startY - event.changedTouches[0].clientY;

    if(Math.abs(diffX) > Math.abs(diffY)) {
        if(diffX > 0) {
            slideLeft();
            setTwo();
        }
        else {
            slideRight();
            setTwo();
        }
    }

    else {
        if(diffY > 0) {
            slideUp();
            setTwo();
        }
        else {
            slideDown();
            setTwo();
        }
    }

    document.getElementById("score").innerText = score;

	checkWin();

	if(hasLost() == true){
		alert("Game Over! You have lost the game. Game will restart");
		restartGame();
		alert("Click any arrow key to restart");
	}
})

document.addEventListener('touchmove', (e) => {
    if(!e.target.className.includes("tile")) {
        return;
    }

    e.preventDefault();

}, {passive: false})