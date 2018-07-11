String.prototype.format = function(args) { 
    if (arguments.length>0) { 
        var result = this; 
        if (arguments.length == 1 && typeof (args) == "object") { 
            for (var key in args) { 
                var reg=new RegExp ("({"+key+"})","g"); 
                result = result.replace(reg, args[key]); 
            } 
        } 
        else { 
            for (var i = 0; i < arguments.length; i++) { 
                if(arguments[i]==undefined) { 
                    return ""; 
                } 
                else { 
                    var reg=new RegExp ("({["+i+"]})","g"); 
                    result = result.replace(reg, arguments[i]); 
                } 
            } 
        } 
        return result; 
    } 
    else { 
        return this; 
    } 
};
 
cc.Class({
    extends: cc.Component,

    properties: {
        lblVersion:cc.Label,
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _mima:null,
        _mimaIndex:0
    },

    // use this for initialization
    onLoad: function () {
        cc.log3.debug("haha onLoad");
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        
        if(!cc.vv){
            cc.director.loadScene("loading");
            return;
        }
      
        
        cc.vv.audioMgr.playBGM("bgMain.mp3");
        
        this._mima = ["A","A","B","B","A","B","A","B","A","A","A","B","B","B"];

        if(!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS ||cc.sys.os ==cc.sys.OS_OSX){
             
            cc.find("Canvas/btn_yk").active = true; 
            cc.vv.http.url = cc.vv.http.master_url;
            cc.vv.net.addHandler('push_need_create_role',function(){
                cc.log3.debug("onLoad:push_need_create_role");
                cc.director.loadScene("createrole");
            });
        
        }

        // TODO 审核
        // if(cc.sys.os == cc.sys.OS_IOS && cc.sys.app_store_review == 1){
        //     cc.find("Canvas/btn_yk").active = true; 
        //     cc.find("Canvas/z_weixindenglu").active = false;
        //     cc.vv.http.url = cc.vv.http.master_url;
        //     cc.vv.net.addHandler('push_need_create_role',function(){
        //         cc.log3.debug("onLoad:push_need_create_role");
        //         cc.director.loadScene("createrole");
        //     });            
        // }

        this.lblVersion.string = cc.VERSION;

        //预加载大厅
        cc.director.preloadScene('hall');
    },
    
    start:function(){
        var account =  cc.sys.localStorage.getItem("wx_account");
        var sign = cc.sys.localStorage.getItem("wx_sign");

        if(account != null && sign != null && account != '' && sign != ''){
            // cc.vv.anysdkMgr.login();
            var ret = {
                errcode:0,
                account:account,
                sign:sign
            }
            cc.vv.userMgr.onAuth(ret);
        }   
    },
    
    onBtnQuickStartClicked:function(){
        cc.vv.userMgr.guestAuth();
    },
    
    onBtnWeichatClicked:function(){
        // var self = this;
        // cc.vv.anysdkMgr.login();
        cc.log3.debug("onBtnWeichatClicked");
        cc.vv.g3Plugin.weChatLogin();
    },
    
    onBtnMIMAClicked:function(event){
        if(this._mima[this._mimaIndex] == event.target.name){
            this._mimaIndex++;
            if(this._mimaIndex == this._mima.length){
                cc.find("Canvas/btn_yk").active = true;
            }
        }
        else{
            cc.log3.debug("oh ho~~~");
            this._mimaIndex = 0;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
