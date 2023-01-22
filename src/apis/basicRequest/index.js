import MessageModel from "./schema.js";
import lodash from "lodash";

// creaiamo la funzione utile a gestire le richieste dirette al DB principale.

export const sendMessage = async(req, res, next) => {
    const message = req.body.message;
    const valuesArray = message.map((v) => v.value);
    const totalValues = lodash.sum(valuesArray);

    try {
        const newMessage = new MessageModel(req.body);

        const { _id } = await newMessage.save();
        //restituiamo al frontend solo l'indicazione dell'id del singolo messaggio
        res.send({ _id });
    } catch (error) {
        next(error);
    }
};