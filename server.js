const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('.'));
app.use(bodyParser.json());

app.get('/user', (req, res) => {
  fs.readFile('./userlist.json', 'utf-8', (err, data) => {
    res.send(JSON.stringify(data));
  });
});

app.get('/user/:id', (req, res) => {
  fs.readFile('./userlist.json', 'utf-8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      const id = req.params.id;
      const fighters = JSON.parse(data);
  
      if (!id) {
        res.send('{"result": 0}');
      }
  
      const newFighter = fighters.filter((fighter) => fighter._id === id);
  
      if (newFighter.length === 0) {
        res.send('{"result": 0}');
      } else {
        res.send(JSON.stringify(newFighter[0]));
      }
    }
  });
});

app.post('/user', (req, res) => {
  fs.readFile('./userlist.json', 'utf-8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      const fighters = JSON.parse(data);
      const fighter = req.body;
      let repeat = true;
  
      fighters.forEach(element => {
        if (element._id === fighter._id) repeat = false; 
      });

      if (repeat) {
        fighters.push(fighter);

        fs.writeFile('./userlist.json', JSON.stringify(fighters), (err) => {
          if (err) {
            res.send('{"result": 0}');
          } else {
            res.send('{"result": 1}');
          }
          console.log('done');
        });
      } else {
        res.send('{"result": 0}');
      }
    }
  });
});

app.put('/user/:id', (req, res) => {
  fs.readFile('./userlist.json', 'utf-8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      const fighters = JSON.parse(data);
      const fighterUpdated = req.body;
      const id = req.params.id;

      if (fighterUpdated._id === id) {
        const newFighters = fighters.filter((fighter) => fighter._id !== id);
        newFighters.push(fighterUpdated);

        fs.writeFile('./userlist.json', JSON.stringify(newFighters), (err) => {
          if (err) {
            res.send('{"result": 0}');
          } else {
            res.send('{"result": 1}');
          }
        });
      } else {
        res.send('{"result": 0}');
      }
    }
  });
});

app.delete(`/user/:id`, (req, res) => {
  fs.readFile('./userlist.json', 'utf-8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      const fighters = JSON.parse(data);
      const id = req.params.id;
      
      if (!id) {
        res.send('{"result": 0}');
      }
  
      const newFighters = fighters.filter((fighter) => fighter._id !== id);

      if (newFighters.length === fighters.length) {
        res.send('{"result": 0}');
      } else {
        fs.writeFile('./userlist.json', JSON.stringify(newFighters), (err) => {
          if (err) {
            res.send('{"result": 0}');
          } else {
            res.send('{"result": 1}');
          }
        });
      }
    }
  });
});

app.listen(5000, function() {
  console.log('server is running on port 5000');
});