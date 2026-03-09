const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://kozoo7.github.io',
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const rawName = typeof req.body.name === 'string' ? req.body.name : '';
        const rawEmail = typeof req.body.email === 'string' ? req.body.email : '';
        const rawMessage = typeof req.body.message === 'string' ? req.body.message : '';

        const name = rawName.trim().slice(0, 200);
        const email = rawEmail.trim().slice(0, 200);
        const message = rawMessage.trim().slice(0, 5000);

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email and message are required.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Please provide a valid email address.' });
        }

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'noahadallah1@gmail.com', // Your email
            subject: `Portfolio contact from ${name}`,
            text: `
Name: ${name}
Email: ${email}
Message: ${message}
            `,
            html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
