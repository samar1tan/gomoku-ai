import Greedy from "./Greedy.js"

var ai = new Greedy()

self.onmessage = function(e) {
    var d = e.data
    console.log('get message: ')
    console.log(d)
    if(d.type == "START") {
        const open = ai.start(d.random)
        postMessage({
            type: 'board',
            data: open
        })
    } else if(d.type == "BEGIN") {
        var p = ai.begin()
        postMessage({
            type: 'put',
            data: p
        })
    } else if(d.type == "GO") {
        var p = ai.turn(e.data.x, e.data.y)
        postMessage({
            type: 'put',
            data: p
        })
    } else if(d.type == "BACKWARD") {
        ai.backward()
    } else if(d.type == "FORWARD") {
        ai.forward()
    } else if(d.type == "CONFIG") {
        console.log('not supported yet!')
    }
}
