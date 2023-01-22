import MessageModel from "./schema.js";
import lodash from "lodash";
import amqp from "amqplib/callback_api.js";

// creaiamo la funzione utile a gestire le richieste dirette al DB principale.

export const sendMessage = async(req, res, next) => {
    const message = req.body.message;
    const valuesArray = message.map((v) => v.value);
    const sumValues = lodash.sum(valuesArray).toString();
    if (sumValues) {
        busController(sumValues);
    }

    try {
        const newMessage = new MessageModel(req.body);

        const { _id } = await newMessage.save();
        //restituiamo al frontend solo l'indicazione dell'id del singolo messaggio
        res.send({ _id });
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