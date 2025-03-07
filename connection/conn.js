import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// creating database connection pool
const conn =  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password : process.env.DB_PASS,
    database: process.env.DB_NAME,
})

// testing the connection

async function testConnection() {
    try {
        const [rows] = await conn.query("SHOW DATABASES");
        console.log("Connection to my sql successful. Available Databases:", rows);
    } catch (error) {
        console.log("Error connection to database",error);
    }
}
testConnection();

export default conn;