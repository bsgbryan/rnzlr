const madul = {
  $init: ({ instances, workers }) => setInterval(() => {
    const index = Math.floor(Math.random() * instances)

    workers[index].send({ madul: 'HelloWorld', method: 'greet', name: 'Tron', worker: index })
  }, 1000)
}