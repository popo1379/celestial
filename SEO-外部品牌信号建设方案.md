# Horoscope SERO — 外部品牌信号建设方案（阶段 3）

> 目标：让 Google 判定 "Horoscope SERO" 和 "opensero" 是一个真实品牌，从而在品牌词搜索中稳定展示。
> 核心原理：Google 通过网络中第三方网站对品牌的**引用密度**和**外链数量**来判断品牌真实性。新品牌通常需要 4-12 周建立足够信号。
> 站点地址：https://opensero.com/horoscope

---

## 优先级与时间线总览

| 优先级 | 任务 | 预计耗时 | 见效周期 | 权重 |
|--------|------|---------|---------|------|
| P0 | GitHub README 强化 | 10 分钟 | 3-7 天 | ★★★★★ |
| P0 | Product Hunt 发布 | 30 分钟 | 1-2 周 | ★★★★★ |
| P1 | Twitter/X 账号 + 置顶帖 | 20 分钟 | 1-2 周 | ★★★★ |
| P1 | Reddit 帖子（r/astrology） | 20 分钟 | 1-2 周 | ★★★★ |
| P2 | 工具目录提交（3-5 个） | 1 小时 | 2-4 周 | ★★★ |
| P2 | Hacker News Show HN | 10 分钟 | 1-3 天 | ★★★ |
| P3 | Quora/Reddit 答题引流 | 持续 | 2-4 周 | ★★ |
| P3 | Medium/Dev.to 技术文章 | 1 小时 | 2-4 周 | ★★ |

---

## P0 - GitHub README 强化（最高优先级，立即执行）

GitHub 是高权重域名（DA 96），Google 爬虫频繁抓取，是最快建立品牌信号的方式。

### 操作步骤

1. 访问 https://github.com/popo1379/celestial
2. 编辑根目录 `README.md`（如不存在则创建）
3. 粘贴以下内容：

```markdown
# Horoscope SERO — Sun Moon Rising Sign Calculator

> Discover your Sun, Moon, and Rising signs in seconds. Free Big Three astrology chart with precise planet positions, daily transits, synastry compatibility, and AI-powered interpretations.

🌐 **Website:** [opensero.com/horoscope](https://opensero.com/horoscope)

## Features

- **Sun Moon Rising Sign Calculator** — Instant Big Three calculation using Swiss Ephemeris
- **Free Natal Chart** — 10 planets, 12 houses, major aspects with AI interpretations
- **Daily Transits** — Personalized daily horoscope based on your birth chart
- **Synastry Compatibility** — Relationship analysis between two charts
- **AI Astrology Chat** — Ask our AI astrologer anything about your chart

## Tech Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth + PostgreSQL)
- Tencent CloudBase AI for interpretations
- Swiss Ephemeris for precise astronomical calculations

## Links

- Website: https://opensero.com/horoscope
- Calculate Your Chart: https://opensero.com/horoscope/chart
- Blog: https://opensero.com/horoscope/blog
- About: https://opensero.com/horoscope/about

---

Horoscope SERO (opensero.com) — Discover the cosmos within you.
```

4. Commit 并推送

### 为什么有效

- GitHub README 中的裸链接会被 Google 视为高权重外链
- "Horoscope SERO" 和 "opensero.com" 的组合出现强化品牌与域名的关联
- GitHub 页面通常在 24-48 小时内被 Google 重新爬取

---

## P0 - Product Hunt 发布（高权重外链 + 流量）

Product Hunt 是 DA 90+ 的高权重站点，发布产品能快速获得外链和品牌曝光。

### 发布模板

**Tagline:**
```
Discover your Sun, Moon, and Rising signs in seconds
```

