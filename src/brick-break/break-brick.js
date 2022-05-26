import {loadCookiePrivacyPolicy} from "../common/load-privacy-policy";
import "./break-brick.css";

loadCookiePrivacyPolicy();

const brickBlast = (function () {
 const font = "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, Liberation Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji";
 let ns = {};
 const SCORE_KEY = "totalScore";
 const LEVEL_KEY = "level";
 let cv = document.getElementById("gameCanvas");
 let ctx = cv.getContext("2d");
 let level = +localStorage.getItem(LEVEL_KEY) || 1;
 let canvasOffset = 30;
 let scrVal = +localStorage.getItem(SCORE_KEY) || 0;
 let levelScore = 0;
 let ballX = 0;
 let ballY = 200 + canvasOffset;
 let ballXdir = 0;
 let ballYdir = 0;
 let xratio = 0;
 let yratio = 0;
 let paddlex = 0;
 let bricks = new Map();
 let brickHeight = 40;
 let bricksXlen = 10;
 let bricksWidth = 0;
 let bricksMargin = 2;
 let paddleLength = 0;
 let ballRadius = 15;
 let paddleHeight = 7;
 let run;
 const numberOfBrickRows = 3;
 const bricksPerRow = 10;

 const getCoordinateKey = (x, y) => `${y}:${x}`;

 ns.init = () => {
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
  bricksWidth = cv.width / bricksXlen;
  xratio = cv.offsetWidth / cv.width;
  yratio = cv.offsetHeight / cv.height;
  paddleLength = cv.width * 0.25;
  
  cv.addEventListener("mousemove", (e) => {
   paddlex = (e.clientX / xratio) - (paddleLength / 2);
  }, false);
  cv.addEventListener("touchmove", (e) => {
   e.preventDefault();
   var touch = e.touches[0];
   paddlex = (touch.clientX / xratio) - (paddleLength / 2);
  }, false);

  ns.setBallSpeed();
  ns.constructBricks();
  ns.drawFrames();
  ns.drawNotification("Press a key to start the game!", "#39ff14");

  const handler = () => {
   run = requestAnimationFrame(ns.startGame);
   document.removeEventListener("keypress", handler);
  }

  document.addEventListener("keypress", handler);
 }

 ns.setBallSpeed = ()=> {
  ballXdir = 9 + ((level - 1) * 3);
  ballYdir = 9 + ((level - 1) * 3);
 }
 ns.startGame = () => {
  ns.drawFrames();
  if (ns.move() && ns.checkGameOver()) {
   run = requestAnimationFrame(ns.startGame);
  }
 }

 ns.drawNotification = (message, color = "#ffffff", y = cv.height / 2) => {
  ctx.font = `25px ${font}`;
  ctx.fillStyle = color;
  const measure = ctx.measureText(message);
  ctx.fillText(message, (cv.width - measure.width) / 2, y);
  ctx.fillText(message, (cv.width - measure.width) / 2, y);
 }

 ns.drawFrames = () => {
  ns.clearRectangle(0, 0, cv.width, cv.height);
  ns.drawRectangle(0, 0, cv.width, cv.height, "#212529");
  ns.drawRectangle(paddlex, cv.height - paddleHeight, paddleLength, paddleHeight, "#ffffff");
  ns.drawCircle(ballX, ballY, ballRadius, "red");
  ns.drawBricks();
  ns.drawScore();
 }

 ns.drawScore = () => {
  ctx.font = `25px ${font}`;
  ctx.fillStyle = "#39ff14";
  const scoresText = `Scores: L: ${levelScore}  T: ${scrVal}`;
  const scoreX = cv.width - ctx.measureText(scoresText).width - 10;
  ctx.fillText(`Level: ${level}`, 10, 20);
  ctx.fillText(scoresText, scoreX, 20);
 }

 ns.move = () => {
  ballX = ballX + ballXdir;
  ballY = ballY + ballYdir;

  const ballYRange = ((brickHeight + bricksMargin) * numberOfBrickRows) + canvasOffset;
  const paddleRange = ballX > (paddlex - ballRadius) 
   && ballX < (paddlex + paddleLength + ballRadius) 
   && ballY > (cv.height - (paddleHeight + ballRadius));

  if (ballX > cv.width) {
   ballXdir = ballXdir * (-1);
  } else if (ballX < 0) {
   ballXdir = ballXdir * (-1);
  }

  if (ballY <= canvasOffset) {
   ballYdir = -ballYdir;
  } else if (ballY < ballYRange && ballY > canvasOffset) {
   let x = parseInt((ballX + bricksWidth) / (bricksWidth + bricksMargin) - 0.70);
   let y = parseInt((ballY - canvasOffset + 1) / (brickHeight + 2));

   const brickKey = getCoordinateKey(x, y);
   if (bricks.has(brickKey)) {
    bricks.delete(brickKey);
    levelScore += 100;
    ballYdir = -ballYdir;
   }
  } else if (paddleRange) {
   ballYdir = -ballYdir;
   ballY -= (paddleHeight + ballRadius);
  } else if (ballY > cv.height + ballRadius) {
   ns.drawNotification("You lost! Press a key to restart.", "#ff0000");
   ns.resetGame(() => ns.startGame());
   return false;
  }
  return true;
 }


 ns.drawRectangle = (x, y, width, height, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
 }

 ns.clearRectangle = (x, y, width, height) => {
  ctx.clearRect(x, y, width, height);
 }


 ns.drawCircle = (xCenter, yCenter, radius, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2, true);
  ctx.fill();
 }

 ns.drawBricks = () => {
  bricks.forEach(v => {
   ns.drawRectangle(v.xPos, v.yPos, v.width, v.height, "#835246");
  });
 }

 ns.constructBricks = () => {
  bricks = new Map();
  for (let y = 0; y < numberOfBrickRows; y++) {
   for (let x = 0; x < bricksPerRow; x++) {
    let xPos = x * bricksWidth + bricksMargin;
    let yPos = y * brickHeight + bricksMargin + canvasOffset;
    let width = bricksWidth - bricksMargin;
    let height = brickHeight - bricksMargin;
    bricks.set(getCoordinateKey(x, y), { xPos, yPos, width, height });
   };
  }
 }

 ns.checkGameOver = () => {
  if (levelScore === 3000) {
   const y = cv.height / 2
   ns.drawNotification("Congrats! you have won this level.", "#00FF00", y);
   ns.drawNotification("Press any key to go to next level.", "#00FF00", y + 40);
   ns.increaseLevel();
   ns.resetGame(() => ns.startGame());
   cancelAnimationFrame(run);
   return false;
  }
  return true;
 }

 ns.resetGame = (resetCallback = () => { }) => {
  const handler = () => {
   ballY = 200 + canvasOffset;
   ballX = 0;
   levelScore = 0;
   ns.constructBricks();
   resetCallback();
   document.removeEventListener("keypress", handler);
  }
  document.addEventListener("keypress", handler);
 }

 ns.increaseLevel = () => {
  level = level + 1;
  scrVal += levelScore;
  ns.setBallSpeed()
  localStorage.setItem(SCORE_KEY, scrVal);
  localStorage.setItem(LEVEL_KEY, level);
 }
 return ns;
})();

brickBlast.init();


