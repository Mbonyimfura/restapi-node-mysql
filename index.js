const express=require('express')
const cors=require('cors');
const mysql=require('mysql');
require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json());

const port=process.env.PORT|| 5000;

const con=mysql.createConnection({
    host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})
//get all users
app.get('/',(req,res)=>{
    let sql='SELECT * FROM users';
    con.query(sql,(error,result)=>{
        if(error){
            console.error('MySQL Error:', error.message); 
            res.status(500).json({error});   
        }else{
            res.status(200).json(result)
        }
    })
})
//get single user
app.get('/user/:id',(req,res)=>{
    const id=req.params.id;
    const sql=`SELECT * FROM users WHERE id=${id}`;
    con.query(sql,(error,result)=>{
        if(error){
            res.status(500).json(error)
        }else{
            res.status(200).json(result)
        }
    })
})
//create user
app.post('/user',(req,res)=>{
    const {first_name,last_name,email,phone_number}=req.body;
    let sql=`INSERT INTO users (first_name,last_name,email,phone_number) VALUES ("${first_name}","${last_name}","${email}","${phone_number}")`;
    con.query(sql,(error,result)=>{
        if(error){
            res.status(500).json(error)
        }else{
            res.status(201).json({message:'User has been created',id:result.insertId });
        }
    })
})
//update user
app.patch('/user/:id',(req,res)=>{
    const id=req.params.id;
    const {first_name,last_name,email,phone_number}=req.body;
    const sql = `UPDATE users SET first_name=?, last_name=?, email=?, phone_number=? WHERE id=?`;
con.query(sql,[first_name,last_name,email,phone_number,id],(error,result)=>{
    if(error){
        res.status(500).json(error)
    }else{
        res.status(200).json({message:'UserInfo has been updatd',id:id})
    }
})
})
//delete  user
app.delete('/user/:id',(req,res)=>{
    const id=req.params.id;
    const sql=`DELETE  FROM users WHERE id=${id}`;
    con.query(sql,(error,result)=>{
        if(error){
            res.status(500).json(error)
        }else{
            res.status(200).json({message:'User is deleted successfully!',success:true})
        }
    })
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})