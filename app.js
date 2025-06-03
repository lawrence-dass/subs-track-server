import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to subs-track API')
});

app.listen(3000, () => {
    console.log('Subs-track API is running on https://localhost:3000')
})

export default app;