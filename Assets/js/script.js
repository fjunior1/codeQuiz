/* Presentaiton functionality, four stages each one in a DIV that is shown or hidden
   intro:        introduction to the quiz expains the rules 
   test:         test in action, shows questions and user selects answers
   score result: end of quiz, asks for name, then  saves name and score
   top scores:   shows high scores, clear high scores
*/

const timeStr = document.getElementById("timer"); 
const introT = document.getElementById("intro"); 
const endT = document.getElementById("end");
const testT = document.getElementById("testArea"); 
const topT = document.getElementById("topScoreArea");
const topList = document.getElementById("topScoreList");
const ansResult = document.getElementById("answerScore");
const finalScore = document.getElementById("finalScore");
const initialStr = document.getElementById("nameInput"); 


// this is the state of the quiz application
// learned about enumerations  here: https://www.sohamkamani.com/javascript/enums/
const statesQuiz = { INTRO:"intro", TEST:"test", FINAL:"final", TOPSCORE:"topScore"}
let actState = statesQuiz.INTRO;
let prevState = null;

function showbyState(state) {
    if (state === statesQuiz.INTRO) {
        introT.style.display = "flex";
    } else {
        introT.style.display = "none";
    }

    if (state === statesQuiz.TEST) {
        testT.style.display = "flex";
    } else {
        testT.style.display = "none";
    }

    if (state === statesQuiz.FINAL) {
        endT.style.display = "flex";
    } else {
        endT.style.display = "none";
    }

    if (state === statesQuiz.TOPSCORE) {
        topT.style.display = "flex";
    } else {
        topT.style.display = "none";
    }
}

showbyState(actState);

/*
  functipon that sets the state of the application and show the right DIV's elements to the user
  Found how to use default parameters from class notes 
  and from this link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
*/
function setState(state, prevSt = null) {
    prevState = prevSt;
    if (state === statesQuiz.INTRO) {
        
    } else if (state === statesQuiz.TEST) {
        
    } else if (state === statesQuiz.FINAL) {
        finalScore.innerText = "Your final score is " + correctCounter;
        clearInterval(myInterval);
    }else if (state === statesQuiz.TOPSCORE) {
        
    }else {
        // problem with state, should go back to intro ( reset quiz app !!!!)
        state = statesQuiz.INTRO;
        prevState = null;
    }

    actState = state;
    showbyState(state);
}

// score functionality
let correctCounter = 0; // this is the number of questions answered correctly on this run
let scores = [];  // name , score

// get and set top scores in localStorage
function getTopScores(){
    if (localStorage.topScores != undefined) {
        scores = JSON.parse(localStorage.getItem("topScores"));
        while (topList.firstChild) {
            topList.removeChild(topList.firstChild);
        }
        // put scores in list HTML
        var count = 1;
        scores.forEach((liElem) => {
            var liIns = document.createElement("li");
            liIns.appendChild(document.createTextNode(count++ + ". " + liElem[1] + " - " + liElem[0]));
            topList.appendChild(liIns)
        });
    }
}

 getTopScores();

function sortTopScores(scores) {
    /* sort the scores high to low by score then alphabetically*/
    scores.sort(function compareFn(firstEl, secondEl) {
        if (firstEl[0] < secondEl[0]) {
            return 1;
        } else if (firstEl[0] > secondEl[0]) {
            return -1;
        } else {
            return 0;
        }
    })
}

function setTopScores(scores) {
    if (scores === null) {
        // delete ocalStorage
        while (topList.firstChild) {
            topList.removeChild(topList.firstChild);
        }
        localStorage.removeItem("topScores");
        return;
    }
    /* items should be sorted by score before saving to localStorage*/
    sortTopScores(scores);
    localStorage.setItem("topScores", JSON.stringify(scores));
    getTopScores();
}

/*
  timer functionality
*/
let timeLeft;

function myClock() {
    let minutes = Math.floor(timeLeft / 60);
    /* found this padding functionality ( .toString().padStart(2, "0") ) at 
       https://stackoverflow.com/questions/1127905/how-can-i-format-an-integer-to-a-specific-length-in-javascript
    */
    let stringTime = minutes + ":" + (timeLeft % 60).toString().padStart(2, "0");
    timeStr.innerText = "timer: " + stringTime;
    if ( --timeLeft < 0) {
       // stop the test, timeout 
       clearInterval(MyInterval);
       setState(statesQuiz.FINAL,null);
    }
    
}
let myInterval = null;
function setTimer(time = 120) { // default 120 seconds opr two(2) minutes
    // from class notes and  https://www.w3schools.com/js/js_timing.asp
    timeLeft = time;
  MyInterval = setInterval(myClock, /* time **/ 1000) //  set time in seconds
}


