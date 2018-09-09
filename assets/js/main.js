const fixedWidth = document.getElementById("area").offsetWidth;
const fixedHeight = document.getElementById("area").offsetHeight;
let isFullScreen = false;

let saveData = {
  drawnBingoBalls: [],
  themeColor: "classic",
  blockerEnabled: false,
  lastActionWasRemove: false,
  ballsDrawnRemaining: "hidden",
  hiddenBingoLetters: []
}

if(typeof(localStorage) !== "undefined") {
  if (localStorage.getItem("bingoMasterBoardSaveData")) {
    const parsedData = JSON.parse(localStorage.getItem("bingoMasterBoardSaveData"));
    for (let i = 0; i < Object.keys(parsedData).length; i += 1) {
      if (saveData.hasOwnProperty(Object.getOwnPropertyNames(parsedData)[i])) {
        saveData[Object.keys(saveData)[Object.keys(saveData).indexOf(Object.getOwnPropertyNames(parsedData)[i])]]
        = parsedData[Object.keys(parsedData)[i]];
      }
    }
  }
}

var isNotSafariPrivate = function() {
  var doesItWork = 'test', storage = window.sessionStorage;
  try {
    storage.setItem(doesItWork, '1');
    storage.removeItem(doesItWork);
    return true;
  }
  catch (error) {
    return false;
  }
}

function save() {
  if ( isNotSafariPrivate() ) {
    localStorage.setItem('bingoMasterBoardSaveData', JSON.stringify(saveData));
  }
}

function init() {
	resize();
	window.addEventListener('resize', resize);
	document.addEventListener("fullscreenchange", onFullScreenChange, false);
	document.addEventListener("webkitfullscreenchange", onFullScreenChange, false);
	document.addEventListener("mozfullscreenchange", onFullScreenChange, false);
	const bingoBallClass = document.querySelectorAll(".bingoBall");
	for (let i = 0; i < bingoBallClass.length; i+=1) {
		bingoBallClass[i].addEventListener("click", () => {activateBingoBall(i+1)});
	}
  let param = location.search;
  if (param === "?masterboard") {
    setTimeout(() => {
      hide("titleSlide");
      show("fullScreenToggleLayer");
  		show("masterBoardSlide", "grid");
  	},50);
  } else {
    setTimeout(() => {
  		show("titleSlide");
  		show("fullScreenToggleLayer");
  	},50);
  }
}

function resize() {
  const viewNames = [
    document.getElementById("area"),
  	document.getElementById("fader"),
		document.getElementById("fullScreenToggleLayer"),
		document.getElementById("drawBallLayer")
  ];
  let areaMultiplier = viewNames[0].offsetHeight/viewNames[0].offsetWidth;
  let windowMultiplier = window.innerHeight/window.innerWidth;
  if (windowMultiplier < areaMultiplier) { // window is wider
    for (let i = 0; i<viewNames.length; i+=1) {
        viewNames[i].style.transform = `scale(` + (window.innerHeight/fixedHeight) + `)`;
    }
  } else {
    for (let i = 0; i<viewNames.length; i+=1) {
      viewNames[i].style.transform = `scale(` + (window.innerWidth/fixedWidth) + `)`;
    }

  }
}

function onFullScreenChange() {
  var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
  if (fullscreenElement === null || fullscreenElement === undefined) {
    isFullScreen = false;
  } else {
    isFullScreen = true;
  }
  changeFullScreenImg();
}

function show(elementName, display) {
  document.getElementById("fader").classList.add("notransition");
  document.getElementById("fader").style.opacity = "1";
	if (display === "flex") {
	  document.getElementById(elementName).style.display = "flex";
	} else if (display === "grid") {
	  document.getElementById(elementName).style.display = "grid";
	} else {
	  document.getElementById(elementName).style.display = "block";
	}
	if (elementName === "masterBoardSlide") {
		changeBG(saveData.themeColor);
		document.getElementById("drawBallLayer").style.display = "block";
		document.getElementById("fullScreenToggle").classList.add("fullScreenToggleSmall");
		document.getElementById("homeButton").style.display = "block";
    setUpMasterBoard();
    	document.onkeydown = function(e) {
    		if (e.keyCode == 32) {randomDraw();}
    		if (e.keyCode == 82) {resetBoard();}
        if (e.keyCode == 88) {toggleBlocker();}
    	}

	} else {
    document.onkeydown = function(e) {
    }
  }
  if (elementName === "settingsSlide") {
    setUpSettings(saveData.themeColor);
  }
	setTimeout(() => {
	  document.getElementById("fader").classList.remove("notransition");
	  document.getElementById("fader").style.opacity = "0";
	},50);
}

