const express = require("express") 
const cors = require("cors")

const app =express()
var bodyparser = require("body-parser")
const port = 3000
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(cors())

     app.post("/users/registration", (req,res)=>{
      let data = req.body
      console.log(data)
      if(data.firstName =="waseem"&& data.lastName =="ali" && data.Birthday=="11/08/2002"&& data.gender=="Male"&& data.email=="waseemalishaik64@gmail.com" && data.password=="WASEEM321" && data.Subject=="2")
        {
       res.send({message:"your registration is successfull"})
      }
      else 
      {
      res.send({message:"resgistration failed,try again!!"})    
      }
      })

app.post("/users/login" , (req,res)=> {
let data =req.body 
if (data.email==='waseem' && data.password==='630') 
    
    res.send({message:"your login is successful"})
else
    res.send({message:"Invalid username/password"})

})

app.post("/users/findajob")








app.listen(port,()=>{

    
console.log("listening to your port",port)


})