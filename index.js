const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const PORT = process.env.PORT ||8000 // deploy Heroku

const app = express()

//sites to scrape information
const newspapers = [
    {
        name: 'thetimes',
        address: 'http://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telepraph.co.uk/climate-crisis',
        base: 'https://www.telepraph.co.uk'
    }
    
]

const articles = []

//to get the html on the terminal, pick up elements
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        //to get the html on the terminal, pick up elements
        const $ = cheerio.load(html)
        //pick a element that contains the climate change subject
        $('a:contains("climate")', html).each(function(){
            //get the text from a tag
            const title = $(this).text()
            //get the link from the a tag
            const url = $(this).attr('href')
            //push to the array
            articles.push({ 
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
            res.json(articles)
        })
    }).catch((err) => console.log(err))

})

app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})
//getting an individual news source by parameter
app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address

    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("climate")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            //push to the array
            specificArticles.push({ 
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch((err) => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))