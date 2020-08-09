var express = require("express");
var mongoose = require("mongoose");
var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(process.env.PORT || 3000)
var sinhvien = require("./Model/Model");
mongoose.connect('mongodb+srv://ttsv:VNjVJwx40M4IOsgF@cluster0.ampdw.mongodb.net/ttsv?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
        if (err) {
            console.log("Error")
        }
        else {
            console.log("Connected db")
        }
    });
//multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (file.mimetype == "image/bmp" || file.mimetype == "image/png") {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("avatar");



app.get("/", function (req, res) {
    res.render("home")
});

app.get("/add", function (req, res) {
    res.render("add")
})

app.post("/add", function (req, res) {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading.");
        } else if (err) {
            console.log("An unknown error occurred when uploading." + err);
        } else {
            var nsinhvien = sinhvien({
                name: req.body.name,
                gioitinh: req.body.gioitinh,
                dob: req.body.dob,
                email: req.body.email,
                msv: req.body.msv,
                team: req.body.team
            })
            nsinhvien.save(function (err) {
                if (err) {
                    console.log("error")
                }
                else {
                    console.log("Save");
                    console.log(nsinhvien);
                    res.redirect('./list')
                }
            })
        }

    });
})
app.get('/list', function (req, res) {
    sinhvien.find(function (err, data) {
        if (err) {
            console.log('Loi')
        } else {
            res.render('list', { danhsach: data })
        }
    })
})
// sửa
app.get("/edit/:id", function (req, res) {
    // Lấy thông tin chi tiết của đối tương theo ID
    sinhvien.findById(req.params.id, function (err, data) {
        if (err) {
            res.send("co loi")
        }
        else {
            res.render('edit', {nsinhvien:data});

        }
    });
})

app.post('/edit', function (req, res) {
    //update thong tin
    upload(req, res, function (err) {
        console.log(req.body);
        if (err instanceof multer.MulterError) {
            console.log("Có lỗi multer tải dữ liệu lên.");
        }
        else if (err) {
            res.send("Ảnh quá lớn hoặc không đúng định dạng cho phép!!!" + err);
            console.log("" + err);
        }
        else {
            sinhvien.updateOne({
                _id: req.body.tmp
            }, {
                name: req.body.name,
                gioitinh: req.body.gioitinh,
                dob: req.body.dob,
                email: req.body.email,
                msv: req.body.msv,
                team: req.body.team
            }, function (err) {
                if (err) {
                    console.log("Lỗi")
                }
                else {
                    res.redirect("./list")
                }

            })
        }

    })
})
app.get('/delete/:id', function (req, res) {
    sinhvien.deleteOne({ _id: req.params.id }, function (err) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.redirect("../list");
        }
    });
})