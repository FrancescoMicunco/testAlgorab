import MessageModel from "./schema.js";

// creaiamo la funzione utile a gestire le richieste dirette al DB principale.

export const sendMessage = async(req, res, next) => {
    try {
        const newMessage = new MessageModel(req.body);

        const { _id } = await newMessage.save();
        //restituiamo al frontend solo l'indicazione dell'id del singolo messaggio
        res.send({ _id });
    } catch (error) {
        next(error);
    }
};