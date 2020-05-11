let startHrs = 0,
	endHrs = 0,
	totalMin = 0,
	totalHrs = 0,
	count = 0,
	oCount = 1,
	sCount = 1,
	midnightCount = 0,
	timeArray = [],
	timeArrayString = [],
	noteArray = [],
	dispTimeMins = 0,
	dispTimeHrs = 0,
	dispTimeStr = "",
	pctWork = 0,
	totalsObj = {};

let t = setInterval(showTime, 1000);

function showTime() {
	let today = new Date();
	let h = today.getHours();
	let m = today.getMinutes();
	let s = today.getSeconds();
	let currentHrs = h + m / 60;
	if (h == 0 && m == 0 && midnightCount == 0) {
		handleMidnight();
	}
	m = checkTime(m);
	s = checkTime(s);
	if (isEven(sCount)) {
		document.getElementById("clock").innerHTML = `${h}:${m}`;
		document.getElementById("secbutton").textContent = "Show Seconds";
	} else {
		document.getElementById("clock").innerHTML = `${h}:${m}:${s}`;
		document.getElementById("secbutton").textContent = "Hide Seconds";
	}
}
function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

function toggleSeconds() {
	sCount++;
}

function handleMidnight() {
	midnightCount++;
	if (!isEven(count)) {
		displayTimeAndComment();
		displayTimeAndComment();
	}
	midnightCount++;
	return;
}

function displayTimeAndComment() {
	d = new Date();
	h = d.getHours();
	m = d.getMinutes();
	hrs = h + m / 60;
	mins = h * 60 + m;
	let note = document.getElementById("text").value;
	let e1 = document.getElementById("note");
	if (note == "") {
		note = "stuff";
	}

	timeArray[count] = hrs;
	if (timeArray[count] == 0 && !isEven(count) && midnightCount == 1) {
		timeArray[count] = 24;
	}
	dispTimeStr = createTimeString(hrs);
	timeArrayString[count] = dispTimeStr;
	if (isEven(count)) {
		noteArray[count] = note;
		startHrs = mins / 60;
	} else {
		endHrs = mins / 60;
		if (endHrs == 0 && midnightCount == 1) {
			endHrs = 24;
		}
		let sectionMins = (endHrs - timeArray[count - 1]) * 60;
		noteArray[count - 1] = note;
		noteArray[count] = sectionMins;
		totalMin = totalMin + sectionMins;
	}
	if (isEven(noteArray.length)) {
		totalsObj = {};
		for (let i = 0; i < noteArray.length; i += 2) {
			totalsObj[noteArray[i]] =
				(totalsObj[noteArray[i]] || 0) + noteArray[i + 1] / 60;
		}
		for (k in totalsObj) {
			totalsObj[k] = totalsObj[k].toFixed(2);
		}
		console.log(totalsObj);
	}
	printNotes();
	summarizeDay();
	count++;
}

function printNotes() {
	let line = 1;
	let totalLines = Math.ceil(timeArray.length / 2);
	let e1 = document.getElementById("note");
	e1.innerHTML = "";
	for (line = 1; line < totalLines; line++) {
		e1.innerHTML += `${line}: ${timeArrayString[line * 2 - 2]} - ${
			timeArrayString[line * 2 - 1]
		} ${noteArray[line * 2 - 2]} for ${Math.round(
			noteArray[line * 2 - 1]
		)} mins <br />`;
	}
	if (timeArrayString[line * 2 - 1] == undefined) {
		e1.innerHTML += `${line}: ${timeArrayString[line * 2 - 2]} -`;
	} else {
		e1.innerHTML += `${line}: ${timeArrayString[line * 2 - 2]} - ${
			timeArrayString[line * 2 - 1]
		} ${noteArray[line * 2 - 2]} for ${Math.round(
			noteArray[line * 2 - 1]
		)} mins <br />`;
		document.getElementById("textfield").reset();
	}
}