function hide(elementName) {
  document.getElementById(elementName).style.display = "none";
	if (elementName === "masterBoardSlide") {
		changeBG();
		document.getElementById("drawBallLayer").style.display = "none";
		document.getElementById("fullScreenToggle").classList.remove("fullScreenToggleSmall");
		document.getElementById("homeButton").style.display = "none";
	}
}

function toggleFullScreen(event) {
	const canvas = document.body;
	if (isFullScreen === false) {
		if(canvas.requestFullScreen) {
			canvas.requestFullScreen();
		} else if(canvas.webkitRequestFullScreen) {
			canvas.webkitRequestFullScreen();
		} else if(canvas.mozRequestFullScreen) {
			canvas.mozRequestFullScreen();
		}
		isFullScreen = true;
	}
	else if (isFullScreen === true) {
		if(document.exitFullscreen) {
	  		document.exitFullscreen();
			} else if(document.mozCancelFullScreen) {
	  		document.mozCancelFullScreen();
			} else if(document.webkitExitFullscreen) {
	  		document.webkitExitFullscreen();
			}
		isFullScreen = false;
	}
	changeFullScreenImg();
}

function changeFullScreenImg() {
  if (isFullScreen === false) {
    document.getElementById("fullScreenButton").style.display = "block";
    document.getElementById("fullScreenButtonDown").style.display = "none";
  } else {
    document.getElementById("fullScreenButton").style.display = "none";
    document.getElementById("fullScreenButtonDown").style.display = "block";
  }
}

function changeBG(color) {
  let newColor;
  if (color === "classic") {
    newColor = "#d1cc85";
    document.getElementById("blocker").style.backgroundImage = "linear-gradient(#c4bd97, #948A54)";
  } else if (color === "red") {
    newColor = "rgb(253, 166, 166)";
    document.getElementById("blocker").style.backgroundImage = "linear-gradient(#ed9f9d, #c0504d)";
  } else if (color === "green") {
    newColor = "rgb(150, 206, 129)";
    document.getElementById("blocker").style.backgroundImage = "linear-gradient(#a9c571, #77933c)";
  } else if (color === "blue") {
    newColor = "rgb(139, 199, 226)";
    document.getElementById("blocker").style.backgroundImage = "linear-gradient(#9abce6, #558ed5)";
  } else if (color === "purple") {
    newColor = "rgb(189, 176, 216)";
    document.getElementById("blocker").style.backgroundImage = "linear-gradient(#b3a2c7, #725892)";
  } else {
    newColor = "radial-gradient(#f7eaab, #bfbb73)";
  }
	document.getElementById("area").style.background=newColor;
	document.getElementById("fader").style.background=newColor;
}

function activateBingoBall(bingoIDNum) {
  let typeOfBingoBall = typeOfBingo(bingoIDNum);
  let typeOfBingoBallLetter = typeOfBingoLetter(bingoIDNum);
  let bingoID = bingoIDNum + "bingo";
	if (saveData.drawnBingoBalls.indexOf(bingoIDNum) === -1) {
		document.getElementById(bingoID).classList.add(typeOfBingoBall);
    document.getElementById("bigBingoBall").classList.remove(document.getElementById("bigBingoBall").classList.item(1));
    document.getElementById("bigBingoBall").classList.add(typeOfBingoBall);
    document.getElementById("bigBingoLetter").innerHTML=typeOfBingoBallLetter;
    document.getElementById("bigBingoNumber").innerHTML=bingoIDNum;
    document.getElementById("bigBingoNumber").style.fontSize=104+"px";
    setTimeout(() => {
      document.getElementById("bigBingoNumber").style.fontSize=95+"px";
    },100);
    saveData.drawnBingoBalls.push(bingoIDNum);
    saveData.lastActionWasRemove = false;
    save();
	} else {
		document.getElementById(bingoID).classList.remove(typeOfBingoBall);
    document.getElementById("bigBingoBall").classList.remove(document.getElementById("bigBingoBall").classList.item(1));
    document.getElementById("bigBingoLetter").innerHTML="&nbsp;";
    document.getElementById("bigBingoNumber").innerHTML="&nbsp;";
    saveData.drawnBingoBalls.splice(saveData.drawnBingoBalls.indexOf(bingoIDNum), 1);
    saveData.lastActionWasRemove = true;
    save();
	}
  updateBallStats();
}

