const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  const { techs } = req.query;

  const results = techs
    ? repositories.filter(repository => repository.techs.includes(techs))
    : repositories;

  return res.json(results);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoriesIndex < 0) {
    return res.status(400).json({ error: 'Repository does not exist.' });
  };

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoriesIndex].likes
  };


  repositories[repositoriesIndex] = repository;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoriesIndex= repositories.findIndex(repository => repository.id === id);

  if (repositoriesIndex< 0) {
    return res.status(400).json({ error: "project not found!" })
  }

  repositories.splice(repositoriesIndex, 1);

  return res.status(204).send( 'Successfully deleted repository' );
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return res.status(400).send();
  };

  repository.likes += 1;

  return res.json(repository);
});

module.exports = app;
