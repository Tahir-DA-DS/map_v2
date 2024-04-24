const express = require("express")
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const customerRouter = require('./router/customerData');
const paymentRouter = require('./router/paymentConfirmation')
const port = process.env.PORT || 3000



app.use(bodyParser.json())

app.use(cors())
app.use('/', customerRouter)
app.use('/', paymentRouter)

// await dbConnection.connect(function(err) {
//         if (err) {
//             console.error('Error connecting to the database: ' + err.stack);
//             return;
//         }
    
       
//         console.log('Connected to database with ID ' + dbConnection.threadId);
//     });
   

// process.on('SIGINT', () => {
//         dbConnection.end((err) => {
//             if (err) {
//                 return console.log('error:' + err.message);
//             }
//             console.log('Database connection closed');
//         });
//     });
app.listen(port, ()=>{
    console.log(`app listening on port ${port} `);
})



