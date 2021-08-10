/**
 * Create by Jin on 2021/8/10
*/
// import { _decorator, RequestItem} from "cc";

//时间间隔
const CONNECT_COUNTER = 3
const CONNECT_INTERVAL = 5 * 1000
const PING_COUNTER = 3
const PING_INTERVAL_NORMAL = 5 * 1000
const PING_INTERVAL_QUICK = 1 * 1000
const PING_INTERVAL_CHECK = 1 * 1000

export interface ISocketWrapperIn {
    name: string
    sendPing(): void
    onOpenBefore(): void
    onOpen(): void
    onMessage(buffer: ArrayBuffer): void
    onCloseBefore(): void
    onClose(): void
    onCloseTemp(): void
}

let caFilePath: string
export function setCaFilePath(path: string) {
    caFilePath = path
}

export default class Socket {
    
    private wrapper: ISocketWrapperIn
    private url: string
    private socket: WebSocket | null
    private socketState: boolean
    private connectState: boolean
    private connectCounter: number
    private connectTimeId: number |null
    private pingStamp: number
    private pingCounter: number
    private pingInterval: number
    private pingTimeId: number | null
    
    constructor(wrapper: ISocketWrapperIn) {
        this.wrapper = wrapper
    }
    /**
     * 1.连接
     * 2.发送
     * 3.关闭
    */
    connect(config: ISocketConfig){
        this.url = "wss://" + config.ip + ":" + config.port

        this.connectState = false
        this.connectCounter = 0
        this.connectSocket()
    }

    isConnencted(){

    }

    send(){

    }

    close(){

    }

    /**
     * 私有函数
     * 1.连接socket
     * 2.监听超时
     * 4.监听打开
     * 5.监听信息
     * 6.监听错误
     * 7.监听关闭
     * 8.监听Pong（Pong为sever更新心跳线程时间，并执行pong的操作，client读取数据进行操作，更新自己心跳时间，执行ping操作，在传给sever）
     * 9.停止超时
     * 10.关闭socket
     * 11.重新连接
     * 3.开始Ping
     * 12.停止Ping
     * 13.检查Ping
     * 14.发送Ping
    */

    private connectSocket(){
        this.connectCounter += 1
        this.socketState = true
        this.socket = new WebSocket(this.url)//暂时没有子协议
        this.socket.binaryType = "arraybuffer"//作为数据发送到服务端
        this.socket.onopen = this.onOpen.bind(this)
        this.socket.onmessage = this.onMessage.bind(this)
        this.socket.onerror = this.onError.bind(this)
        this.socket.onclose = this.onClose.bind(this)
        this.connectTimeId = setTimeout(this.onTimeout.bind(this), CONNECT_INTERVAL)
    }

    private onTimeout(){
        console.log("jin---onTimeout")
        //TODO 1.停止超时 2.关闭socket 3.重新启动
        this.stopTimeout()
        this.closeSocket()
        this.reconnect()
    }

    private onOpen(event: Event){
        console.log("jin---onOpen", event)
        this.stopTimeout()
        this.wrapper.onOpenBefore()
        this.startPing()
    }

    private onMessage(event: MessageEvent){
        console.log("jin---onMessage", event)
        this.onPong()
        this.wrapper.onMessage(event.data)
    }

    private onError(event: Event){
        console.log("jin---onError", event)
        if (this.connectTimeId != null) {
            this.socketState = false
            this.stopTimeout()
            this.closeSocket()
            this.reconnect()
        }
    }

    private onClose(){
        console.log("jin---onClose")
        this.socketState = false
        this.stopPing()
        this.closeSocket()
        this.reconnect()
    }

    private onPong(){
        this.pingStamp = Date.now()
        this.pingCounter = 0
        this.pingInterval = PING_INTERVAL_NORMAL

        if(!this.connectState){
            this.connectState = true
            this.connectCounter = 0
            this.wrapper.onOpen()
        }
    }

    private stopTimeout(){
        if(this.connectTimeId == null){
            return
        }

        clearTimeout(this.connectTimeId)
        this.connectTimeId = null
    }

    private closeSocket(){
        if(this.socket == null){
            return
        }

        console.log("jin---closeSocket")
        this.socketState && this.wrapper.onCloseBefore()
        this.socket.onopen = this.socket.onmessage = this.socket.onerror = this.socket.onclose = null
        this.socketState && this.socket.close()
        this.socket = null
    }

    private reconnect(){
        console.log("jin---reconnect")
        if(this.connectCounter < CONNECT_COUNTER){
            if(this.connectState){
                this.connectState = false
                if(this.connectCounter === 1){
                    this.wrapper.onCloseTemp()
                }
            }
            this.connectSocket()
        }else{
            this.wrapper.onClose()
        }
    }

    private startPing(){
        this.pingStamp = Date.now()
        this.pingCounter = 0
        this.pingInterval = PING_INTERVAL_QUICK
        this.pingTimeId = setInterval(this.checkPing.bind(this), PING_INTERVAL_CHECK)
        this.sendPing()
    }

    private stopPing(){
        if (this.pingTimeId == null) {
            return
        }

        clearInterval(this.pingTimeId)
        this.pingTimeId = null
    }

    private checkPing(){
        if((this.pingStamp + this.pingInterval) > Date.now()){
            return
        }
        console.log("jin---checkPing")
        if(this.pingCounter < PING_COUNTER){
            this.pingInterval = PING_INTERVAL_QUICK
            this.sendPing()
        }else{
            this.stopPing()
            this.closeSocket()
            this.reconnect()
        }
    }

    private sendPing(){
        this.pingCounter += 1
        this.wrapper.sendPing()
    }
}