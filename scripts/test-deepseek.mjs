// 快速验证 DeepSeek API 连通性
const url = 'https://api.deepseek.com/v1/chat/completions'
const apiKey = 'sk-3247eb3d830440b7876d2d7e3df3e1ae'

;(async () => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: '说一句话介绍你自己，不要超过30字' },
        ],
        max_tokens: 200,
        temperature: 0.7,
        stream: false,
      }),
    })
    const text = await res.text()
    console.log('STATUS:', res.status)
    console.log('BODY:', text)
  } catch (e) {
    console.error('ERROR:', e?.message || e)
  }
})()
