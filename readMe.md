Questo codice è creato su specifica richiesta di Algorab ed è finalizzato a sostenere alcune semplici richieste di consumo API gestite con Microservizi e BUS, impiegando un DB principale e un DB secondario (satellite).

Modalita' di utilizzo - 
Attualmente il codice è nella fase di sviluppo, ma alcune funzioni sono già funzionanti e possono essere testate.
Si tratta di un sistema che, utilizzando RabbitMQ come gestore dei messaggi, distribuisce comandi e eventi a due servizi separati.
Poichè il codice non è ancora "Dockerizzato", per testare il funzionamento procedere nel seguente modo:
1) clonare il codice in locale
2) aprire un terminale e scaricare le librerie node nel seguente modo -> digitare    npm install
3) creare un file .env nella root principale e inserire le variabili primarie di connessione al database MongoDB con la seguente forma MONGO_CONNECTION_STRING="inserire qui la stringa di connessone". il codice, in assenza di una stringa di connessione, connette a MongoDB in localhost e quindi in tal caso, assicurarsi che questo sia avviato sulla propria macchina
4) nel terminale digitare    npm run dev e attendere l'esposizione della table che raggruppa gli endpoints
5) testare il funzionamento utilizzando Postman (a breve sarà disponibile un frontend) aprendo 
    una richiesta di tipo POST 
    al seguente url: "http://localhost:3000/message", 
    con il seguente body 
                {"message":[
                  {"value":10},
                  {"value":30}
                          ]}
                          
6) il codice restuisce un _id rappresentatico del messaggio inviato e aggiunto al DB
7) la console mostra il contenuto del messaggio inviato alla coda

Testare la ricezione del messaggio - 

Se si vuole verificare la corretta ricezione del messaggio occorre procedere come segue:
1) clonare il repository 
