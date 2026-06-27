/* ==========================================================
   SERFAM TV
   Partie 1
   Horloge - Google Sheets - Diaporama
========================================================== */

const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnTX635-HGOZAyuYBNOgIU5rL4l_SM-BLmgEWovaMJLqPw0a9ksL0ZN40SkBBdXO7UBd4gc7kKYfmHl99TWp0c-n1IM9lTSSVVV9FpbESVVAgUO8pfMuJxRaGWXacSAHnjvf7GMtYejBDo0sXgaaaV-XY6Ajew7mLFEmhUBztuc-bqQkR3iFkcDrgbAdG4cUwc8yWUYIxHPcB9H79Wa2XY-wHkydjGxO2Nlqz4o93C-ZA_hKRREXc4Qg46I5qts7cHzorFZM_gSQkln3w0ykujdIW8O3cA&lib=M5k8RhdxgLMqvnc5xtfdZ_hrz-EcdL9gh";


let donnees = {};

let photos = [];

let photoCourante = 0;


/* ==========================================================
HORLOGE
========================================================== */

function mettreAJourHorloge() {

    const maintenant = new Date();

    document.getElementById("heure").textContent =
        maintenant.toLocaleTimeString("fr-FR");

    const jour = maintenant.toLocaleDateString("fr-FR",{
        weekday:"long"
    });

    document.getElementById("jour").textContent =
        jour.charAt(0).toUpperCase() + jour.slice(1);

    document.getElementById("date").textContent =
        maintenant.toLocaleDateString("fr-FR",{

            day:"2-digit",
            month:"2-digit",
            year:"numeric"

        });

}


/* ==========================================================
CHARGEMENT GOOGLE SHEETS
========================================================== */

async function chargerDonnees(){

    try{

        const response = await fetch(API_URL);

        donnees = await response.json();

        console.log("SERFAM",donnees);

        initialiserDonnees();

    }

    catch(e){

        console.error(e);

    }

}


/* ==========================================================
INITIALISATION
========================================================== */

function initialiserDonnees(){

    chargerUrgent();

    chargerCitation();

    chargerVitrine();

    chargerBandeau();

    chargerReunions();

    chargerPhotos();

}


/* ==========================================================
PHOTOS
========================================================== */

function chargerPhotos(){

    if(!donnees.photosSerfam) return;

    photos = donnees.photosSerfam;

    if(photos.length===0) return;

    document.getElementById("photo-principale").src =
        photos[0];

}


/* ==========================================================
DIAPORAMA
========================================================== */

function photoSuivante(){

    if(photos.length<=1) return;

    const image =
        document.getElementById("photo-principale");

    image.classList.add("fade-out");

    setTimeout(()=>{

        photoCourante++;

        if(photoCourante>=photos.length){

            photoCourante=0;

        }

        image.src=photos[photoCourante];

        image.classList.remove("fade-out");

        image.classList.add("fade-in");

    },1000);

}


/* ==========================================================
LANCEMENT HORLOGE
========================================================== */

mettreAJourHorloge();

setInterval(

    mettreAJourHorloge,

    1000

);


/* ==========================================================
LANCEMENT DIAPORAMA
========================================================== */

setInterval(

    photoSuivante,

    15000

);


/* ==========================================================
   REUNIONS
========================================================== */

function chargerReunions(){

    const conteneur = document.getElementById("reunions");

    if(!conteneur) return;

    conteneur.innerHTML = "";

    if(!Array.isArray(donnees.reunionsSerfam)) return;

    donnees.reunionsSerfam.forEach(reunion=>{

        const carte = document.createElement("div");

        carte.className="reunion-card";

        carte.innerHTML=`

            <div class="reunion-horaire">

                🕘 ${reunion.debut} - ${reunion.fin}

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
   MESSAGE URGENT
========================================================== */

function chargerUrgent(){

    const zone=document.getElementById("urgent");

    if(!zone) return;

    zone.textContent=

        donnees.urgentSerfam || "Aucun message";

}


/* ==========================================================
   CITATION
========================================================== */

function chargerCitation(){

    const zone=document.getElementById("citation");

    if(!zone) return;

    zone.textContent=

        donnees.citationSerfam || "";

}




reunionsSerfam:[

   {

      debut:"09:00",

      fin:"10:30",

      reunion:"Réunion équipe",

      lieu:"Salle polyvalente"

   },

   {

      debut:"14:00",

      fin:"15:30",

      reunion:"Accueil familles",

      lieu:"Bureau 2"

   }

],

urgentSerfam:"Le parking est fermé.",

citationSerfam:"La famille est le premier lieu d'apprentissage."
