const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");  //it will select the input tag which have type checkbox.
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
sliderHandler();
setIndicator("#ccc");


function sliderHandler(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( passwordLength*100/max) + "% 100%";    // for max i.e 20 value its backgroundColor is 100% then for passwordLength it will be passwordLength*100/max.

}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max){
    return Math.floor(Math.random()*(max-min) + min);
    // here floor we have used bcoz we want a integer not any floating value.
}

function getRandomNumber(){
    return getRandomInteger(0, 9);
}

function getRandomLowerCase(){
    return String.fromCharCode(getRandomInteger(97, 123));  //String.fromCharCode(getRandomInteger) it will generate a character base on the ascii value
}

function getRandomUpperCase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}

function getRandomSymbol(){
    let index = getRandomInteger(0, symbols.length);
    return symbols[index]

}

function calcStrength(){
    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpperCase = true;
    if(lowercaseCheck.checked) hasLowerCase = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpperCase && hasLowerCase && (hasNumber || hasSymbol) && passwordLength>=8){
        setIndicator("#0f0");
    }

    else if((hasUpperCase || hasLowerCase) && (hasNumber || hasSymbol) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'copied';
    }
    catch(e){
        copyMsg.innerText = 'failed';
    }

    copyMsg.classList.add('active');
    setTimeout(() => {
        copyMsg.classList.remove('active');
    },2000); 
}


function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
    
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked){
            checkCount++;
        }
    });

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        sliderHandler();
    }
}

allCheckBox.forEach((checkBox)=>{
    checkBox.addEventListener('change', handleCheckBoxChange);
});


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    sliderHandler();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {

    if(checkCount == 0){
        return;
    }

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        sliderHandler();
    }

    password = "";

    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(getRandomUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(getRandomLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(getRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(getRandomSymbol);
    }

    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log('first executed');
    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let rndIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[rndIndex]();
        console.log(password);
    }
    console.log('second executed');
    console.log(funcArr);
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    calcStrength();
});