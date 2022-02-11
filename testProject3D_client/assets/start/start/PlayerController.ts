
import { _decorator, Component, Vec3, systemEvent, SystemEvent, EventMouse, Animation, v3, Node } from 'cc';
// import { } from "../start/";
import { http } from '../../base/Net/http';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _curJumpTime: number = 0;
    private _jumpTime: number = 0.1;
    private _curJumpSpeed: number = 0;
    private _curPos: Vec3 = v3();
    private _deltaPos: Vec3 = v3(0, 0, 0);
    private _targetPos: Vec3 = v3();
    private _isMoving = false;

    //body动画
    @property({type: Animation})
   public BodyAnim: Animation | null = null;

    start () {
        // systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);

        //TODO socket实例 简单连接
        // let ws = new WebSocket("ws://47.103.86.104:3000")
        // ws.onopen = (result) => {
        //     console.log("jin---on open", result)
        //     ws.send("hello world")
        // }

        // ws.onmessage = (result) =>{
        //     console.log("jin---on message", result)
        // }

        // ws.onerror = (result) => {
        //     console.log("jin---on error", result)
        // }

        // ws.onclose = (result) => {
        //     console.log("jin---on close", result)
        // }

        // setTimeout(()=>{
        //     if(ws.readyState === WebSocket.OPEN){
        //         ws.send("Hello WebSocket, I'm a text message.");
        //     }else{
        //         console.log("WebSocket instance wasn't ready...");
        //     }
        // }, 3)

        //TODO 实现简单http实例
        // let xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
        //         var response = xhr.responseText;
        //         console.log(response);
        //     }
        // };
        // xhr.open("GET", "ws://47.103.86.104:3000", true);
        // xhr.send();

        // console.log("jin---test http")
        // let xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function(){
        //     console.log('onreadystatechang', xhr.readyState);
        // }
        // xhr.open('GET','http://127.0.0.1:8080/get');
        // xhr.responseType = 'text';
        // xhr.setRequestHeader('name', 'Jin');
        // xhr.setRequestHeader('age', '11');
        // xhr.setRequestHeader('sex', 'man');
        // xhr.onload = function(){
        //     console.log('readyState', xhr.readyState);
        //     console.log('status', xhr.status);
        //     console.log('statusText', xhr.statusText);
        //     console.log('getAllResponseHeaders', xhr.getAllResponseHeaders());
        //     console.log('response', xhr.response);
        // }
        // xhr.send();

        console.log("jin---test http 封装")
        http.open('http://127.0.0.1:8080/get', {
            name: "Jin",
            sex: "man"
        },(res)=>{
            console.log("jin---res: ", res)
        })
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.jumpByStep(1);
        } else if (event.getButton() === 2) {
            this.jumpByStep(2);
        }

    }

    jumpByStep(step: number) {
        if (this._isMoving) {
            return;
        }
        this._startJump = true;
        this._jumpStep = step;
        this._curJumpTime = 0;
        this._curJumpSpeed = this._jumpStep / this._jumpTime;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, v3(this._jumpStep, 0, 0));

        if (step === 1) {
            this.BodyAnim && this.BodyAnim.play('oneStep');
         } else if (step === 2) {
            this.BodyAnim &&  this.BodyAnim.play('twoStep');
         }
        this._isMoving = true;
    }

    onOnceJumpEnd() {
        this._isMoving = false;
    }

    update (deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime;
            if (this._curJumpTime > this._jumpTime) {
                // end
                this.node.setPosition(this._targetPos);
                this._startJump = false;
                this.onOnceJumpEnd();
            } else {
                // tween
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._curJumpSpeed * deltaTime;
                Vec3.add(this._curPos, this._curPos, this._deltaPos);
                this.node.setPosition(this._curPos);
            }
        }
    }    

    setInputActive(active: boolean) {
        if (active) {
            systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        } else {
            systemEvent.off(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }
}
