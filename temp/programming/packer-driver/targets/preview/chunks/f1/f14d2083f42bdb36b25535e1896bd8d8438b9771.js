System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, NetworkManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, GameCtrl;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfNetworkManager(extras) {
    _reporterNs.report("NetworkManager", "./NetworkManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Label = _cc.Label;
    }, function (_unresolved_2) {
      NetworkManager = _unresolved_2.NetworkManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "09d91G8NN5EGqpiEDweoOcM", "GameCtrl", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameCtrl", GameCtrl = (_dec = ccclass('GameCtrl'), _dec2 = property(_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
        error: Error()
      }), NetworkManager) : NetworkManager), _dec3 = property(Label), _dec(_class = (_class2 = class GameCtrl extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "networkManager", _descriptor, this);

          // 在编辑器里把挂载了NetworkManager的节点拖进来
          _initializerDefineProperty(this, "coinLabel", _descriptor2, this);

          // 用来显示金币的文字
          this.myUserId = 1001;
        }

        //获取用户数据，暂时定一个固定值，后期从telegram sdk接入
        start() {
          // // 游戏开始时，自动获取第1关的数据
          // this.loadLevel(1);
          //模拟获取tgid
          var myTgId = 12345678;
          var myName = "CocosLearner";
          this.loginGame(myTgId, myName);
        } // 绑定到编辑器里的某个按钮点击事件


        onAddCoinBtnClick() {
          var _this = this;

          return _asyncToGenerator(function* () {
            // 调用我们写的网络方法
            var newCoinValue = yield _this.networkManager.addCoin(_this.myUserId); // 只有当服务器返回成功后，前端才更新显示

            if (newCoinValue && newCoinValue !== null) {
              _this.coinLabel.string = "Coins: " + newCoinValue;
            }
          })();
        }

        loadLevel(id) {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            var data = yield _this2.networkManager.getLevelData(id);

            if (data) {// console.log("加载地图:", data.mapName);
              // console.log("生成敌人数量:", data.enemyCount);
              // // 这里写生成敌人的逻辑...
            }
          })();
        }

        onSignInBtnClick() {
          var _this3 = this;

          return _asyncToGenerator(function* () {
            var result = yield _this3.networkManager.dailySignIn(_this3.myUserId);

            if (result.success) {
              console.log("签到成功 ");
            } else {
              console.log("签到失败 "); // 弹出提示框告诉玩家“明天再来”
            }
          })();
        }

        onBattleWin() {
          var _this4 = this;

          return _asyncToGenerator(function* () {
            // 假设 2001 是“传说之剑”的 ID
            var itemId = 2001;
            var count = 1;
            console.log("正在保存物品到服务器...");
            var result = yield _this4.networkManager.addItem(_this4.myUserId, itemId, count);

            if (result.success) {
              console.log('保存成功，玩家可以安全退出了');
            }
          })();
        } //购买装备点击事件


        onBuyShieldBtnClick() {
          var _this5 = this;

          return _asyncToGenerator(function* () {
            var shieldId = 102;
            console.log("尝试购买护盾...");
            var result = yield _this5.networkManager.buyItem(_this5.myUserId, shieldId);

            if (result.success) {
              console.log("交易成功:", result.message); // 更新金币UI

              _this5.coinLabel.string = "Coins: " + result.newCoins;
            } else {
              console.log("交易失败:", result.message); // 会提示金币不足
            }
          })();
        } //抽奖


        onGachaBtnClick() {
          var _this6 = this;

          return _asyncToGenerator(function* () {
            //调用框架组件，联系服务器api，调动数据库
            var result = yield _this6.networkManager.gachaItem(_this6.myUserId);

            if (result.success) {
              // 播放开箱动画...
              if (result.isRare) {
                console.log("【金光！】恭喜获得: " + result.prizeName);
              } else {
                console.log("【白光...】很遗憾，获得: " + result.prizeName);
              }

              _this6.coinLabel.string = "" + result.newCoins;
            } else {
              console.log(result.message);
            }
          })();
        } //


        loginGame(id, name) {
          var _this7 = this;

          return _asyncToGenerator(function* () {
            console.log('正在连接服务器。。。');
            var result = yield _this7.networkManager.loginItem(id, name);

            if (result) {
              _this7.myUserId = result.playerData.id; //

              _this7.coinLabel.string = 'Coins: ' + result.playerData.coins;

              if (result.isNew) {
                console.log('欢迎老新玩家，100金币已发送');
              } else {
                console.log('老玩家加载完毕');
              }
            }
          })();
        } //


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "networkManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "coinLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f14d2083f42bdb36b25535e1896bd8d8438b9771.js.map