const fileInput = document.getElementById("fileinput");
var inputValidationDisplay;
const messageDisplay = document.getElementById("message");
var countRef;
var masterList
var currentList
var currentListC;
var runningCount;
var currentLetter;
var hasGameStarted;
var countTableRef = Array(26).fill("");
var turn = 0;

fileInput.addEventListener("change", handleFileValidation);

function letsGo() {
    const file = fileInput.files[0];
    messageDisplay.textContent = ""; // Clear previous messages

    // Read the file
    const reader = new FileReader();
    reader.onload = () => {
        masterList = reader.result.split(/\r?\n/);
        startGame();
    };
    reader.onerror = () => {
        showMessage("Error reading the file. Please try again.", "error");
    };
    reader.readAsText(file);
}
function handleFileValidation() {
    const file = fileInput.files[0];
    messageDisplay.textContent = ""; // Clear previous messages

    // Validate file existence and type
    if (!file) {
        showMessage("No file selected. Please choose a file.", "error");
        return;
    }

    if (!file.type.startsWith("text")) {
        showMessage("Unsupported file type. Please select a text file.", "error");
        return;cD
    }
    //Add button Enable here
    document.getElementById("startButton").disabled = false;
    
}
// Displays a message to the user
function showMessage(message, type) {
    messageDisplay.textContent = message;
    messageDisplay.style.color = type === "error" ? "red" : "green";
}

function generateCount(list) {
    var listCount = Array(26).fill(0);
    for (let i = 0; i < list.length; i++)
    {
        listCount[(list[i].toLowerCase()).charCodeAt(0) - 'a'.charCodeAt(0)]++;
    }
    return listCount;
}
function populateCountTable() {
    const tableBody = document.getElementById("data-table");
    tableBody.innerHTML = "";
    for (let i = 0; i < 26; i++) {
        const row = document.createElement("tr");
        //row.style.border = "1px solid black";
        const letterCell = document.createElement("td");
        letterCell.style.border = "1px solid black";
        letterCell.textContent = String.fromCharCode(i + 'A'.charCodeAt(0));
        row.appendChild(letterCell);
        const countCell = document.createElement("td");
        countCell.textContent = runningCount[i];
        countCell.style.border = "1px solid black";
        row.appendChild(countCell);
        countTableRef[i] = row;
        tableBody.appendChild(row);
    }
}

function updateTableValues()
{
    for (let i = 0; i < 26; i++) {
        if (countTableRef[i].children[0].textContent.toLowerCase().charCodeAt(0) == currentLetter.toLowerCase().charCodeAt(0)) {
            countTableRef[i].children[0].style.backgroundColor = "red";
        }
        else
        {
            countTableRef[i].children[0].style.backgroundColor = "";
        }

        countTableRef[i].children[1].textContent = runningCount[i];
        if (countTableRef[i].children[1].textContent == 0) {
            countTableRef[i].children[1].style.backgroundColor = "rgb(0, 255, 0)";
            countTableRef[i].children[1].style.border = "1px solid black";
        }
        else {
            countTableRef[i].children[1].style.border = "2px solid red";
        }
    }
}


function removeName(nameToRemove) {
    if (nameToRemove.toLowerCase().charCodeAt(0) == currentLetter.toLowerCase().charCodeAt(0)) // Check if its current alpha
    {
        const indexToRemove = currentList.indexOf(nameToRemove.toLowerCase());

        if (indexToRemove > -1) { // Only splice if the item is found
            const actualName = currentListC[indexToRemove];
            currentList.splice(indexToRemove, 1);
            currentListC.splice(indexToRemove, 1);
            runningCount = generateCount(currentList);
            updateOrder();
            updateTableValues();
            updateNameTable(actualName);
            inputValidationDisplay.textContent = "";
        }
        else if (currentList.indexOf(nameToRemove.toLowerCase()) == -1 && masterList.indexOf(nameToRemove.toLowerCase()) > -1) {
            inputValidationDisplay.textContent = "That name has already been guessed."
            inputValidationDisplay.style.color = "red";
        }
        else {
            inputValidationDisplay.textContent = "That is not an valid name."
            inputValidationDisplay.style.color = "red";
        }
    }
    else
    {
        inputValidationDisplay.textContent = "Please enter a name that starts with: " + currentLetter.toUpperCase();
        inputValidationDisplay.style.color = "red";
    }

    
    
}

function startGame() {
    currentListC = structuredClone(masterList);
    masterList = masterList.map(element => {
        return element.toLowerCase();
    });
    currentList = structuredClone(masterList);
    runningCount = generateCount(currentList);
    fileInput.remove();
    document.getElementById("startButton").remove();
    document.getElementById("filePrompt").textContent = "Begin guessing names";
    hasGameStarted = false;

    //Setting up the main game elements
    let newElement = document.createElement("input");
    newElement.type = "text";
    newElement.id = "nameGuess";
    newElement.placeholder = "Enter name here";
    document.getElementById("inputDiv").append(newElement);
    newElement = document.createElement("button");
    newElement.onclick = function () { getValue('nameGuess'); };
    newElement.id = "guessButton";
    newElement.textContent = "Guess";
    document.getElementById("inputDiv").append(newElement);
    document.getElementById("nameGuess").addEventListener("keypress", function (event) {
        //event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("guessButton").click();
        }
    });
    newElement = document.createElement("div");
    newElement.style.minHeight = "18px";
    document.getElementById("inputDiv").append(newElement);
    let pElement = newElement;
    newElement = document.createElement("span");
    newElement.id = "wrong-input";
    pElement.append(newElement);
    inputValidationDisplay = newElement;
    newElement = document.createElement("table");
    newElement.style.border = "none";
    newElement.style.borderCollapse = "Collapse";
    let tHead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    let hContent = document.createElement("th");
    hContent.textContent = "Letter";
    headerRow.appendChild(hContent);
    hContent = document.createElement("th");
    hContent.textContent = "Count";
    headerRow.appendChild(hContent);
    tHead.appendChild(headerRow);
    newElement.appendChild(tHead);
    let body = document.createElement("tbody");
    body.id = "data-table";
    newElement.appendChild(body);
    document.getElementById("inputDiv").after(newElement);
    
    populateCountTable();
    updateOrder();
    updateTableValues();

}
function getValue(elementId) {
    const inputElement = document.getElementById(elementId);

    const inputValue = inputElement.value;
    document.getElementById(elementId).value = '';
    removeName(inputValue);
}
function updateNameTable(nameToAdd) {
    const newName = document.createElement("td");
    newName.style.border = "1px solid black";
    newName.style.backgroundColor = "white";
    newName.textContent = nameToAdd;
    newName.style.textAlign = "center";
    newName.width = "100px";
    countTableRef[nameToAdd.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)].appendChild(newName);
}
function updateOrder() {
    if (!hasGameStarted) {
        currentLetter = 'a';
        hasGameStarted = true;
        while (runningCount[currentLetter.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)] <= 0) {
            currentLetter = String.fromCharCode((currentLetter.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 1) % 26 + 'a'.charCodeAt(0));


            if (currentLetter == 'a') {
                //Add game ending logic here
                break;
            }
        }
    }
    else
    {
        let startLetter = currentLetter;
        currentLetter = String.fromCharCode((currentLetter.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 1) % 26 + 'a'.charCodeAt(0));
        while (runningCount[currentLetter.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)] <= 0) {
            currentLetter = String.fromCharCode((currentLetter.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 1) % 26 + 'a'.charCodeAt(0));
            if (startLetter == currentLetter) {
                //Add game ending logic here
                break;
            }
        }
    }
}