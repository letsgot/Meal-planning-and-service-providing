const jwt = require("jsonwebtoken");
const secrets = process.env.DB_LINK||require("../secrets");
const FooduserModel = require("../model/userModel");
const mailSender = require("../utilities/mailSender")
// ************************controller functions************************
async function signupController(req, res) {
    try {
        let data = req.body;
        console.log(data);
        // to create a document inside userModel
        let newUser = await FooduserModel.create(data);
        console.log(newUser);
        res.end("data recieved");
    } catch (err) {
        res.end(err.message);
    }
}

// game of status code important for interview 
async function loginController(req, res) {
    try {
        let data = req.body;
        let { email, password } = data;
        if (email && password) {
            let user = await FooduserModel.findOne({ email: email });
            if (user) {
                if (user.password == password) {
                    // create JWT ->-> payload, secret text 
                    // ,algorithms-> SHA256
                    const token = jwt.sign({
                        data: user["_id"],
                        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
                    }, secrets.JWTSECRET);
                    // put token into cookies
                    res.cookie("JWT", token);
                    // send the token 
                    delete user.password
                    delete user.confirmPassword
                    // before sending to frontend 
                    res.status(200).json({
                        user
                    });
                }
                else{
                    res.status(400).json({
                        result : "email and password does not match"
                    })
                }
            } else {
                res.status(404).json({
                    result : "user not found"
                })
            }
        } else {
            // res.end(" kindly enter email and password both");
            res.status(400).json({
                result : "user not found kindly signup"
            })
        }
    } catch (err) {
        // internal error
        res.status(500).json({
            result : err.message
        })
    }
}
async function resetPasswordController(req, res) {
    try {
        let { otp, password, confirmPassword, email } =
            req.body;
        // search -> get the user
        let user = await FooduserModel.findOne({email:email});
        let currentTime = Date.now();
        if (currentTime > user.otpExpiry) {
            delete user.otp
            delete user.otpExpiry
            await user.save();
            res.status(400).json({
                result: "Otp Expired"
            })
        } else {
            if (user.otp != otp) {
                res.staus(400).json({
                    result: "wrong otp"
                })
            } else {
                // //////////////////////////
                user = await FooduserModel.findOneAndUpdate(
                    { otp, email },
                    { password, confirmPassword },
                    {
                        runValidators: true,
                        new: true
                    });
                delete user.otp
                delete user.otpExpiry
                await user.save();
                //////////////////////////////////////////////////////////////
                res.status(201).json({
                    user: user,
                    message: "User password reset"
                })
            }
        }
        // key delete -> get the document obj -> modify that object by removing useless keys  
        // save to save this doc in db 
        console.log(user);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            result: err.message
        });
    }
}

async function forgetPasswordController(req, res) {
    try {
        // 1st method 
        // let { email } = req.body;
        // let afterFiveMin = Date.now() + 5 * 60 * 1000;
        // let otp = otpGenerator();
        // //    mail
        // // by default -> FindAndUpdate -> not updated send document, 
        // // new =true -> you will get updated doc
        // let user = await FooduserModel
        //     .findOneAndUpdate({ email: email },
        //         { otp: otp, otpExpiry: afterFiveMin },
        //         { new: true });
        // console.log(user);
        // res.json({
        //     data: user,
        //     "message": "Otp send to your mail"
        // })
        

        //another method
        let { email } = req.body;
        let user = await FooduserModel.findOne({email});
        if(user){
            let afterFiveMin = Date.now() + 5 * 60 * 1000;
            let otp = otpGenerator();
            await mailSender(email,otp);
            user.otp = otp;
            user.otpExpiry = afterFiveMin;
            await user.save();
            res.status(204).json({
                data : user,
                result : "otp send to your email"
            })
        }
        else{
            // 404 status code user not found
            res.status(404).json({
                result : "user with this email Id not found"
            })
        }
    } catch (err) {
        res.status(500).json({
            result : "Internal server error"
        })
    }
}
function protectRoute(req, res, next) {
    try {
        const cookies = req.cookies;
        const JWT = cookies.JWT;
        if (cookies.JWT) {
            console.log("protect Route Encountered");
            // you are logged In then it will 
            // allow next fn to run
            let token = jwt.verify(JWT, secrets.JWTSECRET);
            console.log("Jwt decrypted", token);
            let userId = token.data
            console.log("userId", userId);
            req.userId = userId;

            next();
        } else {
            res.send("You are not logged In Kindly Login");
        }
    } catch (err) {
        console.log(err);
        if (err.message == "invalid signature") {
            res.send("TOken invalid kindly login");
        } else {

            res.send(err.message);
        }
    }

}
// ******************helper function************************************************
function otpGenerator() {
    return Math.floor(100000 + Math.random() * 900000);
}
// user update
// delete

module.exports = {
    signupController,
    loginController,
    resetPasswordController,
    forgetPasswordController,
    protectRoute
}