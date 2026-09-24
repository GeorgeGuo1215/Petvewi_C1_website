import { getLocalizedPath } from "@/i18n/config";
import { localize, type Lang } from "@/i18n/translations";

export type ContentStatus = "ready" | "foundation" | "planned";
export type SiteAreaId = "product" | "commerce" | "support" | "company" | "community";

export type SiteContentItem = {
  slug: string;
  title: string;
  summary: string;
  status: ContentStatus;
  integrationKey: string;
  existingHref?: string;
};

export type SiteArea = {
  id: SiteAreaId;
  number: string;
  title: string;
  kicker: string;
  description: string;
  items: SiteContentItem[];
};

type ItemInput = Omit<SiteContentItem, "title" | "summary"> & {
  title: [string, string, string];
  summary: [string, string, string];
};

function item(lang: Lang, input: ItemInput): SiteContentItem {
  return {
    ...input,
    title: localize(lang, ...input.title),
    summary: localize(lang, ...input.summary),
  };
}

export function getStatusLabel(lang: Lang, status: ContentStatus) {
  if (status === "ready") return localize(lang, "已有内容", "已有內容", "Live");
  if (status === "foundation") return localize(lang, "基础已具备", "基礎已具備", "Foundation ready");
  return localize(lang, "入口已预留", "入口已預留", "Planned");
}

