const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const auth = require('./middleware')

const router = express.Router()

//Sign Up route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email})
        if (user) {
            return (
                res.status(400).json({ message: 'User already exist'})
            )
        }
        //Hashing password
        const hashed = await bcrypt.hash(password, 10)

        //User saving
        user = new User({ username, email, password: hashed})
        await user.save()
        res.status(201).json({ message: 'User successfully created!'})
    }
    catch (error) {
        res.status(500).json({message: 'Server error'})
    }
})

//Route Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        //Finding user
        const user = await User.findOne({ email })
        if (!user) {
            return(
                res.status(400).json({ message: 'Invalid email or password'})
            )
        }
        //Password checking
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return (
                res.status(400).json({ message: 'Invalid email or password'})
            )
        }

        //Token generatng
        const token = jwt.sign({ id: user._id},  'secret', {expiresIn: '1hr' })
        res.json({token})
    }
    catch(error) {
        res.status(500).json({ message: 'Internal server ero '})
    }
})

//Protected route to get user details
router.get('/user', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) {
            res.status(404).json({message: 'User not found Sing up'})
        }
        res.json({ username: user.username, email: user.email})
    }
    catch (error){
        res.status(500).json({ message: 'Internal server error'})
    }
})
module.exports = router