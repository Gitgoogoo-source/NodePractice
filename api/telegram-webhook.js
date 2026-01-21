// api/telegram-webhook.js
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  // 1. 基础设置
  if (req.method !== 'POST') {
    return res.status(200).send('Method not allowed');
  }

  const body = req.body;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  try {
    // ==================================================
    // 场景 A: 处理 Pre-checkout (支付前的询问)
    // ==================================================
    if (body.pre_checkout_query) {
      const queryId = body.pre_checkout_query.id;
      const orderId = body.pre_checkout_query.invoice_payload; // 取出我们在 create-invoice 时塞进去的 payload

      console.log(`收到预检请求: Order ID ${orderId}`);

      // 查库：确保这笔订单在数据库里存在，且状态是 pending
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single();

      // 如果查不到订单，或者订单已经支付过了，告诉 TG 交易失败
      if (error || !order || order.status !== 'pending') {
        await answerPreCheckoutQuery(queryId, false, "订单无效或已支付");
        return res.status(200).send('Order invalid');
      }

      // 一切正常，告诉 TG：允许交易
      await answerPreCheckoutQuery(queryId, true);
      return res.status(200).send('Pre-checkout OK');
    }

    // ==================================================
    // 场景 B: 处理 Successful Payment (支付成功的通知)
    // ==================================================
    if (body.message && body.message.successful_payment) {
      const payment = body.message.successful_payment;
      const orderId = payment.invoice_payload; // 依然是那个 payload
      const telegramChargeId = payment.telegram_payment_charge_id; // TG 的官方流水号

      console.log(`收到支付成功通知: Order ID ${orderId}`);

      // --- [关键] 幂等性检查 ---
      // TG 网络波动时可能会发两次通知，我们必须防止重复发货
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('status')
        .eq('order_id', orderId)
        .single();

      if (existingOrder && existingOrder.status === 'paid') {
        console.log('该订单已处理过，跳过');
        return res.status(200).send('Already Processed');
      }

      // --- 更新数据库状态 ---
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid', // 标记为已支付
          telegram_payment_charge_id: telegramChargeId // 记录官方流水号
        })
        .eq('order_id', orderId);

      if (updateError) {
        console.error('更新订单失败:', updateError);
        // 如果这里报错，返回 500，TG 会稍后重试通知
        return res.status(500).send('Database Error');
      }

      console.log('订单状态已更新为 PAID');
      
      // 注意：这里只是更新了订单状态。
      // 真正的“发金币/发道具”逻辑，建议让前端轮询查库，或者在这里触发另一个业务函数。
      // 为了教程简洁，这里只要保证数据库状态变了，就是核心成功。

      return res.status(200).send('Payment Processed');
    }

    // 其他类型的消息，直接忽略
    return res.status(200).send('Ignored');

  } catch (err) {
    console.error('Webhook Error:', err);
    return res.status(500).send('Server Error');
  }

  // --- 辅助函数：回复 Pre-checkout ---
  async function answerPreCheckoutQuery(queryId, okString, errorMessage = "") {
    const url = `https://api.telegram.org/bot${botToken}/answerPreCheckoutQuery`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pre_checkout_query_id: queryId,
        ok: okString,
        error_message: errorMessage // 如果 ok=false，用户会看到这个错误提示
      })
    });
  }
}