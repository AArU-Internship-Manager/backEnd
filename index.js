const express = require('express');
const cors = require('cors')
const app = express();
const port = 3000;
app.use(cors())
app.use(express.json());
const loginRouter = require('./routes/loginApi')
const adminRouter = require('./routes/adminApi')
const studentRouter = require('./routes/studentApi')
app.use('/login', loginRouter)
app.use('/admin', adminRouter)
app.use('/student', studentRouter)


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})