import MessageModel from "./schema.js";
import lodash from "lodash";
import amqp from "amqplib/callback_api.js";
import axios from "axios";
import { busController } from "../../lib/middlewares/buscontroller.js";

// creaiamo la funzione utile a gestire le richieste dirette al DB principale.

export const sendMessage = async(req, res, next) => {
    const message = req.body.message;

    const valuesArray = message.map((v) => v.value); //recuperiamo tutti i valori con chiave "value" e li salviamo in un array

    const sumValues = lodash.sum(valuesArray).toString(); //eseguiamo la somma dei valori e prepariamo il risultato per il bus messangere

    try {
        const newMessage = new MessageModel(req.body);

        const { _id } = await newMessage.save();

        //restituiamo al frontend solo l'indicazione dell'id del singolo messaggio
        res.send({ _id });

        const id = _id.toString(); //eseguo il parsing dell'oggetto _id

        const data = await getMessage(id); // uso l'id per recuperare il record appena salvato

        const msg = { id: data._id, value: sumValues };

        console.log("msg inviato al BUS queue", { msg });

        if (!id || !sumValues) {
            console.log("waiting for a message");
        } else {
            busController(msg);
        }

        // ============== recall del dato appena archiviato nel DB ==========
        async function getMessage(id) {
            try {
                const response = await axios.get(`http://localhost:3000/message/${id}`);
                return response.data;
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        next(error);
    }
};

// funzione backend per restituire l'item richiesto
export const getMessagesById = async(req, res, next) => {
    try {
        const thisMessage = await MessageModel.findById(req.params.id);
        if (!thisMessage) {
            console.log("impossible to find");
            next();
        } else {
            res.send(thisMessage);
        }
    } catch (error) {
        next(error);
    }
};

// funzione BUS controller dei messaggi