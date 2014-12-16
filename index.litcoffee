
    microtime = require 'microtime'

    threshold = 30
    listeners = [ ]
    calls     = { }
    waits     = { }

    setInterval ->
      Object.keys(calls).forEach (id) ->
        listeners.forEach (listener) -> listener.warn id, waits[id] if ++waits[id] > threshold
    , 1000

    module.exports =
      threshold: (limit) -> threshold = limit
      listener:  (fn   ) -> listeners.push fn
      start:     (id   ) ->
        calls[id] = microtime.nowDouble()
        waits[id] = 0
      stop:     (id) -> 
        diff = microtime.nowDouble() - calls[id]

        delete calls[id]
        delete waits[id]

        listeners.forEach (listener) -> listener.notify id, diff