export function getSiteAreas(lang: Lang): SiteArea[] {
  return [
    {
      id: "product",
      number: "4.1",
      title: localize(lang, "产品与体验", "產品與體驗", "Product & experience"),
      kicker: localize(lang, "从第一次认识到每天使用", "從第一次認識到每天使用", "From discovery to everyday use"),
      description: localize(
        lang,
        "现有官网已经建立完整的产品叙事；下一步重点是把佩戴、连接和 App 操作拆成更清晰的体验指南。",
        "現有官網已經建立完整的產品敘事；下一步重點是把佩戴、連接和 App 操作拆成更清晰的體驗指南。",
        "The core product story is already in place. Next, wearing, pairing and App workflows can grow into clearer guided experiences.",
      ),
      items: [
        item(lang, {
          slug: "product-overview",
          title: ["产品概览", "產品概覽", "Product overview"],
          summary: [
            "首屏产品定位、核心价值与连续健康时间线已上线。",
            "首屏產品定位、核心價值與連續健康時間線已上線。",
            "Hero positioning, core value and the continuous health timeline are live.",
          ],
          status: "ready",
          integrationKey: "product.overview",
          existingHref: "/#product",
        }),
        item(lang, {
          slug: "core-features",
          title: ["核心功能", "核心功能", "Core features"],
          summary: [
            "心率、呼吸、行为、定位和异常提醒已有完整展示。",
            "心率、呼吸、行為、定位和異常提醒已有完整展示。",
            "Heart rate, breathing, behavior, location and alerts are already presented.",
          ],
          status: "ready",
          integrationKey: "product.features",
          existingHref: "/#hardware",
        }),
        item(lang, {
          slug: "app-experience",
          title: ["产品使用与 App", "產品使用與 App", "Product use & App"],
          summary: [
            "App 能力已有视觉演示；佩戴、配对和首次连接流程等待补充。",
            "App 能力已有視覺演示；佩戴、配對和首次連接流程等待補充。",
            "The App concept is visualized; wearing, pairing and onboarding flows are ready to be added.",
          ],
          status: "foundation",
          integrationKey: "product.appExperience",
          existingHref: "/#intelligence",
        }),
        item(lang, {
          slug: "use-cases",
          title: ["使用场景", "使用場景", "Use cases"],
          summary: [
            "日常、夜间、独处与康复观察场景已建立，可继续加入老年与慢病专题。",
            "日常、夜間、獨處與康復觀察場景已建立，可繼續加入老年與慢病專題。",
            "Daily, night, alone-time and recovery scenarios are live, with room for senior and chronic-care stories.",
          ],
          status: "foundation",
          integrationKey: "product.useCases",
          existingHref: "/#use-cases",
        }),
        item(lang, {
          slug: "specifications",
          title: ["产品规格", "產品規格", "Specifications"],
          summary: [
            "重量、适配颈围、防水等级和续航范围已有展示。",
            "重量、適配頸圍、防水等級和續航範圍已有展示。",
            "Weight, neck fit, water resistance and battery range are already shown.",
          ],
          status: "foundation",
          integrationKey: "product.specifications",
          existingHref: "/#product",
        }),
        item(lang, {
          slug: "faq",
          title: ["常见问题 FAQ", "常見問題 FAQ", "FAQ"],
          summary: [
            "安全、适用范围、续航、内测与隐私问题已有回答。",
            "安全、適用範圍、續航、內測與隱私問題已有回答。",
            "Safety, fit, battery, beta access and privacy questions are already answered.",
          ],
          status: "ready",
          integrationKey: "product.faq",
          existingHref: "/#faq",
        }),
      ],
    },
    {
      id: "commerce",
      number: "4.2",
      title: localize(lang, "购买与零售", "購買與零售", "Purchase & retail"),
      kicker: localize(lang, "从内测转化到正式交易", "從內測轉化到正式交易", "From beta interest to commerce"),
      description: localize(
        lang,
        "产品尚未发售，目前仅接受内测意向登记；商城、订单、物流与专业采购入口已预留。",
        "產品尚未發售，目前僅接受內測意向登記；商城、訂單、物流與專業採購入口已預留。",
        "The product is not yet on sale. Beta interest registration is open; store, orders, delivery and professional purchasing are planned.",
      ),
      items: [
        item(lang, {
          slug: "online-store",
          title: ["在线商城", "在線商城", "Online store"],
          summary: [
            "商城尚未开放。设备、服务方案及配件信息将在产品发布时公布，目前可登记内测意向。",
            "商城尚未開放。設備、服務方案及配件資訊將在產品發布時公布，目前可登記內測意向。",
            "The store is not yet open. Device, service plan and accessory details will be announced at launch. You can register beta interest now.",
          ],
          status: "foundation",
          integrationKey: "commerce.catalog",
          existingHref: "/#beta",
        }),
        item(lang, {
          slug: "order-status",
          title: ["订单状态查询", "訂單狀態查詢", "Order tracking"],
          summary: [
            "已预留订单号、手机号或邮箱查询入口。",
            "已預留訂單號、手機號或郵箱查詢入口。",
            "A lookup entry for order number, phone or email is reserved.",
          ],
          status: "planned",
          integrationKey: "commerce.orders",
        }),
        item(lang, {
          slug: "shipping-returns",
          title: ["配送与退换货", "配送與退換貨", "Shipping & returns"],
          summary: [
            "政策摘要、地区时效和退换流程页面结构已准备。",
            "政策摘要、地區時效和退換流程頁面結構已準備。",
            "Policy summaries, regional timing and return workflows have a prepared structure.",
          ],
          status: "planned",
          integrationKey: "commerce.fulfillment",
        }),
        item(lang, {
          slug: "professional-purchase",
          title: ["专业与批量采购", "專業與批量採購", "Professional purchasing"],
          summary: [
            "面向宠物医院、研究团队与渠道伙伴的专属询价入口已预留。",
            "面向寵物醫院、研究團隊與渠道夥伴的專屬詢價入口已預留。",
            "A dedicated inquiry path is reserved for clinics, research teams and channel partners.",
          ],
          status: "planned",
          integrationKey: "commerce.professional",
        }),
      ],
    },
    {
      id: "support",
      number: "4.3",
      title: localize(lang, "服务与支持", "服務與支持", "Service & support"),
      kicker: localize(lang, "购买之后仍然安心", "購買之後仍然安心", "Confidence after purchase"),
      description: localize(
        lang,
        "支持中心将统一承载说明书、保修维修、在线客服和隐私安全内容，未来可连接工单或客服系统。",
        "支持中心將統一承載說明書、保修維修、在線客服和隱私安全內容，未來可連接工單或客服系統。",
        "A unified support center will host manuals, warranty, repairs, support and privacy content, ready for ticketing or service integrations.",
      ),
      items: [
        item(lang, {
          slug: "user-manual",
          title: ["使用手册", "使用手冊", "User manual"],
          summary: [
            "已预留快速开始、佩戴、充电、配对与故障排查内容模块。",
            "已預留快速開始、佩戴、充電、配對與故障排查內容模塊。",
            "Quick start, wearing, charging, pairing and troubleshooting modules are reserved.",
          ],
          status: "planned",
          integrationKey: "support.manuals",
        }),
        item(lang, {
          slug: "warranty",
          title: ["保修政策", "保修政策", "Warranty"],
          summary: [
            "保修期限、覆盖范围与凭证要求等待正式政策。",
            "保修期限、覆蓋範圍與憑證要求等待正式政策。",
            "Warranty term, coverage and proof requirements await the final policy.",
          ],
          status: "planned",
          integrationKey: "support.warranty",
        }),
        item(lang, {
          slug: "repair-service",
          title: ["维修服务", "維修服務", "Repair service"],
          summary: [
            "已预留故障判断、送修申请与维修进度入口。",
            "已預留故障判斷、送修申請與維修進度入口。",
            "Diagnosis, repair request and service-status entry points are reserved.",
          ],
          status: "planned",
          integrationKey: "support.repairs",
        }),
        item(lang, {
          slug: "technical-support",
          title: ["技术支持与在线客服", "技術支持與在線客服", "Technical support"],
          summary: [
            "已预留帮助中心、在线咨询和服务工单接口。",
            "已預留幫助中心、在線諮詢和服務工單接口。",
            "Help center, live consultation and service ticket interfaces are reserved.",
          ],
          status: "planned",
          integrationKey: "support.tickets",
        }),
        item(lang, {
          slug: "privacy-security",
          title: ["隐私与数据安全", "隱私與數據安全", "Privacy & data security"],
          summary: [
            "官网已有基础隐私承诺，完整的数据处理与用户权利说明等待补充。",
            "官網已有基礎隱私承諾，完整的數據處理與用戶權利說明等待補充。",
            "A baseline privacy promise exists; full data handling and user-rights documentation can be added.",
          ],
          status: "foundation",
          integrationKey: "support.privacy",
          existingHref: "/#faq",
        }),
      ],
    },
    {
      id: "company",
      number: "4.4",
      title: localize(lang, "品牌与公司", "品牌與公司", "Brand & company"),
      kicker: localize(
        lang,
        "让技术背后的人与选择被看见",
        "讓技術背後的人與選擇被看見",
        "Make the people and choices visible",
      ),
      description: localize(
        lang,
        "团队与技术背景较完整；公司历史、新闻、合作、招聘与可持续发展需要形成长期更新机制。",
        "團隊與技術背景較完整；公司歷史、新聞、合作、招聘與可持續發展需要形成長期更新機制。",
        "Team and technology foundations are strong. History, news, partnerships, careers and sustainability need an ongoing publishing rhythm.",
      ),
      items: [
        item(lang, {
          slug: "about-us",
          title: ["关于我们", "關於我們", "About us"],
          summary: [
            "跨学科研发定位、使命与技术路径已有完整呈现。",
            "跨學科研發定位、使命與技術路徑已有完整呈現。",
            "The interdisciplinary mission, positioning and R&D path are already presented.",
          ],
          status: "foundation",
          integrationKey: "company.about",
          existingHref: "/#company",
        }),
        item(lang, {
          slug: "technology-team",
          title: ["技术团队", "技術團隊", "Technology team"],
          summary: [
            "核心团队、顾问与年轻研发成员已有独立页面。",
            "核心團隊、顧問與年輕研發成員已有獨立頁面。",
            "Core team, advisors and emerging R&D members have a dedicated page.",
          ],
          status: "ready",
          integrationKey: "company.team",
          existingHref: "/team",
        }),
        item(lang, {
          slug: "company-history",
          title: ["创办历史", "創辦歷史", "Our history"],
          summary: [
            "已预留创办缘起、关键里程碑与研发进展时间线。",
            "已預留創辦緣起、關鍵里程碑與研發進展時間線。",
            "Origin story, key milestones and R&D progress timeline are reserved.",
          ],
          status: "planned",
          integrationKey: "company.history",
        }),
        item(lang, {
          slug: "contact",
          title: ["联系方式", "聯繫方式", "Contact"],
          summary: [
            "已预留商务、媒体、用户支持与办公地址信息模块。",
            "已預留商務、媒體、用戶支持與辦公地址信息模塊。",
            "Business, media, support and office contact modules are reserved.",
          ],
          status: "planned",
          integrationKey: "company.contact",
        }),
        item(lang, {
          slug: "newsroom",
          title: ["新闻中心", "新聞中心", "Newsroom"],
          summary: [
            "已预留新闻列表、分类、日期和详情页内容模型。",
            "已預留新聞列表、分類、日期和詳情頁內容模型。",
            "News listing, categories, dates and detail-page content models are reserved.",
          ],
          status: "planned",
          integrationKey: "company.news",
        }),
        item(lang, {
          slug: "partners",
          title: ["合作伙伴", "合作夥伴", "Partners"],
          summary: [
            "已预留科研、临床、供应链与渠道伙伴展示区域。",
            "已預留科研、臨床、供應鏈與渠道夥伴展示區域。",
            "Research, clinical, supply-chain and channel partner areas are reserved.",
          ],
          status: "planned",
          integrationKey: "company.partners",
        }),
        item(lang, {
          slug: "careers",
          title: ["招聘", "招聘", "Careers"],
          summary: [
            "已预留岗位列表、团队文化与申请方式。",
            "已預留崗位列表、團隊文化與申請方式。",
            "Role listings, team culture and application paths are reserved.",
          ],
          status: "planned",
          integrationKey: "company.careers",
        }),
        item(lang, {
          slug: "sustainability-strategy",
          title: ["可持续发展战略", "可持續發展戰略", "Sustainability strategy"],
          summary: [
            "已预留材料、耐用性、维修与循环设计目标。",
            "已預留材料、耐用性、維修與循環設計目標。",
            "Material, durability, repairability and circular-design goals are reserved.",
          ],
          status: "planned",
          integrationKey: "company.sustainability.strategy",
        }),
        item(lang, {
          slug: "sustainability-actions",
          title: ["已开展的行动", "已開展的行動", "Actions underway"],
          summary: [
            "已预留行动清单、数据指标与年度进展。",
            "已預留行動清單、數據指標與年度進展。",
            "Action lists, metrics and annual progress updates are reserved.",
          ],
          status: "planned",
          integrationKey: "company.sustainability.actions",
        }),
        item(lang, {
          slug: "sustainability-participation",
          title: ["用户参与建议", "用戶參與建議", "How users can help"],
          summary: [
            "已预留延长设备寿命、回收和共创建议。",
            "已預留延長設備壽命、回收和共創建議。",
            "Device-life extension, recycling and co-creation guidance are reserved.",
          ],
          status: "planned",
          integrationKey: "company.sustainability.participation",
        }),
      ],
    },
    {
      id: "community",
      number: "4.5",
      title: localize(lang, "内容与社区", "內容與社區", "Content & community"),
      kicker: localize(
        lang,
        "把一次访问变成长久陪伴",
        "把一次訪問變成長久陪伴",
        "Turn a visit into an ongoing relationship",
      ),
      description: localize(
        lang,
        "社区愿景已有品牌表达；故事、知识、活动和社媒分发需要独立内容流与持续运营。",
        "社區願景已有品牌表達；故事、知識、活動和社媒分發需要獨立內容流與持續運營。",
        "The community vision is visible. Stories, knowledge, events and social distribution need dedicated content streams and ongoing operations.",
      ),
      items: [
        item(lang, {
          slug: "pet-stories",
          title: ["宠物故事", "寵物故事", "Pet stories"],
          summary: [
            "已预留故事封面、宠物档案、正文与相关内容模块。",
            "已預留故事封面、寵物檔案、正文與相關內容模塊。",
            "Story cover, pet profile, article and related-content modules are reserved.",
          ],
          status: "planned",
          integrationKey: "community.stories",
        }),
        item(lang, {
          slug: "care-guides",
          title: ["养宠知识", "養寵知識", "Care guides"],
          summary: [
            "已预留健康、营养、行为与设备使用知识分类。",
            "已預留健康、營養、行為與設備使用知識分類。",
            "Health, nutrition, behavior and device-use knowledge categories are reserved.",
          ],
          status: "planned",
          integrationKey: "community.guides",
        }),
        item(lang, {
          slug: "community-events",
          title: ["用户活动", "用戶活動", "Community events"],
          summary: [
            "已预留活动日历、报名、回顾与用户共创入口。",
            "已預留活動日曆、報名、回顧與用戶共創入口。",
            "Event calendar, registration, recaps and co-creation entry points are reserved.",
          ],
          status: "planned",
          integrationKey: "community.events",
        }),
        item(lang, {
          slug: "social-channels",
          title: ["外部社媒入口", "外部社媒入口", "Social channels"],
          summary: [
            "已预留微信、小红书、Instagram 等渠道链接与二维码位置。",
            "已預留微信、小紅書、Instagram 等渠道鏈接與二維碼位置。",
            "Links and QR placements are reserved for WeChat, Xiaohongshu, Instagram and more.",
          ],
          status: "planned",
          integrationKey: "community.social",
        }),
      ],
    },
  ];
}

export function getAllContentSlugs() {
  return getSiteAreas("zh").flatMap((area) => area.items.map((entry) => entry.slug));
}

export function getContentEntry(lang: Lang, slug: string) {
  for (const area of getSiteAreas(lang)) {
    const entry = area.items.find((candidate) => candidate.slug === slug);
    if (entry) return { area, entry };
  }
  return null;
}

export function getContentPath(slug: string, lang: Lang) {
  return getLocalizedPath(`/explore/${slug}`, lang);
}

export function getExistingContentPath(href: string, lang: Lang) {
  const [pathname, hash] = href.split("#");
  return `${getLocalizedPath(pathname || "/", lang)}${hash ? `#${hash}` : ""}`;
}
