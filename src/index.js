import "./styles.css";

//Rod1 element
const rod1 = document.getElementById("rod-1");
//Rod2 element
const rod2 = document.getElementById("rod-2");

//Ball element
const ball = document.getElementById("ball");

//Width of the rod
const rodWidth = rod1.clientWidth;

//To get center position of ball using transform property -
// Toggled the class after getting the calculated middle value for ball
ball.classList.toggle("start");
ball.style.left = ball.getBoundingClientRect().x + "px";
ball.classList.toggle("start");

//Direction of ball in horizontal direction
let directionX = true;

//Direction of ball in vertical direction
let directionY = false;

//Interval function id for move ball & ball color
var moveBallIntevalId, ballColorIntervalId;

//Game started varible to indicate game status
let gameStarted = false;

//Rod score 1 stored in the rod1Score
let rod1Score = 0;

//Rod score 2 stored in the rod2Score
let rod2Score = 0;

//To determine the initial position of the ball based on the last winner - Ball will appear in the loser rod
if (
  localStorage.getItem("winnerName") != null &&
  localStorage.getItem("winnerName") === "Rod 2"
) {
  //If Rod 2 wins then ball will appear on the Rod 1
  ball.style.top = "27px";
} else {
  //By default ball will appear on the Rod 2
  ball.style.bottom = "27px";
}

document.body.addEventListener("keypress", function (e) {
  // a - 97
  // d - 100
  // enter - 13
  let rodCoOrdinates = rod1.getBoundingClientRect();

  //Enter key (keyCode - 13) to start the game
  if (!gameStarted && e.keyCode === 13) {
    //game status is true
    gameStarted = true;
    let startMsg = "";

    //Determine the start message
    if (localStorage.getItem("maxScore") != null) {
      startMsg +=
        localStorage.getItem("winnerName") +
        " has maximum score of " +
        localStorage.getItem("maxScore");
    } else {
      startMsg += " This is your first time!";
    }
    alert(startMsg);

    //Interval function to move the ball on the window
    moveBallIntevalId = setInterval(function () {
      let curMaxScore = rod1Score > rod2Score ? rod1Score : rod2Score;

      //If ball is crossed the boudaries alert with messsage and end the game
      if (crossedBoundaries()) {
        let winnerPlayer = rod1Score > rod2Score ? "Rod 1" : "Rod 2";

        if (localStorage.getItem("maxScore") != null) {
          if (localStorage.getItem("maxScore") <= rod1Score) {
            localStorage.setItem("winnerName", "Rod 1");
            localStorage.setItem("maxScore", rod1Score);
          } else if (localStorage.getItem("maxScore") <= rod2Score) {
            localStorage.setItem("winnerName", "Rod 2");
            localStorage.setItem("maxScore", rod2Score);
          }
        } else {
          localStorage.setItem("maxScore", curMaxScore);
          localStorage.setItem("winnerName", winnerPlayer);
        }

        gameStarted = false;
        clearInterval(moveBallIntevalId);
        clearInterval(ballColorIntervalId);

        if (rod1Score !== rod2Score) {
          alert(
            winnerPlayer +
              " wins with score of " +
              curMaxScore +
              ". Max score is " +
              localStorage.getItem("maxScore")
          );
        }

        window.location.reload();
        return;
      }
      moveBallXDirection();
      moveBallYDirection();
      hitBallOnRod();
    }, 60);

    //Interval function to change color of call from color1 to color2 for 150 milliseconds
    ballColorIntervalId = setInterval(function () {
      ball.style.background = "brown";
      setTimeout(function () {
        ball.style.background = "cyan";
      }, 150);
    }, 1500);
  }
  //a key (keycode - 97) to move the rod 1 & 2 towards left
  else if (e.keyCode === 97) {
    if (!isSafeMoveRod(rodCoOrdinates.x - 20)) {
      return;
    }
    rod1.style.left = Math.round(rodCoOrdinates.x) - 20 + "px";
    rod2.style.left = rod1.style.left;
  }
  //a key (keycode - 100) to move the rod 1 & 2 towards right
  else if (e.keyCode === 100) {
    if (!isSafeMoveRod(rodCoOrdinates.x + 20)) {
      return;
    }
    rod1.style.left = Math.round(rodCoOrdinates.x) + 20 + "px";
    rod2.style.left = rod1.style.left;
  }
});

//Checks whether the move of the rod is in visible area of the window
function isSafeMoveRod(pos) {
  if (pos < rod1.style.width || pos >= window.innerWidth - rodWidth) {
    return false;
  }
  return true;
}

//Checks whether the move of the ball in horizontal direction results in visible area of screen
function isSafeMoveBallX(pos) {
  if (pos < 0 || pos + ball.clientWidth >= window.innerWidth) {
    return false;
  }
  return true;
}

//Checks whether the ball crossed the vertical boundaries of the visible area of screen
function crossedBoundaries() {
  if (
    ball.getBoundingClientRect().y < 0 ||
    ball.getBoundingClientRect().y > window.innerHeight
  ) {
    return true;
  }
  return false;
}

//Moves the ball in X (horizontal) direction
function moveBallXDirection() {
  if (directionX === true) {
    if (isSafeMoveBallX(ball.getBoundingClientRect().x + 10)) {
      ball.style.left = ball.getBoundingClientRect().x + 10 + "px";
    } else {
      directionX = !directionX;
      return;
    }
  } else {
    if (isSafeMoveBallX(ball.getBoundingClientRect().x - 10)) {
      ball.style.left = ball.getBoundingClientRect().x - 10 + "px";
    } else {
      directionX = !directionX;
      return;
    }
  }
}

//Moves the ball in Y (Vertical) direction
function moveBallYDirection() {
  if (directionY === true) {
    ball.style.top = ball.getBoundingClientRect().y + 7 + "px";
  } else {
    ball.style.top = ball.getBoundingClientRect().y - 7 + "px";
  }
}

//Checks whether the ball is hit on the rod. If hit then reverse the Y direction of the ball
function hitBallOnRod() {
  if (
    rod1.getBoundingClientRect().x <= ball.getBoundingClientRect().x &&
    ball.getBoundingClientRect().x <=
      rod1.getBoundingClientRect().x + rod1.clientWidth
  ) {
    if (ball.getBoundingClientRect().y <= rod1.clientHeight) {
      rod1Score += 20;
      directionY = !directionY;
    } else if (
      ball.getBoundingClientRect().y >=
      rod2.getBoundingClientRect().y - rod2.clientHeight
    ) {
      rod2Score += 20;
      directionY = !directionY;
    }
  }
}
