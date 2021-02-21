const { json } = require("express");
const express = require("express");
const uuid = require("uuid");

const app = express();
const fs = require("fs");
const { nextTick } = require("process");

const { logger } = require("./middleware");
const { waiter } = require("./middleware");

app.use(waiter);
app.use(logger);
app.use(express.json());

//send data to client
app
  .route("/b")
  .get((req, res) => {
    let allBins = [];
    let filesName = fs.readdirSync("./backend/localDataBase");
    if (!filesName) res.status("204").json(`no files`);
    filesName.forEach((element) => {
      allBins.push(
        JSON.parse(
          fs.readFileSync(`./backend/localDataBase/${element}`, {
            encoding: "utf8",
            flag: "r",
          })
        )
      );
    });
    res.send(allBins);
    console.log("before");
  })
  .post((req, res) => {
    console.log(req.body);
    const binName = uuid.v4();
    fs.writeFile(
      `./backend/localDataBase/${binName}.json`,
      JSON.stringify(req.body),
      (err) => {
        if (err !== null) {
          res.status(400).json(`unsuccess create file: ${err}`);
          return;
        }
        console.log(`Success create new file with uniq id ${binName}`);
        res.status(201).json(`the uniq id of this task is: ${binName}`);
      }
    );
  });

// send specific data by id to client
app
  .route("/b/:id")
  .get((req, res) => {
    const { id } = req.params;
    fs.readFile(`./backend/localDataBase/${id}.json`, "utf8", (err, data) => {
      if (err) {
        res.status(404).json({ msg: `There is not task with that id: ${err}` });
      }
      res.send(data);
      console.log("got it:", data);
    });
    console.log("before");
  })

  .put((req, res) => {
    const { id } = req.params;
    console.log(req.body);
    fs.access(
      `./backend/localDataBase/${id}.json`,
      fs.constants.F_OK,
      (err) => {
        if (err) {
          res.status(404).json(`The file does not exist: ${err}`);
          return;
        } else {
          fs.writeFile(
            `./backend/localDataBase/${id}.json`,
            JSON.stringify(req.body),
            () => {
              console.log("Change succeeded:");
              res.json(req.body);
            }
          );
        }
      }
    );
  })
  .delete((req, res) => {
    const { id } = req.params;
    console.log(req.body);
    fs.unlink(`./backend/localDataBase/${id}.json`, (err) => {
      if (err) {
        res.status(500).json({ msg: `can not remove this file:${err}` });
        return;
      }
      res.json("Remove success");
    });
  });

app.listen(3030, () => console.log("server run"));
