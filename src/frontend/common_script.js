const quitBtn = document.getElementById("quit-btn");
const quitModal = document.getElementById("quit-modal");
const quitYesBtn = document.getElementById("quit-yes-btn");
const quitNoBtn = document.getElementById("quit-no-btn");

let livelloCompletati = 0;
let numeroErrori = 0;

function showVictoryModal() {
    const modal = document.getElementById("victory-modal");
    modal.style.display = "flex"; // mostro la modale

    const playAgainBtn = document.getElementById("play-again-btn");
    playAgainBtn.onclick = () => {
        window.location.href = "../elenco_esercizi.html";
        /*modal.style.display = "none"; // nascondo modale
        currentLevel = 0;
        loadLevel();*/
        // torna alla home
    };
}

quitBtn.addEventListener("click", () => {
    quitModal.style.display = "flex"; // mostra la modale
});

quitYesBtn.addEventListener("click", () => {
    terminaEsercuzioneEsercizio(getIdEsercizio(), "N", true);
});

quitNoBtn.addEventListener("click", () => {
    quitModal.style.display = "none";
});


function incrementaLivelliCompletati() {
    livelloCompletati++;
}

function incrementaNumeroErrori() {
    numeroErrori++;
}

function terminaEsercuzioneEsercizio(idEsercizio, terminato, goHome) {
    const token = localStorage.getItem("token"); // recupero il token dal localstorage
    const idBambino = JSON.parse(localStorage.getItem("user")).id;

    const body = {
        idEsercizio: idEsercizio,
        bambino: idBambino,
        numeroErrori: numeroErrori,
        terminato: terminato,
        livelliCompletati: livelloCompletati
    };


    fetch("http://localhost:8080/executions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nella chiamata API");
            }
            return response.json();
        })
        .then(data => {
            //console.log("Esecuzione salvata correttamente:", data);
            if(goHome) window.location.href = "../elenco_esercizi.html";
        })
        .catch(error => {
            console.error("Errore:", error);
        });
}


