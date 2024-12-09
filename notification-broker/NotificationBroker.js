const express = require('express');

const app = express();
const port = 3000;

// Middleware to parse JSON body of the request
app.use(express.json());

// Define a POST endpoint that will handle incoming notifications
app.post('/notify', (req, res) => {
    console.log("Logged req object : ",req)
    console.log('res body : ', req.body)
    const message = req.body;  // Get the message from the payload
    if (!message) {
        return res.status(400).send('Message is required');
    }
    console.log('Received notification message : ', message);

    // You can now trigger any logic to notify the frontend
    // For example, sending a push notification, updating the UI, etc.

    // For now, let's just send a response back to the Spring Boot app
    res.status(200).send('Notification received');
});

app.get("/notification")

// Start the server
app.listen(port, () => {
    console.log(`Frontend API listening on http://localhost:${port}`);
});