**Description:**
```
Horoscope SERO (opensero.com/horoscope) is a free online astrology platform that calculates your Big Three — Sun, Moon, and Rising signs — using precise Swiss Ephemeris algorithms.

✨ Features:
• Sun Moon Rising Sign Calculator — instant Big Three results
• Free Natal Chart with 10 planets, 12 houses, and major aspects
• AI-powered astrology interpretations
• Daily transits personalized to your birth chart
• Synastry compatibility analysis
• No signup required to start

🔗 Website: https://opensero.com/horoscope

Whether you're new to astrology or an experienced seeker, Horoscope SERO helps you explore the cosmos within you — beautifully designed, powered by modern technology.
```

**Topics:** Astrology, AI, Wellness, Productivity

---

## P1 - Twitter/X 账号建立

### 操作步骤

1. 注册 @HoroscopeSERO 或 @opensero 账号
2. Bio 模板：
```
Horoscope SERO — Discover your Sun, Moon, and Rising signs in seconds. Free Big Three astrology chart with AI interpretations. 🔮✨
```
3. 置顶推文模板：
```
✨ Introducing Horoscope SERO — your free Sun Moon Rising Sign Calculator.

Discover your Big Three in seconds:
☉ Sun sign — your core identity
☽ Moon sign — your emotional nature
↑ Rising sign — how the world sees you

Try it free: https://opensero.com/horoscope

#astrology #birthchart #sunmoonrising
```

---

## P1 - Reddit 发帖（r/astrology）

### 帖子标题
```
I built a free Sun Moon Rising sign calculator — no signup required
```

### 帖子内容
```
Hey r/astrology! 

I've been working on Horoscope SERO (opensero.com/horoscope) — a free online tool that calculates your Sun, Moon, and Rising signs using Swiss Ephemeris for precision.

What's included:
- Big Three calculation (Sun, Moon, Rising) in seconds
- Full natal chart with 10 planets, 12 houses, and major aspects
- AI-powered interpretations of your placements
- Daily transits based on your birth chart
- Synastry compatibility between two charts

No signup required to calculate your chart — just enter your birth date, time, and location.

Would love feedback from the astrology community! What features would you want to see added?

🔗 https://opensero.com/horoscope
```

### 注意事项

- 先在 r/astrology 活跃几天（评论他人帖子）再发主帖，避免被判定为纯推广
- 不要重复发帖，一个 subreddit 只发一次
- 可同时发到 r/InternetIsBeautiful、r/SideProject、r/webapps

---

## P2 - 工具目录提交清单

以下目录站免费提交，能提供稳定的外链：

| 目录站 | 提交地址 | 备注 |
|--------|---------|------|
| AlternativeTo | https://alternativeto.net/manage/new/ | 选 "Astrology" 分类 |
| ToolFinder | https://toolfinder.net/submit | 选 "Wellness" 分类 |
| There's An AI For That | https://theresanaiforthat.com/submit/ | 强调 AI 解读功能 |
| Futurepedia | https://www.futurepedia.io/submit | 强调 AI 功能 |
| Slant.co | https://www.slant.co/ | 对比竞品时提及 |
| Astrology Directory | 搜索 "astrology directory submit" | 行业专属目录 |

### 通用提交描述

```
Horoscope SERO (opensero.com/horoscope) is a free online astrology platform offering a Sun Moon Rising sign calculator, Big Three birth chart, daily transits, synastry compatibility, and AI-powered astrology interpretations. No signup required.
```

---

## P2 - Hacker News Show HN

### 标题
```
Show HN: Horoscope SERO – Free Sun Moon Rising sign calculator with AI interpretations
```

### 内容
```
Hi HN! I built Horoscope SERO (https://opensero.com/horoscope) — a free astrology platform that calculates your Sun, Moon, and Rising signs using Swiss Ephemeris for precision.

The Big Three (Sun, Moon, Rising) form the foundation of your astrological identity:
- Sun: core identity and ego
- Moon: emotional nature and instincts  
- Rising: how the world sees you

Tech stack: Next.js 14 + TypeScript + Supabase + Tencent CloudBase AI for interpretations.

Features:
- Instant Big Three calculation
- Full natal chart with 10 planets and 12 houses
- AI-powered astrology chat
- Daily transits
- Synastry compatibility

No signup required to calculate your chart. Would love feedback!
```

