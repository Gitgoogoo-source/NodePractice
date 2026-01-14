// /api/get-level.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
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



  // 从网址参数里获取关卡ID，例如 /api/get-level?levelId=1
  const { levelId } = req.query;

  const { data, error } = await supabase
    .from('levels')
    .select('data')
    .eq('id', levelId)
    .single();

  if (error) return res.status(500).json({ error: error.message});

  return res.status(200).json({ levelData: data.data });
}