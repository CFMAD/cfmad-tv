/* ==========================================================
   SERFAM TV
   VERSION basée sur la structure CFMAD TV
========================================================== */

console.log("SERFAM TV démarré");


/* ==========================================================
   CONFIGURATION
========================================================== */

const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSVuuA-puvl4RIgmcomKu0NEXT1h7eUQdfmbteDWFHHElk6Pz9zVVU7Yyr1cxPas2V7s94ZkkqFREZGg4MNbgJFPOFLo7cD8ZJqTiGnGvRXLmHIzJq5diFNr5M9fAx5_1QwGheK6PIxCgrlLaPaJciDj-MYAWuOVZN8F8Zj3dEpBOlTYYAEVUCdx1s3NeHWGj4TumaJd97uMdTSieC_xMwsoV_J1nhK9lTexNMc8wccaDZ-bMrvJVYpSL9kPiju3tsxSadR-L7UXRMsBgZAWQPggerYXg&lib=M5k8RhdxgLMqvnc5xtfdZ_hrz-EcdL9gh";

/*
   false = ordinateur
   true  = Smart TV Hisense

   Si l'heure de la TV est correcte,
   laisser false.
*/

const MODE_TV = false;


let donnees = {};

let photos = [];

let photoCourante = 0;


/* ==========================================================
   HORLOGE
========================================================== */

function mettreAJourHorloge(){

    const maintenant = new Date();


    /*
       Correction éventuelle de l'heure de la Smart TV
    */

    if(MODE_TV){

        maintenant.setHours(
            maintenant.getHours() + 1
        );

    }


    /* Heure */

    document.getElementById("heure").textContent =
        maintenant.toLocaleTimeString("fr-FR");


    /* Jour */

    const jour =
        maintenant.toLocaleDateString(
            "fr-FR",
            {
                weekday:"long"
            }
        );


    document.getElementById("jour").textContent =
        jour.charAt(0).toUpperCase() + jour.slice(1);


    /* Date */

    document.getElementById("date").textContent =
        maintenant.toLocaleDateString(
            "fr-FR",
            {
                day:"2-digit",
                month:"2-digit",
                year:"numeric"
            }
        );

}


/* ==========================================================
   CHARGEMENT DES DONNÉES
========================================================== */

async function chargerDonnees(){

    try{

        const response = await fetch(
            API_URL,
            {
                cache:"no-store"
            }
        );


        if(!response.ok){

            throw new Error(
                "Erreur HTTP : " + response.status
            );

        }


        donnees = await response.json();


        console.log(
            "DONNÉES SERFAM :",
            donnees
        );


        initialiserPage();


    }

    catch(erreur){

        console.error(
            "Erreur chargement SERFAM :",
            erreur
        );

    }

}


/* ==========================================================
   INITIALISATION
========================================================== */

function initialiserPage(){

    chargerUrgent();

    chargerCitation();

    chargerPhotos();

    chargerPlanning();

    chargerVitrine();

    chargerBandeau();

}


/* ==========================================================
   PHOTO
========================================================== */

async function chargerPhotos(){

    photos = [];

    if(
        Array.isArray(
            donnees.photosSerfam
        )
    ){

        const candidates =
            donnees.photosSerfam.filter(
                photo => photo
            );

        /* On teste chaque URL */
        for(const url of candidates){

            const imageTest =
                new Image();

            const valide =
                await new Promise(
                    resolve => {

                        imageTest.onload =
                            () => resolve(true);

                        imageTest.onerror =
                            () => resolve(false);

                        imageTest.src = url;

                    }
                );

            if(valide){

                photos.push(url);

            }

        }

    }


    if(photos.length === 0){

        console.warn(
            "Aucune photo SERFAM valide."
        );

        return;

    }


    photoCourante = 0;

    const image =
        document.getElementById(
            "photo-principale"
        );


    if(!image){

        return;

    }


    image.src =
        photos[0];

}


/* ==========================================================
   DIAPORAMA
========================================================== */

function photoSuivante(){

    if(photos.length <= 1){

        return;

    }


    const image =
        document.getElementById(
            "photo-principale"
        );


    if(!image){

        return;

    }


    photoCourante++;

    if(
        photoCourante >= photos.length
    ){

        photoCourante = 0;

    }


    const prochainePhoto =
        photos[photoCourante];


    image.classList.add(
        "fade-out"
    );


    setTimeout(

        () => {

            image.src =
                prochainePhoto;

            image.classList.remove(
                "fade-out"
            );

            image.classList.add(
                "fade-in"
            );


            setTimeout(

                () => {

                    image.classList.remove(
                        "fade-in"
                    );

                },

                800

            );

        },

        500

    );

}

