import amqp from "amqplib/callback_api.js";

export const busController = (msg) => {
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

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
        });
    });
};