let idEsercizio = 3;

function getIdEsercizio() {
    return idEsercizio;
}

const problems = [
    {
        text: "In una scatola ci sono 15 mele, ne mangio 4 e ne regalo 3 ad un amico, insieme a 2 banane. Quante mele mi restano?",
        correct: 8,
        operands: [15, 4, 3],
        operator: "-"
    }/*,
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
    {
        text: "Luca aveva 9 palline, ne regala 4 e riceve 2 fumetti. Quante palline gli rimangono?",
        correct: 5,
        operands: [9, 4],
        operator: "-"
    },
    {
        text: "Sara ha 12 penne, ne presta 5 e compra 3 quaderni. Quante penne ha adesso?",
        correct: 7,
        operands: [12, 5],
        operator: "-"
    },
    {
        text: "In un parco ci sono 5 bambini, arrivano altri 3 e 2 adulti. Quanti bambini ci sono in tutto?",
        correct: 8,
        operands: [5, 3],
        operator: "+"
    },
    {
        text: "Avevo 10 euro. Compro una matita da 2 euro, un quaderno da 3 euro e un panino da 5 euro. Quanti euro mi restano?",
        correct: 0,
        operands: [10, 2, 3, 5], // inteso come 10 - (2+3+5)
        operator: "-"
    }*/
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

        setTimeout(() => {
            currentProblem++;
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
        }, 1000);
    } else {
        incrementaNumeroErrori();
        document.body.classList.add("error");
        messageBox.textContent = "Ops! Risultato sbagliato 👀";
        messageBox.className = "message-warning";
    }
});

loadProblem(currentProblem);
