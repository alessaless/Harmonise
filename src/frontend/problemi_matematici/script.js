let idEsercizio = 7;

function getIdEsercizio() {
    return idEsercizio;
}

const problems = [
    // --- Addizioni ---
    {
        text: "Avevo 6 mele, compro altre 2 mele e 5 patate. Quante mele ho adesso?",
        correct: 8,
        operands: [6, 2],
        operator: "+"
    },
    {
        text: "Marco ha 4 biscotti e ne riceve altri 3, insieme a 2 caramelle. Quanti biscotti ha in totale?",
        correct: 7,
        operands: [4, 3],
        operator: "+"
    },

    // --- Sottrazioni ---
    {
        text: "In una scatola ci sono 15 mele, ne mangio 4 e ne regalo 3 ad un amico, insieme a 2 banane. Quante mele mi restano?",
        correct: 8,
        operands: [15, 4, 3],
        operator: "-"
    },
    {
        text: "Ho 20 caramelle, ne mangio 5 e ne regalo altre 7. Quante caramelle mi restano?",
        correct: 8,
        operands: [20, 5, 7],
        operator: "-"
    },

    // --- Moltiplicazioni ---
    {
        text: "Luca ha comprato 3 caramelle. Ogni caramella costa 2 euro. Quanto ha speso Luca?",
        correct: 6,
        operands: [2, 3],
        operator: "*"
    },
    {
        text: "Ogni scatola contiene 4 biscotti. Se compro 5 scatole, quanti biscotti ho in totale?",
        correct: 20,
        operands: [4, 5],
        operator: "*"
    },

    // --- Divisioni ---
    {
        text: "Sara ha 12 penne e le distribuisce ai suoi 4 amici. Quante penne ha ciascun amico?",
        correct: 3,
        operands: [12, 4],
        operator: "/"
    },
    {
        text: "Un pasticcere ha 18 torte e vuole metterle in scatole da 6. Quante scatole riuscirà a riempire?",
        correct: 3,
        operands: [18, 6],
        operator: "/"
    }
];



const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");
const nextBtn = document.getElementById("next-btn");
const problemBig = screen1.querySelector(".problem-big");
const problemSmall = screen2.querySelector(".problem-small");
const numbersContainer = document.getElementById("numbers-container");
const operation = document.getElementById("operation");
const checkBtn = document.getElementById("check-btn");
const levelInfo = document.getElementById("level-info");
const messageBox = document.getElementById("message");

let answerInput;
let currentProblem = 0;


function loadProblem(index) {

    const problem = problems[index];
    // aggiorna testi
    QT.say(problem.text)
    problemBig.textContent = problem.text;
    problemSmall.textContent = problem.text;
    levelInfo.textContent = `Livello ${index + 1}`;

    // reset messaggi e sfondi
    messageBox.textContent = "";
    messageBox.className = "";
    document.body.classList.remove("completed", "error");

    // genera numeri del problema
    const numbers = problem.text.match(/\d+/g) || [];
    numbersContainer.innerHTML = "";
    numbers.forEach((num) => {
        const el = document.createElement("div");
        el.classList.add("draggable");
        el.textContent = num;
        el.setAttribute("draggable", "true");
        el.dataset.value = num;

        el.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.dataset.value);
        });

        numbersContainer.appendChild(el);
    });

    // ricrea blocco operazione dinamico
    operation.innerHTML = "";

    problem.operands.forEach((_, i) => {
        const dz = document.createElement("div");
        dz.classList.add("dropzone");
        operation.appendChild(dz);

        // se non è l’ultimo operando → aggiungi operatore
        if (i < problem.operands.length - 1) {
            const op = document.createElement("span");
            op.classList.add("operator");
            op.textContent = problem.operator;
            operation.appendChild(op);
        }
    });

    // aggiungi =
    const eq = document.createElement("span");
    eq.classList.add("operator");
    eq.textContent = "=";
    operation.appendChild(eq);

    // input risultato
    answerInput = document.createElement("input");
    answerInput.type = "number";
    answerInput.placeholder = "?";
    answerInput.id = "answer-input";
    answerInput.style.fontFamily = "'Fredoka One', cursive";
    operation.appendChild(answerInput);

    // setup dropzone eventi
    operation.querySelectorAll(".dropzone").forEach((dz) => {
        dz.addEventListener("dragover", (e) => {
            e.preventDefault();
            dz.style.background = "#d0ebff";
        });

        dz.addEventListener("dragleave", () => {
            dz.style.background = "#e7f5ff";
        });

        dz.addEventListener("drop", (e) => {
            e.preventDefault();
            const value = parseInt(e.dataTransfer.getData("text/plain"), 10);
            const problem = problems[currentProblem];

            if (!problem.operands.includes(value)) {
                QT.say("Questo numero non va usato! ")
                incrementaNumeroErrori();
                document.body.classList.add("error");
                messageBox.textContent = "Ops! Hai usato un dato sbagliato 👀";
                messageBox.className = "message-warning";
                return;
            }

            dz.textContent = value;
            dz.classList.add("filled");
            dz.style.background = "#a5d8ff";
        });
    });
}



nextBtn.addEventListener("click", () => {
    screen1.classList.remove("active");
    screen1.style.left = "-100%";
    screen2.classList.add("active");
    screen2.style.left = "0";
});

// verifica risultato
checkBtn.addEventListener("click", () => {
    const problem = problems[currentProblem];
    const userAnswer = parseInt(answerInput.value, 10);

    // numeri nelle dropzone nell'ordine scelto
    const chosen = [...operation.querySelectorAll(".dropzone")]
        .map((dz) => parseInt(dz.textContent, 10))
        .filter((n) => !isNaN(n));

    if (chosen.length < problem.operands.length) {
        QT.say("Devi trascinare tutti i numeri!")
        document.body.classList.add("error");
        incrementaNumeroErrori();
        messageBox.textContent = "Devi trascinare tutti i numeri 👀";
        messageBox.className = "message-warning";
        return;
    }

    // calcola risultato effettivo con ordine scelto dal bambino
    let calc = chosen[0];
    for (let i = 1; i < chosen.length; i++) {
        if (problem.operator === "+") calc += chosen[i];
        if (problem.operator === "-") calc -= chosen[i];
        if (problem.operator === "*") calc *= chosen[i];
        if (problem.operator === "/") calc /= chosen[i];
    }

    // verifica
    if (userAnswer === problem.correct && calc === problem.correct) {
        document.body.classList.add("completed");
        incrementaLivelliCompletati();
        messageBox.textContent = "Bravo! Risposta corretta 🎉";
        messageBox.className = "message-success";

        currentProblem++;
        if(currentProblem < problems.length) {
            QT.say("Bravo, hai terminato il livello!")
        } else {
            QT.say("Bravissimo, hai terminato tutti i livelli")
        }

        setTimeout(() => {
            if (currentProblem < problems.length) {
                loadProblem(currentProblem);

                // torna alla schermata iniziale
                screen2.classList.remove("active");
                screen2.style.left = "100%";
                screen1.classList.add("active");
                screen1.style.left = "0";
            } else {
                document.body.classList.add("completed");
                messageBox.textContent= "Hai completato tutti i livelli! 🌟", "success";
                terminaEsercuzioneEsercizio(idEsercizio, "Y", false)
                setTimeout(() => {
                    showVictoryModal();
                }, 500);

            }
        }, 3000);
    } else {
        QT.say("Ricontrolla il risultato! ")
        incrementaNumeroErrori();
        document.body.classList.add("error");

        messageBox.textContent = "Ops! Risultato sbagliato 👀";
        messageBox.className = "message-warning";
    }
});


