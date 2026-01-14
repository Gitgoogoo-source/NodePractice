import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }


   const { userId, itemId, count } = req.body;
  
   const {data ,error} = await supabase
   .from('inventory')
   .insert([
        {
        user_id :userId,
        item_id: itemId, 
        count: count 
        }
    ])
    if(error) return res.status(500).json({error: error.message});
    return res.status(200).json({ success: true, message: "物品已存入背包" });
}