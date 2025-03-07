import conn from "../connection/conn.js";

// Query for user creation
export const createUser = async (name, email , passwordhash )=>{
    const query = 'INSERT INTO users (name,email,password) VALUES (?,?,?)';
    const result = await conn.execute(query,[name, email, passwordhash]);
    return result;
}

// query for finding user by email
export const findUserByEmail = async (email)=>{
    const query = 'SELECT *  FROM users WHERE email = ?';
    const [rows] = await conn.execute (query,[email]);
    return rows[0];
}


//   gettting user by id
export const getUserbyId = async(id)=>{
    const query = 'SELECT id , name, email FROM users WHERE id =?';
    const [rows] = await conn.execute(query, [id]);
    return rows[0];
}

// updating user
export const updateUserbyId = async(id,name,email)=>{
    const fieldstoupdate =[];
    const values =[];
    if(name){
        fieldstoupdate.push('name =?');
        values.push(name);
    }

    if(email){
        fieldstoupdate.push('email = ?');
        values.push(email);
    }
    if(fieldstoupdate.length == 0){
        throw new Error("No fields to update")
    }
    const query = `UPDATE users SET ${fieldstoupdate.join(' , ')} where id = ?`;
    values.push(id);
    const [result ] = await conn.execute(query,values);
    return result;
}

// deleting user
export const deleteUserbyId = async(id)=>{
    const query = 'DELETE FROM users where id =?';
    const [result] = await conn.execute(query,[id]);
    return result;
}

// viewing all user from database
export const getAlluser = async()=>{
    const query = 'SELECT * FROM users';
    const[rows]= await conn.execute(query);
    return rows;

}