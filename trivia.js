const category = {
    films: '&category=11',
    music: '&category=12',
    videogames: '&category=15',
    sports: '&category=21',
    geography: '&category=22',
    history: '&category=23',
    celebrities: '&category=26',
    animals: '&category=27',
}
const difficulty = {
    easy: '&difficulty=easy',
    medium: '&difficulty=medium',
    hard: '&difficulty=hard'
}
const type ={
    'multiplechoice': '&type=multiple',
    'true/false': '&type=boolean'
}
const chosenCategory = document.querySelector('#category');
const chosenDifficulty = document.querySelector('#difficulty');
const typeOfQuestionsChosen = document.querySelector('#type-of-questions');
const question =  document.querySelector('#question');
const difficultyLabel = document.querySelector('#difficulty');
const trueFalseOption = document.querySelector("#true-false");
let count = 0;
let finalScore = 0;
let questionsToBeDisplayedArr = [];
const correctAnswers = [];
const chosenAnswersArray = [];
const nextButton = document.querySelector('#next');
const questionCtr = document.querySelector('#q-ctr')

// getting array of correct answers for the end and the next questions

// decode the question with special characters
const decodeHTMLEntities = (question) => {
    return question
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}
const displayQuestionsAndAnswers = () =>{
    const shuffledArray = questionsToBeDisplayedArr.sort(() => Math.random() - 0.5);
    shuffledArray.forEach(question => {
        question = decodeHTMLEntities(question);
        const input = document.createElement('input');
        const label = document.createElement('label');
        let div = document.createElement('div');
        div.classList.add('question');
        label.innerText = question;
        label.setAttribute('for', question);
        input.setAttribute('type', 'radio');
        input.setAttribute('name','radio-group');
        input.setAttribute('id', question);
        input.setAttribute('value', question);
        div.appendChild(input);
        div.appendChild(label);
        questionCtr.appendChild(div);
        div.addEventListener('click', function() {
            // Programmatically check the radio button when the div is clicked
            input.checked = true;
        });

    })
}

document.querySelector('#start').addEventListener('click', () => {
    document.querySelector('#container').style.display = 'none';
    document.querySelector('#game-container').style.display = 'flex';
    document.querySelector('h1').innerText = chosenCategory.value.toUpperCase();
    const apiUrl= `https://opentdb.com/api.php?amount=10${category[chosenCategory.value]}${difficulty[chosenDifficulty.value]}${type[typeOfQuestionsChosen.value]}`;
    fetchQuestions(apiUrl);
    console.log(apiUrl, category[chosenCategory.value])
})
difficultyLabel.addEventListener('change', () => {
    if(difficultyLabel.value === 'hard'){
        trueFalseOption.style.display = 'none';
    }else{
        trueFalseOption.style.display = 'block';
    }
})

const fetchQuestions = (apiUrl) => {
    fetch(apiUrl)
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            const questionsFromApi = data.results;
            console.log(questionsFromApi,questionsToBeDisplayedArr);
            const addCorrectAnswerToArr = () => {
                correctAnswers.push(decodeHTMLEntities(questionsFromApi[count].correct_answer));
            }
            const getQuestionsAndAnswers = () => {
                question.innerText =decodeHTMLEntities(questionsFromApi[count].question);
                for(let q of questionsFromApi[count].incorrect_answers){
                    questionsToBeDisplayedArr.push(q);
                }
                // add the 3 answers to an array
                questionsToBeDisplayedArr.push(questionsFromApi[count].correct_answer);
            }
            const displayResults = () => {
                for (let i = 0; i <= count; i++) {
                    if(chosenAnswersArray[i] === correctAnswers[i] && chosenAnswersArray.length>0){
                        finalScore++;
                    }
                }
                const p = document.createElement('p');
                const resultPercantage = (finalScore/questionsFromApi.length)*100;
                p.classList.add('result');
                p.innerText = `Your final score is: ${resultPercantage}%`;
                questionCtr.appendChild(p);
                console.log(finalScore);
                console.log(chosenAnswersArray,correctAnswers)
            }
            getQuestionsAndAnswers();
            displayQuestionsAndAnswers();
            addCorrectAnswerToArr();
            nextButton.addEventListener('click', () =>{
                checkChosenAnswer();
                count++;
                questionsToBeDisplayedArr = [];
                questionCtr.innerHTML ='';
                question.innerText = '';
                questionCtr.appendChild(question);
                if(count > questionsFromApi.length-1){
                    displayResults();
                    nextButton.innerText = 'Restart';
                    nextButton.addEventListener('click', () => {
                        location.reload();
                    });
                }else{

                    checkChosenAnswer();
                    getQuestionsAndAnswers();
                    displayQuestionsAndAnswers();
                    addCorrectAnswerToArr();
                }
            })

            const checkChosenAnswer = () => {
                // Find the selected radio button
                const userChosenAnswer = document.querySelector('input[name="radio-group"]:checked');
                // Check if any radio button is selected
                if(userChosenAnswer){
                    // Log the value of the selected answer
                    chosenAnswersArray.push(userChosenAnswer.value);
                }
            }

        })
        .catch(error => {
            console.error('Error fetching trivia data:', error);
        });

}