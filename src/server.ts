import express from 'express';
const app = express();


import scrappedJobRouter from './routes/job.routes';
import filterJobRouter from './routes/filter.routes';

app.use('/filter', filterJobRouter);
app.use('/job', scrappedJobRouter);

const port = process.env.PORT || 5000;
app.listen(port, ()=> {
    console.log("server is running on port " + port + "✅");
})
