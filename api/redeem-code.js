import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)




export default async function handler(req ,res){

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }


  const {userId, codeInput} = req.body;

  //检查兑换码是否有效
  const {data:codeData , error:codeError} = await supabase
  .from('gift_codes')
  .select('*')
  .eq('code',codeInput)
  .single()


    if(codeError || !codeData){
    return res.status(400).json({success:false , message:'兑换码无效'})
  }
    if(!codeData.active){
      return res.status(400).json({success:false , message:'兑换码过期'})
    }

//检查兑换码是否被该玩家领取过了

const {data:usedData , error:userError} = await supabase
.from('used_codes')
.select('*')
.eq('user_id',userId)
.eq('code',codeInput)
.maybeSingle()

if(usedData)    return res.status(400).json({success:false , message:'你已经领过了'})

//发放流程
//4.1 差用户当前金币
const {data:userData} = await supabase.from('players').select('coins').eq('id',userId).single()

//4.2更新金币
const newCoins = userData.coins+codeData.reward_coins;
await supabase.from('players').update({coins:newCoins}).eq('id',userId);

  // 4.3 记录领取记录 (防止再次领取)
  await supabase.from('used_codes').insert([{user_id: userId, code: codeInput}])

  return res.status(200).json({
    success:true,
    message:`兑换成功！获得 ${codeData.reward_coins} 金币`,
    newCoins:newCoins
  })






}