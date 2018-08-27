const fixedWidth = document.getElementById("area").offsetWidth;
const fixedHeight = document.getElementById("area").offsetHeight;
let isFullScreen = false;

let saveData = {
  drawnBingoBalls: [],
  themeColor: "#d1cc85",
  blockerEnabled: false
}

if(typeof(localStorage) !== "undefined") {
  if (localStorage.getItem("bingoMasterBoardSaveData")) {
    saveData = JSON.parse(localStorage.getItem("bingoMasterBoardSaveData"));
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
		bingoBallClass[i].addEventListener("click", () => {activateBingoBall(bingoBallClass[i].id)});
	}
  let param = location.search;
  if (param == "?masterboard") {
    setTimeout(() => {
      hide("titleSlide");
  		show("masterBoardSlide", "grid");
  		show("fullScreenToggleLayer");
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
	}
	setTimeout(() => {
	  document.getElementById("fader").classList.remove("notransition");
	  document.getElementById("fader").style.opacity = "0";
	},50);
}

function hide(elementName) {
  document.getElementById(elementName).style.display = "none";
	if (elementName === "masterBoardSlide") {
		changeBG("radial-gradient(#f7eaab, #bfbb73)");
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
	document.getElementById("area").style.background=color;
	document.getElementById("fader").style.background=color;
}

function activateBingoBall(bingoID) {
	if (document.getElementById(bingoID).classList.contains("bingoBallActiveB")) {
		document.getElementById(bingoID).classList.remove("bingoBallActiveB");
	} else {
		document.getElementById(bingoID).classList.add("bingoBallActiveB");
	}
}

function toggleBlocker() {
	if (saveData.blockerEnabled === true) {
    saveData.blockerEnabled = false;
		document.getElementById("blocker").style.left = 1287 + "px";
	} else {
    saveData.blockerEnabled = true;
		document.getElementById("blocker").style.left = 255 + "px";
	}
  setUpMasterBoard();
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
}