function typeOfBingo(num) {
  if (num <= 15){
    return "bingoBallActiveB";
  } else if (num <= 30) {
    return "bingoBallActiveI";
  } else if (num <= 45) {
    return "bingoBallActiveN";
  } else if (num <= 60) {
    return "bingoBallActiveG";
  } else {
    return "bingoBallActiveO";
  }
}

function typeOfBingoLetter(num) {
  if (num <= 15){
    return "B";
  } else if (num <= 30) {
    return "I";
  } else if (num <= 45) {
    return "N";
  } else if (num <= 60) {
    return "G";
  } else {
    return "O";
  }
}

function loadBingoBall(bingoIDNum) {
  let typeOfBingoBall = typeOfBingo(bingoIDNum);
  let bingoID = bingoIDNum + "bingo";
		document.getElementById(bingoID).classList.add(typeOfBingoBall);
  if (saveData.drawnBingoBalls.indexOf(bingoIDNum) === saveData.drawnBingoBalls.length-1 && saveData.lastActionWasRemove === false) {
    let typeOfBingoBallLetter = typeOfBingoLetter(bingoIDNum);
    document.getElementById("bigBingoBall").classList.remove(document.getElementById("bigBingoBall").classList.item(1));
    document.getElementById("bigBingoBall").classList.add(typeOfBingoBall);
    document.getElementById("bigBingoLetter").innerHTML=typeOfBingoBallLetter;
    document.getElementById("bigBingoNumber").innerHTML=bingoIDNum;
  }
}

function getBallsRemaining() {
  let numbersAvailable = [];
  for (let i = 1; i<=15;i+=1) {
    if (saveData.drawnBingoBalls.indexOf(i) === -1 && saveData.hiddenBingoLetters.indexOf("B") === -1) {
      numbersAvailable.push(i);
    }
  }
  for (let i = 16; i<=30;i+=1) {
    if (saveData.drawnBingoBalls.indexOf(i) === -1 && saveData.hiddenBingoLetters.indexOf("I") === -1) {
      numbersAvailable.push(i);
    }
  }
  for (let i = 31; i<=45;i+=1) {
    if (saveData.drawnBingoBalls.indexOf(i) === -1 && saveData.hiddenBingoLetters.indexOf("N") === -1) {
      numbersAvailable.push(i);
    }
  }
  for (let i = 46; i<=60;i+=1) {
    if (saveData.drawnBingoBalls.indexOf(i) === -1 && saveData.hiddenBingoLetters.indexOf("G") === -1) {
      numbersAvailable.push(i);
    }
  }
  for (let i = 61; i<=75;i+=1) {
    if (saveData.drawnBingoBalls.indexOf(i) === -1 && saveData.hiddenBingoLetters.indexOf("O") === -1) {
      numbersAvailable.push(i);
    }
  }
  return numbersAvailable;
}

function randomDraw() {
  if (getBallsRemaining().length === 0) {
    document.getElementById("drawBallDiv").style.transform = "rotate(15deg)";
    setTimeout(() => {
      document.getElementById("drawBallDiv").style.transform = "rotate(0deg)";
    },100);
  } else {
    document.getElementById("drawBallDiv").style.transform = "scale(0.9)";
    document.getElementById("drawBallDiv").style.opacity = 0.6;
    setTimeout(() => {
      document.getElementById("drawBallDiv").style.transform = "scale(1)";
      document.getElementById("drawBallDiv").style.opacity = 1;
    },100)
    let theRandomNumber = getBallsRemaining()[Math.floor(Math.random()*getBallsRemaining().length)];
    activateBingoBall(theRandomNumber);
  }
}

