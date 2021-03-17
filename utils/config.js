require('dotenv').config

const PORT = process.env.PORT
const MONDODB_URI = process.env.MONDODB_URI

module.exports = {
    PORT, MONDODB_URI
}