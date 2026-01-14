import { _decorator, Component, instantiate, Label, Layout, Node, Prefab } from 'cc';
import { NetworkManager } from './NetworkManager';
const { ccclass, property } = _decorator;

interface PlayerData {
    name: string;
    coins: number;
}


@ccclass('Leaderboard')
export class Leaderboard extends Component {

    @property(Node)
    contentNode: Node = null!;
     @property(Prefab)
    itemPrefab: Prefab = null!;
    @property(NetworkManager)
    network : NetworkManager = null


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

    async renderLeaderboard() {

        // const  data: PlayerData[] = await this.network.getLeaderboard()
         const  data: PlayerData[] = await this.network.getLeaderboard()
        console.log('联网测试：输出结果', data)

        // 清空列表（防止重复刷新时叠加）
        this.contentNode.removeAllChildren();

        // 遍历数据
        for (let i = 0; i < data.length; i++) {
            const player = data[i];

            // A. 生成新节点
            const item = instantiate(this.itemPrefab);

            // B. 添加到 ScrollView 的 content 卷轴上
            this.contentNode.addChild(item);

            // C. 找到节点里的 Label 并赋值
            // 假设你的预制体结构是根节点下直接挂着三个 Label 节点
            // 建议在 RankItem 上也挂个脚本专门管理赋值，这里为了演示简单直接用 getChildByName
            // 注意：这里名字要和你预制体里的节点名字完全一致
            const rankLabel = item.getChildByName("rank")?.getComponent(Label);
            const nameLabel = item.getChildByName("name")?.getComponent(Label);


            if (rankLabel) rankLabel.string = `No.${i + 1}`;
            if (nameLabel) nameLabel.string = player.name;
        }

        // 刷新 Layout（有时候动态添加节点后，布局没立即更新，强制刷新一下）
        // 虽然 Layout 组件通常会自动更新，但手动调用是个好习惯
        this.contentNode.getComponent(Layout)?.updateLayout();
    }
}

