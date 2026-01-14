import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const {userId} = req.body
  const COST = 50

  //查钱
  const {data:user} = await supabase
  .from('players')
  .select('coins')
  .eq('id',userId)
  .single()

  //扣钱
  const newCoins = user.coins - COST;
  await supabase
  .from('players')
  .update({coins: newCoins})
  .eq('id',userId);

   // 3. 【核心步骤】服务器生成随机数 (0.0 到 1.0 之间)
   const randomVal = Math.random();
   let prizeName = '';
   let  priceName = '';
   let prizeId = 0;

   if(randomVal<0.1){
    // 10% 概率 (0.0 ~ 0.1)
    prizeName = '传说神剑ssr'
    prizeId = 999;
   }else{
    //90概率
    prizeName = "生锈铁片 n"
    prizeId  = 10
   }

    //给奖励
    await supabase
    .from('inventory')
    .insert([{user_id: userId, item_id:prizeId , count:1}]);

    return res.status(200).json({
        success : true,
        prizeName : prizeName,
        isRare : prizeId === 999,
        newCoins : newCoins

    })



}