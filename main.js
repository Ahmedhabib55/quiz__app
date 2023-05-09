// ** selected Elements

	let countspan = document.querySelector(".quiz-info .count span");
	let quizArea = document.querySelector(".quiz-area");
	let answerArea = document.querySelector(".answer-area");
	let bullets = document.querySelector(".bullets")
	let bulletsContainers = document.querySelector(".bullets .spans");
	let countArea = document.querySelector(".countdown")
	let submit = document.querySelector(".submit");
	let resultsArea = document.querySelector(".reslut")

	// set options
	let currentIndex = 0;
	let goodAnswer = 0;
	let countDownInterval;



	function getQuestions(){
	let myRequest = new XMLHttpRequest();
		myRequest.onload = function (){
			if(this.readyState === 4 && this.status === 200){
				let questionsObj = JSON.parse(this.responseText);
				let countQuestions = questionsObj.length;
					// create Bullets And Set Questions Count
						createBullets(countQuestions);
					// add Questions To page
						addQuestions(questionsObj[currentIndex], countQuestions);
					// start count down 
						countDown((2 * 60), countQuestions)
					// click on submit
						submit.onclick = _ =>{
							// get right answer 
								let rightAnswer = questionsObj[currentIndex]["right_answer"];
								// increase index 
									currentIndex++;
									// check the answer
										checkAnswer(rightAnswer, countQuestions);
									// remove previous questions
										quizArea.innerHTML = "";
										answerArea.innerHTML = "";
									// add onther questios 
										addQuestions(questionsObj[currentIndex], countQuestions); 
									// handel bullets 
										handleBullets()
										clearInterval(countDownInterval)
									// start count down 
										countDown((2 * 60), countQuestions)
									// show results
									 showResults(countQuestions)

										
								
						}
				
				
		}
	}
	myRequest.open("GET", "quiz-app.json",true);
	myRequest.send();

}
getQuestions()


function createBullets(num){
    countspan.innerHTML = num

    // start to create spans bullets
    for(let i = 1; i <= num; i++){
        let theBullets = document.createElement("span") ;
        // append bullets to main Bulet container
        bulletsContainers.appendChild(theBullets);

         if (i === 1) {
            theBullets.className = "active";
         }
    }

}

function addQuestions(quest,count){
 // stop listen to click
 if (currentIndex < count ){
	let question = document.createElement("h2");
		question.append(document.createTextNode(quest.title));
		// apend question to page
		quizArea.append(question)
    
	for(let i = 1; i <= 4; i++){
		// create div for contoin input + label
		let answer = document.createElement("div")
			answer.className = "answer";

		let input = document.createElement("input");	

			input.type = "radio"
			input.name = `questions`;
			input.id = `answer_${i}`;
			input.dataset.answer = quest[`answer_${i}`];

			// make first element checked
			if(i === 1) input.checked = true ;

		//  create label and and connect with input	
		let theLanbel = document.createElement("label");
			theLanbel.htmlFor = `answer_${i}`
			theLanbel.append(document.createTextNode(quest[`answer_${i}`]));

					// append input to answer area
					answer.appendChild(input);
					answer.appendChild(theLanbel);
					answerArea.append(answer)
    }
	}
}

function checkAnswer(rAnswer,count){
	// console.log(rAnswer,count);
	// to slected the checked element
		let answers = document.getElementsByName("questions")
		let thechooseAnswerd;

		for (let i = 0; i < answers.length; i++){
				if(answers[i].checked) {
					thechooseAnswerd= answers[i].dataset.answer;
				}
		}

		if(rAnswer === thechooseAnswerd) {
			goodAnswer++;
		}

}

function handleBullets(){
	let bulletsSpans = document.querySelectorAll(".bullets .spans span");
	bulletsSpans.forEach((span,idx)=>{
		if(currentIndex === idx){
			span.classList.add("active")
		}else{
			span.classList.remove("active")
		}
	})

}

function showResults (count){
	let theResults;
	if(currentIndex === count){
	quizArea.remove();
	answerArea.remove();
	submit.remove();
	bullets.remove();

	if(goodAnswer > (count / 2) && goodAnswer < count){
		theResults = `<span class="good"> you are good </span> `
	}else if (goodAnswer === count) {
		theResults =	`<span class="perfect"> you are perfect </span> `
	}else{
		theResults =`<span class="bad">please try agin</span> `
	}
	resultsArea.innerHTML = theResults;


	}
}

function countDown(dur, count){
	if (currentIndex < count){
		let minutes,seconds;
		countDownInterval = setInterval(_=>{
			minutes = parseInt( dur / 60) ;
			seconds = parseInt(dur % 60);
			minutes =  minutes < 10 ? `0${minutes}`: minutes;
			seconds = seconds < 10 ? `0${seconds}`: seconds;
			countArea.innerHTML = `${minutes}:${seconds}`
			if(--dur < 0){
				clearInterval(countDownInterval)
				submit.click();
			}
		},1000)
	}
}