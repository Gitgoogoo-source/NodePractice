import { createClient } from "@supabase/supabase-js";
import { appendFile } from "node:fs";

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


const {tgId , username} = req.body;
  //查找这个id
const {data:exisitingUser,error:error1} = await supabase
  .from('players')
  .select('*')
  .eq('id', tgId)
  .single();

if(error1) {
    console.log('api请求失败',error1.message)
    return res.status(500).json({success:false, error:error1.message})
}
//如果查到了，说明时老玩家，如果没查到，就是新玩家
if(exisitingUser){
    return res.status(200).json({
    success :true,
    isNew : false,
    playerData : exisitingUser,
    message : "欢迎回来，老玩家！"
})
}

//3. 如果没查到，或者报错说找不到，说明是新玩家 -> 执行插入 (Insert)
//初始化。送100金币

const {data : newUser,error:insertError} = await supabase
    .from('players')
    .insert([
    {id:tgId , username:username, coins:100}])
    .select()
    .single();

if(insertError) {
     console.log('api请求失败')
    return res.status(500).json({success :false ,error:insertError.message});}

return res.status(200).json({
    success:true,
    isNew : true,
    playerData : newUser,
    message : '注册成功，送100金币'
    })

}

