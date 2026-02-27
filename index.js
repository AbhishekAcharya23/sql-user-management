const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app= express();
const path = require("path");
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended:true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Abhiwon@2429c'
});

let getRandomUser= ()=> {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
 ];
}

let q = "INSERT INTO user (id, username, email, password)VALUES ?";

let data=[];

for(let i=0; i<=100; i++){
    data.push(getRandomUser());
}





app.get("/", (req,res)=>{
    let q = `SELECT count(*) FROM user`;
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let count = result[0]['count(*)'];
            res.render("home.ejs",{count});
        });
    }catch(err){
        console.log(err);
        res.send("some error in DB");
    }
    
})

app.get("/user",(req,res)=>{
    let q=`SELECT * FROM user`;

    try{
        connection.query(q, (err, users)=>{
            if(err) throw err;
            // console.log(result);
            // res.send(result);
            res.render("showusers.ejs", {users});
        });
    }catch(err){
        console.log(err);
        res.send("some error in DB");
    }
})

app.get("/user/:id/edit",(req,res)=>{  
    let { id }= req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    

    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let user = result[0];
            // res.send(result);
            res.render("edit.ejs", {user});
        });
    }catch(err){
        console.log(err);
        res.send("some error in DB");
    }
})

app.patch("/user/:id", (req, res)=>{
    let { id }= req.params;
    let { password : formPass, username: newUsername} = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;

    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let user = result[0];
            
            if( formPass!= user.password) {
                res.send("WRONG password");
            }else {
                let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
                connection.query(q2, (err, result)=>{
                    if(err)throw err;
                    res.redirect("/user");
                })
            }
            
            // res.send(result);
            // res.render("edit.ejs", {user});
        });
    }catch(err){
        console.log(err);
        res.send("some error in DB");
    }
})

app.post("/user", (req, res)=>{
    res.render("newuser.ejs");
})

// app.post("/user/add",(req,res)=>{
//     let id = faker.string.uuid();
//     let { password : formPass, username: newUsername, email: newEmail} = req.body;

//     // console.log(id);
//     // console.log(formPass);
//     // console.log(newUsername);

//     let q3 = `INSERT INTO user (id, email, username, password) VALUES (?, ?, ?, ?)`;
//     try{
//         connection.query(q3,[id, newEmail, newUsername, formPass], (err, result)=>{
//             if(err) throw err;
//             let user = result[0];
            
//         });
//     }catch(err){
//         console.log(err);
//         res.send("some error in DB");
//     }
//     res.redirect("/user");
// })

app.post("/user/add", (req, res)=>{
    let id = faker.string.uuid();
    let {username, password, email} = req.body;
    let q3 = `INSERT INTO user (id, username, email, password) VALUES(?, ?, ?, ?)`;

    try{
        connection.query(q3, [id, username, email, password], (err, result)=>{
            if(err) throw err;
            console.log(result);
            res.redirect("/user");
            
        });
    }catch(err){
        console.log(err);
        res.send("some error in DB");
    }
})


app.delete("/user/:id", (req, res)=>{
    
    let { password: userPass} = req.body;
    console.log(userPass);
    let { id }= req.params;
    let q4 = "SELECT * FROM user WHERE id=?";
    try{
        connection.query(q4, [id], (err, result)=>{
            if(err) throw err;
            
            // console.log(result);
            let password = result[0].password;
            console.log(password);

            if(userPass != password){
                res.send("WRONG password");
            }else {
                let q5 = "DELETE FROM user WHERE id = ?";
                try{
                    connection.query(q5, [id], (err, result)=>{
                        if(err) throw err;
                        res.redirect("/user");
                    }); 
                }catch(err){
                    console.log(err);
                    res.send("some error in DB");
                }
        } 
    });
    }catch(err){
        console.log(err);
        res.send("some error in DB");
    }
})

app.post("/user/:id/delete", (req, res)=>{
    
    let { id }= req.params;
    console.log(id);

    let q3 = "SELECT * FROM USER WHERE id=?";
    

    try{
        connection.query(q3, [id], (err, result)=>{
            if(err) throw err;
            
            let user = result[0];
            console.log(user);
            res.render("deleteuser.ejs",  {user} );
            // res.redirect("/user");
            // res.render("edit.ejs", {user});
        });
    }catch(err){
        console.log(err);
        res.send("some error in DB");
    }
})
//     let q5 = `DELETE FROM user WHERE id = ${id}`;

//     try{
//         connection.query(q5, (err, result)=>{
//             if(err) throw err;
//             // let user = result[0];
//             res.redirect("/user");
//             // res.render("edit.ejs", {user});
//         });
//     }catch(err){
//         console.log(err);
//         res.send("some error in DB");
//     }
// })

app.listen("8080", () =>{
    console.log("server is listening to port 8080")
})

// try{
//     connection.query(q, [data], (err, result)=>{
//     if(err) throw err;
//     console.log(result);
//     });
// }catch(err){
//     console.log(err);
// }


