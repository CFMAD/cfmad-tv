const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnTX635-HGOZAyuYBNOgIU5rL4l_SM-BLmgEWovaMJLqPw0a9ksL0ZN40SkBBdXO7UBd4gc7kKYfmHl99TWp0c-n1IM9lTSSVVV9FpbESVVAgUO8pfMuJxRaGWXacSAHnjvf7GMtYejBDo0sXgaaaV-XY6Ajew7mLFEmhUBztuc-bqQkR3iFkcDrgbAdG4cUwc8yWUYIxHPcB9H79Wa2XY-wHkydjGxO2Nlqz4o93C-ZA_hKRREXc4Qg46I5qts7cHzorFZM_gSQkln3w0ykujdIW8O3cA&lib=M5k8RhdxgLMqvnc5xtfdZ_hrz-EcdL9gh";

async function chargerDonnees() {

    try {

        const response = await fetch(API_URL);
        const data = await response.json();

        console.log("DONNEES", data);

        // slogan
        document.getElementById("slogan").textContent =
            data.slogan || "";

        // urgent
        document.getElementById("urgent").textContent =
            data.urgent || "";

        // citation
        document.getElementById("citation").textContent =
            data.citation || "";

        // photo
        if (data.photos && data.photos.length > 0) {
            document.getElementById("photo-principale").src =
                data.photos[0];
        }

        // facebook
        if (data.facebook) {
            document.getElementById("facebook-link").innerHTML =
                `<a href="${data.facebook}" target="_blank">${data.facebook}</a>`;
        }

        // bandeau bas
        if (Array.isArray(data.bandeau)) {
            document.getElementById("bandeau").textContent =
                data.bandeau.join(" | ");
        }

        // planning
        const planning = document.getElementById("planning");
        planning.innerHTML = "";

        if (Array.isArray(data.planning)) {

            data.planning.forEach(item => {

                const ligne = document.createElement("div");

let couleur = "#4ea72e";

switch(item.salle){

case "Salle de cours":
couleur = "#4ea72e";
break;

case "Salle Solidarité":
couleur = "#ff33cc";
break;

case "Cuisine":
couleur = "#ff0000";
break;

case "Salle Hygiène":
couleur = "#ffff00";
break;

case "Salle Manutention":
couleur = "#38c3f3";
break;

case "Salle des profs":
couleur = "#aeaeae";
break;

}

ligne.className = "planning-card";

ligne.style.borderLeft =
`12px solid ${couleur}`;

ligne.innerHTML = `
<span class="col-horaire">${item.debut} - ${item.fin}</span>
<span class="col-classe">${item.classe}</span>
<span class="col-formation">${item.formation}</span>
<span class="col-salle">${item.salle}</span>
<span class="col-formateur">${item.formateur}</span>
`;
              
                
                planning.appendChild(ligne);
            });

        }

        // vitrine
        const vitrine = document.getElementById("vitrine");
        vitrine.innerHTML = "";

        if (Array.isArray(data.vitrine)) {

            data.vitrine.forEach(bloc => {

                const div = document.createElement("div");

                div.innerHTML = `
                    <h3>${bloc.titre}</h3>
                    <p>${bloc.texte}</p>
                `;

                vitrine.appendChild(div);
            });

        }

    } catch (e) {

        console.error(e);

    }
}

function mettreAJourHorloge() {

    const maintenant = new Date();

    const heure =
        maintenant.toLocaleTimeString("fr-FR");

    const date =
        maintenant.toLocaleDateString("fr-FR");

    document.getElementById("heure").textContent = heure;
    document.getElementById("date").textContent = date;
}

mettreAJourHorloge();
setInterval(mettreAJourHorloge, 1000);

chargerDonnees();
setInterval(chargerDonnees, 60000);
