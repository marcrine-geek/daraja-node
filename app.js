const express = require("express")
const request = require("request")
const bodyParser = require("body-parser")
const app = express();

//routes
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.send("Hello world")
})

app.get("/access_token", access, (req, res) => {
    res.status(200).json({access_token: req.access_token})
})


app.get("/register", access, (req, resp) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    let auth = "Bearer " + req.access_token

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "ShortCode": "600343 ",
                "ResponseType": " complete",
                "ConfirmationURL": "http://i196.207.18.98:8000/confirmation",
                "ValidationURL": "http://196.207.18.98:8000/validation_url"
            }
                
        
        },
        function(error, response, body){
            if(error) { console.log(error)}

            resp.status(200).json(body)
        }
    )
})

app.post("/confirmation", (req, res) => {
    console.log("..................confirmation............")
    console.log(res.body)
})

app.post("/validation", (req, res) => {
    console.log("............validation..........")
    console.log(res.body)
})

app.get("/simulate", access, (req, res) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate"
    let auth = "Bearer " + req.access_token

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json(
                "ShortCode":" 600343",
                "CommandID":"CustomerPayBillOnline",
                "Amount": " 100",
                "Msisdn":"254708374149 ",
                "BillRefNumber":"TestAPI "
            )
        },
        function(error, response, body){
            if(error){
                console.log(error)
            }
            else{
                res.status(200).json(body)
            }
        }
    )
})



function access(req, res, next){
    //access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    let auth = new Buffer("x2GOB3BoXx4yMwNNMEBoGkp4jONZNknE:4J6AftDYIGIyDU9s ").toString('base64');


    request(
        {
            url: url,
            headers: {
                "Authorization": "Basic " + auth
            }
        },
        (error, response, body) => {
            if(error){
                console.log(error)
            }
            else{
                req.access_token = JSON.parse(body).access_token
                next()
            }
        }
    )

}

//listen
app.listen(8000, (err, live) => {
    if(err){
        console.error(err)
    }

    console.log("server running on port 8000")
});