const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const PORT = 8000 

const app = express()

app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/news', () => {
    axios.get('https://www.theguardian.com/environment/climate-crisis')
    .then((response) => {
        const html = response.data
        console.log(html)
    })
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))