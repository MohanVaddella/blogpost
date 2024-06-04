// userController.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

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
        const token = await userCredential.user.getIdToken();
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
