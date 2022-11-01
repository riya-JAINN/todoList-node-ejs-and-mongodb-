const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
mongoose.connect("mongodb://localhost:27017/Item");
const itemsSchema = {
  name: {
    type: String,
    required: true,
  },
};

const Item = mongoose.model("item", itemsSchema);

app.get("/", (req, res) => {
  let day = new Date().getDay();
  day = days[day];

  Item.find({}, (err, data) => {
    if (err) console.log(err);
    else {
      if (data.length === 0) {
        Item.insertMany(
          [{ name: "eat food" }, { name: "drink  water" }],
          (err) => {
            if (err) console.log("error");
            else
              Item.find({}, (newData) => {
                data = newData;
              });
          }
        );
      }

      res.render("main", { day: day, newItem: data });
    }
  });
});
app.post("/", (req, res) => {
  const item = new Item({ name: req.body.item });
  item.save();
  res.redirect("/");
});
app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/delete", (req, res) => {
  console.log(req.body.celcius);
});

// app.get("/work", (req, res) => {
//   res.render("main", { day: "work", newItem: workItems });
// });
app.listen(3000, () => {
  console.log("server is up and running");
});