/* ==========================================================
   PLANNING / RÉUNIONS
========================================================== */

function chargerPlanning(){

    const planning =
        document.getElementById(
            "planning"
        );


    if(!planning){

        return;

    }


    planning.innerHTML = "";


    /*
       Les données SERFAM utilisent actuellement
       "reunionsSerfam".

       On conserve donc cette source.
    */

    if(
        !Array.isArray(
            donnees.reunionsSerfam
        )
        ||
        donnees.reunionsSerfam.length === 0
    ){

        planning.innerHTML = `

            <div class="aucune-activite">

                Aucune activité prévue aujourd'hui.

            </div>

        `;

        return;

    }


    donnees.reunionsSerfam.forEach(
        reunion => {


            const ligne =
                document.createElement("div");


            ligne.className =
                "planning-card";


            /*
               Horaire
            */

            const debut =
                reunion.debut || "";


            const fin =
                reunion.fin || "";


            const horaire =
                debut && fin
                    ? `${debut} - ${fin}`
                    : debut || fin || "";


            /*
               Activité / formation

               On accepte plusieurs noms possibles
               afin de ne pas devoir modifier
               le Google Sheet.
            */

            const activite =
                reunion.formation ||
                reunion.reunion ||
                reunion.titre ||
                reunion.activite ||
                "";


            /*
               Salle

               Si "salle" existe :
               on l'utilise.

               Sinon on utilise "lieu".
            */

            const salle =
                reunion.salle ||
                reunion.lieu ||
                "";


            /*
               Formateur

               Le champ n'existe peut-être pas
               actuellement dans les données SERFAM.
            */

            const formateur =
                reunion.formateur ||
                reunion.formateurNom ||
                "";


            /*
               Couleur de la petite barre
            */

            let couleur =
                "#7A165B";


            /*
               Quelques couleurs selon le type
               d'activité.

               Cela reste volontairement discret.
            */

            const texteActivite =
                activite.toLowerCase();


            if(
                texteActivite.includes("réunion")
                ||
                texteActivite.includes("reunion")
            ){

                couleur =
                    "#1877F2";

            }


            else if(
                texteActivite.includes("formation")
            ){

                couleur =
                    "#7A165B";

            }


            else if(
                texteActivite.includes("supervision")
            ){

                couleur =
                    "#7AA73D";

            }


            ligne.innerHTML = `

                <div class="horaire-wrapper">

                    <span
                        class="couleur-salle"
                        style="background:${couleur}">
                    </span>

                    <span class="col-horaire">

                        ${horaire}

                    </span>

                </div>


                <span class="col-formation">

                    ${activite}

                </span>


                <span class="col-salle">

                    ${salle}

                </span>


                <span class="col-formateur">

                    ${formateur}

                </span>

            `;


            planning.appendChild(
                ligne
            );

        }
    );

}


/* ==========================================================
   INFORMATION IMPORTANTE
========================================================== */

function chargerUrgent(){

    const zone =
        document.getElementById(
            "urgent"
        );


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
        document.getElementById(
            "citation"
        );


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
        document.getElementById(
            "vitrine"
        );


    if(!vitrine){

        return;

    }


    vitrine.innerHTML = "";


    if(
        !Array.isArray(
            donnees.vitrineSerfam
        )
    ){

        return;

    }


    donnees.vitrineSerfam.forEach(
        bloc => {


            const div =
                document.createElement("div");


            div.innerHTML = `

                <h3>

                    ${bloc.titre || ""}

                </h3>


                <p>

                    ${bloc.texte || ""}

                </p>

            `;


            vitrine.appendChild(
                div
            );

        }
    );

}


/* ==========================================================
   BANDEAU
========================================================== */

function chargerBandeau(){

    const bandeau =
        document.getElementById(
            "bandeau"
        );


    if(!bandeau){

        return;

    }


    if(
        Array.isArray(
            donnees.bandeauSerfam
        )
    ){

        bandeau.textContent =
            donnees.bandeauSerfam.join(
                "   ●   "
            );

    }

    else{

        bandeau.textContent = "";

    }

}


/* ==========================================================
   DÉMARRAGE
========================================================== */


/* Horloge */

mettreAJourHorloge();


setInterval(
    mettreAJourHorloge,
    1000
);


/* Chargement initial */

chargerDonnees();


/* Actualisation des données */

setInterval(
    chargerDonnees,
    60000
);


/* Diaporama */

setInterval(
    photoSuivante,
    15000
);


/* ==========================================================
   SÉCURITÉ / CHARGEMENT
========================================================== */

window.addEventListener(
    "load",
    () => {

        console.log(
            "SERFAM TV prête"
        );

    }
);
