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
mongoose.connect("mongodb://localhost:27017/todo");
const itemsSchema = {
  name: {
    type: String,
    required: true,
  },
};

// app.post("/", (req, res) => {
//   const item = new Item({ name: req.body.item });
//   item.save();
//   res.redirect("/");
// });
// app.get("/about", (req, res) => {
//   res.render("about");
// });
app.get("/:name", (req, res) => {
  const listName = req.params.name;
  const newSchema = {
    name: {
      type: String,
      required: true,
    },
  };
  const newList = mongoose.model(listName, newSchema);
  let day = new Date().getDay();
  day = days[day];

  newList.find({}, (err, data) => {
    if (err) console.log(err);
    else {
      if (data.length === 0) {
        newList.insertMany(
          [{ name: "eat food" }, { name: "drink  water" }],
          (err) => {
            if (err) console.log("error");
            else
              newList.find({}, (newData) => {
                data = newData;
              });
          }
        );
      }
      res.render("main", { day: day, newItem: data });
    }
  });
});
// app.post("/delete/:item", (req, res) => {
//   const id = req.params.item;
//   console.log(id);
//   .deleteOne({ id: id }, (err) => {
//     if (err) console.log(err);
//     else res.redirect("/");
//   });
// });

app.post("/:name", (req, res) => {});
app.listen(3000, () => {
  console.log("server is up and running");
});
