const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnRGMvStHydQqQDf08CHVrd4C0w-lUgsqFeyzc098_TSbfDoVM2CA6WjyC29yNDumWEDz6bhQnMPdD09I_tNyWgRAnfNwBCEkVmkTfjdIT60-mtj7yd_gDxBqHljHk2Gxrz0SOty325oXFFrlv6O81M1ULi0w6-dQodUVajq-4uX-Zs8eU5MC0d07lCywK_Bh_v7V72AZKo4Egei1-YHYR3JfPNIEs0OCLoAeSPQz3ULRkRtdubX9P6tQsmkXS1Kl-Xt1Cqj2vwGQlfhEzg7M_U5Wnr18Q&lib=M5k8RhdxgLMqvnc5xtfdZ_hrz-EcdL9gh";

async function chargerDonnees() {

    try {

        const response = await fetch(API_URL);
        const data = await response.json();

        // SLOGAN
        document.getElementById("slogan").textContent =
            data.slogan || "";

        // URGENT
        document.getElementById("urgent").textContent =
            data.urgent || "";

        // CITATION
        document.getElementById("citation").textContent =
            data.citation || "";

        // FACEBOOK
        document.getElementById("facebook-link").innerHTML =
            data.facebook
                ? `<a href="${data.facebook}" target="_blank">${data.facebook}</a>`
                : "";

        // PLANNING
        afficherPlanning(data.planning || []);

    } catch (erreur) {

        console.error(erreur);

        document.getElementById("planning").innerHTML =
            "Erreur de chargement";

    }

}

function afficherPlanning(planning) {

    const container = document.getElementById("planning");

    container.innerHTML = "";

    planning.forEach(item => {

        const ligne = document.createElement("div");

        ligne.innerHTML = `
            <strong>${item.debut} - ${item.fin}</strong><br>
            ${item.formation}<br>
            ${item.salle}<br>
            ${item.formateur}
            <hr>
        `;

        container.appendChild(ligne);

    });

}

function mettreAJourHorloge() {

    const maintenant = new Date();

    document.getElementById("heure").textContent =
        maintenant.toLocaleTimeString("fr-FR");

    document.getElementById("date").textContent =
        maintenant.toLocaleDateString("fr-FR");

}

chargerDonnees();

mettreAJourHorloge();

setInterval(mettreAJourHorloge, 1000);
