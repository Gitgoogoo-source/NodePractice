// api/create-invoice.js
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // --- 1. 设置跨域头 (CORS) ---
  // 这一步是为了允许你的 Cocos 游戏（可能运行在不同域名下）调用这个接口
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- 2. 获取参数 ---
  // 这里简化了校验，实际生产中应该校验 initData 以防止伪造 userId
  const { userId, amount, itemDescription } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // --- 3. 数据库记账 (Supabase) ---
    // 先在数据库生成一个订单，状态为 pending
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert([{
        telegram_user_id: userId,
        amount: amount,   // Stars 的数量
        payload: itemDescription, // 记录买的是什么，比如 "100 Gold"
        status: 'pending' // 初始状态
      }])
      .select() // 返回插入后的数据
      .single(); // 确保只拿一条

    if (dbError) {
      console.error('Database Error:', dbError);
      throw new Error('Failed to create order in database');
    }

    const myOrderId = order.order_id; // 获取刚才生成的 UUID
    console.log('订单号已生成-待支付:', myOrderId);

    // --- 4. 调用 Telegram API 生成链接 ---
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgApiUrl = `https://api.telegram.org/bot${botToken}/createInvoiceLink`;

    const response = await fetch(tgApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "Purchase Item", // 账单标题
        description: itemDescription, // 账单描述
        // [关键点]!!!
        // 我们必须把 Supabase 生成的 order_id 塞入 payload 字段。
        // 这样当用户支付成功后，TG 通知我们时，把这个 payload 原样还给我们，
        // 我们才知道是哪笔订单被支付了。
        payload: myOrderId, 
        currency: "XTR", // Telegram Stars 的固定货币代码
        prices: [
          { label: itemDescription, amount: amount } // Stars 数量
        ]
      }),
    });


    const tgData = await response.json();

    if (!tgData.ok) {
      console.error('Telegram API Error:', tgData);
      throw new Error(`Telegram Error: ${tgData.description}`);
    }

    // --- 5. 返回支付链接给前端 ---
    return res.status(200).json({ 
      invoiceLink: tgData.result,
      orderId: myOrderId 
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}