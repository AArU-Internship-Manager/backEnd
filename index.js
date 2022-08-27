const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
const loginRouter = require('./routes/loginApi')
const adminRouter = require('./routes/adminApi')

app.use('/login', loginRouter)
app.use('/admin', adminRouter)


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})