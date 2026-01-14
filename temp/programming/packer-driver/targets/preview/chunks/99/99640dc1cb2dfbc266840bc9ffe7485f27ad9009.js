System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _crd, ccclass, property, API_BASE_URL, NetworkManager;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f6e23gV5OZCsar5eV8Y0xw9", "NetworkManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'error', 'log', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);
      API_BASE_URL = 'https://node-practice-six.vercel.app/api';

      _export("NetworkManager", NetworkManager = (_dec = ccclass('NetworkManager'), _dec(_class = class NetworkManager extends Component {
        // 案例1：请求加金币 (POST 请求)
        addCoin(userId) {
          return _asyncToGenerator(function* () {
            var url = API_BASE_URL + "/add-coin";

            try {
              var response = yield fetch(url, {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json'
                },
                body: JSON.stringify({
                  userId: userId
                })
              });

              if (!response.ok) {
                // 判断--->网络通了，但事情没办成”       
                console.log(response.status);
                return null;
              }

              var result = yield response.json(); // 把后端回来的字符串转回对象      

              if (result.success) {
                console.log("金币增加成功！当前金币:", result.currentCoins);
                return result.currentCoins;
              } else {
                console.log('出错了', result.error);
                return null;
              }
            } catch (error) {
              console.log("NetWorkManager.addCoin错误,错误为:", error);
              return null;
            }
          })();
        } // 案例2：获取关卡数据 (GET 请求)


        getLevelData(levelId) {
          return _asyncToGenerator(function* () {
            // GET 请求的参数通常拼在 URL 后面
            var url = API_BASE_URL + "/get-level?levelId=" + levelId;

            try {
              var response = yield fetch(url, {
                method: 'GET'
              });

              if (!response.ok) {
                // 判断--->网络通了，但事情没办成”    
                var err = yield response.json();
                var ms = err.error;
                console.log("为啥没办成", response.status, ms);
                return null;
              } else {
                console.log('Network.getLevelData:客户端-->服务器:发送成功:');
              }

              var result = yield response.json();
              console.log("服务器返回的数据是:", result); // 【NEW】这里是最关键的一步！我们要亲眼看看result长什么样

              if (result.levelData) {
                console.log("获取关卡数据成功:", result.levelData);
                return result.levelData;
              } else {
                console.log("没获取到数据库关卡数据");
              }
            } catch (error) {
              console.log("网络错误了:", error);
            }
          })();
        } //获取金币排行榜前10名
        // async getLeaderboard(){
        //     try{
        //         const response = await fetch(`${API_BASE_URL}/get-leaderboard`)
        //         const result = await response.json()
        //         return result.leaderboard
        //     }catch(error){
        //         console.log(error)
        //         return[]
        //     }
        // }


        getLeaderboard() {
          return _asyncToGenerator(function* () {
            try {
              var response = yield fetch(API_BASE_URL + "/get-leaderboard");
              var text = yield response.text();

              if (!response.ok) {
                //请求成功，但是服务器查不到信息
                console.log('API响应错误:', response.status);

                try {
                  var errorData = JSON.parse(text);
                  console.log('错误详情:', errorData);
                } catch (error) {//连请求都失败了，那么直接跳到这里不执行const text那行
                }

                return [];
              }

              var result = JSON.parse(text);
              return result.leaderboard || [];
            } catch (error) {
              console.log('getLeaderboard错误:', error);
              return [];
            }
          })();
        }

        dailySignIn(userId) {
          return _asyncToGenerator(function* () {
            try {
              var response = yield fetch(API_BASE_URL + "/daily-signin", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userId
                })
              });
              var text = yield response.text();

              if (!response.ok) {
                try {
                  console.log('api响应错误', response.status);
                  var errorData = JSON.parse(text);
                  console.log('错误详情', errorData);
                } catch (error) {}

                return {
                  success: false,
                  message: '网络通了，事没办成'
                };
              }

              var result = JSON.parse(text);
              return result;
            } catch (e) {
              console.log('network-dailysignin-failed');
              return {
                success: false,
                message: '网络都没通，搞毛线'
              };
            }
          })();
        } //最标准的fetch写法，能一眼知道哪里错了


        addItem(userId, itemId, count) {
          return _asyncToGenerator(function* () {
            try {
              var response = yield fetch(API_BASE_URL + "/add-item", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userId,
                  itemId,
                  count
                })
              });
              var text = yield response.text();

              if (!response.ok) {
                try {
                  console.log('network-addItem，响应错误', response.status);
                  var errorData = JSON.parse(text);
                  console.log('错误详情', errorData);
                } catch (error) {}

                return {
                  success: false,
                  message: '网络通了，事没办成'
                };
              }

              return JSON.parse(text);
            } catch (error) {
              console.log("network-addItem-failed");
              return {
                success: false,
                message: '网络都没通，搞毛线'
              };
            }
          })();
        }

        buyItem(userId, itemId) {
          return _asyncToGenerator(function* () {
            try {
              var response = yield fetch(API_BASE_URL + "/buy-item", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userId,
                  itemId
                })
              });
              var text = yield response.text();

              if (!response.ok) {
                try {
                  console.log('响应错误', response.status);
                  var errorData = JSON.parse(text);
                  console.log('错误详情', errorData);
                } catch (error) {}

                return {
                  success: false,
                  message: '网络通了，事没办成'
                };
              } //等于return await response.json();


              return JSON.parse(text);
            } catch (error) {
              console.log("network-addItem-failed");
              return {
                success: false,
                message: '网络都没通，搞毛线'
              };
            }
          })();
        }

        gachaItem(userId) {
          return _asyncToGenerator(function* () {
            try {
              var response = yield fetch(API_BASE_URL + "/gacha", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userId
                })
              });
              var text = yield response.text();

              if (!response.ok) {
                try {
                  console.log('响应错误', response.status);
                  var errorData = JSON.parse(text);
                  console.log('错误详情看下面', errorData);
                } catch (error) {}

                return {
                  success: false,
                  message: '网线通了，事没办成'
                };
              }

              return JSON.parse(text);
            } catch (error) {
              console.log("请求失败，详细错误：", error);
              console.log("错误类型：", error.name);
              console.log("错误信息：", error.message);
              return {
                success: false,
                message: '网都没通，搞毛线'
              };
            }
          })();
        }

        loginItem(tgId, username) {
          return _asyncToGenerator(function* () {
            try {
              var response = yield fetch(API_BASE_URL + "/login", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  tgId,
                  username
                })
              });
              var text = yield response.text();

              if (!response.ok) {
                try {
                  console.log('响应错误', response.status);
                  var errorData = JSON.parse(text);
                  console.log('错误详情看下面', errorData);
                } catch (error) {}

                return {
                  success: false,
                  message: '网线通了，事没办成'
                };
              }

              return JSON.parse(text);
            } catch (error) {
              console.log("请求失败，详细错误：", error);
              console.log("错误类型：", error.name);
              console.log("错误信息：", error.message);
              return {
                success: false,
                message: '网都没通，搞毛线'
              };
            }
          })();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=99640dc1cb2dfbc266840bc9ffe7485f27ad9009.js.map