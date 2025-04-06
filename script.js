let text = "";
let timeleft = 60;
let count = 0;
let i = 0;
let Istimer = false;
let mainbox = document.getElementById("text-display");
let timebox = document.getElementById("timer");
let wpmbox = document.getElementById("wpm");
let acbox = document.getElementById("accuracy");
let btn = document.getElementById("btn");
let spans = [];
let totaltyped = 0, correct = 0, wrong = 0, wpm = 0, accuracy = 0;
let textarr = [];

timebox.innerHTML = timeleft + "s";

async function getText() {
  let response = await fetch(
    "https://fakerapi.it/api/v2/texts?_quantity=1&_characters=400"
  );
  let data = await response.json();
  text = data.data[0].content;
}

function timer() {
  const timerid = setInterval(() => {
    timeleft--;
    timebox.innerHTML = timeleft + "s";
    if (timeleft <= 0) {
      clearInterval(timerid);
      console.log("done");
      mainbox.removeEventListener("keydown", handleKeyStrokes);
      calculateStats();
    }
  }, 1000);
}

function calculateStats(){
   accuracy = Math.floor((correct/totaltyped)*100);
   wpm = Math.floor((totaltyped/5)/1)
   acbox.innerHTML = accuracy + "%";
   wpmbox.innerHTML = wpm;
}

btn.addEventListener("click",async() => {
  timeleft = 60;
  timebox.innerHTML = timeleft + "s";
  i = 0;
  Istimer = false;
  correct = 0;
  wrong = 0;
  totaltyped = 0;
  wpmbox.innerHTML = "0";
  acbox.innerHTML = "0%";
  await getText();
  main();
})

function handleKeyStrokes(event) {
  spans = mainbox.querySelectorAll("span");
  if (!Istimer) {
    Istimer = true;
    timer();
  }
  if (textarr[i] === event.key) {
    spans[i].classList.add("typed");
    correct++;
    console.log("corrected: ",correct)
    i++;   
  } else {
    console.log("worng");
    spans[i].classList.add("wrong");
    wrong++;
    i++;
  }
  spans[i + 1]?.scrollIntoView({ behavior: "smooth", block: "center" });

  totaltyped++;
  console.log("Total: ",totaltyped);
}

async function main() {
  await getText();
  let cleanedtext = text
  .toLowerCase()
  .replace(/[^\w\s]/g, " ")
  .replace(/\s+/g, " ")
  .trim();
  textarr = cleanedtext.split("")
  mainbox.innerHTML = "";
    textarr.forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    mainbox.appendChild(span);
  });
  mainbox.focus();
  mainbox.addEventListener("keydown", handleKeyStrokes);
}
main();
