import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;
import { NetworkManager } from './NetworkManager';
import { Leaderboard } from './Leaderboard';



@ccclass('GameCtrl')
export class GameCtrl extends Component {

    @property(NetworkManager)
    networkManager: NetworkManager = null; // 在编辑器里把挂载了NetworkManager的节点拖进来
    @property(Label)
    coinLabel: Label = null; // 用来显示金币的文字

    private myUserId = 1001;    //获取用户数据，暂时定一个固定值，后期从telegram sdk接入

    
     start() {
        // // 游戏开始时，自动获取第1关的数据
        // this.loadLevel(1);

        //模拟获取tgid
        const myTgId = 12345678; 
        const myName = "CocosLearner";
        this.loginGame(myTgId, myName);
        
    }

// 绑定到编辑器里的某个按钮点击事件
    async onAddCoinBtnClick() {
        // 调用我们写的网络方法
        const newCoinValue = await this.networkManager.addCoin(this.myUserId);
        // 只有当服务器返回成功后，前端才更新显示
        if (newCoinValue && newCoinValue!== null) {
            this.coinLabel.string = "Coins: " + newCoinValue;
        }
    }


    async loadLevel(id: number) {
        const data = await this.networkManager.getLevelData(id);
        if(data) {
            // console.log("加载地图:", data.mapName);
            // console.log("生成敌人数量:", data.enemyCount);
            // // 这里写生成敌人的逻辑...
        }
    }

    async onSignInBtnClick(){
        const result = await this.networkManager.dailySignIn(this.myUserId)

        if(result.success){
            console.log("签到成功 ")
        }else {
            console.log("签到失败 ");
            // 弹出提示框告诉玩家“明天再来”
        }
    }

    async onBattleWin(){
        // 假设 2001 是“传说之剑”的 ID
        const itemId = 2001;
        const count = 1;

        console.log("正在保存物品到服务器...");
        const result = await this.networkManager.addItem(this.myUserId, itemId, count);

        if(result.success){
            console.log('保存成功，玩家可以安全退出了')
        }


    }

//购买装备点击事件
    async onBuyShieldBtnClick() {
        const shieldId = 102;
        console.log("尝试购买护盾...");
        
        const result = await this.networkManager.buyItem(this.myUserId, shieldId);
        
        if (result.success) {
            console.log("交易成功:", result.message);
            // 更新金币UI
            this.coinLabel.string = "Coins: " + result.newCoins;
        } else {
            console.log("交易失败:", result.message); // 会提示金币不足
        }
    }



        //抽奖
    async onGachaBtnClick(){
        //调用框架组件，联系服务器api，调动数据库
        const result = await this.networkManager.gachaItem(this.myUserId)
           if (result.success) {
            // 播放开箱动画...
            if (result.isRare) {
                console.log("【金光！】恭喜获得: " + result.prizeName);
            } else {
                console.log("【白光...】很遗憾，获得: " + result.prizeName);
            }
            this.coinLabel.string = "" + result.newCoins;
        } else {
            console.log(result.message);
        }

    }



//


async loginGame(id:number , name:string){
    console.log('正在连接服务器。。。');

    const result = await this.networkManager.loginItem(id,name)
    if(result){
        this.myUserId = result.playerData.id    //
        this.coinLabel.string = 'Coins: ' +result.playerData.coins;

        if(result.isNew){
            console.log('欢迎老新玩家，100金币已发送')
        }else{
            console.log('老玩家加载完毕')
        }
    }
}





//
}

