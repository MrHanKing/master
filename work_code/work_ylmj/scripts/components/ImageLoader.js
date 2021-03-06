
function getBaseInfo(userid,callback){
    if(cc.vv.baseInfoMap == null){
        cc.vv.baseInfoMap = {};
    }
    
    if(cc.vv.baseInfoMap[userid] != null){
        callback(userid,cc.vv.baseInfoMap[userid]);
    }
    else{
        cc.vv.http.sendRequest('/base_info',{userid:userid},function(ret){
            var url = null;
            if(ret.headimgurl){
               url = ret.headimgurl;
            }
            var info = {
                name:ret.name,
                sex:ret.sex,
                url:url,
            }
            cc.vv.baseInfoMap[userid] = info;
            callback(userid,info);
            
        },cc.vv.http.master_url);   
    }  
};

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
        _width:90,
        _height:90,
    },

    // use this for initialization
    onLoad: function () {
        this._width = this.node.width;
        this._height = this.node.height;
        this.setupSpriteFrame();
    },
    
    setUserID:function(userid, setUseInfoCallback){
        // if(cc.sys.isNative == false){
        //     return;
        // }
        if(!userid){
            return;
        }
        
        var self = this;

        getBaseInfo(userid,function(code,info){
           if(info && info.url){
                self.loadImage(info.url,userid,function (err,spriteFrame) {
                    self._spriteFrame = spriteFrame;
                    if (cc.vv.images) {
                        cc.vv.images[userid] = spriteFrame;
                    }
                    self.setupSpriteFrame();
                });   
            }else{
                //加载默认头像
                cc.loader.loadRes('textures/YX_Public/icon_userhead', function( error, tex )
                {
                    var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                    self._spriteFrame = spriteFrame;
                    if (cc.vv.images) {
                        cc.vv.images[userid] = spriteFrame;
                    }
                    self.setupSpriteFrame();
                });
            }

            if (info && info.name && setUseInfoCallback) {
                setUseInfoCallback(info);
            }
        });
    },

    setClubID:function(userid, setUseInfoCallback) {
        var self = this;
        if(cc.vv.images == null){
            cc.vv.images = {};
        }

        //直接读取本地 同步操作
        if (cc.vv.images && cc.vv.images[userid]) {
            self._spriteFrame = cc.vv.images[userid];
            self.setupSpriteFrame();
            if (setUseInfoCallback) {
                setUseInfoCallback();
            }
            return;
        }

        //适应俱乐部桌子刷新
        if (userid == 0 || !userid) {

            cc.loader.loadRes('textures/YX_Public/icon_userhead', function( error, tex )
            {
                var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                self._spriteFrame = spriteFrame;
                if (cc.vv.images) {
                    cc.vv.images[userid] = spriteFrame;
                }
                self.setupSpriteFrame();
                if (setUseInfoCallback) {
                    setUseInfoCallback();
                }
            });
            return;
        }

        this.setUserID(userid, setUseInfoCallback);
    },
    
    setupSpriteFrame:function(){
        if(this._spriteFrame){
            var spr = this.getComponent(cc.Sprite);
            if(spr){
                spr.spriteFrame = this._spriteFrame;    
            }
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    loadImage:function(url,code,callback){
        /*
        if(cc.vv.images == null){
            cc.vv.images = {};
        }
        var imageInfo = cc.vv.images[url];
        if(imageInfo == null){
            imageInfo = {
                image:null,
                queue:[],
            };
            cc.vv.images[url] = imageInfo;
        }
        
        cc.loader.load(url,function (err,tex) {
            imageInfo.image = tex;
            var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
            for(var i = 0; i < imageInfo.queue.length; ++i){
                var itm = imageInfo.queue[i];
                itm.callback(itm.code,spriteFrame);
            }
            itm.queue = [];
        });
        if(imageInfo.image != null){
            var tex = imageInfo.image;
            var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
            callback(code,spriteFrame);
        }
        else{
            imageInfo.queue.push({code:code,callback:callback});
        }*/
        var that = this;
        cc.loader.load({url:url,type:"png"},function (err,tex) {
            var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, that._width, that._height));
            callback(code,spriteFrame);
        });
    },
});
