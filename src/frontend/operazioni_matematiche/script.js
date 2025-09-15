const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const levelInfo = document.getElementById("level-info");
const cardsContainer = document.getElementById("cards");
const messageBox = document.getElementById("message");

let currentLevel = 1;
const maxLevel = 10;
let idEsercizio = 5;

function getIdEsercizio() {
    return idEsercizio;
}

// Genera operazione in base al livello
function generateOperation(level) {
    let a, b, operator, result;

    switch(level) {
        case 1: // addizioni entro 10
            a = Math.floor(Math.random() * 6) + 1;
            b = Math.floor(Math.random() * 6) + 1;
            operator = "+";
            result = a + b;
            break;
        case 2: // addizioni entro 20
            a = Math.floor(Math.random() * 11) + 5;
            b = Math.floor(Math.random() * 11) + 5;
            operator = "+";
            result = a + b;
            break;
        case 3: // sottrazioni entro 15
            a = Math.floor(Math.random() * 15) + 5;
            b = Math.floor(Math.random() * a);
            operator = "-";
            result = a - b;
            break;
        case 4: // moltiplicazioni entro 6x6
            a = Math.floor(Math.random() * 6) + 2;
            b = Math.floor(Math.random() * 6) + 2;
            operator = "×";
            result = a * b;
            break;
        case 5: // divisioni semplici (tabelline)
            b = Math.floor(Math.random() * 5) + 2;
            result = Math.floor(Math.random() * 6) + 2;
            a = b * result;
            operator = "÷";
            break;
        case 6: // addizioni entro 50
            a = Math.floor(Math.random() * 30) + 10;
            b = Math.floor(Math.random() * 30) + 10;
            operator = "+";
            result = a + b;
            break;
        case 7: // sottrazioni entro 50
            a = Math.floor(Math.random() * 50) + 20;
            b = Math.floor(Math.random() * a);
            operator = "-";
            result = a - b;
            break;
        case 8: // moltiplicazioni fino a 10x10
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
            operator = "×";
            result = a * b;
            break;
        case 9: // divisioni con resto esatto entro 100
            b = Math.floor(Math.random() * 9) + 2;
            result = Math.floor(Math.random() * 10) + 2;
            a = b * result;
            operator = "÷";
            break;
        case 10: // mix di tutte le operazioni
            const randLevel = Math.floor(Math.random() * 4) + 1; // da 1 a 4
            return generateOperation(randLevel);
        default:
            return null;
    }

    return { a, b, operator, result };
}


// Disegna l’operazione sul canvas
function drawOperation(op) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "80px Fredoka One";   // <--- aumentato da 40px a 60px
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText(`${op.a} ${op.operator} ${op.b} = ?`, canvas.width / 2, canvas.height / 2);
}

// Crea le 3 card con le risposte
function createCards(correct) {
    cardsContainer.innerHTML = "";

    // Generiamo due distrattori casuali
    let answers = [correct];
    while (answers.length < 3) {
        let wrong = correct + (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
        if (wrong >= 0 && !answers.includes(wrong)) {
            answers.push(wrong);
        }
    }

    // Mischiamo le risposte
    answers.sort(() => Math.random() - 0.5);

    // Creiamo le card
    answers.forEach(ans => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.textContent = ans;
        card.addEventListener("click", () => checkAnswer(ans, correct));
        cardsContainer.appendChild(card);
    });
}

// Controlla la risposta
function checkAnswer(selected, correct) {
    if (selected === correct) {
        QT.say("Bravo!");
        showMessage("Corretto! 🎉", "success");
        if (currentLevel < maxLevel) {
            currentLevel++;
            incrementaLivelliCompletati();
            setTimeout(startLevel, 3000);
        } else {
            QT.say("Hai completato tutti i livelli");
            document.body.classList.add("completed");
            showMessage("Hai completato tutti i livelli! 🌟", "success");
            incrementaLivelliCompletati()
            terminaEsercuzioneEsercizio(idEsercizio, "Y", false)
            setTimeout(() => {
                showVictoryModal();
            }, 500);

        }
    } else {
        showMessage("Ops, riprova! ❌", "warning");
        QT.say("La risposta non è giusta, riprova");
        incrementaNumeroErrori();
    }
}

// Mostra messaggi
function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = "";
    if (type === "success") {
        messageBox.classList.add("message-success");
        document.body.classList.add("completed");
        document.body.classList.remove("error");
    }
    if (type === "warning") {
        messageBox.classList.add("message-warning");
        document.body.classList.remove("completed");
        document.body.classList.add("error");
    }
}

function startLevel() {
    levelInfo.textContent = `Livello ${currentLevel}`;
    messageBox.textContent = "";
    messageBox.className = "";
    document.body.classList.remove("completed", "error");

    const op = generateOperation(currentLevel);
    drawOperation(op);
    createCards(op.result);
}

startLevel();
