const fixedWidth = document.getElementById("area").offsetWidth;
const fixedHeight = document.getElementById("area").offsetHeight;
let isFullScreen = false;

let themeColor = "#d1cc85";

function init() {
	resize();
	window.addEventListener('resize', resize);
	document.addEventListener("fullscreenchange", onFullScreenChange, false);
	document.addEventListener("webkitfullscreenchange", onFullScreenChange, false);
	document.addEventListener("mozfullscreenchange", onFullScreenChange, false);

	const bingoBallClass = document.querySelectorAll(".bingoBall");
	for (let i = 0; i < bingoBallClass.length; i+=1) {
		bingoBallClass[i].addEventListener("click", activateBingoBall);
	}

	setTimeout(() => {
		show("titleSlide");
		show("fullScreenToggle");
	},50);
}

function resize() {
  const viewNames = [
    document.getElementById("area"),
  	document.getElementById("fader")
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
		changeBG(themeColor);
		document.getElementById("fullScreenToggle").classList.add("fullScreenToggleSmall");
	}
	setTimeout(() => {
	  document.getElementById("fader").classList.remove("notransition");
	  document.getElementById("fader").style.opacity = "0";
	},50);
}

function hide(elementName) {
  document.getElementById(elementName).style.display = "none";
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

function activateBingoBall(e) {
	e.preventDefault();
	console.log(parseInt(e.target.id));
	if (document.getElementById(e.target.id).classList.contains("bingoBallActiveB")) {
		document.getElementById(e.target.id).classList.remove("bingoBallActiveB");
	} else {
		document.getElementById(e.target.id).classList.add("bingoBallActiveB");
	}
}
