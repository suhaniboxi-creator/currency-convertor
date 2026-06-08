
let swapBtn = document.querySelector(".convertImg");
let exchangeRateBtn = document.querySelector(".exchangeRate-btn");
let fromDropdown = document.querySelector("select[name='from']");
let toDropdown = document.querySelector("select[name='to']");
let inputText = document.querySelector(".input");
let errorMsg = document.querySelector(".errorMsg");
let msg = document.querySelector(".msg"); // renamed from rate to msg
let fromFlag=document.querySelector("#fromFlag");
let toFlag=document.querySelector("#toFlag");
let copyBtn=document.querySelector(".copyBtn")
let copyMsg = document.querySelector(".copyMsg");
let historyDiv = document.querySelector("#history");
let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
let themeBtn=document.querySelector(".mode-button");

//swap button
swapBtn.addEventListener("click", () => {
    let temp = fromDropdown.value;
    fromDropdown.value = toDropdown.value;
    toDropdown.value = temp;

    updateFlag(fromFlag, fromDropdown.value);
    updateFlag(toFlag, toDropdown.value);

});

//input check
inputText.addEventListener("input", () => {
    let amount = inputText.value; // define amount here
    if(isNaN(amount) || amount <= 0 || amount === "") {
        errorMsg.classList.remove("hide");
    } else {
        errorMsg.classList.add("hide");
    }
});
// Update the flag
function updateFlag(imgElement, currencyCode) {
    let countryCode = countryList[currencyCode];
    imgElement.src = `https://flagsapi.com/${countryCode}/shiny/64.png`;
}

fromDropdown.addEventListener("change", () => {
    updateFlag(fromFlag, fromDropdown.value);
});

toDropdown.addEventListener("change", () => {
    updateFlag(toFlag, toDropdown.value);
});

async function getLiveRate(fromCurrency, toCurrency) {
  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
  const data = await response.json();
  return data.rates[toCurrency];
 
}

function disableBtn(){
    exchangeRateBtn.disabled=true;
}

function enableBtn(){
    exchangeRateBtn.disabled=false;
}
exchangeRateBtn.addEventListener("click", async () => {
    let fromCurrency = fromDropdown.value;
    let toCurrency = toDropdown.value;
    let amount = inputText.value;


     if(isNaN(amount) || amount <= 0 || amount === "") {
        errorMsg.classList.remove("hide");
        return; // this stops the rest of the function
    }

     exchangeRateBtn.innerText="Converting";
    disableBtn();
    let liveRate = await getLiveRate(fromCurrency, toCurrency);
    let result = amount * liveRate;
    
    msg.innerText = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
    enableBtn();
    exchangeRateBtn.innerText = "Get Exchange Rate";
    addHistory(fromCurrency , toCurrency , amount ,result);
});


for(let currencyCode in countryList) {
    let option1 = document.createElement("option");
    option1.value = currencyCode;
    option1.innerText = currencyCode;
    fromDropdown.appendChild(option1);

    let option2 = document.createElement("option");
    option2.value = currencyCode;
    option2.innerText = currencyCode;
    toDropdown.appendChild(option2);
}

copyBtn.addEventListener("click" , () => {
navigator.clipboard.writeText(msg.innerText)
.then(() => {
    copyMsg.classList.remove("hide");

    setTimeout(() => {
        copyMsg.classList.add("hide");
    } , 4000);
})}
)

function addHistory(fromCurrency , toCurrency , amount ,result){

    let entry = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
    history.push(entry);

    if(history.length > 5) {
        history.shift(); // remove oldest if more than 5
    }
    localStorage.setItem("conversionHistory" , JSON .stringify(history))
    displayHistory();
}
function displayHistory(){
    historyDiv.innerHTML="";
history.forEach((entry) => {
        let p = document.createElement("p");
        p.innerText = entry;
        historyDiv.appendChild(p);
    });

}
displayHistory();
// on page load — read saved theme
if(localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.innerHTML = '<i class="fa-regular fa-sun"></i><p>Light Mode</p>';
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeBtn.innerHTML = '<i class="fa-regular fa-sun"></i><p>Light Mode</p>';
        themeBtn.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        themeBtn.innerHTML = '<i class="fa-regular fa-moon"></i><p>Dark Mode</p>';
        themeBtn.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
});





















//async function
// async function getLiveRate(fromCurrency, toCurrency) {
//     try {
//         const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
//         if(!response.ok) throw new Error("API failed");
//         const data = await response.json();
//         return data.rates[toCurrency];
//     } catch(error) {
//         console.error(error);
//         return null;
//     }
// }

// exchangeRateBtn.addEventListener("click", async () => {
//     let fromCurrency = fromDropdown.value;
//     let toCurrency = toDropdown.value;
//     let amount = inputText.value;

//     let liveRate = await getLiveRate(fromCurrency, toCurrency); // renamed to liveRate
    
//     if(liveRate === null) {
//         msg.innerText = "Something went wrong. Try again!";
//         return;
//     }

//     let result = amount * liveRate;
//     msg.innerText = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
// });

//add countrylist to dropdown

//  normal logic without api
// exchangeRateBtn.addEventListener("click", () => {
//     let fromCurrency = fromDropdown.value;
//     let toCurrency = toDropdown.value;
//     let amount = inputText.value;

//     let result = amount * rates[fromCurrency][toCurrency];
//     rate.innerText = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
// });
// const rates = {
//     USD: { USD: 1, INR: 96.5, GBP: 0.742, EUR: 0.858, JPY: 159.5 },
//     INR: { USD: 0.0104, INR: 1, GBP: 0.00769, EUR: 0.00889, JPY: 1.65 },
//     GBP: { USD: 1.347, INR: 130.0, GBP: 1, EUR: 1.156, JPY: 214.9 },
//     EUR: { USD: 1.166, INR: 112.5, GBP: 0.865, EUR: 1, JPY: 185.9 },
//     JPY: { USD: 0.00627, INR: 0.605, GBP: 0.00465, EUR: 0.00538, JPY: 1 }
// };