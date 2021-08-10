/**
 * Create by Jin on 2021/8/10
*/

interface ISocketConfig {
    ip: string
    port: number
}

// interface ISocketWrapper {
//     add(message: any, opcode: Record<string, string>)
//     startSocket(config: ISocketConfig)
//     send<T>(name: string, message: T): void
//     close(): void
// }

// interface ISocketDelegate {
//     socket: ISocketWrapper
//     startSocket(): void
//     onOpenBefore(): void
//     onOpen(): void
//     onCloseBefore?(): void
//     onClose(): void
//     onCloseTemp?(): void
// }