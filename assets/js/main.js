const fixedWidth = document.getElementById("area").offsetWidth;
const fixedHeight = document.getElementById("area").offsetHeight;
let isFullScreen = false;
let loadedMasterBoard = false;

let saveData = {
  drawnBingoBalls: [],
  themeColor: "classic",
  bingoStyle: "ball",
  blockerEnabled: false,
  lastActionWasRemove: false,
  ballsDrawnRemaining: "drawn",
  hiddenBingoLetters: [],
  winningPattern: []
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
    if (loadedMasterBoard === false) {
      setUpMasterBoard();
      loadedMasterBoard = true;
    }
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
    if (saveData.bingoStyle === "ball") {
    document.getElementById("bigBingoBall").classList.add(typeOfBingoBall);
    } else {
      document.getElementById("bigBingoBall").classList.add("bigBingoBallVintage");
    }
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
  if (saveData.bingoStyle === "vintage") {
    return "bingoBallVintageActive";
  } else {
    if (num <= 15){
      return "bingoBallBallActiveB";
    } else if (num <= 30) {
      return "bingoBallBallActiveI";
    } else if (num <= 45) {
      return "bingoBallBallActiveN";
    } else if (num <= 60) {
      return "bingoBallBallActiveG";
    } else {
      return "bingoBallBallActiveO";
    }
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
    if (saveData.bingoStyle === "ball") {
    document.getElementById("bigBingoBall").classList.add(typeOfBingoBall);
    } else {
      document.getElementById("bigBingoBall").classList.add("bigBingoBallVintage");
    }
    document.getElementById("bigBingoLetter").innerHTML=typeOfBingoBallLetter;
    document.getElementById("bigBingoNumber").innerHTML=bingoIDNum;
  }
}

function renderBingoStyle() {
  if (saveData.bingoStyle === "ball") {
    for (let i=0;i<75;i+=1) {
      document.getElementById(i+1 + "bingo").classList.remove(document.getElementById(i+1 + "bingo").classList.item(2));
      document.getElementById(i+1 + "bingo").classList.remove(document.getElementById(i+1 + "bingo").classList.item(1));
      document.getElementById(i+1 + "bingo").classList.add("bingoBallBall");
    }
  } else {
    for (let i=0;i<75;i+=1) {
      document.getElementById(i+1 + "bingo").classList.remove(document.getElementById(i+1 + "bingo").classList.item(2));
      document.getElementById(i+1 + "bingo").classList.remove(document.getElementById(i+1 + "bingo").classList.item(1));
      document.getElementById(i+1 + "bingo").classList.add("bingoBallVintage");
    }
  }
}

function changeBingoStyle(theStyle) {
  saveData.bingoStyle = theStyle;
  save();
  renderBingoStyle();
  for (let i=0;i<saveData.drawnBingoBalls.length;i+=1) {
    loadBingoBall(saveData.drawnBingoBalls[i]);
  }
  setUpSettings();
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
    let theRandomNumber = getBallsRemaining()[cryptoRandom(0,getBallsRemaining().length-1)];
    activateBingoBall(theRandomNumber);
  }
}

function cryptoRandom (min, max) {
    // Create an unsigned 32-bit array, required for crypto.getRandomValues
    // Unsigned 32-bit numbers range from 0 to 4,294,967,295.
    // The 1 means we're going to generate one number.
    const cryptoRandomSet = new Uint32Array(1);
    // Generate a crypto-random number from 0 to 4,294,967,295.
    window.crypto.getRandomValues(cryptoRandomSet);
    // Convert the generated number to math.random() format.
    // aka a number from 0-1 (including 0, but not 1)
    // To get this, we divide the generated number by 4,294,967,295, plus 1.
    // We need to add 1 to the denominator so we'll never get 1 as the result.
    let cryptoRandomNumber = cryptoRandomSet[0] / (4294967295 + 1);
    // Return the random integer based on prior math.random() logic
    return Math.floor(cryptoRandomNumber * (max - min + 1)) + min;
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
    document.getElementById(i+1 + "bingo").classList.remove(document.getElementById(i+1 + "bingo").classList.item(2));
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
  clearWinningPattern();
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
  renderBingoStyle();
  for (let i=0;i<saveData.drawnBingoBalls.length;i+=1) {
    loadBingoBall(saveData.drawnBingoBalls[i]);
  }
  for (let i=0;i<saveData.hiddenBingoLetters.length;i+=1) {
    hideBingo(saveData.hiddenBingoLetters[i], "render");
  }
  for (let i=0;i<saveData.winningPattern.length;i+=1) {
    document.getElementById(saveData.winningPattern[i] + "card").classList.add("bingoCardActive2");
    document.getElementById(saveData.winningPattern[i] + "bigcard").classList.add("bingoCardActive");
  }
  toggleBallsDrawnRemaining("render");
  updateBallStats();
}

