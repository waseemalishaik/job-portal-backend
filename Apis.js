 
 
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const { error } = require('console');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: "mysql.avishkarindustries.com",
    user: "flh_user2",
    password: "z3M5-gQDX_Ba!8[23",
    database: "flh_student"
});

// Connecting to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

app.get('/',(req,res)=>{
    res.send("Welcome to Express Server")
})

app.get('/jobs', (req, res) => {
    db.query("SELECT * FROM waseem_jobprotal", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

//create users
app.post('/Recruiter_Register',(req,res) => { 

  const { Name , Email, Password, Repeatpassword } = req.body;
    const Role= "recruiter"
    console.log(req.body);
    const query = 'INSERT INTO waseem_users ( Name, Email, password, Repeatpassword , Role) VALUES (?,?,?,?,?)'; 
      
      db.query(query,[ Name, Email , Password, Repeatpassword, Role ], (err,result) =>{

            if (err) {
                console.log(err)
                return res.status(500).json({ error: 'error creating users'});
            }
            res.status(201).json({message: 'user created', userId: result.insertId});

      });

});
 
// Job Posting API
app.post('/job-post', (req, res) => {
  console.log(req.body);

  const { JobTitle, CompanyName, Location, JobType, SalaryRange, JobDescription, RequiredSkills, ContactEmail } = req.body;

  if (!	JobTitle || !CompanyName || !Location || !JobType || !SalaryRange || !JobDescription|| !RequiredSkills || !ContactEmail)  {
      // return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO `waseem_jobs` (	JobTitle, CompanyName, Location, JobType, SalaryRange, JobDescription, RequiredSkills, ContactEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [	JobTitle, CompanyName, Location, JobType, SalaryRange, JobDescription, RequiredSkills, ContactEmail], (err, result) => {
      if (err) {
          console.error('Error inserting job:', err);
          return res.status(500).json({ error: 'Error Posting Job' });
      }
      res.status(201).json({ message: 'Job posted successfully', jobId: result.insertId });
  });
});








// Seeker_Registration

app.post('/JobSeeker_Register',(req,res) => { 

  const { name, phone, email, password, education } = req.body;
    const Role= "JobSeeker"
    console.log(req.body);
    const query = 'INSERT INTO waseem_users ( Name, PhoneNumber, Email, password, Education , Role) VALUES (?,?,?,?,?,?)'; 
      
      db.query(query,[ name, phone, email , password, education, Role ], (err,result) =>{

            if (err) {
                console.log(err)
                return res.status(500).json({ error: 'error creating users'});
            }
            res.status(201).json({message: 'user created', userId: result.insertId});

      });

});






// Read all users
app.get('/waseem_users', (req, res) => {
    const query = 'SELECT * FROM waseem_users';
   
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Error fetching users' });
      }
      res.status(200).json(results);
    });
  });



app.post('/login', (req, res) => {
  const { Emailaddress, Password } = req.body;

  if (!Emailaddress || !Password) {
      return res.status(400).json({ error: "Email and Password are required" });
  }

  const query = "SELECT * FROM waseem_users WHERE Email = ?";

  db.query(query, [Emailaddress], (err, result) => {
      if (err) {    
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.length === 0) {
          return res.status(401).json({ error: "Invalid username or password" });
      }

     
      if (result[0].Password === Password) {
          return res.json({ message: "Your login was successful",result });
      } else {
          return res.status(401).json({ error: "Invalid username or password" });
      }
  });
});


app.put('/edit-job/:id', (req, res) => {
  const jobId = req.params.id;  // URL se job ID lena
  const { JobTitle, CompanyName, Location, JobType, SalaryRange, JobDescription, RequiredSkills, ContactEmail } = req.body;

  if (!JobTitle || !CompanyName || !Location || !JobType || !SalaryRange || !JobDescription || !RequiredSkills || !ContactEmail) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `UPDATE waseem_jobs 
                 SET JobTitle = ?, CompanyName = ?, Location = ?, JobType = ?, SalaryRange = ?, JobDescription = ?, RequiredSkills = ?, ContactEmail = ? 
                 WHERE Id = ?`;

  db.query(query, [JobTitle, CompanyName, Location, JobType, SalaryRange, JobDescription, RequiredSkills, ContactEmail, jobId], (err, result) => {
      if (err) {
          console.error('Error updating job:', err);
          return res.status(500).json({ error: 'Error updating job' });
      }
      res.status(200).json({ message: 'Job updated successfully' });
  });
});
app.listen(4000, () => console.log("Server running on port 4000"));