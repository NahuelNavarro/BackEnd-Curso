import nodemailer from 'nodemailer'
  trasporter = nodemailer.createTransport(
    {
        service:"gmail",
        port: "587",
        auth:{
            user:"navarronahuelezequiel@gmail.com",
            pass: "weaisaorqlkoqwhm"
        }
    }
)

trasporter.sendMail(
    {
        from:"ecommerce navarronahuelezequiel@gmail.com",
        to:"navarronahuelezequiel@gmail.com",
        subject:"prueba",
        html:`<h2>mensaje prueb</h2>`

}
).then(resultado=>console.log(resultado))
