// import { createClient } from "@supabase/supabase-js";
// import { appendFile } from "node:fs";

// const supabase = createClient(
//     process.env.SUPABASE_URL,
//     process.env.SUPABASE_KEY
// )

// export default async function handler(req ,res){
//    // ==========================================
//   // 【新增部分开始】解决跨域问题的标准写法
//   // ==========================================
  
//   // 1. 允许任何网址访问 (*)
//   res.setHeader('Access-Control-Allow-Origin', '*');
  
//   // 2. 允许的前端请求方法 (比如 GET, POST, OPTIONS 等)
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  
//   // 3. 允许前端发送的头部信息 (比如 content-type)
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   // 4. 处理 "预检" 请求 (OPTIONS)
//   // 浏览器在发送 POST 之前，会先发一个 OPTIONS 请求来问服务器："我能发数据给你吗？"
//   // 如果这里不直接回复 OK，浏览器就会报错，后续的加金币逻辑根本不会执行。
//     if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }


// const {tgId , username} = req.body;
//   //查找这个id
// const {data:exisitingUser,error:error1} = await supabase
//   .from('players')
//   .select('*')
//   .eq('id', tgId)
  

// if(error1) {
//     console.log('api请求失败',error1.message)
//     return res.status(500).json({success:false, error:error1.message})
// }
// //如果查到了，说明时老玩家，如果没查到，就是新玩家
// if(exisitingUser && exisitingUser.length > 0){
//     return res.status(200).json({
//     success :true,
//     isNew : false,
//     playerData : exisitingUser[0],
//     message : "欢迎回来，老玩家！"
// })
// }

// //3. 如果没查到，或者报错说找不到，说明是新玩家 -> 执行插入 (Insert)
// //初始化。送100金币

// const {data : newUser,error:insertError} = await supabase
//     .from('players')
//     .insert([
//     {id:tgId , username:username, coins:100}])
//     .select()
//     .single();

// if(insertError) {
//      console.log('api请求失败')
//     return res.status(500).json({success :false ,error:insertError.message});}

// return res.status(200).json({
//     success:true,
//     isNew : true,
//     playerData : newUser,
//     message : '注册成功，送100金币'
//     })

// }

import { createClient } from "@supabase/supabase-js";

// 初始化 Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
    // ==========================================
    // 1. 设置跨域 (CORS) - 保持你原来的写就好，没问题
    // ==========================================
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ==========================================
    // 2. 获取参数并检查
    // ==========================================
    const { tgId, username } = req.body;

    // 安全检查：如果前端传来的 tgId 是空的，直接报错，别往下走了
    if (!tgId) {
        return res.status(400).json({ success: false, message: "缺少 tgId" });
    }

    // ==========================================
    // 3. 核心逻辑：查老玩家
    // ==========================================
    
    // 统一把查询结果叫 userResult，清晰明了
    const { data: userResult, error: error1 } = await supabase
        .from('players')
        .select('*')
        .eq('id', tgId); // 查询 id 等于 tgId 的数据

    // 数据库本身报错（比如连不上网）
    if (error1) {
        console.error('查询数据库出错:', error1.message);
        return res.status(500).json({ success: false, error: error1.message });
    }

    // 【修正点】在这里！
    // userResult 是一个数组。如果长度大于0，说明查到了人。
    if (userResult && userResult.length > 0) {
        return res.status(200).json({
            success: true,
            isNew: false,
            playerData: userResult[0], // 取数组里的第1个人
            message: "欢迎回来，老玩家！"
        });
    }

    // ==========================================
    // 4. 没查到 -> 新玩家 -> 插入数据
    // ==========================================
    
    // 注意：username 有可能为空（比如有些TG用户没设置用户名），给个默认值
    const safeName = username || "Unknown Hero";

    const { data: newUser, error: insertError } = await supabase
        .from('players')
        .insert([
            { id: tgId, username: safeName, coins: 100 }
        ])
        .select()
        .single(); // 这里用 single() 确保返回的是一个对象，而不是数组

    if (insertError) {
        console.error('插入新用户出错:', insertError.message);
        return res.status(500).json({ success: false, error: insertError.message });
    }

    return res.status(200).json({
        success: true,
        isNew: true,
        playerData: newUser,
        message: '注册成功，送100金币'
    });
}