function updateBallStats() {
  let ballsRemaining = getBallsRemaining().length;
  document.getElementById("ballsDrawnNum").innerHTML = 75 - (saveData.hiddenBingoLetters.length*15) - ballsRemaining;
  document.getElementById("ballsRemainingNum").innerHTML = ballsRemaining;
}

function hideBingo(bingoLetter, renderOrToggle) {
  let bingoLetterClass;
  let bingoBallsClass;
  if (bingoLetter === "B") {
    bingoLetterClass = "bingoB";
    bingoBallsClass = "bingoBallsB";
  }
  else if (bingoLetter === "I") {
    bingoLetterClass = "bingoI";
    bingoBallsClass = "bingoBallsI";
  }
  else if (bingoLetter === "N") {
    bingoLetterClass = "bingoN";
    bingoBallsClass = "bingoBallsN";
  }
  else if (bingoLetter === "G") {
    bingoLetterClass = "bingoG";
    bingoBallsClass = "bingoBallsG";
  }
  else if (bingoLetter === "O") {
    bingoLetterClass = "bingoO";
    bingoBallsClass = "bingoBallsO";
  }

  if (renderOrToggle === "toggle") {
    if (saveData.hiddenBingoLetters.indexOf(bingoLetter) === -1) {
      document.getElementById(bingoLetterClass).classList.add("bingoLetterGray");
      document.getElementById(bingoBallsClass).style.display = "none";
      saveData.hiddenBingoLetters.push(bingoLetter);
      save();
    } else {
      document.getElementById(bingoLetterClass).classList.remove("bingoLetterGray");
      document.getElementById(bingoBallsClass).style.display = "block";
      saveData.hiddenBingoLetters.splice(saveData.hiddenBingoLetters.indexOf(bingoLetter), 1);
      save();
    }
    updateBallStats();
  }

  else if (renderOrToggle === "render") {
    if (saveData.hiddenBingoLetters.indexOf(bingoLetter) === -1) {
      document.getElementById(bingoLetterClass).classList.remove("bingoLetterGray");
      document.getElementById(bingoBallsClass).style.display = "block";
    } else {
      document.getElementById(bingoLetterClass).classList.add("bingoLetterGray");
      document.getElementById(bingoBallsClass).style.display = "none";
    }
  }

  else if (renderOrToggle === "reset") {
    saveData.hiddenBingoLetters = [];
    save();
    const letters = ['B', 'I', 'N', 'G', 'O'];
    for (let i = 0; i< letters.length; i+=1) {
      hideBingo(letters[i], "render");
    }
  }

}

function toggleBallsDrawnRemaining(renderOrToggle) {
  if (renderOrToggle === "toggle") {
    if (saveData.ballsDrawnRemaining === "hidden") {
      document.getElementById("ballsDrawnRemaining").style.visibility = "visible";
      document.getElementById("ballsDrawn").style.display = "flex";
      saveData.ballsDrawnRemaining = "drawn";
      save();
    } else if (saveData.ballsDrawnRemaining === "drawn") {
      document.getElementById("ballsDrawn").style.display = "none";
      document.getElementById("ballsRemaining").style.display = "flex";
      saveData.ballsDrawnRemaining = "remaining";
      save();
    } else {
      document.getElementById("ballsRemaining").style.display = "none";
      document.getElementById("ballsDrawnRemaining").style.visibility = "hidden";
      saveData.ballsDrawnRemaining = "hidden";
      save();
    }
  }
  else if (renderOrToggle === "render") {
    if (saveData.ballsDrawnRemaining === "hidden") {
    } else if (saveData.ballsDrawnRemaining === "drawn") {
      document.getElementById("ballsDrawnRemaining").style.visibility = "visible";
      document.getElementById("ballsDrawn").style.display = "flex";
    } else {
      document.getElementById("ballsDrawnRemaining").style.visibility = "visible";
      document.getElementById("ballsRemaining").style.display = "flex";
    }
  }
}

