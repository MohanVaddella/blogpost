import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const { JWT_SECRET } = process.env;


export const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        res.status(201).json({ message: 'User registered successfully', userId: userCredential.user.uid });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = jwt.sign({
            userId: userCredential.user.uid,
            email: userCredential.user.email
        }, JWT_SECRET, { expiresIn: "1h" });
        
        res.status(200).json({
            msg: "Login Successful...!",
            email: userCredential.user.email,
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
