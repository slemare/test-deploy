const express = require('express')
const hbs     = require('hbs')
const fs      = require('fs')

const port = process.env.PORT || 3000

var app = express()

// Setup Configurations
hbs.registerPartials(__dirname + '/views/partials') //@@
app.set('view engine', 'hbs')   // This accepts key value pairs with what to set and what to set it to.
                                // 'views' is the default directory that express uses for templates



// Middleware
//___________

// Create some middleware to log user request details
app.use((req, res, next) => {
    let now = new Date().toString()
    let log = `${now}: ${req.method} ${req.url}`
    console.log(log)
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log')
        }
    })
    next()
})

// This has to go after the above as middleware is run in the order it appears
// app.use((req, res, next) => {
//     res.render('maintenance.hbs')
// })

app.use(express.static(__dirname + '/public'))     
                            // Built in middleware. The function is taken from the Express object,
                            // it just serves up a directory. 'express.static' gives the absolute
                            // path to the directory we want toerve up. '__dirname' gives the path
                            // from the root directory to our directory.
                            // We will also provide some middleware of our own


// A Helper is a function that returns something that will get rendered
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase()
})

// This is a route - an incoming request to an address, in this case '/'
// When we receive this url this route specifies what we want to do
app.get('/', (req, res) => res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website',
        currentYear: new Date().getFullYear()
    })
)

// Another address within our web site
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        currentYear: new Date().getFullYear()
    })
})

// Set the app to listen to a port for a local setup. (This will change when we want to deploy)
app.listen(port, () => console.log(`Server is up on port: ${port}`))


