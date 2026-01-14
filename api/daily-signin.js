import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)

export default async function handler(req,res){
res.setHeader('Access-Control-Allow-Origin','*')
res.setHeader('Access-Control-Allow-Methods','GET,POST')
res.setHeader('Access-Control-Allow-Headers','Content-Type')
if(req.method == 'OPTIONS') return res.status(200).end()

const {userId} = req.body;

  // 1. 获取用户上次签到的时间
const {data:userData ,error} = await supabase
.from('players')
.select('last_signin,coins')
.eq('id',userId)
.single()

if(error) return res.status(500).json({error:error.message})

const lastTime = userData.last_signin ? new Date(userData.last_signin) : null

const now = new Date()  //服务器的时间，玩家无法更改

// 2. 判断是不是同一天
  // 简单的判断逻辑：把日期转成字符串比较 (YYYY-MM-DD)
  // 如果上次签到时间存在，且日期字符串和今天一样，那就是重复签到

  if(lastTime && lastTime.toDateString() == now.toDateString()){
    return res.status(400).json({success:false,message:'今天已经签到了，明天再来'})
  }

  const reward = 50;
  const newCoins = userData.coins + reward;

    // 更新数据库：金币加了，签到时间改为 'now()'
    await supabase 
    .from('players')
    .update({
        coins: newCoins,
        last_signin :now.toISOString()
    })
    .eq('id',userId)

    return res.status(200).json({success: true, message: `签到成功！获得 ${reward} 金币`, newCoins :newCoins})



}