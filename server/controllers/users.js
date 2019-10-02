var mongoose = require('mongoose')
var bcrypt = require("bcrypt");
    Order = mongoose.model('Order')
    Team = mongoose.model('Team')
    User = mongoose.model('User')
module.exports = {
    index: function(req, res) {
        res.json({success : true})
    },
    newTeam: function(req, res) {
        var team = new Team({name: req.body.newTeam.name, Image: req.body.newTeam.Image, description: req.body.newTeam.description})
        team.titles.push(req.body.newTeam.titles);
        team.value.push(req.body.newTeam.value)
        team.shares.push(req.body.newTeam.shares)
        team.save(function(err) {
            if(err) {
                res.json({success : false})
            }
            else {
                Team.find({}, function(err, teams) {
                    if(err) {
                        res.json({success : false})
                    }
                    else {
                        res.json({success : true, teams : teams, team : team})
                    }
                })
            }
        })
    },
    updateTeam: function(req, res) {
        Team.findOne({_id : req.params.id}, function(err, team) {
            team.name = req.body.updateTeam.name
            team.Image = req.body.updateTeam.Image
            team.description = req.body.updateTeam.description
            if(team.value[team.value.length-1] != req.body.updateTeam.value) {
                team.value.push(req.body.updateTeam.value)
            }
            team.save(function(err) {
                if(err) {
                    res.json({success : false})
                }
                else {
                    res.json({success : true, team : team})
                }
            })
        })
    },
    newOrder: function(req, res) {
        var order = new Order({amount: req.body.newOrder.amount, _user: req.params.userId, _team: req.params.teamId, activity: "Buy", team_name: req.params.teamName})
        User.findOne({_id : req.params.userId}, function(err, user) {
            Team.findOne({_id : req.params.teamId}, function(err, team) {
                if(user.money - (team.value[team.value.length-1]*order.amount) < 0) {
                    res.json({success : false, message : "You don't have the money for this transaction!"})
                }
                user.money = user.money - (team.value[team.value.length-1]*order.amount);
                user.shares += order.amount;
                user.save(function(err) {
                    if(err) {
                        console.log(err)
                        res.json({success : false})
                    }
                })
            })
        })
        Team.findOne({_id : req.params.teamId}, function(err, team) {
            team.shares.push(team.shares[team.shares.length-1] -= order.amount)
            team.save(function(err) {
                if(err) {
                    console.log(err)
                    res.json({success : false})
                }
            })
        })
        order.save(function(err, buyOrder) {
            if(err) {
                res.json({success : false})
            }
            else {
                User.findOne({_id : req.params.userId}, function(err, user) {
                    res.json({order : buyOrder, user : user})
                })
            }
        })
    },
    newSaleOrder: function(req, res) {
        var order = new Order({amount: req.body.newSaleOrder.amount, _user: req.params.userId, _team: req.params.teamId, activity: "Sell", team_name : req.params.teamName})
        User.findOne({_id : req.params.userId}, function(err, user) {
            Order.find({}, function(err, orders) {
                console.log(orders)
                userShares = 0;
                if(err) {
                    res.json({success : false})
                    return;
                }
                else {
                    for(let singleOrder of orders) {
                        if(singleOrder._team == req.params.teamId && singleOrder._user == req.params.id) {
                            console.log("Found a match!")
                            if(singleOrder.activity === "Buy") {
                                userShares = userShares + singleOrder.amount;
                            }
                            if(singleOrder.activity === "Sell") {
                                userShares = userShares - singleOrder.amount;
                            }
                        }
                    }
                }
            })
            Team.findOne({_id : req.params.teamId}, function(err, team) {
                user.money = user.money + (team.value[team.value.length-1]*order.amount);
                user.shares -= order.amount;
                user.save(function(err) {
                    if(err) {
                        res.json({success : false})
                        return;
                    }
                })
            })
        })
        Team.findOne({_id : req.params.teamId}, function(err, team) {
            team.shares.push(team.shares[team.shares.length-1] += order.amount)
            team.save(function(err) {
                if(err) {
                    res.json({success : false})
                    return;
                }
            })
        })
        order.save(function(err, sellOrder) {
            if(err) {
                res.json({success : false})
                return;
            }
            else {
                User.findOne({_id : req.params.userId}, function(err, user) {
                    res.json({order : sellOrder})
                })
            }
        })
    },
    newUser: function(req, res) {
        bcrypt.hash(req.body.newUser.password, 10)
        .then(hashed_password => {
            var user = new User({username: req.body.newUser.username, email: req.body.newUser.email, password: hashed_password});
            user.save(function(err, user) {
                if(err) {
                    res.json({success : false})
                }
                else {
                    req.session.email = req.body.newUser.email;
                    res.json({success : true, user : user })
                }
            })
        })
        .catch(error => {
            console.log(error)
            res.json({success : false})
        })
    },
    loginUser: function(req, res) {
        User.findOne({email: req.body.loginUser.email}, function(err, user) {
            if(user == null) {
                res.json({success : false})
            }
            else {
                bcrypt.compare(req.body.loginUser.password, user.password)
                .then(result => {
                    if(result == true) {
                        req.session.email = req.body.loginUser.email;
                        res.json({success : true, user : user})
                    }
                    else {
                        res.json({success : false})
                    }
                })
                .catch(error => {
                    console.log(error)
                    res.json({success : false})
                })
            }
        })
    },
    checkAdmin: function(req, res) {
        if(req.session.email) {
            User.findOne({email: req.session.email}, function(err, user) {
                if(user.admin == false) {
                    res.json({success : false})
                }
                else {
                    res.json({success : true, user : user})
                }
            })
        }
        else {
            res.json({success : false})
        }
    },
    checkSession: function(req, res) {
        if(req.session.email) {
            User.findOne({email : req.session.email}, function(err, user) {
                if(user == null) {
                    req.json({success : false})
                }
                else {
                    res.json({success : true, user : user})
                }
            })
        }
        else {
            res.json({success : false})
        }
    },
    allTeams: function(req, res) {
        Team.find({}, function(err, teams) {
            if(err) {
                res.json({success : false})
            }
            else {
                res.json({teams : teams})
            }
        })
    },
    showTeam: function(req, res) {
        Team.find({name : req.params.name}, function(err, team) {
            if(err) {
                req.json({success : false})
            }
            else {
                res.json({team : team[0]})
            }
        })
    },
    allOrders: function(req, res) {
        Order.find({}, function(err, orders) {
            if(err) {
                res.json({success : false})
            }
            else {
                res.json({orders : orders})
            }
        })
    },
    allUserOrders: function(req, res) {
        Order.find({}, function(err, orders) {
            userOrders = [];
            if(err) {
                res.json({success : false})
            }
            else {
                for(let order of orders) {
                    if(order._user == req.params.id) {
                        userOrders.push(order)
                    }
                }
                res.json({userOrders : userOrders})
            }
        })
    },
    userShares: function(req, res) {
        Order.find({}, function(err, orders) {
            console.log(orders)
            userShares = 0;
            if(err) {
                res.json({success : false})
            }
            else {
                for(let order of orders) {
                    if(order._team == req.params.teamId && order._user == req.params.id) {
                        console.log("Found a match!")
                        if(order.activity === "Buy") {
                            userShares = userShares + order.amount;
                        }
                        if(order.activity === "Sell") {
                            userShares = userShares - order.amount;
                        }
                    }
                }
                res.json({userShares : userShares})
            }
        })
    },
    logout: function(req, res) {
        if(req.session) {
            req.session.destroy();
            console.log(req.session)
            res.json({success : true})
        }
        else {
            res.json({success : false})
        }
    }
}