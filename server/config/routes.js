var mongoose = require('mongoose')
    Order = mongoose.model('Order')
    Team = mongoose.model('Team')
    User = mongoose.model('User')
var projects = require('../controllers/users.js')
const path = require('path')
module.exports = function(app) {
    app.get('/project/home', function(req, res) {
        projects.index(req, res)
    })
    app.post('/projects/new/user', function(req, res) {
        projects.newUser(req, res)
    })
    app.post('/projects/login/user', function(req, res) {
        projects.loginUser(req, res)
    })
    app.get('/projects/session', function(req, res) {
        projects.checkSession(req, res)
    })
    app.post('/projects/new/team', function(req, res) {
        projects.newTeam(req, res)
    })
    app.get('/projects/teams', function(req, res) {
        projects.allTeams(req, res)
    })
    app.post('/projects/orders/new/:userId/:teamId/:teamName', function(req, res) {
        projects.newOrder(req, res)
    })
    app.post('/projects/orders/new/sell/:userId/:teamId/:teamName', function(req, res) {
        projects.newSaleOrder(req, res)
    })
    app.get('/projects/orders', function(req, res) {
        projects.allOrders(req, res)
    })
    app.get('/projects/orders/:id', function(req, res) {
        projects.allUserOrders(req, res)
    })
    app.get('/projects/shares/:id/:teamId', function(req, res) {
        projects.userShares(req, res)
    })
    app.get('/projects/team/:name', function(req, res) {
        projects.showTeam(req, res)
    })
    app.get('/projects/admin', function(req, res) {
        projects.checkAdmin(req, res)
    })
    app.put('/projects/team/:id', function(req, res) {
        projects.updateTeam(req, res)
    })

    app.get('/projects/logout', function(req, res) {
        console.log("in routes.js")
        projects.logout(req, res)
    })
    app.all("*", (req,res,next) => {
        res.sendFile(path.resolve("./public/dist/public/index.html"))
    });
}