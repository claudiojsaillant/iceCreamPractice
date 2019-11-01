const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const db = require("./models");
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get("/getUser", (req, res) => {
    db.User.find({})
    .then(users => {
        res.json(users)
    })
})

app.get("/getLists", (req, res) => {
    db.List.find({})
    .populate("order")
    .then(Lists => {
        res.json(Lists)
    })
})

app.get("/getOrders", (req, res) => {
    db.Order.find({})
    .then(Orders => {
        res.json(Orders)
    })
})

app.put("updateOrder/:id", (req, res) => {
    db.Order.findByIdAndUpdate({_id: req.params.id}, {body: req.body.body}).then(newOrd => {
        res.json({
            message: "Order sucessfully updated."
        })
    })
})

app.delete("/delList/:id", (req, res) => {
    db.List.deleteOne({_id: req.params.id})
    db.List.findOne({_id: req.params.id}).then(listDb => {
        if(listDb.length === 0){
            res.json({
                message: "Deleted sucessfully."
            });
        }
    })
})

app.delete("/delOrder/:id", (req, res) => {
    db.Order.deleteOne({_id: req.params.id})
    db.Order.findOne({_id: req.params.id}).then(orderDb => {
        if(listDb.length === 0){
            res.json({
                message: "Deleted sucessfully."
            });
        }
    })
})

app.post("/createUser", (req, res) => {
    console.log(req.body);
    db.User.findOne({
        email: req.body.email
    }).then(user => {
        if(user){
            res.json({
                message: "This email already exists."
            });
        } else {
            db.User.create(req.body)
            .then(user => {
                res.json({message: user.type + " account succesfully created. "});
            }).catch(err => {
                console.log(err);
            })
        }
    });
});

app.post("/login", (req, res) => {
    console.log(req.body);
    db.User.findOne({ email: req.body.email})
        .then(user => {
            if(user){
                if(user.password === req.body.password){
                    res.json({
                        message:"login succesfull"
                    })
                } else {
                    res.json({
                        message:"incorrect credentials"
                    })
                }
            } else {
                res.json({
                    message: "This email doesn't exist"
                })
            }
        }).catch(err => {
            console.log(err);
        })
})

app.post("/list", function(req, res) {
    listObj = req.body;
    listObj.time = Date.now();
    console.log(req.body);
    db.List.create(listObj)
      .then(function(listDb) {
        res.json(listDb);
      }).catch(function(err) {
        res.json(err);
      });
  });

app.post("/order/:listid", function(req, res) {
    db.Order.create(req.body)
      .then(function(dbOrder) {
          console.log(dbOrder, "jllo");
        return db.List.findOneAndUpdate(
          { _id: req.params.listid },
          { $push: { order: dbOrder._id } },
          { new: true }
        );
      })
      .then(function(dbList) {
        // If we were able to successfully update an , send it back to the client
        res.json(dbList);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/iceCreamApp");

// Define API routes here

server.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});


