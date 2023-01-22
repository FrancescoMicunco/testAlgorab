import MessageModel from "./schema.js";
import lodash from "lodash";
import amqp from "amqplib/callback_api.js";
import axios from "axios";

// creaiamo la funzione utile a gestire le richieste dirette al DB principale.

export const sendMessage = async(req, res, next) => {
    const message = req.body.message;
    console.log("message => ", message);
    const valuesArray = message.map((v) => v.value); //recuperiamo tutti i valori con chiave "value" e li salviamo in un array
    const sumValues = lodash.sum(valuesArray).toString(); //eseguiamo la somma dei valori e prepariamo il risultato per il bus messangere

    const msg = { value: sumValues };
    console.log("msg =>", msg);

    // if (!sumValues) {
    //     console.log("waiting for a message");
    // } else {
    //     busController(msg);
    // }

    try {
        const newMessage = new MessageModel(req.body);

        const { _id } = await newMessage.save();
        //restituiamo al frontend solo l'indicazione dell'id del singolo messaggio
        res.send({ _id });
        const id = _id.toString();

        getMessage(id);
        // ============== recall del dato appena archiviato nel DB ==========
        async function getMessage(id) {
            try {
                const response = await axios.get(`http://localhost:3000/message/${id}`);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        next(error);
    }
};

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

const busController = (msg) => {
    amqp.connect("amqp://localhost", function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            const queue = "sum";

            channel.assertQueue(queue, { durable: false });

            channel.sendToQueue(queue, Buffer.from(msg));
        });
    });
};