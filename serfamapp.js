/* ==========================================================
   SERFAM TV
   Partie 1
   Configuration + Horloge + Chargement
========================================================== */

console.log("SERFAM TV démarré");

/* ==========================================================
   CONFIGURATION
========================================================== */

const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnTX635-HGOZAyuYBNOgIU5rL4l_SM-BLmgEWovaMJLqPw0a9ksL0ZN40SkBBdXO7UBd4gc7kKYfmHl99TWp0c-n1IM9lTSSVVV9FpbESVVAgUO8pfMuJxRaGWXacSAHnjvf7GMtYejBDo0sXgaaaV-XY6Ajew7mLFEmhUBztuc-bqQkR3iFkcDrgbAdG4cUwc8yWUYIxHPcB9H79Wa2XY-wHkydjGxO2Nlqz4o93C-ZA_hKRREXc4Qg46I5qts7cHzorFZM_gSQkln3w0ykujdIW8O3cA&lib=M5k8RhdxgLMqvnc5xtfdZ_hrz-EcdL9gh";

// false = PC
// true = Smart TV Hisense
const MODE_TV = false;

let donnees = {};

let photos = [];

let photoCourante = 0;


/* ==========================================================
   HORLOGE
========================================================== */

function mettreAJourHorloge(){

    const maintenant = new Date();

    if(MODE_TV){

        maintenant.setHours(
            maintenant.getHours()+1
        );

    }

    document.getElementById("heure").textContent =
        maintenant.toLocaleTimeString("fr-FR");

    const jour =
        maintenant.toLocaleDateString("fr-FR",{

            weekday:"long"

        });

    document.getElementById("jour").textContent =
        jour.charAt(0).toUpperCase()+jour.slice(1);

    document.getElementById("date").textContent =
        maintenant.toLocaleDateString("fr-FR",{

            day:"2-digit",
            month:"2-digit",
            year:"numeric"

        });

}


/* ==========================================================
   GOOGLE SHEETS
========================================================== */

async function chargerDonnees(){

    try{

        const response = await fetch(API_URL);

        donnees = await response.json();

        console.log(donnees);

        initialiserPage();

    }

    catch(erreur){

        console.error(erreur);

    }

}


/* ==========================================================
   INITIALISATION
========================================================== */

function initialiserPage(){

    chargerUrgent();

    chargerCitation();

    chargerPhotos();

    chargerReunions();

    chargerVitrine();

    chargerBandeau();

}







/* ==========================================================
   SERFAM TV
   Partie 2
   Photos + Diaporama + Réunions
========================================================== */

/* ==========================================================
   PHOTOS
========================================================== */

function chargerPhotos(){

    photos = [];

    if(Array.isArray(donnees.photosSerfam)){

        photos = donnees.photosSerfam;

    }

    if(photos.length===0){

        return;

    }

    photoCourante = 0;

    document.getElementById("photo-principale").src =
        photos[0];

}


/* ==========================================================
   DIAPORAMA
========================================================== */

function photoSuivante(){

    if(photos.length<=1){

        return;

    }

    photoCourante++;

    if(photoCourante>=photos.length){

        photoCourante=0;

    }

    const image =
        document.getElementById("photo-principale");

    image.classList.add("fade-out");

    setTimeout(()=>{

        image.src = photos[photoCourante];

        image.classList.remove("fade-out");

        image.classList.add("fade-in");

        setTimeout(()=>{

            image.classList.remove("fade-in");

        },800);

    },500);

}


/* ==========================================================
   REUNIONS
========================================================== */

function chargerReunions(){

    const conteneur =
        document.getElementById("reunions");

    if(!conteneur){

        return;

    }

    conteneur.innerHTML="";

    if(!Array.isArray(donnees.reunionsSerfam)){

        return;

    }

    donnees.reunionsSerfam.forEach(reunion=>{

        const carte =
            document.createElement("div");

        carte.className="reunion-card";

        carte.innerHTML=`

            <div class="reunion-horaire">

                ${reunion.debut} - ${reunion.fin}

            </div>

            <div class="reunion-titre">

                ${reunion.reunion}

            </div>

            <div class="reunion-lieu">

                📍 ${reunion.lieu}

            </div>

        `;

        conteneur.appendChild(carte);

    });

}





/* ==========================================================
   SERFAM TV
   Partie 3
   Urgent - Citation - Vitrine - Bandeau
========================================================== */

/* ==========================================================
   MESSAGE IMPORTANT
========================================================== */

function chargerUrgent(){

    const zone =
        document.getElementById("urgent");

    if(!zone){

        return;

    }

    zone.textContent =
        donnees.urgentSerfam || "";

}


/* ==========================================================
   CITATION
========================================================== */

function chargerCitation(){

    const zone =
        document.getElementById("citation");

    if(!zone){

        return;

    }

    zone.textContent =
        donnees.citationSerfam || "";

}


/* ==========================================================
   VITRINE
========================================================== */

function chargerVitrine(){

    const vitrine =
        document.getElementById("vitrine");

    if(!vitrine){

        return;

    }

    vitrine.innerHTML = "";

    if(!Array.isArray(donnees.vitrineSerfam)){

        return;

    }

    donnees.vitrineSerfam.forEach(bloc=>{

        const div =
            document.createElement("div");

        div.innerHTML = `

            <h3>${bloc.titre}</h3>

            <p>${bloc.texte}</p>

        `;

        vitrine.appendChild(div);

    });

}


/* ==========================================================
   BANDEAU
========================================================== */

function chargerBandeau(){

    const bandeau =
        document.getElementById("bandeau");

    if(!bandeau){

        return;

    }

    if(Array.isArray(donnees.bandeauSerfam)){

        bandeau.textContent =
            donnees.bandeauSerfam.join("   ●   ");

    }

    else{

        bandeau.textContent = "";

    }

}





/* ==========================================================
   SERFAM TV
   Partie 4
   Lancement de l'application
========================================================== */

/* ==========================================================
   DEMARRAGE
========================================================== */

// Horloge
mettreAJourHorloge();
setInterval(mettreAJourHorloge,1000);

// Chargement initial
chargerDonnees();

// Rafraîchissement des données toutes les minutes
setInterval(chargerDonnees,60000);

// Diaporama
setInterval(photoSuivante,15000);


/* ==========================================================
   SECURITE
========================================================== */

window.addEventListener("load",()=>{

    console.log("SERFAM TV prêt");

});


/* ==========================================================
   FIN
========================================================== */
