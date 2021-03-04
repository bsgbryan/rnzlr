const { warn } = require('./config')(sdk)

let wrkrs

let taskCounter = 0

const tasks = []
const working = {
  // key: worker id
  // value: Array of tasks in-flight
}

const madul = {
  register: ({ workers }) => {
    wrkrs = workers

    for (const w of workers)
      w.on('error', (e) => warn(`Worker ${w.id} encountered error`, e.message))
  },
  assign: ({ task }) => {
    let assigned = false
    const t = { ...task, tid: taskCounter++ }

    for (let w = 1; w <= wrkrs.length; w++) {
      if (working[w] === undefined) {
        working[w] = [t]

        wrkrs[w - 1].send(t)

        assigned = true

        break
      }
      else if (working[w].length < 5) {
        working[w].push(t)

        wrkrs[w - 1].send(t)

        assigned = true

        break
      }
    }

    if (assigned === false)
      tasks.push(t)

    return assigned
  },
  clear: ({ task, id }) => {
    working[id] = working[id].filter(w => w.tid !== task.tid)
    
    if (tasks.length > 0)
      wrkrs[id - 1].send(tasks.shift())
  }
}
