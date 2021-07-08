const express = require("express");

const db = require("./data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/api/accounts", (req, res) => {
  db.select("*")
    .from("accounts")
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error getting the accounts" });
    });
});

server.get("/api/accounts/:id", (req, res) => {
  db.select("*")
    .from("accounts")
    .where({ id: req.params.id })
    .first()
    .then(account => {
      res.status(200).json(account);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "Error getting the accounts" });
    });
});

server.post("/api/accounts", (req, res) => {
  const accountData = req.body;

  if (!accountData.name || accountData.name === "" || !accountData.budget) {
    res.status(204).json({ message: "Account name or budget missing" });
  } else {
    db("accounts")
      .insert(accountData, "id")
      .then(ids => {
        const id = ids[0];

        return db("accounts")
          .select("id", "name", "budget")
          .where({ id })
          .first()
          .then(account => {
            res.status(201).json(account);
          });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          errorMessage: "Error adding the account"
        });
      });
  }
});

server.put("/api/accounts/:id", (req, res) => {
    const { id } = req.params;
    const changes = req.body;
  
    if (!changes.name || changes.name === "" || !changes.budget) {
        res.status(204).json({ message: "Account name or budget missing" });
      } else {
    db("accounts")
      .where({ id })
      .update(changes)
      .then(count => {
        if (count > 0) {
          res.status(200).json({ message: `${count} record(s) updated` });
        } else {
          res.status(404).json({ message: "Account not found" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          errorMessage: "Error updating the account"
        });
      });
    }
  });

  server.delete("/api/accounts/:id", (req, res) => {
    db("accounts")
      .where({ id: req.params.id })
      .del()
      .then(count => {
        res.status(200).json({ message: `${count} record(s) removed` });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          errorMessage: "Error removing the account"
        });
      });
  });

module.exports = server;
