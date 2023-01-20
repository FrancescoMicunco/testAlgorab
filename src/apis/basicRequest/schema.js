import mongoose from "mongoose";
import uniqid from "uniqid";

const { Schema, model } = mongoose;

// Creaiamo un modello di dati con l'ausilio di Mongoose in modo dagestire le richieste dal frontend.
// Nel nostro caso si tratta di un array di oggetti, che può essere assimilato ad un carrello di un e-commerce
const Message = new Schema({
    message: [{
        idReference: { type: String, default: uniqid() }, //usiamo uniqid per generare un nostro id unico, indipendente dall'_id assegnato da Mongo
        value: { type: Number },
    }, ],
}, { timestamp: true });

export default model("Message", Message);