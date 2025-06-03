import express from 'express';

import { PORT } from './config/env.js';

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to subs-track API')
});

app.listen(PORT, () => {
    console.log(`Subs-track API is running on https://localhost:${PORT}`)
})

export default app;