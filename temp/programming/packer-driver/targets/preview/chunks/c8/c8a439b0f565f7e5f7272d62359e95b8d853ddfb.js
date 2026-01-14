System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Label, Layout, Node, Prefab, NetworkManager, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, Leaderboard;

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
      instantiate = _cc.instantiate;
      Label = _cc.Label;
      Layout = _cc.Layout;
      Node = _cc.Node;
      Prefab = _cc.Prefab;
    }, function (_unresolved_2) {
      NetworkManager = _unresolved_2.NetworkManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2664fOlf5pGvYt1WWJgObvo", "Leaderboard", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Label', 'Layout', 'Node', 'Prefab']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Leaderboard", Leaderboard = (_dec = ccclass('Leaderboard'), _dec2 = property(Node), _dec3 = property(Prefab), _dec4 = property(_crd && NetworkManager === void 0 ? (_reportPossibleCrUseOfNetworkManager({
        error: Error()
      }), NetworkManager) : NetworkManager), _dec(_class = (_class2 = class Leaderboard extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "contentNode", _descriptor, this);

          _initializerDefineProperty(this, "itemPrefab", _descriptor2, this);

          _initializerDefineProperty(this, "network", _descriptor3, this);
        }

        start() {
          // // 模拟从数据库拿到的数据（就是你用 .order.limit 查出来的结果）
          //   const mockData: PlayerData[] = [
          //     { name: "大佬A", coins: 9999 },
          //     { name: "玩家B", coins: 8888 },
          //     { name: "菜鸟D", coins: 100 }
          //     // ... 假设有10条
          // ];
          this.renderLeaderboard();
        }

        renderLeaderboard() {
          var _this = this;

          return _asyncToGenerator(function* () {
            var _this$contentNode$get;

            // const  data: PlayerData[] = await this.network.getLeaderboard()
            var data = yield _this.network.getLeaderboard();
            console.log('联网测试：输出结果', data); // 清空列表（防止重复刷新时叠加）

            _this.contentNode.removeAllChildren(); // 遍历数据


            for (var i = 0; i < data.length; i++) {
              var _item$getChildByName, _item$getChildByName2;

              var player = data[i]; // A. 生成新节点

              var item = instantiate(_this.itemPrefab); // B. 添加到 ScrollView 的 content 卷轴上

              _this.contentNode.addChild(item); // C. 找到节点里的 Label 并赋值
              // 假设你的预制体结构是根节点下直接挂着三个 Label 节点
              // 建议在 RankItem 上也挂个脚本专门管理赋值，这里为了演示简单直接用 getChildByName
              // 注意：这里名字要和你预制体里的节点名字完全一致


              var rankLabel = (_item$getChildByName = item.getChildByName("rank")) == null ? void 0 : _item$getChildByName.getComponent(Label);
              var nameLabel = (_item$getChildByName2 = item.getChildByName("name")) == null ? void 0 : _item$getChildByName2.getComponent(Label);
              if (rankLabel) rankLabel.string = "No." + (i + 1);
              if (nameLabel) nameLabel.string = player.name;
            } // 刷新 Layout（有时候动态添加节点后，布局没立即更新，强制刷新一下）
            // 虽然 Layout 组件通常会自动更新，但手动调用是个好习惯


            (_this$contentNode$get = _this.contentNode.getComponent(Layout)) == null || _this$contentNode$get.updateLayout();
          })();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "contentNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "itemPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "network", [_dec4], {
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
//# sourceMappingURL=c8a439b0f565f7e5f7272d62359e95b8d853ddfb.js.map