import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Horoscope SERO',
  description: 'Terms and conditions for using Horoscope SERO astrology services.',
  openGraph: {
    title: 'Terms of Service — Horoscope SERO',
    description: 'Terms and conditions for using Horoscope SERO astrology services.',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service — Horoscope SERO',
    description: 'Terms and conditions for using Horoscope SERO astrology services.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const sections = [
  'acceptance',
  'service',
  'account',
  'conduct',
  'ip',
  'disclaimer',
  'changes',
  'disputes',
  'contact',
]

function t(key: string, locale: string): string {
  const en: Record<string, string> = {
    'terms.title': 'Terms of Service',
    'terms.lastUpdated': 'Last updated:',
    'terms.acceptance.title': 'Acceptance of Terms',
    'terms.acceptance.content': 'By accessing or using Horoscope SERO (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.\n\nThese terms apply to all visitors, users, and others who access or use the Service.',
    'terms.service.title': 'Description of Service',
    'terms.service.content': 'Horoscope SERO provides astrological chart calculations, daily transit information, synastry analysis, and AI-powered interpretation services. The Service is for entertainment and self-reflection purposes only.',
    'terms.account.title': 'User Accounts',
    'terms.account.content': 'When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.\n\nYou are responsible for safeguarding the password and for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.',
    'terms.conduct.title': 'Acceptable Use',
    'terms.conduct.content': 'You agree not to use the Service to:\n\n• Violate any applicable laws or regulations\n• Infringe upon the rights of others\n• Upload or transmit malicious code\n• Attempt to gain unauthorized access to the Service\n• Use the Service for any illegal or unauthorized purpose\n• Interfere with or disrupt the Service or servers',
    'terms.ip.title': 'Intellectual Property',
    'terms.ip.content': 'The Service and its original content, features, and functionality are and will remain the exclusive property of Horoscope SERO and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.\n\nOur trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Horoscope SERO.',
    'terms.disclaimer.title': 'Disclaimer',
    'terms.disclaimer.content': 'ASTROLOGICAL READINGS AND INTERPRETATIONS PROVIDED BY Horoscope SERO ARE FOR ENTERTAINMENT AND SELF-REFLECTION PURPOSES ONLY.\n\nThe Service is not a substitute for professional advice, including but not limited to psychological, medical, legal, financial, or career advice. Always seek the advice of qualified professionals regarding any such matters.\n\nWe make no representations or warranties of any kind, express or implied, about the accuracy, reliability, or completeness of the information provided through the Service.',
    'terms.changes.title': 'Changes to Service',
    'terms.changes.content': 'We reserve the right to withdraw or amend our Service, and any service or material we provide via the Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Service is unavailable at any time or for any period.\n\nWe may also impose limits on certain features and services or restrict your access to parts or all of the Service without notice or liability.',
    'terms.disputes.title': 'Governing Law & Disputes',
    'terms.disputes.content': 'These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.\n\nAny dispute arising out of or relating to these Terms or the Service will be resolved through good faith negotiation. If unresolved, disputes shall be submitted to the competent courts of said jurisdiction.',
    'terms.contact.title': 'Contact',
    'terms.contact.content': 'If you have any questions about these Terms, please contact us at support@Horoscope SERO.app.',
  }

  const zh: Record<string, string> = {
    'terms.title': '服务条款',
    'terms.lastUpdated': '最后更新时间：',
    'terms.acceptance.title': '条款接受',
    'terms.acceptance.content': '访问或使用 Horoscope SERO（"服务"）即表示您同意受本服务条款的约束。如果您不同意任何部分条款，则不得访问本服务。\n\n这些条款适用于所有访问或使用服务的访客、用户和其他人。',
    'terms.service.title': '服务描述',
    'terms.service.content': 'Horoscope SERO 提供占星图表计算、每日行运信息、合盘分析以及 AI 解读服务。本服务仅供娱乐和自我反思目的使用。',
    'terms.account.title': '用户账户',
    'terms.account.content': '当您向我们创建账户时，您必须提供始终准确、完整且最新的信息。未能这样做构成违反条款，可能导致立即终止您在我们服务上的账户。\n\n您负责保护密码以及在您账户下发生的所有活动。一旦您知道任何安全漏洞或未经授权使用您的账户，必须立即通知我们。',
    'terms.conduct.title': '合理使用',
    'terms.conduct.content': '您同意不将服务用于：\n\n• 违反任何适用的法律法规\n• 侵犯他人的权利\n• 上传或传输恶意代码\n• 试图未经授权访问服务\n• 将服务用于任何非法或未经授权的目的\n• 干扰或破坏服务或服务器',
    'terms.ip.title': '知识产权',
    'terms.ip.content': '本服务及其原始内容、功能和功能均为 Horoscope SERO 及其许可方的专有财产，并且将继续如此。本服务受美国和其他国家的版权、商标和其他法律保护。\n\n未经 Horoscope SERO 事先书面同意，我们的商标和商业外观不得与任何产品或服务结合使用。',
    'terms.disclaimer.title': '免责声明',
    'terms.disclaimer.content': 'Horoscope SERO 提供的占星解读仅供娱乐和自我反思目的使用。\n\n本服务不能替代专业建议，包括但不限于心理、医疗、法律、财务或职业建议。对于任何此类事项，请始终寻求合格专业人士的建议。\n\n我们不对通过服务提供的信息的准确性、可靠性或完整性作出任何类型的明示或暗示的陈述或保证。',
    'terms.changes.title': '服务变更',
    'terms.changes.content': '我们保留自行决定撤回或修改我们的服务以及我们通过服务提供的任何服务或材料的权利，恕不另行通知。如果由于任何原因服务的全部或任何部分在任何时间或任何期间不可用，我们将不承担任何责任。\n\n我们还可能对某些功能和服务施加限制，或者限制您对部分或全部服务的访问，恕不另行通知，也不承担责任。',
    'terms.disputes.title': '适用法律与争议',
    'terms.disputes.content': '本条款应受我们运营所在司法管辖区的法律管辖和解释，不考虑其法律冲突规定。\n\n因本条款或服务引起或与之相关的任何争议将通过真诚协商解决。如未能解决，争议应提交给上述司法管辖区的主管法院。',
    'terms.contact.title': '联系方式',
    'terms.contact.content': '如果您对本条款有任何疑问，请通过 support@Horoscope SERO.app 联系我们。',
  }

  const dict = locale === 'zh' ? zh : en
  return dict[key] || key
}

export default function TermsPage() {
  const locale = 'en'

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="animate-fade-in">
          <h1
            className="text-3xl font-bold text-[#e8e6e3] sm:text-4xl"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {t('terms.title', locale)}
          </h1>
          <p className="mt-2 text-sm text-[#6a6865]">
            {t('terms.lastUpdated', locale)} {new Date().toLocaleDateString()}
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
                {t(`terms.${section}.title`, locale)}
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-[#a8a6a3]">
                <p className="whitespace-pre-line">
                  {t(`terms.${section}.content`, locale)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
