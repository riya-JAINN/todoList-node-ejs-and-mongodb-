const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/todo");
const itemsSchema = {
  name: {
    type: String,
    required: true,
  },
};
const listSchema = {
  name: String,
  items: [itemsSchema],
};
const List = mongoose.model("List", listSchema);
const Item = mongoose.model("item", itemsSchema);
app.post("/", (req, res) => {
  const listName = req.body.List;
  if (listName == "Today") {
    const item = new Item({ name: req.body.item });
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (error, docs) => {
      docs.items.push({ name: req.body.item });
      docs.save();
      res.redirect(`/${listName}`);
    });
  }
});
app.get("/", (req, res) => {
  Item.find({}, (err, data) => {
    if (err) console.log(err);
    else {
      if (data.length < 1) {
        Item.insertMany(
          [{ name: "eat food" }, { name: "drink  water" }],
          (err, doc) => {
            if (err) console.log("error");
            else res.render("main", { listName: "Today", newItem: doc });
          }
        );
      } else res.render("main", { listName: "Today", newItem: data });
    }
  });
});
app.get("/:name", (req, res) => {
  const name = _.capitalize(req.params.name);
  List.findOne({ name: name }, (err, docs) => {
    if (err) console.log("not found");
    else {
      if (docs) {
        res.render("main", { listName: name, newItem: docs.items });
      } else {
        const list = new List({
          name: name,
          items: [{ name: "eat food" }, { name: "drink water" }],
        });
        list.save();
        res.render("main", { listName: name, newItem: list.items });
      }
    }
  });
});
app.post("/delete/:id", (req, res) => {
  const listName = req.body.listName;
  const id = req.params.id;
  if (listName == "Today") {
    Item.deleteOne({ _id: id }, (err) => {
      if (err) console.log(err);
      else res.redirect("/");
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: id } } },
      (error) => {
        if (!error) res.redirect(`/${listName}`);
      }
    );
  }
});
app.listen(3000, () => {
  console.log("server is up and running");
});