function setUpSettings() {
  document.getElementById("classic").style.backgroundColor = "";
  document.getElementById("red").style.backgroundColor = "";
  document.getElementById("green").style.backgroundColor = "";
  document.getElementById("blue").style.backgroundColor = "";
  document.getElementById("purple").style.backgroundColor = "";
  document.getElementById("bingoStyleBall").style.backgroundColor = "";
  document.getElementById("bingoStyleVintage").style.backgroundColor = "";
  if (saveData.themeColor === "classic") {
    document.getElementById("classic").style.backgroundColor = "rgba(148,138,84,0.28)";
  } else if (saveData.themeColor === "red") {
    document.getElementById("red").style.backgroundColor = "rgba(255,0,0,0.2)";
  } else if (saveData.themeColor === "green") {
    document.getElementById("green").style.backgroundColor = "rgba(0,128,0,0.2)";
  } else if (saveData.themeColor === "blue") {
    document.getElementById("blue").style.backgroundColor = "rgba(51,102,255,0.2)";
  } else if (saveData.themeColor === "purple") {
    document.getElementById("purple").style.backgroundColor = "rgba(164,70,153,0.2)";
  }
  if (saveData.bingoStyle === "ball") {
    document.getElementById("bingoStyleBall").style.backgroundColor = "rgba(0,0,0,0.15)";
  } else if (saveData.bingoStyle === "vintage") {
    document.getElementById("bingoStyleVintage").style.backgroundColor = "rgba(0,0,0,0.15)";
  }
}

function changeBackgroundColor(theColor) {
  saveData.themeColor = theColor;
  save();
  setUpSettings();
}

function toggleWinningPattern(theNumber) {
  let bingoID = theNumber + "bigcard";
  let bingoID2 = theNumber + "card";
  if (saveData.winningPattern.indexOf(theNumber) === -1) {
    document.getElementById(bingoID).classList.add("bingoCardActive");
    document.getElementById(bingoID2).classList.add("bingoCardActive2");
    saveData.winningPattern.push(theNumber);
  } else {
    saveData.winningPattern.splice(saveData.winningPattern.indexOf(theNumber), 1);
    document.getElementById(bingoID).classList.remove("bingoCardActive");
    document.getElementById(bingoID2).classList.remove("bingoCardActive2");
  }
  save();
}

function winningPatternFromName() {
  clearWinningPattern();
  for (let i = 0; i < arguments.length; i+=1) {
    toggleWinningPattern(arguments[i]);
  }
}

function clearWinningPattern() {
  for (let i=0;i<saveData.winningPattern.length;i+=1) {
    document.getElementById(saveData.winningPattern[i] + "card").classList.remove("bingoCardActive2");
    document.getElementById(saveData.winningPattern[i] + "bigcard").classList.remove("bingoCardActive");
  }
  saveData.winningPattern = [];
  save();
}

function hideBingoLettersBasedOnWinningPattern() {
  let bExists = false;
  let iExists = false;
  let nExists = false;
  let gExists = false;
  let oExists = false;
  if (saveData.winningPattern.length > 0) {
    for (let i=0;i<saveData.winningPattern.length;i+=1) {
      if (saveData.winningPattern[i] <=5) {
        bExists = true;
      } else if (saveData.winningPattern[i] <=10) {
        iExists = true;
      } else if (saveData.winningPattern[i] <=15) {
        nExists = true;
      } else if (saveData.winningPattern[i] <=20) {
        gExists = true;
      } else if (saveData.winningPattern[i] <=25) {
        oExists = true;
      }
    }
    hideBingo("", "reset");
    if (bExists === false) {
      hideBingo('B', 'toggle');
    }
    if (iExists === false) {
      hideBingo('I', 'toggle');
    }
    if (nExists === false) {
      hideBingo('N', 'toggle');
    }
    if (gExists === false) {
      hideBingo('G', 'toggle');
    }
    if (oExists === false) {
      hideBingo('O', 'toggle');
    }
  }
}
