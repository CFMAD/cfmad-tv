function updateClock(){
 const now = new Date();
 document.getElementById('clock').innerText =
    now.toLocaleString('fr-FR');
}

setInterval(updateClock,1000);
updateClock();

const API_URL =
'https://script.google.com/macros/s/AKfycbzoSPWRJw0C23NtO1U-EvONul-meqZKeEkA0x0rg1FPiNFlsiFFDsttq9QsXYl_cN732Q/exec';

async function loadData(){

 try{

   const response = await fetch(API_URL);
   const data = await response.json();

   let html =
   '<tr><th>Horaire</th><th>Formation</th><th>Salle</th><th>Formateur</th></tr>';

   data.planning.forEach(item => {

      html += `
      <tr>
        <td>${item.horaire}</td>
        <td>${item.formation}</td>
        <td>${item.salle}</td>
        <td>${item.formateur}</td>
      </tr>`;
   });

   document.getElementById('planning').innerHTML = html;

   document.getElementById('messages').innerHTML =
      data.messages.join('<br><br>');

   document.getElementById('quote').innerText =
      data.citation;

   document.getElementById('ticker').innerText =
      data.bandeau;

   if(data.urgent){

      document.getElementById('urgent').innerHTML =
      `<div class="urgent">
        ⚠ ${data.urgent}
      </div>`;
   }

 }catch(error){

   console.error(error);

 }

}

loadData();

setInterval(loadData,300000);