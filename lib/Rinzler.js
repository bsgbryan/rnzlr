const { log } = require('./config')(sdk)

const listening = w => `worker${w > 1 ? 's' : ''} ready`

const madul = {
  deps: ['cluster[isMaster, fork]', '/Server[boot]'],
  $launch: async ({ isMaster, fork, boot, instances }) => { 
    if (isMaster) {
      const workers = []

      for (let c = 0; c < instances; c++) {
        const f = fork()

        f.on('message', m => log(f.id, m))

        workers.push(f)
      }

      log(instances, listening(instances))

      setInterval(() => {
        const index = Math.floor(Math.random() * instances)

        workers[index].send({ madul: 'HelloWorld', method: 'greet', name: 'Tron', worker: index })
      }, 1000)
    } else
      await boot()
  }
}
