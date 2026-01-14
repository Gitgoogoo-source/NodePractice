import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)




export default async function handler(req ,res){
   // ==========================================
  // 【新增部分开始】解决跨域问题的标准写法
  // ==========================================
  
  // 1. 允许任何网址访问 (*)
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // 2. 允许的前端请求方法 (比如 GET, POST, OPTIONS 等)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  
  // 3. 允许前端发送的头部信息 (比如 content-type)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 4. 处理 "预检" 请求 (OPTIONS)
  // 浏览器在发送 POST 之前，会先发一个 OPTIONS 请求来问服务器："我能发数据给你吗？"
  // 如果这里不直接回复 OK，浏览器就会报错，后续的加金币逻辑根本不会执行。
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }



  

  // req.body 包含了前端传来的所有信息
  const {userId} = req.body

  if(!userId) return   res.status(400).json({error: '缺少用户id'})
  // .rpc 是调用数据库函数，这里为了简单演示，我们用先查后改或者简单的 update
  
    const {data:userData , error: fetchError} = await supabase
    .from('players')
    .select('coins')
    .eq('id',userId)
    .single()

    if(fetchError) return res.status(500).json({error:fetchError.message})

      //做逻辑运算
    console.log(userData)
    const newCoins = userData.coins +10


    //更新回去
     const {error:updateError} = await supabase
     .from('players')
     .update({coins:newCoins})
     .eq('id',userId)

     if(updateError) return res.status(500).json({error:updateError.message})

     // 3. 返回结果给前端

     return res.status(200).json({

        success:true ,
        message :'金币已到账',
        currentCoins :newCoins
     })




}