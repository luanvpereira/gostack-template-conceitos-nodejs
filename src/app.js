const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function checkRepositoryId(request, response, next) {
  const { id } = request.params
  const message = 'Repository not found'

  if(!isUuid(id)) {
    return response.status(400).json({
      message
    })
  }

  const repository = repositories.find(repository => repository.id === id)

  if(!repository) {
    return response.status(400).json({
      message
    })
  }

  return next()
}

app.use('/repositories/:id', checkRepositoryId)

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs = [] } = request.body
  
  const createdRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(createdRepository)

  return response.json(createdRepository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs = [] } = request.body
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  const updatedRepository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  }

  repositories[repositoryIndex] = updatedRepository

  return response.json(updatedRepository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  repositories.splice(repositoryIndex, 1)

  return response.sendStatus(204)
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  const currentRepository = repositories[repositoryIndex]

  const updatedRepository = {
    ...currentRepository,
    likes: currentRepository.likes + 1
  }

  repositories[repositoryIndex] = updatedRepository

  return response.json(updatedRepository)
});

module.exports = app;
