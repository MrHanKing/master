// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Basketball extends cc.Component {

    @property(cc.Node)
    public basketballNode: cc.Node = null;
    @property(cc.Node)
    public randRect: cc.Node = null;
    @property(cc.Node)
    public basketRect: cc.Node = null;
    @property(cc.Node)
    public resultNode: cc.Node = null;

    @property(cc.Label)
    public scoreLabel: cc.Label = null;
    @property(cc.Label)
    public timeLabel: cc.Label = null;
    @property(cc.Label)
    public gameDes:cc.Label = null;

    private _isBallTouch: boolean = false;
    //得分距离
    private _getScoreDis: number = 50;
    private _score: number = 0;
    private _runtime: number = 0;
    //当前关卡
    private _nowBoss: number = 0;

    //游戏状态
    private _gameResult: boolean = false;
    private _oldPos: cc.Vec2 = null;
    //场景大小
    // windowSize: cc.Size = cc.director.getWinSize()

    private _basketBallConfig: any[] = [
        {"ballNum": 10, "time": 30, "des": "第一关:30秒进10个球获胜"},
        {"ballNum": 8, "time": 20, "des": "第二关:20秒进8个球获胜"},
        {"ballNum": 5, "time": 10, "des": "第三关:10秒进5个球获胜"}
    ]
    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        this._oldPos = this.node.getPosition();
        this.initTouchEvent();
        this.resetGame();
    }

    private randomBasketBallPos(){
        // 随机出现在屏幕上指定球场区域内
        const x = this.randRect.width * (Math.random() - .5);
        const y = this.randRect.height * (Math.random() - .5);
        const pos = this.basketballNode.parent.convertToNodeSpaceAR(this.randRect.convertToWorldSpaceAR(cc.v2(x, y)));
        this.basketballNode.setPosition(pos);
    }

    //重新开始
    private resetGame(){
        this._gameResult = false;
        this.resultNode.active = false;
        const data = this._basketBallConfig[this._nowBoss];
        if (data) {
            this._score = 0;
            this._runtime = data.time;
            this.gameDes.string = data.des;
            this.setScoreLabel(0)
            this.setTimeLable(data.time);
            this.randomBasketBallPos();
            this.setUiShow(true);
        }
    }

    private setUiShow(isshow:boolean){
        this.scoreLabel.node.active = isshow;
        this.timeLabel.node.active = isshow;
        this.gameDes.node.active = isshow;
    }

    private initTouchEvent(){
        this.basketballNode.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.basketballNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.basketballNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.basketballNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
    }

    private touchStart(event:cc.Event.EventTouch){
        this._isBallTouch = true;
    }

    private touchMove(event:cc.Event.EventTouch) {
        if (this._isBallTouch) {
            this.basketballNode.setPosition(this.basketballNode.parent.convertTouchToNodeSpaceAR(event.touch));
        }
    }

    private touchEnd(event:cc.Event.EventTouch) {
        this._isBallTouch = false;
        if (this.getDistance(this.basketballNode, this.basketRect) < this._getScoreDis) {
            this.getScore();
            this.randomBasketBallPos();
        }
    }

    private touchCancel(event:cc.Event.EventTouch) {
        this._isBallTouch = false;
    }
    // start () {}

    private getDistance(node1:cc.Node, node2:cc.Node): number{
        const pos1 = node1.getPosition();
        const pos2 = node2.getPosition();
        const distance = cc.pDistance(pos1, pos2);
        return distance;
    }

    private getScore(){
        this._score = this._score + 1;
        this.setScoreLabel(this._score);
        if (this._score >= this._basketBallConfig[this._nowBoss].ballNum) {
            this.gameResult(1);
        }
    }

    private setTimeLable(time:number){
        this.timeLabel.string = (time >= 0) ? "剩余时间:" + time.toFixed(1) : "剩余时间:0";
    }

    private setScoreLabel(score:number){
        this.scoreLabel.string = "得分:" + score;
    }

    update (dt) {
        if (!this._gameResult) {
            this._runtime = this._runtime - dt;
            this.setTimeLable(this._runtime);
        }

        if (this._runtime < 0) {
            this.gameResult();
        }
    }

    //type 1 胜利 2 失败
    private gameResult(type:number = 2){
        this._gameResult = true;
        let des:string = "";
        if (type === 1) {
            des = "恭喜你获得了胜利";
        }else{
            des = "你失败了,请再接再厉不要放弃!";
        }
        this.resultNode.getChildByName("des").getComponent(cc.Label).string = des;
        this.resultNode.getChildByName("btn_next").getComponent(cc.Button).interactable = (type === 1) && (this._nowBoss < this._basketBallConfig.length);
        this.resultNode.active = true;
    }

    public onBtnNext(){
        this._nowBoss = this._nowBoss + 1;
        if (this._nowBoss >= this._basketBallConfig.length) {
            //最后关直接前往第一关
            this._nowBoss = 0;
        }
        this.runAnimaToNextLevel();
    }

    public onBtnReGame(){
        this.resetGame();
    }

    private runAnimaToNextLevel(){
        this.setUiShow(false);
        this.resultNode.active = false;
        let width = this.node.getContentSize().width;
        this.node.runAction(cc.sequence(
            cc.moveBy(2, cc.p(-width, 0)),
            cc.callFunc(this.runOverCallBack, this)
        ))
    }

    private runOverCallBack(){
        this.node.setPosition(this._oldPos);
        this.resetGame();
    }
}
