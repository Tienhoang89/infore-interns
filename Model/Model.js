const mongoose = require("mongoose");

var svschema = new mongoose.Schema({ 
    name: 'string',
    gioitinh:'string',
    dob: 'string',
    email: 'string',
    msv: 'string',
    team: 'string'
     });

module.exports = mongoose.model("sinhvien", svschema)