function overrideTime() {
	let e2 = document.getElementById("editinfo");
	if (isEven(oCount)) {
		let newHour = timeToHours(
			parseFloat(document.getElementById("orhrs").value).toFixed(2)
		);
		let newIndex = parseInt(document.getElementById("ordex").value);
		let noError = findOverrideError(newIndex, newHour);

		if (!noError) {
			document.getElementById("orindex").style.display = "none";
			document.getElementById("orhours").style.display = "none";
			document.getElementById("orhelp").style.display = "none";
			oCount++;
			return;
		}

		timeArray[newIndex] = newHour;
		let hrs = newHour;

		dispTimeStr = createTimeString(hrs);
		timeArrayString[newIndex] = dispTimeStr;

		if (isEven(newIndex) && timeArray.length !== newIndex) {
			let newSectionMins = (timeArray[newIndex + 1] - timeArray[newIndex]) * 60;
			noteArray[newIndex + 1] = newSectionMins;
		} else if (isEven(newIndex) && timeArray.length === newIndex) {
			//just replace it and move on
		} else {
			let newSectionMins = (timeArray[newIndex] - timeArray[newIndex - 1]) * 60;
			noteArray[newIndex] = newSectionMins;
		}

		let editedLine = 0;

		if (isEven(newIndex)) {
			editedLine = (newIndex + 2) / 2;
		} else {
			editedLine = (newIndex + 1) / 2;
		}
		timeArrayString[newIndex] += "*";
		//e2.innerHTML += `LINE ${editedLine} HAS BEEN EDITED <br />`

		printNotes();
		summarizeDay();

		document.getElementById("orindex").style.display = "none";
		document.getElementById("orhours").style.display = "none";
		document.getElementById("orhelp").style.display = "none";
	} else {
		document.getElementById("orindex").style.display = "block";
		document.getElementById("orhours").style.display = "block";
		document.getElementById("orhelp").style.display = "block";
	}

	oCount++;
}

function findOverrideError(newIndex, newHour) {
	let d = new Date();
	if (Number.isNaN(newIndex) || Number.isNaN(newHour)) {
		alert("missing something");
	} else if (newHour === Infinity) {
		alert("not a time");
	} else if (
		newHour.toFixed(2) > (d.getHours() + d.getMinutes() / 60).toFixed(2)
	) {
		alert("thats the future");
	} else if (
		timeArray[newIndex - 1] > newHour ||
		timeArray[newIndex + 1] < newHour
	) {
		alert("out of bounds");
	} else if (newIndex >= timeArray.length) {
		alert("doesn't exist");
	} else if (timeArray[newIndex].toFixed(2) === newHour.toFixed(2)) {
		alert("not an edit");
	} else {
		return true;
	}
	return false;
}

function resetEverything() {
	totalHrs = getHrs();
	if (totalHrs > 0.01) {
		alert(totalHrs.toFixed(2));
	}
	let e1 = document.getElementById("note");
	let e2 = document.getElementById("editinfo");
	let e3 = document.getElementById("summary");
	let e4 = document.getElementById("xx");

	e1.innerHTML = "";
	e2.innerHTML = "";
	e3.innerHTML = "";
	e4.innerHTML = "";
	startHrs = 0;
	endHrs = 0;
	totalMin = 0;
	totalHrs = 0;
	count = 0;
	oCount = 1;
	timeArray = [];
	timeArrayString = [];
	noteArray = [];
	dispTimeMins = 0;
	dispTimeHrs = 0;
	dispTimeStr = "";
	pctWork = 0;
}

function summarizeDay() {
	let e3 = document.getElementById("summary");
	totalHrs = getHrs();
	pctWork = getPercent(totalHrs).toFixed(2);

	e3.textContent = `Summary: ${totalHrs.toFixed(2)} hours Percent: ${pctWork}%`;
	totalHrs = 0;
}

function getHrs() {
	total = 0;
	let i = timeArray.length;
	while (i > 1) {
		if (!isEven(i)) {
			i = i - 1;
		}
		total += timeArray[i - 1] - timeArray[i - 2];
		i = i - 2;
	}
	return total;
}

function getPercent(tw) {
	if (tw == 0) {
		return 0;
	}
	let i = timeArray.length - 1;
	let pct = 0;
	if (midnightCount == 0) {
		pct = (tw / (timeArray[i] - timeArray[0])) * 100;
	} else {
		pct = (tw / (timeArray[i] + 24 - timeArray[0])) * 100;
	}
	// if(pct < 0){return 0;}
	return pct;
}

function createTimeString(h) {
	dh = Math.floor(h);
	dm = Math.round((h - dh) * 60);
	dm = checkTime(dm);
	return `${dh}:${dm}`;
}

function timeToHours(time) {
	let h = Math.floor(time);
	let m = (time - h) * (5 / 3);
	let hrs = h + m;
	if (m > 59 || h > 23 || m < 0 || h < 0) {
		return Infinity;
	}
	return hrs;
}

function hideElements() {
	document.getElementById("orindex").style.display = "none";
	document.getElementById("orhours").style.display = "none";
	document.getElementById("orhelp").style.display = "none";
}

function isEven(value) {
	if (value % 2 == 0) return true;
	else return false;
}
