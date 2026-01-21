System.register("chunks:///_virtual/main",["./PaymentController.ts"],(function(){return{setters:[null],execute:function(){}}}));

System.register("chunks:///_virtual/PaymentController.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(e){var n,t,r,o,a,i;return{setters:[function(e){n=e.inheritsLoose,t=e.asyncToGenerator,r=e.regeneratorRuntime},function(e){o=e.cclegacy,a=e._decorator,i=e.Component}],execute:function(){var s;o._RF.push({},"d09787pWCFNw5VO04PkY31y","PaymentController",void 0);var c=a.ccclass;a.property,e("PaymentController",c("PaymentController")(s=function(e){function o(){for(var n,t=arguments.length,r=new Array(t),o=0;o<t;o++)r[o]=arguments[o];return(n=e.call.apply(e,[this].concat(r))||this).backendUrl="https://node-practice-six.vercel.app",n}n(o,e);var a=o.prototype;return a.start=function(){window.Telegram&&window.Telegram.WebApp?console.log("Telegram WebApp Detected"):console.warn("Not in Telegram Environment")},a.onBuyButtonClicked=function(){var e=t(r().mark((function e(){return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.node.active=!1,window.Telegram.WebApp.showPopup({title:"Error",message:"创建订单失败",buttons:[{type:"ok"}]}),e.prev=2,e.next=5,this.initiatePayment();case 5:e.next=10;break;case 7:e.prev=7,e.t0=e.catch(2),console.error("支付流程异常:",e.t0);case 10:return e.prev=10,this.node.active=!0,e.finish(10);case 13:case"end":return e.stop()}}),e,this,[[2,7,10,13]])})));return function(){return e.apply(this,arguments)}}(),a.initiatePayment=function(){var e=t(r().mark((function e(){var n,t,o,a,i,s,c;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(window.Telegram&&window.Telegram.WebApp){e.next=3;break}return console.log("请在 Telegram 内打开游戏进行支付测试"),e.abrupt("return");case 3:if(t=window.Telegram.WebApp,o=null==(n=t.initDataUnsafe)||null==(n=n.user)?void 0:n.id){e.next=8;break}return console.error("无法获取用户 ID"),e.abrupt("return");case 8:return console.log("正在请求支付链接..."),e.next=11,fetch(this.backendUrl+"/api/create-invoice",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:o,amount:1,itemDescription:"100 Gold Coins"})});case 11:return a=e.sent,e.next=14,a.json();case 14:if(i=e.sent,a.ok){e.next=19;break}return console.error("后端报错:",i),t.showPopup({title:"Error",message:"创建订单失败",buttons:[{type:"ok"}]}),e.abrupt("return");case 19:s=i.invoiceLink,c=i.orderId,console.log("获取到支付链接:",s,"订单号:",c),t.openInvoice(s,(function(e){console.log("支付弹窗关闭，状态:",e),"paid"===e?t.showPopup({title:"Success!",message:"支付成功！金币稍后到账。",buttons:[{type:"ok"}]}):"cancelled"===e?console.log("用户取消了支付"):console.log("支付失败或状态未知:",e)}));case 23:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),o}(i))||s);o._RF.pop()}}}));

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});