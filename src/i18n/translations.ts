export type Lang = "zh" | "zh-TW" | "en";

export function localize(lang: Lang, simplified: string, traditional: string, english: string): string {
  if (lang === "en") return english;
  if (lang === "zh-TW") return traditional;
  return simplified;
}

export const translations = {
  zh: {
    nav: { formula: "安心配方", ai: "App生态", team: "团队", compare: "竞品对比", preorder: "申请内测", lang: "繁體" },
    hero: {
      badge: "让每一位宠物主真正地安心",
      subtitle: "24小时毛孩贴身守护精灵",
      desc: "毫米波雷达 × 多模态大模型，重新定义宠物健康管理新范式",
      cta1: "申请内测", cta2: "了解产品", scroll: "向下滚动",
    },
    stats: [
      { value: "24/7", label: "全天候守护" },
      { value: "40+", label: "顶级兽医验证" },
      { value: "健康级→医疗级", label: "检测精度" },
      { value: "研发中", label: "产品状态" },
    ],
    pain: {
      label: "问题所在", title: "毛孩子生病\n不会说话",
      items: [
        { title: "白大褂效应", desc: "临床诊疗环境诱发强烈应激反应，掩盖宠物真实生理基线，造成「应激性失真」。" },
        { title: "检测非连续", desc: "现有方法仅能院内离散瞬时采样，宠物离院后缺乏 24/7 全天候连续动态追踪。" },
        { title: "束缚与伤害", desc: "传统 ECG 设备需剃毛且易伤皮肤，要求宠物静止，无法实现居家监测。" },
      ],
    },
    hardware: {
      label: "安心配方 01", title: "硬件革命", subtitle: "突破毛发屏障的毫米波雷达终端",
      desc: "自主研发专利毫米波雷达终端，构建宠物健康的第一道预警防线；结合多模态融合定位（GPS+LBS+WiFi）与高精度多轴 IMU。",
      features: [
        { title: "无惧毛发阻隔", desc: "毫米波信号具备卓越穿透力，无视厚重毛发干扰，无需剃毛即可直达体征监测。" },
        { title: "医疗级精准度", desc: "捕捉皮下生命体征微距变化，生成专业多普勒心动图与呼吸相位图，精度对齐临床设备。" },
        { title: "零压感非接触", desc: "纯雷达非接触式感知，宠物全程无感佩戴，从物理层面根除白大衣效应与应激反应。" },
      ],
    },
    ai: {
      label: "安心配方 02", title: "软件大脑", subtitle: "PetMind 大模型全方位守护",
      desc: "针对通用大模型在垂直领域的认知局限，引入海量真实临床数据深度训练，构建真正具备「兽医临床思维」的专用 AI 内核。",
      features: [
        { title: "心律与呼吸率异常警报", desc: "实时监测生命体征，异常情况秒级推送。" },
        { title: "异常行为模式识别", desc: "多轴 IMU 精准捕捉动态行为，深度还原活动特征。" },
        { title: "饮食与生活干预建议", desc: "结合品种、年龄、既往病史进行交叉深度分析。" },
        { title: "AI 兽医思维链", desc: "Agent 多轮思考，分析异常体征，给出专业就医指导。" },
      ],
    },
    social: {
      label: "安心配方 03", title: "专属宠物社交圈", subtitle: "在交友与心得分享中消除焦虑",
      features: [
        { title: "发现与共鸣", desc: "全网精选热门话题，随时分享毛孩子日常，在别人的经验中找到安心。" },
        { title: "附近宠友", desc: "基于高精度定位，发现身边的毛孩子，随时约玩，交流养宠心得。" },
        { title: "专属互助圈", desc: "异常预警时，一键求助社区同品种资深宠主，用群体经验缓解突发恐慌。" },
      ],
    },
    team: {
      label: "团队介绍", title: "跨学科核心研发团队",
      desc: "重新定义宠物健康管理，顶尖团队指导和支持构建宠物生态体系",
      core: "核心研发团队", support: "顶尖指导与支持",
      members: {
        ceo: { name: "Mr. Guo Zhaojin", role: "CEO", desc: ["香港城市大学兽医医学及生命科学院&创新学院博士生", "剑桥大学2025/26「未来全球领袖」", "国际动物福利研讨会优秀论文奖、国际顶尖动物科学期刊审稿人", "负责 PetMind 和上层算法的设计和训练"] },
        scientist: { name: "Dr. DONG Shuqin", role: "首席科学家", desc: ["中国首位 IEEE MTT-S 医疗应用研究生奖学金获得者", "香港城市大学 ITF 博士后研究员，深耕毫米波生物雷达近 10 年", "发表 40 余篇生物雷达相关国际学术论文", "主持宠物医疗级雷达模块底层算法与硬件设计"] },
        cto: { name: "Mr. LYU Li", role: "CTO", desc: ["香港城市大学-康奈尔大学联培兽医学博士生", "宾夕法尼亚大学兽医学院访问学者", "欧洲精准畜牧业大会最佳博士论文奖", "负责动态环境下微弱生物信号的提取与识别"] },
        cdo: { name: "Ms. Liu Yuning", role: "CMO&CDO", desc: ["从事宠物及 IP 市场产品销售数年", "拥有海内外供应链与电商渠道分销网络"] },
        prof_liu: { name: "Prof. LIU Kai", role: "指导教授", desc: ["香港城市大学赛马会动物医学及生命科学院副教授", "主导 AI 动物健康算法的病理模型构建", "提供海量临床标注数据支持"] },
        prof_guo: { name: "Prof. Guo Yongxin", role: "指导教授", desc: ["香港城市大学电子工程系讲座教授、香港城市大学青岛研究院院长", "IEEE 会士、新加坡工程院院士", "为毫米波雷达技术提供顶层设计与全球领先理论指导"] },
        prof_chan: { name: "Prof. CHAN Derek", role: "指导教授", desc: ["香港城市大学创新学院教授", "现任华润创业（CR Enterprise）高级投资总监", "担任香港创科创投基金首席投资官"] },
      },
      intern_label: "实习团队",
      interns: {
        zhang_zheng: { name: "张正", role: "产品实习生", desc: ["香港城市大学商学院数据分析硕士研究生", "美国亚利桑那大学统计学与数据科学双学士学位", "国家软件著作权专利《深度学习与人工智能训练平台》持有人", "美国大学生数学建模竞赛（MCM）二等奖", "兼具产品设计与数据分析能力，主导产品规划、数据策略与智能训练平台建设"] },
        dai_zhihao: { name: "戴智濠", role: "大模型 Agent 实习生", desc: ["华南理工大学数据科学与大数据技术（本科）", "中国科学院北京基因组研究所 实习生", "华为通软嵌入式开发实习生", "负责动物健康 AI Agent 系统架构设计与搭建"] },
        wu_mengmeng: { name: "吴 Mengmeng", role: "Agent 校准与测评", desc: ["浙江大学", "负责 PetMind Agent 的校准与测评"] },
      },
    },
    compare: {
      label: "产品差异", title: "从记录活动，到理解健康。",
      desc: "不止知道去了哪里、动了多少，更理解心率、呼吸与行为如何随时间变化。PetHealthAI 将传感器、算法与 AI 服务整合为一套完整的连续健康系统。",
      col1: "功能与指标", col2: "传统产品", col3: "PetHealthAI",
      rows: [
        { label: "生理指标传感器", old: "光电（易受毛发干扰）", next: "毫米波雷达（可穿透毛发）" },
        { label: "生理指标精度", old: "模糊估算", next: "医疗级精度" },
        { label: "AI 智能分析", old: "无 / 基础规则", next: "PetMind 垂类大模型" },
        { label: "售价", old: "200–600 USD", next: "尚未发售，定价待公布", highlight: true },
      ],
    },
    faq: {
      label: "常见问题", title: "你可能想知道",
      items: [
        { q: "毫米波雷达对宠物安全吗？", a: "完全安全。我们使用的毫米波频段（60GHz）功率极低，远低于手机辐射标准，且为非电离辐射，对宠物和人体均无任何伤害。" },
        { q: "项圈适合哪些宠物？", a: "目前主要针对猫咪和中小型犬设计，重量约 28g，适合颈围 20–45cm 的宠物。大型犬版本正在研发中。" },
        { q: "续航时间有多长？", a: "在标准使用模式下（持续监测 + GPS 每 5 分钟定位），续航可达 72 小时；关闭 GPS 后可延长至 120 小时以上。" },
        { q: "内测资格如何获得？", a: "产品尚未正式发售。您可填写申请表登记内测意向，具体安排确认后，我们会通过您留下的联系方式通知您。登记不产生订单或费用。" },
        { q: "数据隐私如何保障？", a: "所有宠物健康数据均加密存储，仅用于为您提供个性化健康分析，绝不向第三方共享或出售。" },
      ],
    },
    beta: {
      badge: "产品研发中", title: "成为第一批守护者",
      desc: "产品尚未正式发售，欢迎登记内测意向，与我们一起探索宠物健康的更多可能",
      limitedTag: "尚未发售", productName: "精灵一代 智能健康项圈",
      reviewNote: "研发阶段 · 尚未发售",
      price: "敬请期待", originalPrice: "", save: "",
      priceNote: "上市时间与价格待公布",
      benefits: ["产品尚未正式发售", "售价、服务方案及上市时间将在发布时公布", "内测申请仅登记意向，不产生订单或费用"],
      colorLabel: "配色偏好：", colors: ["星空黑", "月光白", "天空蓝"],
      planLabel: "AI 服务周期意向（非订购）",
      plans: [
        { label: "月度", price: "价格待公布", desc: "仅登记偏好" },
        { label: "年度", price: "价格待公布", desc: "仅登记偏好", badge: "" },
        { label: "两年", price: "价格待公布", desc: "仅登记偏好" },
      ],
      features: ["毫米波雷达实时心率 & 呼吸监测", "GPS + LBS + WiFi 多模态定位", "最长 120 小时续航", "IP68 防水防尘", "PetMind AI 兽医级分析", "异常预警秒级推送"],
      cta: "申请内测资格 →", ctaNote: "申请仅登记内测意向，不产生订单或费用。",
      viewLabels: ["正视图", "侧视图", "俯视图"],
      modal: {
        title: "申请内测资格", desc: "填写信息，我们将优先联系您",
        fields: [{ label: "您的姓名", placeholder: "请输入姓名", type: "text" }, { label: "微信号", placeholder: "请输入微信号，方便联系", type: "text" }, { label: "邮箱（选填）", placeholder: "your@email.com", type: "email" }],
        submit: "提交申请", privacy: "您的信息仅用于内测资格审核，不会用于其他用途",
        successTitle: "申请已提交！", successDesc: "感谢您的支持，内测意向已登记。具体安排确认后，我们会联系您；本次登记不产生订单或费用。", close: "关闭",
      },
    },
    footer: { mission: "我们的使命：让每一位宠物主真正地安心", copyright: "PetHealthAI. All rights reserved." },
    scrollTop: "回到顶部",
    phone: {
      title: "宠物健康助手", desc: "专业的宠物健康咨询，随时为你和爱宠服务",
      features: [{ title: "健康咨询", desc: "宠物疾病、症状分析、预防建议" }, { title: "营养指导", desc: "饮食搭配、营养补充、体重管理" }, { title: "日常护理", desc: "行为训练、美容护理、生活习惯" }],
      tabs: ["首页", "社交圈", "健康助手", "设备连接", "我的"], input: "输入消息...",
    },
  },
  "zh-TW": {
    nav: { formula: "安心配方", ai: "App生態", team: "團隊", compare: "競品對比", preorder: "申請內測", lang: "EN" },
    hero: {
      badge: "讓每一位寵物主真正地安心",
      subtitle: "24小時毛孩貼身守護精靈",
      desc: "毫米波雷達 × 多模態大模型，重新定義寵物健康管理新範式",
      cta1: "申請內測", cta2: "了解產品", scroll: "向下滾動",
    },
    stats: [
      { value: "24/7", label: "全天候守護" },
      { value: "40+", label: "頂級獸醫驗證" },
      { value: "健康級→醫療級", label: "檢測精度" },
      { value: "研發中", label: "產品狀態" },
    ],
    pain: {
      label: "問題所在", title: "毛孩子生病\n不會說話",
      items: [
        { title: "白大褂效應", desc: "臨床診療環境誘發強烈應激反應，掩蓋寵物真實生理基線，造成「應激性失真」。" },
        { title: "檢測非連續", desc: "現有方法僅能院內離散瞬時採樣，寵物離院後缺乏 24/7 全天候連續動態追蹤。" },
        { title: "束縛與傷害", desc: "傳統 ECG 設備需剃毛且易傷皮膚，要求寵物靜止，無法實現居家監測。" },
      ],
    },
    hardware: {
      label: "安心配方 01", title: "硬體革命", subtitle: "突破毛髮屏障的毫米波雷達終端",
      desc: "自主研發專利毫米波雷達終端，構建寵物健康的第一道預警防線；結合多模態融合定位（GPS+LBS+WiFi）與高精度多軸 IMU。",
      features: [
        { title: "無懼毛髮阻隔", desc: "毫米波信號具備卓越穿透力，無視厚重毛髮干擾，無需剃毛即可直達體徵監測。" },
        { title: "醫療級精準度", desc: "捕捉皮下生命體徵微距變化，生成專業多普勒心動圖與呼吸相位圖，精度對齊臨床設備。" },
        { title: "零壓感非接觸", desc: "純雷達非接觸式感知，寵物全程無感佩戴，從物理層面根除白大衣效應與應激反應。" },
      ],
    },
    ai: {
      label: "安心配方 02", title: "軟體大腦", subtitle: "PetMind 大模型全方位守護",
      desc: "針對通用大模型在垂直領域的認知局限，引入海量真實臨床數據深度訓練，構建真正具備「獸醫臨床思維」的專用 AI 內核。",
      features: [
        { title: "心律與呼吸率異常警報", desc: "即時監測生命體徵，異常情況秒級推送。" },
        { title: "異常行為模式識別", desc: "多軸 IMU 精準捕捉動態行為，深度還原活動特徵。" },
        { title: "飲食與生活干預建議", desc: "結合品種、年齡、既往病史進行交叉深度分析。" },
        { title: "AI 獸醫思維鏈", desc: "Agent 多輪思考，分析異常體徵，給出專業就醫指導。" },
      ],
    },
    social: {
      label: "安心配方 03", title: "專屬寵物社交圈", subtitle: "在交友與心得分享中消除焦慮",
      features: [
        { title: "發現與共鳴", desc: "全網精選熱門話題，隨時分享毛孩子日常，在別人的經驗中找到安心。" },
        { title: "附近寵友", desc: "基於高精度定位，發現身邊的毛孩子，隨時約玩，交流養寵心得。" },
        { title: "專屬互助圈", desc: "異常預警時，一鍵求助社區同品種資深寵主，用群體經驗緩解突發恐慌。" },
      ],
    },
    team: {
      label: "團隊介紹", title: "跨學科核心研發團隊",
      desc: "重新定義寵物健康管理，頂尖團隊指導和支持構建寵物生態體系",
      core: "核心研發團隊", support: "頂尖指導與支持",
      members: {
        ceo: { name: "Mr. Guo Zhaojin", role: "CEO", desc: ["香港城市大學獸醫醫學及生命科學院&創新學院博士生", "劍橋大學2025/26「未來全球領袖」", "國際動物福利研討會優秀論文獎、國際頂尖動物科學期刊審稿人", "負責 PetMind 和上層演算法的設計和訓練"] },
        scientist: { name: "Dr. DONG Shuqin", role: "首席科學家", desc: ["中國首位 IEEE MTT-S 醫療應用研究生獎學金獲得者", "香港城市大學 ITF 博士後研究員，深耕毫米波生物雷達近 10 年", "發表 40 餘篇生物雷達相關國際學術論文", "主持寵物醫療級雷達模組底層演算法與硬體設計"] },
        cto: { name: "Mr. LYU Li", role: "CTO", desc: ["香港城市大學-康奈爾大學聯培獸醫學博士生", "賓夕法尼亞大學獸醫學院訪問學者", "歐洲精準畜牧業大會最佳博士論文獎", "負責動態環境下微弱生物信號的提取與識別"] },
        cdo: { name: "Ms. Liu Yuning", role: "CMO&CDO", desc: ["從事寵物及 IP 市場產品銷售數年", "擁有海內外供應鏈與電商渠道分銷網絡"] },
        prof_liu: { name: "Prof. LIU Kai", role: "指導教授", desc: ["香港城市大學賽馬會動物醫學及生命科學院副教授", "主導 AI 動物健康演算法的病理模型構建", "提供海量臨床標註數據支持"] },
        prof_guo: { name: "Prof. Guo Yongxin", role: "指導教授", desc: ["香港城市大學電子工程系講座教授、香港城市大學青島研究院院長", "IEEE 會士、新加坡工程院院士", "為毫米波雷達技術提供頂層設計與全球領先理論指導"] },
        prof_chan: { name: "Prof. CHAN Derek", role: "指導教授", desc: ["香港城市大學創新學院教授", "現任華潤創業（CR Enterprise）高級投資總監", "擔任香港創科創投基金首席投資官"] },
      },
      intern_label: "實習團隊",
      interns: {
        zhang_zheng: { name: "張正", role: "產品實習生", desc: ["香港城市大學商學院數據分析碩士研究生", "美國亞利桑那大學統計學與數據科學雙學士學位", "國家軟體著作權專利《深度學習與人工智能訓練平台》持有人", "美國大學生數學建模競賽（MCM）二等獎", "兼具產品設計與數據分析能力，主導產品規劃、數據策略與智能訓練平台建設"] },
        dai_zhihao: { name: "戴智濠", role: "大模型 Agent 實習生", desc: ["華南理工大學數據科學與大數據技術（本科）", "中國科學院北京基因組研究所 實習生", "華為通軟嵌入式開發實習生", "負責動物健康 AI Agent 系統架構設計與搭建"] },
        wu_mengmeng: { name: "吳 Mengmeng", role: "Agent 校準與測評", desc: ["浙江大學", "負責 PetMind Agent 的校準與測評"] },
      },
    },
    compare: {
      label: "產品差異", title: "從記錄活動，到理解健康。",
      desc: "不只知道去了哪裡、動了多少，更理解心率、呼吸與行為如何隨時間變化。PetHealthAI 將感測器、演算法與 AI 服務整合為一套完整的連續健康系統。",
      col1: "功能與指標", col2: "傳統產品", col3: "PetHealthAI",
      rows: [
        { label: "生理指標感測器", old: "光電（易受毛髮干擾）", next: "毫米波雷達（可穿透毛髮）" },
        { label: "生理指標精度", old: "模糊估算", next: "醫療級精度" },
        { label: "AI 智能分析", old: "無 / 基礎規則", next: "PetMind 垂類大模型" },
        { label: "售價", old: "200–600 USD", next: "尚未發售，定價待公布", highlight: true },
      ],
    },
    faq: {
      label: "常見問題", title: "你可能想知道",
      items: [
        { q: "毫米波雷達對寵物安全嗎？", a: "完全安全。我們使用的毫米波頻段（60GHz）功率極低，遠低於手機輻射標準，且為非電離輻射，對寵物和人體均無任何傷害。" },
        { q: "項圈適合哪些寵物？", a: "目前主要針對貓咪和中小型犬設計，重量約 28g，適合頸圍 20–45cm 的寵物。大型犬版本正在研發中。" },
        { q: "續航時間有多長？", a: "在標準使用模式下（持續監測 + GPS 每 5 分鐘定位），續航可達 72 小時；關閉 GPS 後可延長至 120 小時以上。" },
        { q: "內測資格如何獲得？", a: "產品尚未正式發售。您可填寫申請表登記內測意向，具體安排確認後，我們會透過您留下的聯絡方式通知您。登記不產生訂單或費用。" },
        { q: "數據隱私如何保障？", a: "所有寵物健康數據均加密存儲，僅用於為您提供個性化健康分析，絕不向第三方共享或出售。" },
      ],
    },
    beta: {
      badge: "產品研發中", title: "成為第一批守護者",
      desc: "產品尚未正式發售，歡迎登記內測意向，與我們一起探索寵物健康的更多可能",
      limitedTag: "尚未發售", productName: "精靈一代 智能健康項圈",
      reviewNote: "研發階段 · 尚未發售",
      price: "敬請期待", originalPrice: "", save: "",
      priceNote: "上市時間與價格待公布",
      benefits: ["產品尚未正式發售", "售價、服務方案及上市時間將在發布時公布", "內測申請僅登記意向，不產生訂單或費用"],
      colorLabel: "配色偏好：", colors: ["星空黑", "月光白", "天空藍"],
      planLabel: "AI 服務週期意向（非訂購）",
      plans: [
        { label: "月度", price: "價格待公布", desc: "僅登記偏好" },
        { label: "年度", price: "價格待公布", desc: "僅登記偏好", badge: "" },
        { label: "兩年", price: "價格待公布", desc: "僅登記偏好" },
      ],
      features: ["毫米波雷達即時心率 & 呼吸監測", "GPS + LBS + WiFi 多模態定位", "最長 120 小時續航", "IP68 防水防塵", "PetMind AI 獸醫級分析", "異常預警秒級推送"],
      cta: "申請內測資格 →", ctaNote: "申請僅登記內測意向，不產生訂單或費用。",
      viewLabels: ["正視圖", "側視圖", "俯視圖"],
      modal: {
        title: "申請內測資格", desc: "填寫資訊，我們將優先聯繫您",
        fields: [{ label: "您的姓名", placeholder: "請輸入姓名", type: "text" }, { label: "微信號", placeholder: "請輸入微信號，方便聯繫", type: "text" }, { label: "郵箱（選填）", placeholder: "your@email.com", type: "email" }],
        submit: "提交申請", privacy: "您的資訊僅用於內測資格審核，不會用於其他用途",
        successTitle: "申請已提交！", successDesc: "感謝您的支持，內測意向已登記。具體安排確認後，我們會聯繫您；本次登記不產生訂單或費用。", close: "關閉",
      },
    },
    footer: { mission: "我們的使命：讓每一位寵物主真正地安心", copyright: "PetHealthAI. All rights reserved." },
    scrollTop: "回到頂部",
    phone: {
      title: "寵物健康助手", desc: "專業的寵物健康諮詢，隨時為你和愛寵服務",
      features: [{ title: "健康諮詢", desc: "寵物疾病、症狀分析、預防建議" }, { title: "營養指導", desc: "飲食搭配、營養補充、體重管理" }, { title: "日常護理", desc: "行為訓練、美容護理、生活習慣" }],
      tabs: ["首頁", "社交圈", "健康助手", "設備連接", "我的"], input: "輸入訊息...",
    },
  },
  en: {
    nav: { formula: "Our Formula", ai: "App Ecosystem", team: "Team", compare: "Comparison", preorder: "Apply for beta", lang: "简中" },
    hero: {
      badge: "True peace of mind for every pet owner",
      subtitle: "24/7 Guardian for Your Furry Friend",
      desc: "mmWave Radar × Multimodal LLM — redefining the paradigm of pet health management",
      cta1: "Apply for Beta", cta2: "Learn More", scroll: "Scroll Down",
    },
    stats: [
      { value: "24/7", label: "Round-the-clock" },
      { value: "40+", label: "Top Vet Validated" },
      { value: "Health→Medical", label: "Grade Accuracy" },
      { value: "In development", label: "Product status" },
    ],
    pain: {
      label: "The Problem", title: "Pets can't tell you\nwhen they're sick",
      items: [
        { title: "White Coat Effect", desc: "Clinical environments trigger acute stress responses, masking pets' true physiological baseline and causing stress-induced distortion." },
        { title: "Discontinuous Monitoring", desc: "Existing methods only capture discrete in-clinic snapshots. There's no 24/7 continuous dynamic tracking after the pet leaves." },
        { title: "Restraint & Harm", desc: "Traditional ECG devices require shaving and can injure skin, demanding the pet stay still — impossible for home monitoring." },
      ],
    },
    hardware: {
      label: "Formula 01", title: "Hardware Revolution", subtitle: "mmWave Radar That Sees Through Fur",
      desc: "Our proprietary patented mmWave radar terminal builds the first line of defense for pet health, combined with multi-modal positioning (GPS+LBS+WiFi) and high-precision multi-axis IMU.",
      features: [
        { title: "Fur-Penetrating Signal", desc: "mmWave signals pass through dense fur without shaving, reaching vital signs directly." },
        { title: "Medical-Grade Precision", desc: "Captures micro-movements of subcutaneous vital signs, generating Doppler cardiograms aligned with clinical devices." },
        { title: "Zero-Pressure Non-Contact", desc: "Pure radar non-contact sensing — pets wear it without noticing, eliminating white coat effect at the physical level." },
      ],
    },
    ai: {
      label: "Formula 02", title: "AI Brain", subtitle: "PetMind LLM — Full-Spectrum Guardian",
      desc: "Trained on massive real clinical data to overcome the limitations of general LLMs in vertical domains, building an AI core with genuine veterinary clinical thinking.",
      features: [
        { title: "Heart Rate & Breathing Alerts", desc: "Real-time vital sign monitoring with second-level anomaly push notifications." },
        { title: "Abnormal Behavior Recognition", desc: "Multi-axis IMU precisely captures dynamic behavior and deeply restores activity patterns." },
        { title: "Diet & Lifestyle Interventions", desc: "Cross-analysis combining breed, age, and medical history for personalized recommendations." },
        { title: "AI Vet Chain-of-Thought", desc: "Multi-round Agent reasoning analyzes abnormal signs and provides professional medical guidance." },
      ],
    },
    social: {
      label: "Formula 03", title: "Pet Social Community", subtitle: "Ease anxiety through connection & shared experience",
      features: [
        { title: "Discover & Connect", desc: "Curated trending topics — share your pet's daily life and find reassurance in others' experiences." },
        { title: "Nearby Pet Friends", desc: "High-precision location-based discovery of nearby pets for playdates and knowledge exchange." },
        { title: "Mutual Aid Circle", desc: "When alerts fire, instantly reach out to experienced owners of the same breed in the community." },
      ],
    },
    team: {
      label: "Our Team", title: "Interdisciplinary Core R&D Team",
      desc: "Redefining pet health management with world-class guidance and support",
      core: "Core R&D Team", support: "Advisory & Support",
      members: {
        ceo: { name: "Mr. Guo Zhaojin", role: "CEO", desc: ["PhD candidate, CityU HK Jockey Club College of Veterinary Medicine & Jockey Club College of Innovation", "Cambridge University 2025/26 'Future Global Leader'", "Outstanding Paper Award at Int'l Animal Welfare Symposium; reviewer for top animal science journals", "Leads PetMind design and upper-layer algorithm training"] },
        scientist: { name: "Dr. DONG Shuqin", role: "Chief Scientist", desc: ["China's first IEEE MTT-S Graduate Fellowship in Medical Applications", "ITF Postdoctoral Fellow at CityU HK, 10 years in mmWave bio-radar", "Published 40+ international papers on biological radar", "Leads radar module hardware design and core algorithms"] },
        cto: { name: "Mr. LYU Li", role: "CTO", desc: ["Joint PhD candidate, CityU HK – Cornell University", "Visiting Scholar, University of Pennsylvania School of Veterinary Medicine", "Best Doctoral Thesis Award, European Conference on Precision Livestock Farming", "Leads weak bio-signal extraction in dynamic environments"] },
        cdo: { name: "Ms. Liu Yuning", role: "CMO&CDO", desc: ["Several years of experience in pet and IP product sales", "Owns domestic and overseas supply-chain resources and e-commerce distribution channels"] },
        prof_liu: { name: "Prof. LIU Kai", role: "Advisor", desc: ["Associate Professor, CityU HK Jockey Club College of Veterinary Medicine", "Leads pathological model construction for AI animal health algorithms", "Provides large-scale annotated clinical data support"] },
        prof_guo: { name: "Prof. Guo Yongxin", role: "Advisor", desc: ["Chair Professor of EE, CityU HK; Director, City University of Hong Kong Qingdao Research Institute", "IEEE Fellow, Fellow of Singapore Academy of Engineering", "Provides top-level design and globally leading theoretical guidance for mmWave radar"] },
        prof_chan: { name: "Prof. CHAN Derek", role: "Advisor", desc: ["Professor, CityU HK College of Innovation", "Senior Investment Director, CR Enterprise", "Chief Investment Officer, HKSAR Innovation & Technology Venture Fund"] },
      },
      intern_label: "Interns",
      interns: {
        zhang_zheng: { name: "ZHANG Zheng", role: "Product Intern", desc: ["MSc candidate in Data Analytics, CityU HK College of Business", "Dual BSc in Statistics & Data Science, University of Arizona", "National Software Copyright Patent: Deep Learning & AI Training Platform", "MCM Mathematical Contest in Modeling, Meritorious Winner (2nd Prize)", "Bridges product design and data analytics — leads product planning, data strategy, and intelligent training platform development"] },
        dai_zhihao: { name: "DAI Zhihao", role: "LLM Agent Intern", desc: ["BSc in Data Science & Big Data Technology, South China University of Technology", "Research Intern, Beijing Institute of Genomics, Chinese Academy of Sciences", "Embedded Development Intern, Huawei Software Technologies", "Leads design and development of the animal health AI Agent system"] },
        wu_mengmeng: { name: "WU Mengmeng", role: "Agent Calibration & Evaluation", desc: ["Zhejiang University", "Responsible for PetMind Agent calibration and evaluation"] },
      },
    },
    compare: {
      label: "Product difference", title: "From tracking activity to understanding health.",
      desc: "Go beyond where they went and how much they moved. Understand how heart rate, breathing and behavior change over time through one continuous system of sensors, algorithms and AI care.",
      col1: "Feature", col2: "Traditional Products", col3: "PetHealthAI",
      rows: [
        { label: "Vital Sign Sensor", old: "Optical (blocked by fur)", next: "mmWave Radar (penetrates fur)" },
        { label: "Measurement Accuracy", old: "Rough estimation", next: "Medical-grade precision" },
        { label: "AI Analysis", old: "None / basic rules", next: "PetMind vertical LLM" },
        { label: "Price", old: "200–600 USD", next: "Not yet available; pricing to be announced", highlight: true },
      ],
    },
    faq: {
      label: "FAQ", title: "You might be wondering",
      items: [
        { q: "Is mmWave radar safe for pets?", a: "Completely safe. The 60GHz mmWave band we use has extremely low power — far below mobile phone radiation standards — and is non-ionizing radiation, harmless to both pets and humans." },
        { q: "Which pets is the collar designed for?", a: "Currently designed for cats and small-to-medium dogs, weighing ~28g and fitting neck circumferences of 20–45cm. A large dog version is in development." },
        { q: "How long does the battery last?", a: "In standard mode (continuous monitoring + GPS every 5 min), battery lasts 72 hours. With GPS off, it extends to 120+ hours." },
        { q: "How do I get beta access?", a: "The product is not yet on sale. Submit the form to register your interest, and we will contact you when beta arrangements are confirmed. Registration creates no order or payment." },
        { q: "How is my data privacy protected?", a: "All pet health data is encrypted and used solely to provide personalized health analysis. We never share or sell data to third parties." },
      ],
    },
    beta: {
      badge: "In development", title: "Be Among the First Guardians",
      desc: "Our product is not yet on sale. Register your interest in beta testing and help shape the future of pet health.",
      limitedTag: "Not yet available", productName: "Elf Version 1 Smart Health Collar",
      reviewNote: "In development · Not yet available",
      price: "Coming soon", originalPrice: "", save: "",
      priceNote: "Launch timing and pricing to be announced",
      benefits: ["The product is not yet on sale", "Pricing, service plans and availability will be announced at launch", "Beta registration records interest only; no order or payment is created"],
      colorLabel: "Preferred finish: ", colors: ["Space Black", "Moonlight White", "Sky Blue"],
      planLabel: "Preferred AI service period (not a purchase)",
      plans: [
        { label: "Monthly", price: "Pricing pending", desc: "Preference only" },
        { label: "Annual", price: "Pricing pending", desc: "Preference only", badge: "" },
        { label: "2-Year", price: "Pricing pending", desc: "Preference only" },
      ],
      features: ["mmWave real-time heart rate & breathing", "GPS + LBS + WiFi multi-modal positioning", "Up to 120-hour battery life", "IP68 waterproof & dustproof", "PetMind AI vet-grade analysis", "Second-level anomaly push alerts"],
      cta: "Apply for Beta Access →", ctaNote: "Register your interest only. No order or payment is created.",
      viewLabels: ["Front", "Side", "Top"],
      modal: {
        title: "Apply for Beta Access", desc: "Fill in your info and we'll reach out first",
        fields: [{ label: "Your Name", placeholder: "Enter your name", type: "text" }, { label: "WeChat ID", placeholder: "Enter your WeChat ID", type: "text" }, { label: "Email (optional)", placeholder: "your@email.com", type: "email" }],
        submit: "Submit Application", privacy: "Your info is used solely for beta qualification review and will never be shared.",
        successTitle: "Application Submitted!", successDesc: "Thank you. Your beta interest is registered. We will contact you when arrangements are confirmed; no order or payment has been created.", close: "Close",
      },
    },
    footer: { mission: "Our mission: true peace of mind for every pet owner", copyright: "PetHealthAI. All rights reserved." },
    scrollTop: "Back to top",
    phone: {
      title: "Pet Health Assistant", desc: "Professional pet health consultation, always here for you",
      features: [{ title: "Health Consult", desc: "Disease, symptom analysis, prevention tips" }, { title: "Nutrition Guide", desc: "Diet planning, supplements, weight management" }, { title: "Daily Care", desc: "Behavior training, grooming, lifestyle habits" }],
      tabs: ["Home", "Social", "Health AI", "Devices", "Profile"], input: "Type a message...",
    },
  },
};
