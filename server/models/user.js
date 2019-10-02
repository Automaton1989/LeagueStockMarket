var mongoose = require('mongoose')
var TeamProjectSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: [true, "There must be a team name"]
    },
    titles:  {
        type: [String]
    },
    Image: {
        type: String
    },
    description: {
        type: String
    },
    value: {
        type: [Number]
    },
    shares: {
        type: [Number]
    }},
    {timestamps : true});
var UserProjectSchema = new mongoose.Schema( {
    username: {
        type: String,
        required: [true, "You must have a username of at least 3 characters"],
        minlength: 3
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    shares: {
        type: Number, 
        default: 0
    },
    admin: {
        type: Boolean,
        default: false
    },
    money: {
        type: Number, default: 10000
    }},
    {timestamps : true});
var OrderProjectSchema = new mongoose.Schema( {
    _user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    _team: {
        type: mongoose.Schema.Types.ObjectId, ref: "Team"
    },
    team_name: {
        type: String
    },
    activity: {
        type: String
    },
    amount: {
        type: Number
    }},
    {timestamps : true});
var Order = mongoose.model('Order', OrderProjectSchema)
var Team = mongoose.model('Team', TeamProjectSchema)
var User = mongoose.model('User', UserProjectSchema)