import { createClient } from "@supabase/supabase-js";
import { error } from "node:console";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// 模拟服务器端的商品配置（实际上这些应该存数据库）
const SHOP_ITEMS = {
    101: { name: "Iron Sword", price: 100 },
    102: { name: "Magic Shield", price: 500 }
    };


export default async function handler(req,res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
//接收客户端用户请求，接收用户id+商品id
    const{userId , itemId} = req.body

//检查商品是否存在
    const itemConfig = SHOP_ITEMS[itemId]
    if(!itemConfig){
        return res.status(400).json({error:'没有商品'})
    }

//检查用户余额
    const {data:userData, error:userError} = await supabase
    .from('players')
    .select('coins')
    .eq('id',userId)
    .single()

    if(userError) return res.status(500).json({error:userError.message})

//服务器的判断逻辑-判断钱够不够
    if(userData.coins < itemConfig.price){
        return res.status(400).json({success: false, message: "金币不足！"})
    }

 // 执行交易逻辑：
 // 扣钱 + 给东西
  // 注意：在专业开发中，这步最好用数据库的“事务(RPC)”，但作为新手，我们先分两步写

//扣钱
    const newBalance = userData.coins - itemConfig.price
    await supabase
    .from('players')
    .update({coins: newBalance})
    .eq('id',userId)

//给东西
    await supabase
    .from('inventory').insert([{user_id:userId , item_id: itemId, count: 1 }])

    return res.status(200).json({
        success : true,
        message:'购买成功',
        newCoins: newBalance
    })










}