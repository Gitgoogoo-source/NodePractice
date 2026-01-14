import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)

export default async function handler(req,res){

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }


    const {data,error} = await supabase
    .from('players')
    .select('name:username,coins')
    .order('coins', {ascending:false})
    .limit(3)


    if(error) return res.status(500).json({error:error.message})

    return res.status(200).json({leaderboard:data})
    console.log('获取排名成功')


}