// process buttons
let btns = document.querySelectorAll("button");

function setupCallbackBns(Btn) {
    Btn.forEach((b) => {
        b.addEventListener('click', function (event) {
            
            /* p[rocess the click event here*/
            if (this.id === "startBtn") {  // start quiz button
                setState(statesQuiz.TEST, null);
                setTimer(); // starts timer with default time for test 2 minutes
                selectQuestion();
            } else if (this.id === "backBtn") { // back button , go back in page history see onclick="history.back()"
                setState(prevState, null);
            } else if (this.id === "scoreslink") {  // top scores 
                
               //alert("go to top scores");
                setState(statesQuiz.TOPSCORE, actState);
            } else if (this.id === "clearScoreBtn") { // another button
                setTopScores(null); //null means delete local Storage variable
                topScoreList.querySelectorAll("li").forEach(ilElem => {
                    ilElem.remove();
                })
            } else if (this.id === "reportScore") {
               
                // save score and initials in top score array
                scores.push([correctCounter, initialStr.value]);
                setTopScores(scores);
                // go to intro , to start another test
                setState(statesQuiz.TOPSCORE, statesQuiz.INTRO);
            }
        });
    });
}

setupCallbackBns(btns);

// list of questions and answers,
const questions = [
    ["Is JavaScript a case-sensitive language?", "yes", "no", "sometimes", "if setup properly", 1],
    ["How you define a variable in JavaScript?", "intr", "variable", "let", "setVar", 3],
    ["Name some of the JavaScript Frameworks", "J3", "Angular", "CSS", "HTML", 2],
    ["q4", "4", "4", "4", "4", 1],
    ["q5", "", "", "", "", 1],
    ["q6", "", "", "", "", 1],
    ["q7", "", "", "", "", 1],
    ["q8", "", "", "", "", 1],
    ["q9", "", "", "", "", 1],
    ["q10", "", "", "", "", 1],
    ["q11", "", "", "", "",1],
    ["q12", "", "", "", "",1],
    ["q13", "", "", "", "",1],
];

// question string area
const qStrArea = document.getElementById("testquestion");
// answer areas
const ans1StrArea = document.getElementById("Ans1");
const ans2StrArea = document.getElementById("Ans2");
const ans3StrArea = document.getElementById("Ans3");
const ans4StrArea = document.getElementById("Ans4");

const questionsAsked = [];
let QuestionIdx; // this is the index for actual question

// process question, click on answer, update score
let answerBtns = document.querySelectorAll(".answer");

/*
   Randomly select a question that has not been selected before
*/
function selectQuestion() {
    
    let newQuestion = false;
    let questionEntry = 0;
    ansResult.innerText = "";
    while (!newQuestion) {

        if (questions.length === questionsAsked.length) {
            newQuestion = true; // no new questions
            setState(statesQuiz.FINAL);// set state to end test
        }

        questionEntry = Math.floor(Math.random() * questions.length);

        if ((questionsAsked.length === 0 ) || questionsAsked.indexOf(questionEntry) < 0) {
            // new question found, use it
            QuestionIdx = questionEntry; // use this to access all elements of the question
            newQuestion = true; // to exit the loop

            questionsAsked.push(QuestionIdx);

            // fill up question and answers
            qStrArea.innerText = questions[QuestionIdx][0];
            ans1StrArea.innerText = questions[QuestionIdx][1];
            ans2StrArea.innerText = questions[QuestionIdx][2];
            ans3StrArea.innerText = questions[QuestionIdx][3];
            ans4StrArea.innerText = questions[QuestionIdx][4];
        }
    }
    return questionEntry; // -1 if no more questions. just in case i need it in the future, questionIdx will do for now.
}

function verifyAns(answer) {
    
    if (answer === questions[QuestionIdx][5]) {
        ansResult.innerText = "Correct !!!"
        correctCounter++; // increase correctly answered counter
    } else {
        ansResult.innerText = "Wrong !!!"
    }
}

/*
 setup the callback to handle click on the answerrs
*/
function setupCallbackAns(answersBtn) {
    answersBtn.forEach((ans) => {
        ans.addEventListener('click', function (event) {
            /* p[rocess the click event here*/
            let answer = null; // one based to make it easier to verify 
            if (this.id === "Ans1") {  // ans 1
                answer = 1;  
            } else if (this.id === "Ans2") { // ans 2
                answer = 2;  
            } else if (this.id === "Ans3") {  // ans 3
                answer = 3;  
            } else if (this.id === "Ans4") { // ans 4
                answer = 4;  
            }

            verifyAns(answer);
           setTimeout( selectQuestion,1000); // select and present a new question
        })
    })
}

setupCallbackAns(answerBtns);





