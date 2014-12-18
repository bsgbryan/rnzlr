
    microtime = require 'microtime'

    threshold = 30
    listeners = [ ]
    calls     = [ ]
    profiles  = [ ]
    waits     = { }
    counters  = { }

    setInterval ->
      warning   = { }
      completed = { }
      progress  = { }

      Object.keys(calls).forEach (id) ->
        waiting     = ++waits[id]
        warning[id] = waiting if waiting > threshold

      index = 0
      if calls.length > 0
        loop
          call    = calls[index]
          profile = profiles[index]

          if profile.stop?
            completed[call] = profile
            calls.splice    index, 1
            profiles.splice index, 1
          else if profile.progress?
            progress[call] = profile.progress
            profile.progress = [ ]
            ++index
          else
            ++index

          break if index == calls.length

      warnings   = Object.keys(warning).length
      counted    = Object.keys(counters).length
      completes  = Object.keys(completed).length
      progressed = Object.keys(progress).length

      listeners.forEach (listener) ->
        listener.warn     warning   if typeof listener.warn     == 'function' and warnings   > 0
        listener.counts   counters  if typeof listener.counts   == 'function' and counted    > 0
        listener.complete completed if typeof listener.complete == 'function' and completes  > 0
        listener.progress progress  if typeof listener.progress == 'function' and progressed > 0

      counters = { }

    , 1000

    module.exports =
      threshold: (limit) -> threshold = limit
      listen:    (obj  ) -> listeners.push obj

      add: (item, data) ->
        unless counters[item]?
          counters[item] = count: 0, data: [ ]

        counters[item].count += 1
        counters[item].data.push details: data, time: microtime.nowDouble()

      start: (id) ->
        calls.push id
        profiles.push start: microtime.nowDouble()
        waits[id] = 0

      update: (id) ->
        idx = calls.indexOf id

        unless profiles[idx].progress?
          profiles[idx].progress = [ ]

        profiles[idx].progress.push microtime.nowDouble()

      stop: (id) -> 
        idx = calls.indexOf id
        profiles[idx].stop = microtime.nowDouble()

        delete waits[id]