function resetBoard() {
  for (let i=0;i<75;i+=1) {
    document.getElementById(i+1 + "bingo").classList.remove(document.getElementById(i+1 + "bingo").classList.item(1));
  }
  document.getElementById("bigBingoBall").classList.remove(document.getElementById("bigBingoBall").classList.item(1));
  document.getElementById("bigBingoLetter").innerHTML="&nbsp;";
  document.getElementById("bigBingoNumber").innerHTML="&nbsp;";
  const bingoBallsClass = document.querySelectorAll(".bingoBalls");
  for (let i = 0; i < bingoBallsClass.length; i+=1) {
    bingoBallsClass[i].classList.add("notransition");
    bingoBallsClass[i].style.opacity = 0;
    setTimeout(() => {
      bingoBallsClass[i].classList.remove("notransition");
      bingoBallsClass[i].style.opacity = 1;
    },100)
  }
  document.getElementById("blocker").classList.add("notransition");
  document.getElementById("blocker").style.opacity = 0;

  // Chrome has a Bingo letter rendering bug when resetting with the blocker enabled.
  // Until Chrome fixes this bug, this browser-specific workaround is necessary.
  // Safari also has this bug, but it is fixed in the latest Technology Preview.
  const isChrome = !!window.chrome && !!window.chrome.webstore;
  if (isChrome === true) {
    const bingoLetterClass = document.querySelectorAll(".bingoLetter");
    for (let i = 0; i < bingoLetterClass.length; i+=1) {
      bingoLetterClass[i].classList.add("chromeBingoLetterFix");
      setTimeout(() => {
        bingoLetterClass[i].classList.remove("chromeBingoLetterFix");
      },410)
    }
  }

  setTimeout(() => {
    document.getElementById("blocker").classList.remove("notransition");
    document.getElementById("blocker").style.opacity = 1;
  },100)
  saveData.drawnBingoBalls = [];
  saveData.lastActionWasRemove = false;
  save();
  hideBingo("", "reset");
  updateBallStats();
}

function toggleBlocker() {
	if (saveData.blockerEnabled === true) {
    saveData.blockerEnabled = false;
		document.getElementById("blocker").style.left = 1287 + "px";
    document.getElementById("showBoard").style.display = "none";
    document.getElementById("hideBoard").style.display = "flex";
	} else {
    saveData.blockerEnabled = true;
		document.getElementById("blocker").style.left = 255 + "px";
    document.getElementById("hideBoard").style.display = "none";
    document.getElementById("showBoard").style.display = "flex";
	}
  save();
}

function setUpMasterBoard() {
  if (saveData.blockerEnabled === false) {
    document.getElementById("showBoard").style.display = "none";
    document.getElementById("hideBoard").style.display = "flex";
    document.getElementById("blocker").style.left = 1287 + "px";
  } else {
    document.getElementById("hideBoard").style.display = "none";
    document.getElementById("showBoard").style.display = "flex";
    document.getElementById("blocker").style.left = 255 + "px";
  }
  for (let i=0;i<saveData.drawnBingoBalls.length;i+=1) {
    loadBingoBall(saveData.drawnBingoBalls[i]);
  }
  hideBingo("B", "render");
  hideBingo("I", "render");
  hideBingo("N", "render");
  hideBingo("G", "render");
  hideBingo("O", "render");
  toggleBallsDrawnRemaining("render");
  updateBallStats();
}

function setUpSettings(theColor) {
  document.getElementById("classic").style.backgroundColor = "";
  document.getElementById("red").style.backgroundColor = "";
  document.getElementById("green").style.backgroundColor = "";
  document.getElementById("blue").style.backgroundColor = "";
  document.getElementById("purple").style.backgroundColor = "";
  if (theColor === "classic") {
    document.getElementById("classic").style.backgroundColor = "rgba(148,138,84,0.28)";
  } else if (theColor === "red") {
    document.getElementById("red").style.backgroundColor = "rgba(255,0,0,0.2)";
  } else if (theColor === "green") {
    document.getElementById("green").style.backgroundColor = "rgba(0,128,0,0.2)";
  } else if (theColor === "blue") {
    document.getElementById("blue").style.backgroundColor = "rgba(51,102,255,0.2)";
  } else if (theColor === "purple") {
    document.getElementById("purple").style.backgroundColor = "rgba(164,70,153,0.2)";
  }
}

function changeBackgroundColor(theColor) {
  saveData.themeColor = theColor;
  save();
  setUpSettings(theColor);
}
