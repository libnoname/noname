declare module '*?raw' {
    const src: string
    export default src
}

declare module '*?url' {
    const src: string
    export default src
}

declare module '*?worker' {
    const workerConstructor: {
        new(): Worker
    }
    export default workerConstructor
}

declare module '*?worker&module' {
    const workerConstructor: {
        new(): Worker
    }
    export default workerConstructor
}

declare module '*?sharedworker' {
    const sharedWorkerConstructor: {
        new(): SharedWorker
    }
    export default sharedWorkerConstructor
}

declare module '*?sharedworker&module' {
    const sharedWorkerConstructor: {
        new(): SharedWorker
    }
    export default sharedWorkerConstructor
}