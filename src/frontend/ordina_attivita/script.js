let idEsercizio = 6;

function getIdEsercizio() {
    return idEsercizio;
}

const levels = [
    {
        "title": "Livello 1: Mangiare una mela",
        "correctOrder": [
            "Prendi la mela",
            "Lava la mela",
            "Mangia la mela"
        ],
        "distractors": [
            "Metti la mela sul naso",
            "Gioca a calcio"
        ]
    }
    /*,
    {
        "title": "Livello 2: Mettersi il cappotto",
        "correctOrder": [
            "Prendi il cappotto",
            "Infila un braccio",
            "Infila l’altro braccio",
            "Chiudi i bottoni"
        ],
        "distractors": [
            "Metti il cappotto in testa",
            "Lancia il cappotto"
        ]
    },
    {
        "title": "Livello 3: Bere un bicchiere d’acqua",
        "correctOrder": [
            "Prendi il bicchiere",
            "Riempilo d’acqua",
            "Bevi l’acqua"
        ],
        "distractors": [
            "Metti il bicchiere in tasca",
            "Versa l’acqua sul pavimento"
        ]
    },
    {
        "title": "Livello 4: Disegnare",
        "correctOrder": [
            "Prendi un foglio",
            "Prendi una matita",
            "Disegna sul foglio"
        ],
        "distractors": [
            "Mangia la matita",
            "Metti il foglio in testa"
        ]
    },
    {
        "title": "Livello 5: Giocare con le costruzioni",
        "correctOrder": [
            "Prendi i mattoncini",
            "Incastra i pezzi",
            "Costruisci una torre"
        ],
        "distractors": [
            "Lancia i mattoncini",
            "Nascondi i pezzi"
        ]
    },
    {
        "title": "Livello 6: Prepararsi per dormire",
        "correctOrder": [
            "Metti il pigiama",
            "Vai a letto",
            "Chiudi gli occhi"
        ],
        "distractors": [
            "Indossa le scarpe",
            "Accendi la musica forte"
        ]
    }*/
];


let currentLevel = 0;
let draggedTask = null;

const levelInfo = document.getElementById("level-info");
const message = document.getElementById("message");
const checkBtn = document.getElementById("check-btn");
const taskList = document.querySelector(".task-list");
const rightPanel = document.getElementById("right-panel");

function loadLevel() {
    const level = levels[currentLevel];
    levelInfo.textContent = level.title;
    message.textContent = "";
    message.className = "";

    // reset lista attività
    taskList.innerHTML = "";

    // reset e crea slot in base al numero corretto di passi
    rightPanel.innerHTML = "";
    for (let i = 0; i < level.correctOrder.length; i++) {
        const slot = document.createElement("div");
        slot.classList.add("slot");
        slot.textContent = "Trascina qui...";
        slot.dataset.value = "";
        rightPanel.appendChild(slot);
    }

    // genera lista di task (giusti + distrattori)
    const tasks = [...level.correctOrder, ...level.distractors];
    shuffleArray(tasks);

    tasks.forEach(t => {
        const div = document.createElement("div");
        div.classList.add("task");
        div.setAttribute("draggable", "true");
        div.textContent = t;
        taskList.appendChild(div);
    });

    enableDragAndDrop();
}

function enableDragAndDrop() {
    const tasks = document.querySelectorAll(".task");
    const slots = document.querySelectorAll(".slot");

    tasks.forEach(task => {
        task.addEventListener("dragstart", e => {
            draggedTask = task;
            setTimeout(() => (task.style.display = "none"), 0);
        });

        task.addEventListener("dragend", e => {
            draggedTask.style.display = "block";
            draggedTask = null;
        });
    });

    slots.forEach(slot => {
        slot.addEventListener("dragover", e => {
            e.preventDefault();
            slot.classList.add("drag-over");
        });

        slot.addEventListener("dragleave", () => {
            slot.classList.remove("drag-over");
        });

        slot.addEventListener("drop", () => {
            slot.classList.remove("drag-over");
            if (draggedTask) {
                const level = levels[currentLevel];
                const value = draggedTask.textContent;

                // 👉 controllo se il valore NON fa parte della sequenza corretta
                if (!level.correctOrder.includes(value)) {
                    // errore: attività non valida
                    incrementaNumeroErrori();
                    QT.say("Questa attività non va qui!")
                    message.textContent = "Questa attività non va qui!";
                    message.className = "message-warning";
                    document.body.classList.add("error");

                    // rimetti subito il task visibile nella lista
                    draggedTask.style.display = "block";
                    draggedTask = null;
                    return;
                }

                document.body.classList.remove("error");
                message.textContent = "";
                message.className = "";
                // se lo slot aveva già un valore → lo rimetti in lista
                if (slot.dataset.value) {
                    addTaskToList(slot.dataset.value);
                }

                // aggiorna slot
                slot.textContent = ""; // pulisco prima
                slot.dataset.value = value;
                slot.classList.add("filled");

                // creo contenitore con testo e bottone X
                const span = document.createElement("span");
                span.textContent = value;

                const btn = document.createElement("button");
                btn.classList.add("remove-btn");
                btn.textContent = "×";
                btn.addEventListener("click", () => {
                    addTaskToList(slot.dataset.value);
                    slot.textContent = "Trascina qui...";
                    slot.dataset.value = "";
                    slot.classList.remove("filled");
                });

                slot.appendChild(span);
                slot.appendChild(btn);

                // rimuovi task dalla lista
                draggedTask.remove();
            }
        });




    });
}

// Verifica
checkBtn.addEventListener("click", () => {
    const level = levels[currentLevel];
    const chosen = Array.from(document.querySelectorAll(".slot"))
        .map(s => s.dataset.value)
        .filter(Boolean);

    if (arraysEqual(chosen, level.correctOrder)) {
        incrementaLivelliCompletati()
        message.textContent = "Bravo! Hai completato il livello!";
        message.className = "message-success";
        document.body.classList.add("completed");
        currentLevel++;
        if(currentLevel < levels.length) {
            QT.say("Bravo, hai terminato il livello!")
        } else {
            QT.say("Bravissimo, hai terminato tutti i livelli")
        }

        setTimeout(() => {
            document.body.classList.remove("completed");

            if (currentLevel < levels.length) {
                loadLevel();
            } else {
                terminaEsercuzioneEsercizio(idEsercizio, "Y", false)
                showVictoryModal();
            }
        }, 1500);
    } else {
        incrementaNumeroErrori();
        QT.say("Ricontrolla l'ordine delle attività! ")
        message.textContent = "Ops! Prova di nuovo...";
        message.className = "message-warning";
        document.body.classList.add("error");
    }
});

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function addTaskToList(value) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");
    div.textContent = value;

    // attacco i listener drag
    div.addEventListener("dragstart", e => {
        draggedTask = div;
        setTimeout(() => (div.style.display = "none"), 0);
    });
    div.addEventListener("dragend", e => {
        div.style.display = "block";
        draggedTask = null;
    });

    taskList.appendChild(div);
}


// Avvio
loadLevel();