### 最佳发布时间

- 周二至周四，美国太平洋时间 6:00-9:00 AM
- 避免周末和节假日

---

## P3 - Quora/Reddit 答题引流

### 高价值问题（搜索这些关键词找问题）

- "What is my sun moon and rising sign?"
- "How to find my sun moon rising sign?"
- "What is the big three in astrology?"
- "Best free birth chart calculator?"
- "How to read a natal chart?"

### 答题模板

```
The easiest way to find your Sun, Moon, and Rising signs is to use a free online calculator. You'll need three pieces of information:

1. Your birth date
2. Your exact birth time (check your birth certificate)
3. Your birth location

I'd recommend Horoscope SERO (opensero.com/horoscope) — it's free, no signup required, and uses Swiss Ephemeris for precision. It also gives you a full natal chart with AI interpretations.

The Big Three:
- **Sun sign**: your core identity
- **Moon sign**: your emotional nature
- **Rising sign (Ascendant)**: how others perceive you

Hope this helps!
```

### 注意事项

- 不要每个答案都放链接，部分答案纯文字提供价值即可
- 链接放在"推荐工具"语境中，不要硬推
- 答题质量 > 答题数量

---

## P3 - Medium/Dev.to 技术文章（双效外链）

### 文章主题

**Dev.to（技术向）：**
```
Building a Sun Moon Rising Sign Calculator with Next.js and Swiss Ephemeris
```

**Medium（用户向）：**
```
How to Find Your Sun, Moon, and Rising Signs: A Beginner's Guide
```

### 文章结构（Dev.to）

```markdown
# Building a Sun Moon Rising Sign Calculator with Next.js

I recently launched [Horoscope SERO](https://opensero.com/horoscope) — a free astrology platform...

## Why Swiss Ephemeris?

...

## Implementing the Big Three Calculation

...

## AI-Powered Interpretations

...

## Conclusion

Horoscope SERO (opensero.com/horoscope) is live — try it free!
```

---

## 效果监控

### 每周检查项

1. **Google 搜索 `site:opensero.com`** — 查看索引页面数量增长
2. **Google 搜索 `Horoscope SERO`** — 查看品牌词是否出现
3. **Google 搜索 `opensero`** — 查看域名词是否出现
4. **Google Search Console** — 查看外链报告（需先完成阶段 2 的 GSC 提交）

### 预期时间线

| 时间 | 预期效果 |
|------|---------|
| 1-2 周 | GitHub、Product Hunt 外链被 Google 抓取 |
| 2-4 周 | `opensero` 品牌词出现在搜索结果（独特词，更易收录） |
| 4-8 周 | `Horoscope SERO` 开始出现在前 3 页 |
| 8-12 周 | `Horoscope SERO` 稳定进入前 10 |

### 如果 4 周后仍无效果

- 检查 Google Search Console 是否已提交 sitemap
- 检查 robots.ts 是否意外屏蔽了关键页面
- 增加更多高质量外链（DA 50+ 站点）
- 考虑在 Reddit r/SEO 寻求建议

---

## 执行清单

- [ ] GitHub README 更新
- [ ] Product Hunt 发布
- [ ] Twitter/X 账号建立 + 置顶帖
- [ ] Reddit r/astrology 发帖
- [ ] AlternativeTo 提交
- [ ] There's An AI For That 提交
- [ ] Hacker News Show HN 发帖
- [ ] Quora 答题 3-5 个
- [ ] Dev.to 技术文章发布
- [ ] 每周检查品牌词搜索结果

---

*最后更新：2026-07-29*
*Horoscope SERO (opensero.com/horoscope) — Discover the cosmos within you.*
