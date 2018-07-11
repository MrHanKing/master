cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _alert:null,
        _btnOK:null,
        _btnCancel:null,
        _title:null,
        _content:null,
        _onok:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        this._alert = this.node;
        this._title = this.node.getChildByName("title").getComponent(cc.Label);
        this._content = this.node.getChildByName("content").getComponent(cc.Label);
        
        this._btnOK = this.node.getChildByName("btn_ok");
        this._btnCancel = this.node.getChildByName("btn_cancel");
        
        cc.vv.utils.addClickEvent(this._btnOK,this.node,"Alert","onBtnClicked");
        cc.vv.utils.addClickEvent(this._btnCancel,this.node,"Alert","onBtnClicked");
        
        this._alert.active = false;
        // cc.vv.alert = this;

        this.checkUserStatuc();
    },

    checkUserStatuc:function(){
        if(cc.vv.userMgr.status != 1){
            cc.vv.alert.show("提示","您无法进行游戏~~",function(){
                cc.director.end();  
            },false);
        }
    },
    
    onBtnClicked:function(event){

        cc.vv.audioMgr.playSFX("ui_click.mp3");

        if(event.target.name == "btn_ok"){
            if(this._onok){
                this._onok();
            }
        }
        this._alert.active = false;
        this._onok = null;
    },
    
    show:function(title,content,onok,needcancel){
        this._alert.active = true;
        this._onok = onok;
        this._title.string = title;
        this._content.string = content;
        if(needcancel){
            this._btnCancel.active = true;
            this._btnOK.x = -150;
            this._btnCancel.x = 150;
        }
        else{
            this._btnCancel.active = false;
            this._btnOK.x = 0;
        }
    },
    
    onDestory:function(){
        if(cc.vv){
            cc.vv.alert.onDestory();    
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});