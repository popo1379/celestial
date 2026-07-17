import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Horoscope SERO',
  description: 'Learn how Horoscope SERO collects, uses, and protects your personal data.',
  openGraph: {
    title: 'Privacy Policy — Horoscope SERO',
    description: 'Learn how Horoscope SERO collects, uses, and protects your personal data.',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy — Horoscope SERO',
    description: 'Learn how Horoscope SERO collects, uses, and protects your personal data.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const sections = [
  'intro',
  'infoWeCollect',
  'howWeUse',
  'dataStorage',
  'cookies',
  'yourRights',
  'contact',
  'updates',
]

function t(key: string, locale: string): string {
  const en: Record<string, string> = {
    'privacy.title': 'Privacy Policy',
    'privacy.lastUpdated': 'Last updated:',
    'privacy.intro.title': 'Introduction',
    'privacy.intro.content': 'Welcome to Horoscope SERO. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.\n\nBy using Horoscope SERO, you agree to the collection and use of information in accordance with this policy.',
    'privacy.infoWeCollect.title': 'Information We Collect',
    'privacy.infoWeCollect.content': 'We collect the following types of information:\n\n• Account Information: When you sign up using Google, GitHub, or email, we collect your email address and a unique user identifier.\n\n• Birth Data: To generate your natal chart, we collect your birth date, time, place (city and coordinates), and timezone.\n\n• Usage Data: We may collect information on how the service is accessed and used, including your device type, browser type, and pages visited.',
    'privacy.howWeUse.title': 'How We Use Your Information',
    'privacy.howWeUse.content': 'We use the collected data for various purposes:\n\n• To provide and maintain our service\n• To create and manage your user account\n• To calculate and display astrological charts\n• To provide AI interpretation features\n• To improve our service and user experience\n• To send you important service updates',
    'privacy.dataStorage.title': 'Data Storage & Security',
    'privacy.dataStorage.content': 'Your data is securely stored using Supabase, a cloud database service with industry-standard encryption and security practices. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.\n\nAll data transmission uses HTTPS encryption. Your astrological profiles are linked to your user account and are not publicly visible.',
    'privacy.cookies.title': 'Cookies',
    'privacy.cookies.content': 'We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.\n\nYou can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.',
    'privacy.yourRights.title': 'Your Rights',
    'privacy.yourRights.content': 'You have the right to:\n\n• Access the personal data we hold about you\n• Request correction of inaccurate data\n• Request deletion of your data and account\n• Object to processing of your personal data\n• Request restriction of processing\n• Data portability\n\nTo exercise these rights, please contact us using the information below.',
    'privacy.contact.title': 'Contact Us',
    'privacy.contact.content': 'If you have any questions about this Privacy Policy, please contact us through our website or email us at support@Horoscope SERO.app.',
    'privacy.updates.title': 'Updates to This Policy',
    'privacy.updates.content': 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.\n\nYou are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.',
  }

  const zh: Record<string, string> = {
    'privacy.title': '隐私政策',
    'privacy.lastUpdated': '最后更新时间：',
    'privacy.intro.title': '简介',
    'privacy.intro.content': '欢迎使用 Horoscope SERO。我们尊重您的隐私，并致力于保护您的个人数据。本隐私政策解释了我们在您使用我们的服务时如何收集、使用和保护您的信息。\n\n使用 Horoscope SERO 即表示您同意根据本政策收集和使用信息。',
    'privacy.infoWeCollect.title': '我们收集的信息',
    'privacy.infoWeCollect.content': '我们收集以下类型的信息：\n\n• 账户信息：当您使用 Google、GitHub 或邮箱注册时，我们会收集您的邮箱地址和唯一用户标识符。\n\n• 出生数据：为了生成您的本命盘，我们会收集您的出生日期、时间、地点（城市和坐标）以及时区。\n\n• 使用数据：我们可能会收集有关服务访问方式和使用情况的信息，包括您的设备类型、浏览器类型和访问的页面。',
    'privacy.howWeUse.title': '我们如何使用您的信息',
    'privacy.howWeUse.content': '我们将收集的数据用于以下目的：\n\n• 提供和维护我们的服务\n• 创建和管理您的用户账户\n• 计算和展示占星图表\n• 提供 AI 解读功能\n• 改进我们的服务和用户体验\n• 向您发送重要的服务更新',
    'privacy.dataStorage.title': '数据存储与安全',
    'privacy.dataStorage.content': '您的数据通过 Supabase 安全存储，Supabase 是一个采用行业标准加密和安全实践的云数据库服务。我们采取适当的技术和组织措施来保护您的个人数据免遭未经授权的访问、更改、披露或破坏。\n\n所有数据传输均使用 HTTPS 加密。您的占星档案与您的用户账户关联，不会公开显示。',
    'privacy.cookies.title': 'Cookie',
    'privacy.cookies.content': '我们使用 Cookie 和类似的跟踪技术来跟踪我们服务上的活动并保存某些信息。Cookie 是包含少量数据的文件，可能包含匿名唯一标识符。\n\n您可以指示浏览器拒绝所有 Cookie 或在发送 Cookie 时发出提示。但是，如果您不接受 Cookie，您可能无法使用我们服务的某些部分。',
    'privacy.yourRights.title': '您的权利',
    'privacy.yourRights.content': '您有权：\n\n• 访问我们持有的您的个人数据\n• 请求更正不准确的数据\n• 请求删除您的数据和账户\n• 反对处理您的个人数据\n• 请求限制处理\n• 数据可携带权\n\n要行使这些权利，请使用以下信息联系我们。',
    'privacy.contact.title': '联系我们',
    'privacy.contact.content': '如果您对本隐私政策有任何疑问，请通过我们的网站或发送邮件至 support@Horoscope SERO.app 联系我们。',
    'privacy.updates.title': '政策更新',
    'privacy.updates.content': '我们可能会不时更新我们的隐私政策。我们会通过在本页面发布新的隐私政策并更新"最后更新"日期来通知您任何更改。\n\n建议您定期查看本隐私政策以了解任何变化。本隐私政策的变化在发布到本页面时生效。',
  }

  const dict = locale === 'zh' ? zh : en
  return dict[key] || key
}

export default function PrivacyPage() {
  const locale = 'en'

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="animate-fade-in">
          <h1
            className="text-3xl font-bold text-[#e8e6e3] sm:text-4xl"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {t('privacy.title', locale)}
          </h1>
          <p className="mt-2 text-sm text-[#6a6865]">
            {t('privacy.lastUpdated', locale)} {new Date().toLocaleDateString()}
          </p>
          <div className="mt-6 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
        </div>

        <div className="mt-10 space-y-10">
          {sections.map((section, index) => (
            <div
              key={section}
              className="animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <h2 className="text-lg font-semibold text-[#e8e6e3]">
                {t(`privacy.${section}.title`, locale)}
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-[#a8a6a3]">
                <p className="whitespace-pre-line">
                  {t(`privacy.${section}.content`, locale)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
