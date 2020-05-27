const { v4: uuid } = require('uuid')
const { performance } = require('perf_hooks')
const fs = require('fs')

const REG_EXP_1 = /^[a-zA-Z0-9\-]{30,36}$/i
const REG_EXP_2 = /^[0-9A-F]{8}-[0-9AF]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/

const getData = (n = 0, percentOfInvalid = 0) => {
    const data = []

    for (let i = 0; i < n; i++) {
        const key = i / n * 100 < percentOfInvalid ? 'INVALID_DATA' : uuid()
        data.push(key)
    }

    return data
}

const testRegExp = (regExp, data) => {
    const start = performance.now()
    data.forEach((item) => regExp.test(item))
    const time = performance.now() - start;

    return time
}

const N = process.argv[2]
const percentOfInvalid = process.argv[3]
const outFilename = process.argv[4] || 'output.json'

const data = getData(N, percentOfInvalid)

const output = {
    REG_EXP_1: "/^[a-zA-Z0-9\-]{30,36}$/i",
    REG_EXP_2: "/^[0-9A-F]{8}-[0-9AF]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/",
    keys: N,
    invalid: `${percentOfInvalid}%`,
    valid: `${100 - percentOfInvalid}%`,
    time: {
        REG_EXP_1: testRegExp(REG_EXP_1, data),
        REG_EXP_2: testRegExp(REG_EXP_2, data)
    }
}

fs.writeFileSync(outFilename, JSON.stringify(output, null, 2))