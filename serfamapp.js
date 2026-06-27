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
