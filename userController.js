import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import jwt from 'jsonwebtoken';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseConfig from './config.js';

import dotenv from 'dotenv';
dotenv.config();

const { JWT_SECRET } = process.env;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const usersCollection = collection(db, 'users');


export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    console.log('Received request to register user:', req.body);

    try {
        //const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await addDoc(usersCollection, {
            uid: userCredential.user.uid,
            email: userCredential.user.email
        });
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
