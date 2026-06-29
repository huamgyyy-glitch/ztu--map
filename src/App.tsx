import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import AMapLoader from "@amap/amap-jsapi-loader";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { BookmarkSimple } from "@phosphor-icons/react/BookmarkSimple";
import { Camera } from "@phosphor-icons/react/Camera";
import { ChatCircle } from "@phosphor-icons/react/ChatCircle";
import { Heart } from "@phosphor-icons/react/Heart";
import { House } from "@phosphor-icons/react/House";
import { ImageSquare } from "@phosphor-icons/react/ImageSquare";
import { Lightbulb } from "@phosphor-icons/react/Lightbulb";
import { MapPin } from "@phosphor-icons/react/MapPin";
import { PaperPlaneTilt } from "@phosphor-icons/react/PaperPlaneTilt";
import { Star } from "@phosphor-icons/react/Star";
import { X } from "@phosphor-icons/react/X";
import { architectureAsset, cardPhoto, foodAsset, mapAsset } from "./assets";
import {
  foodCategoryColor,
  foodMapCategories,
  foodMapSpots,
  foodRouteTimeline,
  type FoodMapCategory,
  type FoodMapSpot,
} from "./data/mapFoodSpots";
import {
  cultureCategoryColor,
  cultureMapCategories,
  cultureMapSpots,
  type CultureMapCategory,
  type CultureMapSpot,
} from "./data/mapCultureSpots";

const optimizedAsset = (name: string) => `/assets/optimized/${name}`;

const entrances = [
  { to: "/map", tab: "手绘导览", title: "古城手绘地图", desc: "美食点、古建点、拍照点、夜游点一图掌握，导航不迷路！", icon: "home-handdrawn-map.webp", tone: "green" },
  { to: "/food", tab: "烟火美味", title: "昭通味道图鉴", desc: "油糕稀豆粉、烧洋芋、昭通小肉串……尝一口地道昭通味！", icon: "home-food-guide.webp", tone: "red" },
  { to: "/architecture", tab: "建筑人文", title: "屋檐下的古城", desc: "青瓦民居、城门牌坊、老会馆、古城街巷，藏着百年的故事。", icon: "home-architecture.webp", tone: "blue" },
  { to: "/cinema", tab: "游客安利", title: "游客安利墙", desc: "上传你的古城美照，分享拍摄地点与推荐理由，让更多人遇见昭通之美！", icon: "home-cinema.webp", tone: "purple" },
];

type FoodItem = {
  id: string;
  name: string;
  category: string;
  photo: string;
  tags: string[];
  time: string;
  way: string;
  highlight: string;
  text: string;
  likes: string;
};

const foodCategories = [
  { id: "breakfast", name: "早餐必吃", desc: "一天的元气从这里开始", icon: "🍜" },
  { id: "street", name: "街边小吃", desc: "烟火气里的地道美味", icon: "🥔" },
  { id: "night", name: "夜宵推荐", desc: "夜晚热闹的味蕾狂欢", icon: "🍢" },
  { id: "classic", name: "本地经典", desc: "代代相传的昭通味道", icon: "🏯" },
  { id: "hot", name: "热门安利", desc: "游客都在吃的推荐榜", icon: "🔥" },
];

const foods: FoodItem[] = [
  { id: "rice", name: "油糕稀豆粉", category: "早餐必吃", photo: "food-yougao-xidoufen.jpg", tags: ["酥香", "绵滑", "暖胃"], time: "07:30—10:30", way: "趁热掰开油糕，蘸着稀豆粉吃", highlight: "本地黄豆磨浆，手工油糕现炸，香气浓郁", text: "油糕泡进稀豆粉，一酥一滑，是昭通清晨最舒服的暖意。", likes: "8.2k" },
  { id: "potato", name: "烧洋芋", category: "街边小吃", photo: "food-shaoyangyu.jpg", tags: ["软糯", "蘸料香"], time: "10:00—21:00", way: "炭火慢烤后蘸辣椒面吃", highlight: "外焦里糯，越吃越香", text: "炭火烤得焦香，蘸一口辣椒面，越吃越有味。", likes: "7.9k" },
  { id: "skewer", name: "昭通小肉串", category: "夜宵推荐", photo: "food-zhaotong-skewer.jpg", tags: ["炭火", "鲜辣"], time: "18:00—23:00", way: "刚出炉时配一杯冰饮", highlight: "现烤现卖，油香和辣香一起冒出来", text: "小串现烤，油香和辣香一起冒出来，是夜晚最热闹的味道。", likes: "7.5k" },
  { id: "rice-noodle", name: "豆花米线", category: "早餐必吃", photo: "food-douhua-mixian.jpg", tags: ["豆花细嫩", "米线爽滑"], time: "07:00—11:00", way: "先拌辣椒，再喝一口汤", highlight: "豆花细嫩，米线爽滑，汤鲜味美", text: "豆花细嫩、米线爽滑，汤鲜味美。", likes: "6.5k" },
  { id: "cool", name: "凉粉", category: "街边小吃", photo: "food-liangfen.jpg", tags: ["冰凉爽口", "酸辣开胃"], time: "14:00—17:00", way: "加醋加辣，拌匀后入口", highlight: "清凉解暑，低脂时光", text: "冰凉爽口，酸辣开胃，夏日必备。", likes: "6.8k" },
  { id: "tofu", name: "烤豆腐", category: "街边小吃", photo: "food-kaodoufu.jpg", tags: ["外焦里嫩", "蘸料香"], time: "15:00—22:00", way: "蘸折耳根辣椒蘸水", highlight: "外焦里嫩，秘制蘸料香气扑鼻", text: "外焦里嫩，秘制蘸料香气扑鼻。", likes: "6.2k" },
  { id: "hotpot", name: "小锅串串", category: "夜宵推荐", photo: "food-xiaoguo-chuanchuan.jpg", tags: ["麻辣鲜香", "越煮越入味"], time: "18:00—23:30", way: "荤素搭配，慢慢涮", highlight: "锅多味，麻辣鲜香", text: "锅多味，麻辣鲜香，越煮越入味。", likes: "5.9k" },
  { id: "cold", name: "蘸凉粉", category: "本地经典", photo: "food-zhan-liangfen.jpg", tags: ["清爽", "咸香"], time: "11:00—18:00", way: "蘸汁浓一点更香", highlight: "清香爽滑，独特的山风风味", text: "奔爽凉粉，清香爽滑，独特的山风风味。", likes: "5.3k" },
];

type ArchitecturePlace = {
  id: string;
  name: string;
  group: string;
  photo: string;
  description: string;
  tags: string[];
  tip: string;
  cardText: string;
};

const architectureGroups = [
  { title: "会馆与大院", items: ["guild", "li", "shaanxi-guild", "guizhou-guild", "chijia-courtyard"] },
  { title: "老街与巷子", items: ["square", "old-street", "huaiyuan-street", "doujie", "alley"] },
  { title: "城门与人文", items: ["gate", "quma", "wenmiao", "jiangliangfu-home", "kuixing-pavilion"] },
];

const architectureItems: ArchitecturePlace[] = [
  { id: "guild", name: "广东会馆", group: "会馆与大院", photo: "arch-guildhall.jpg", description: "清代商帮集资所建，木雕石刻精美，戏楼飞檐恢宏，见证昭通商脉与文化交融。", tags: ["商帮文化", "戏楼", "木雕", "石刻"], tip: "看建筑细节、拍屋檐和会馆门楼，感受商帮文化与精湛工艺。", cardText: "会馆庭院，雕梁画栋，气度不凡。" },
  { id: "li", name: "李氏支祠", group: "会馆与大院", photo: "arch-li-family.jpg", description: "清光绪年间实业家李耀庭所建二进祠堂，木构梁柱古朴厚重，古戏台常年上演庭院实景剧，承载李氏家族百年商道文脉。", tags: ["祠堂文化", "庭院戏剧", "木雕古建", "商儒文脉"], tip: "参观祠堂碑刻与木刻古籍，傍晚观看实景话剧，在天井庭院拍摄古风人像。", cardText: "二进祠堂，木构厚重，百年商道藏在院落与戏台之间。" },
  { id: "shaanxi-guild", name: "陕西会馆", group: "会馆与大院", photo: "arch-guildhall.jpg", description: "清乾隆陕商集资修建三进院落，又称关帝庙，碑刻记载山陕商训，飞檐戏楼规制宏大，见证滇铜商贸往来。", tags: ["山陕商帮", "关帝文化", "古戏楼", "石刻碑记"], tip: "细读会馆商训石碑，拍摄对称院落全景，细看梁柱精美木雕纹样。", cardText: "陕商会馆与关帝信仰相连，戏楼飞檐里有旧时商路回声。" },
  { id: "guizhou-guild", name: "贵州会馆", group: "会馆与大院", photo: "arch-guildhall.jpg", description: "乾隆黔商共建，旧名忠烈宫、黑神庙，院落雅致清幽，融合黔滇两地建筑特色，记录旧时山货药材商贸历史。", tags: ["黔商文化", "古戏台遗存", "中式院落", "乡土文脉"], tip: "漫步回廊感受静谧庭院，寻找老照片复刻点位，了解黔滇通商往事。", cardText: "清幽院落连着黔滇商路，适合慢慢看回廊与戏台遗存。" },
  { id: "chijia-courtyard", name: "迟家大院", group: "会馆与大院", photo: "arch-li-family.jpg", description: "民国昭通首富私宅，前院中式天井雕花门窗，后院西式拱廊洋楼，中西合璧独一无二，内设非遗体验工坊。", tags: ["中西合璧", "民国老宅", "天井民居", "非遗体验"], tip: "打卡中西建筑碰撞机位，体验甲马印制、剪纸非遗，逛老宅花园与绣楼。", cardText: "中式天井与西式拱廊并置，民国老宅里藏着非遗体验。" },
  { id: "square", name: "辕门口", group: "老街与巷子", photo: "arch-square.jpeg", description: "古城城市中轴线核心，旧时镇署衙门所在地，矗立抗战出征纪念碑与百年钟楼，是老城政治商贸文化交汇中心。", tags: ["古城中心", "红色历史", "钟楼地标", "衙署旧址"], tip: "打卡钟楼全景，细读共赴国难纪念碑，站制高点俯瞰全城街巷肌理。", cardText: "钟楼、纪念碑与旧衙署记忆交汇，是老城中轴线的核心节点。" },
  { id: "old-street", name: "北正街", group: "老街与巷子", photo: "arch-old-street.jpg", description: "古城主干道，沿街保留老式骑楼商铺，新旧商铺交融，连通多座会馆街巷，烟火气与古建筑交织。", tags: ["老城商街", "骑楼建筑", "市井烟火", "街巷串联"], tip: "沿街逛特色小店，拍摄骑楼复古街景，串联周边会馆步行游览。", cardText: "骑楼商铺与烟火日常沿街展开，是串联会馆与巷子的主线。" },
  { id: "huaiyuan-street", name: "怀远街", group: "老街与巷子", photo: "arch-old-street.jpg", description: "古城网红商业街，标志性过街骑楼横跨街巷，两侧文创、茶馆云集，是古城人流核心打卡地。", tags: ["过街骑楼", "网红街巷", "文创市集", "休闲茶馆"], tip: "过街楼正下方居中打卡，逛文创小店，街边茶馆歇脚看往来行人。", cardText: "过街骑楼横跨街巷，文创小店和茶馆把老街变得热闹。" },
  { id: "doujie", name: "陡街", group: "老街与巷子", photo: "arch-doujie.jpg", description: "石阶古街，曲折上行，老建筑与街招一起构成复古街景。", tags: ["拍照", "慢逛", "街景"], tip: "低机位顺着坡度拍，纵深感最强。", cardText: "石阶古街，曲折上行，别有韵味。" },
  { id: "alley", name: "挑水巷", group: "老街与巷子", photo: "tiaoshuixiang-stone-alley.jpg", description: "青石板路与窄巷相连，安静、清爽，适合寻找古城慢生活。", tags: ["小巷", "青石", "慢行"], tip: "雨后或清晨光线柔和，巷子更有层次。", cardText: "老巷幽深，青石板路，静谧清幽。" },
  { id: "gate", name: "抚镇门", group: "城门与人文", photo: "arch-gate.jpg", description: "古城城门与石牌坊相接，线条稳重，是城市记忆的重要入口。", tags: ["城门", "牌坊", "历史"], tip: "正面取景，把城门、道路和天空一起纳入画面。", cardText: "古城阙门，城楼巍峨，登楼望城。" },
  { id: "quma", name: "趣马门", group: "城门与人文", photo: "arch-quma-gate.jpeg", description: "城门楼阁舒展，飞檐层叠，城墙厚重，是进入古城气韵的一眼开场。", tags: ["城门", "楼阁", "拍照"], tip: "适合正面取景，把城门、道路和天空一起纳入画面，气势最完整。", cardText: "楼阁巍峨，城门开阔，第一眼很震撼。" },
  { id: "wenmiao", name: "文庙", group: "城门与人文", photo: "arch-wenmiao.jpg", description: "红墙、飞檐与文脉空间相连，是古城里最有书卷气的建筑片段。", tags: ["文庙", "红墙", "人文"], tip: "拍红墙与飞檐的局部，画面干净又有古意。", cardText: "近代学堂故居，书香门第，文脉悠长。" },
  { id: "jiangliangfu-home", name: "姜亮夫故居", group: "城门与人文", photo: "arch-wenmiao.jpg", description: "国学大师姜亮夫旧居，小巧静谧四合院，陈列先生著作与生平史料，书香满院，文脉厚重。", tags: ["名人故居", "国学文脉", "四合院", "文史展馆"], tip: "安静品读先生生平展，庭院内拍摄书香氛围感照片，感受文人风骨。", cardText: "小巧四合院里陈列文史著作，书香气从院落里慢慢铺开。" },
  { id: "kuixing-pavilion", name: "魁星阁", group: "城门与人文", photo: "arch-wenmiao.jpg", description: "文庙配套清代古建，攒尖飞檐楼阁，古时学子祈福金榜题名之地，小巧精致，文脉寓意浓厚。", tags: ["科举文化", "文昌楼阁", "文庙配套", "古风小景"], tip: "拍摄楼阁飞檐特写，了解古代科举文化，与文庙建筑群联动游览。", cardText: "攒尖飞檐小巧精致，科举祈福的寓意很适合和文庙一起看。" },
];

const architectureMapSpotIds: Record<string, string> = {
  guild: "culture-guildhall-guangdong",
  li: "culture-li-family",
  "shaanxi-guild": "culture-shaanxi-guildhall",
  "guizhou-guild": "culture-guizhou-guildhall",
  "chijia-courtyard": "culture-chijia-courtyard",
  square: "culture-yuanmenkou",
  "old-street": "culture-beizheng-street",
  "huaiyuan-street": "culture-huaiyuan-street",
  doujie: "culture-doujie",
  alley: "culture-tiaoshui-alley",
  gate: "culture-fuzhen-gate",
  quma: "culture-quma-gate",
  wenmiao: "culture-wenmiao",
  "jiangliangfu-home": "culture-jiangliangfu-home",
  "kuixing-pavilion": "culture-kuixing-pavilion",
};

type CinemaPost = {
  id: string;
  title: string;
  place: string;
  photo: string;
  text: string;
  category: string;
  likes: number;
  author: string;
  time: string;
  top?: number;
  isNew?: boolean;
};

const cinemaPosts: CinemaPost[] = [
  { id: "sunset", title: "夕阳下的昭通古城", place: "城隍庙观景台", photo: "architecture-paifang-sunrise.jpg", text: "黄昏真的太治愈了，古城在夕阳里温柔得像一幅画。", category: "拍照点", likes: 1286, author: "山城漫游者", time: "刚刚", top: 1 },
  { id: "wenmiao-night", title: "夜晚的文庙", place: "文庙广场", photo: "ancient-building-night.jpg", text: "灯光一亮，整个文庙都变得很有氛围感，超美！", category: "夜景", likes: 672, author: "阿飞的旅行", time: "5小时前", top: 2 },
  { id: "skewer", title: "昭通小肉串！", place: "昭通古城美食街", photo: "food-meat-skewer.jpg", text: "炭火烤得滋滋香，小肉串配特色蘸料，绝了！", category: "美食", likes: 548, author: "吃货小圆", time: "6小时前", top: 3 },
  { id: "old-lane", title: "藏在巷子里的时光", place: "太平街小巷", photo: "old-street-walk.jpg", text: "慢慢走、慢慢看，仿佛回到了旧时光里。", category: "小巷", likes: 233, author: "时光漫步", time: "1天前" },
  { id: "rice", title: "油糕稀豆粉真香！", place: "昭通古城小吃店", photo: "cinema-oil-cake-pea-paste.jpg", text: "一口油糕，一口稀豆粉，暖心又满足～", category: "美食", likes: 412, author: "豆豆爱吃", time: "1天前" },
  { id: "gate", title: "登高望古城", place: "城墙观景台", photo: "stone-paifang.jpg", text: "站在城墙上俯瞰古城，层层叠叠的屋檐太壮观了！", category: "古建筑", likes: 389, author: "山城漫游者", time: "2天前" },
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePageReal />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/food" element={<FoodPage />} />
      <Route path="/architecture" element={<ArchitecturePage />} />
      <Route path="/cinema" element={<CinemaPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function TopBar() {
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span>昭</span>
        <strong>昭通古城</strong>
      </Link>
      <Link to="/" className="home-link"><House weight="bold" />返回首页</Link>
    </header>
  );
}

function BookShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <main className={`book-shell ${className}`}>{children}</main>;
}

function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="page-title">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  );
}

function HomePageReal() {
  const [tipsOpen, setTipsOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <main className="home-page">
      <span className="home-leaf leaf-one" />
      <span className="home-leaf leaf-two" />
      <span className="home-leaf leaf-three" />

      <header className="site-header" aria-label="首页导航">
        <Link className="home-brand" to="/" aria-label="昭通古城首页">
          <img src={optimizedAsset("home-hero-left.webp")} alt="" />
          <span>
            <strong>昭通古城</strong>
            <em>一口烟火，一眼百年</em>
          </span>
        </Link>

        <nav className="nav-pills" aria-label="首页快捷导航">
          <button className="nav-pill" type="button" onClick={() => setTipsOpen(true)}>
            <Lightbulb weight="regular" />
            <span>游玩贴士</span>
          </button>
          <Link className="nav-pill nav-camera" to="/cinema">
            <Camera weight="regular" />
            <span>拍照打卡</span>
          </Link>
          <Link className="nav-pill" to="/food">
            <span className="nav-icon-text" aria-hidden="true">♨</span>
            <span>必吃推荐</span>
          </Link>
          <Link className="nav-pill" to="/map">
            <MapPin weight="regular" />
            <span>游览路线</span>
          </Link>
          <button
            className={`nav-pill nav-save ${saved ? "is-saved" : ""}`}
            type="button"
            onClick={() => setSaved((value) => !value)}
            aria-pressed={saved}
          >
            <Heart weight={saved ? "fill" : "regular"} />
            <span>{saved ? "已收藏" : "收藏本页"}</span>
          </button>
        </nav>

        <Link className="home-button" to="/">
          <House weight="bold" />
          <span>返回首页</span>
        </Link>
      </header>

      <section className="hero-section" aria-label="昭通古城奇妙游">
        <img
          className="hero-illustration hero-illustration-left"
          src={optimizedAsset("home-hero-left.webp")}
          alt="昭通古城门楼插画"
          decoding="async"
          fetchPriority="high"
        />
        <div className="hero-copy">
          <h1>昭通古城奇妙游</h1>
          <p className="hero-subtitle">一口烟火，一眼百年</p>
          <p className="hero-desc">
            这里有青瓦飞檐的老街，有热气腾腾的烟火味，也有流转百年的故事与人情。
            打开这本小小的导览手册，一起出发吧！
          </p>
        </div>
        <img
          className="hero-illustration hero-illustration-right"
          src={optimizedAsset("home-hero-right.webp")}
          alt="昭通古城街景与美食插画"
          decoding="async"
        />
      </section>

      <section className="feature-grid" aria-label="首页入口">
        <Link className="feature-card interactive-card map-card" to="/map" aria-label="进入古城手绘地图">
          <span className="sticker">手绘导览</span>
          <div className="feature-copy">
            <h2>古城地图</h2>
            <p>美食点、古建点、拍照点、夜游点一图掌握，导航不迷路！</p>
          </div>
          <div className="feature-art map-art">
            <img src={optimizedAsset("home-handdrawn-map.webp")} alt="古城手绘地图插画" loading="lazy" />
            <span className="map-pulse" />
            <svg className="route-dash" viewBox="0 0 420 210" aria-hidden="true">
              <path d="M42 152 C115 80 170 170 232 98 S334 72 382 42" />
            </svg>
          </div>
          <span className="card-arrow"><ArrowRight weight="bold" /></span>
        </Link>

        <Link className="feature-card interactive-card food-card" to="/food" aria-label="进入昭通味道图鉴">
          <span className="sticker">烟火美味</span>
          <div className="feature-copy">
            <h2>昭通味道图鉴</h2>
            <p>油糕稀豆粉、烧洋芋、昭通小肉串……尝一口地道昭通味！</p>
          </div>
          <div className="feature-art">
            <span className="steam steam-one" />
            <span className="steam steam-two" />
            <span className="steam steam-three" />
            <img src={optimizedAsset("home-food-guide.webp")} alt="昭通美食插画" loading="lazy" />
          </div>
          <span className="card-arrow"><ArrowRight weight="bold" /></span>
        </Link>

        <Link className="feature-card interactive-card architecture-card" to="/architecture" aria-label="进入屋檐下的古城">
          <span className="sticker">建筑人文</span>
          <div className="feature-copy">
            <h2>屋檐下的古城</h2>
            <p>青瓦民居、城门牌坊、老会馆、古城街巷，藏着百年的故事。</p>
          </div>
          <div className="feature-art">
            <span className="warm-glow" />
            <img src={optimizedAsset("home-architecture.webp")} alt="屋檐与灯笼插画" loading="lazy" />
          </div>
          <span className="card-arrow"><ArrowRight weight="bold" /></span>
        </Link>

        <Link className="feature-card interactive-card cinema-card" to="/cinema" aria-label="进入游客便利贴">
          <span className="sticker">游客便利贴</span>
          <div className="feature-copy">
            <h2>游客便利贴</h2>
            <p>上传你的古城美照，分享拍摄地点与推荐理由，让更多人遇见昭通之美！</p>
          </div>
          <div className="feature-art">
            <span className="camera-spark" />
            <img src={optimizedAsset("home-cinema.webp")} alt="相机胶片游客便利贴插画" loading="lazy" />
          </div>
          <span className="card-arrow"><ArrowRight weight="bold" /></span>
        </Link>
      </section>

      {tipsOpen && (
        <Modal title="游玩贴士" onClose={() => setTipsOpen(false)}>
          <div className="tips-long-copy">
            <p>来昭通古城不要抱着“逛大景区”的心态，它最舒服的玩法不是赶景点，而是慢慢钻巷子。建议下午四五点左右来，光线没那么晒，青瓦屋檐、老院子和街边小摊都比较有味道，拍照也比正午好看。</p>
            <p>路线可以从趣马门附近开始，先沿着老街随便走一走，再往挑水巷方向逛。挑水巷里面藏着不少老建筑，迟家大院、广东会馆都值得进去看看。广东会馆不是那种特别大的景点，但门楼、戏台、木雕和院子的细节很耐看，适合慢慢拍，不要只在门口打个卡就走。</p>
            <p>如果想拍照，建议避开最热闹的主街，多往小巷里面走。昭通古城真正好看的地方，往往不是最显眼的牌坊，而是转角处的青石板路、老墙、木门、屋檐和晒太阳的老人。穿浅色衣服、复古一点的衣服会比较出片。</p>
            <p>吃东西可以从早上的油糕稀豆粉开始，热乎乎的很有昭通味道。下午可以试试烧洋芋、凉粉，晚上再去吃小肉串。古城最有烟火气的时候其实是傍晚以后，灯慢慢亮起来，人也多起来，边走边吃会比白天更有感觉。</p>
            <p>需要注意的是，古城街巷不算特别大，不建议把行程安排得太满。留两三个小时慢慢逛刚刚好，如果还要拍照、吃东西，可以安排半天。下雨天青石板会有点滑，穿舒服一点的鞋；有些老建筑内部空间不大，拍照的时候尽量别大声喧哗，也不要触碰木雕、墙面和展陈。</p>
            <p>总的来说，昭通古城不是那种一眼惊艳的地方，但它越逛越有味道。它好看的地方在生活感里：巷子里的风、老院子的光、烤洋芋的香味，还有本地人慢悠悠的日常。想真正感受昭通古城，别急，慢慢走就对了。</p>
          </div>
        </Modal>
      )}
    </main>
  );
}

type MapFilter = "全部" | "美食店铺" | FoodMapCategory | CultureMapCategory;

type MapDisplaySpot = {
  id: string;
  kind: "food" | "culture";
  name: string;
  street: string;
  address: string;
  categories: string[];
  primaryCategory: string;
  feature: string;
  openTime: string;
  photoTip: string;
  interview: string;
  duration: string;
  fallback?: [number, number];
  geocodeKeyword: string;
  image?: string;
};

type ResolvedMapSpot = MapDisplaySpot & {
  lng?: number;
  lat?: number;
  geocodeStatus: "matched" | "fallback" | "pending";
  resolvedAddress?: string;
};

const mapFilterItems: MapFilter[] = [
  "全部",
  "美食店铺",
  ...foodMapCategories.filter((item): item is FoodMapCategory => item !== "全部"),
  ...cultureMapCategories,
];

function toFoodDisplaySpot(spot: FoodMapSpot): MapDisplaySpot {
  return {
    ...spot,
    kind: "food",
    categories: [...spot.categories],
  };
}

function toCultureDisplaySpot(spot: CultureMapSpot): MapDisplaySpot {
  return {
    id: spot.id,
    kind: "culture",
    name: spot.name,
    street: spot.category,
    address: spot.address,
    categories: [spot.category],
    primaryCategory: spot.category,
    feature: spot.feature,
    openTime: spot.openTime,
    photoTip: spot.photoTip,
    interview: spot.interview,
    duration: spot.duration,
    geocodeKeyword: spot.geocodeKeyword,
    image: spot.image,
  };
}

function MapPage() {
  const [searchParams] = useSearchParams();
  const foodDisplaySpots = useMemo(() => foodMapSpots.map(toFoodDisplaySpot), []);
  const cultureDisplaySpots = useMemo(() => cultureMapSpots.map(toCultureDisplaySpot), []);
  const allSpots = useMemo(() => [...foodDisplaySpots, ...cultureDisplaySpots], [foodDisplaySpots, cultureDisplaySpots]);
  const requestedSpotId = searchParams.get("spot") ?? "";
  const requestedSpot = useMemo(() => allSpots.find((spot) => spot.id === requestedSpotId), [allSpots, requestedSpotId]);
  const [filter, setFilter] = useState<MapFilter>(() => requestedSpot ? requestedSpot.primaryCategory as MapFilter : "全部");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(() => requestedSpot?.id ?? foodMapSpots[0].id);
  const [routeNotice, setRouteNotice] = useState("沿着北正街、陡街、崇义街和挑水巷，把一天的烟火味慢慢串起来。");
  const searchText = query.trim().toLowerCase();

  useEffect(() => {
    if (!requestedSpotId) return;
    if (!requestedSpot) {
      setFilter("全部");
      setQuery("");
      setSelectedId(foodMapSpots[0].id);
      return;
    }
    setFilter(requestedSpot.primaryCategory as MapFilter);
    setQuery("");
    setSelectedId(requestedSpot.id);
  }, [requestedSpotId, requestedSpot]);

  const visibleMapSpots = useMemo(() => {
    const filtered = allSpots.filter((spot) => {
      const categoryMatched =
        filter === "全部"
        || (filter === "美食店铺" && spot.kind === "food")
        || spot.categories.includes(filter);
      if (!categoryMatched) return false;
      if (!searchText) return true;
      return [
        spot.name,
        spot.street,
        spot.address,
        spot.feature,
        spot.photoTip,
        spot.interview,
        spot.categories.join(" "),
      ].some((value) => value.toLowerCase().includes(searchText));
    });
    return filtered;
  }, [allSpots, filter, searchText]);

  const selected = useMemo(() => (
    allSpots.find((spot) => spot.id === selectedId)
    ?? visibleMapSpots[0]
    ?? foodDisplaySpots[0]
  ), [allSpots, selectedId, visibleMapSpots, foodDisplaySpots]);

  const navigateToSpot = (spot: MapDisplaySpot) => {
    if (!spot.fallback) {
      window.open(`https://uri.amap.com/search?keyword=${encodeURIComponent(`昭通市昭阳区${spot.name}`)}&src=zhaotong-food-map`, "_blank", "noopener,noreferrer");
      return;
    }
    const [lng, lat] = spot.fallback;
    window.open(`https://uri.amap.com/navigation?to=${lng},${lat},${encodeURIComponent(spot.name)}&mode=walk&policy=1&src=zhaotong-food-map`, "_blank", "noopener,noreferrer");
  };

  const chooseRouteSpot = (spotId: string) => {
    setFilter("全部");
    setQuery("");
    setSelectedId(spotId);
    const spot = foodDisplaySpots.find((item) => item.id === spotId);
    if (spot) {
      setRouteNotice(`已聚焦「${spot.name}」，可以从地图 marker 或右侧卡片继续导航。`);
    }
  };

  return (
    <main className="map-page food-map-page">
      <header className="map-top-nav">
        <Link className="map-logo" to="/">
          <strong>昭通古城</strong>
          <span>烟火美食路线</span>
        </Link>
        <nav aria-label="古城美食地图导航">
          <Link to="/">首页</Link>
          <Link className="active" to="/map">古城地图</Link>
          <Link to="/food">味道图鉴</Link>
        </nav>
      </header>

      <section className="map-page-title food-map-title">
        <span>手账美食地图</span>
        <h1>昭通古城烟火美食路线</h1>
        <p>22家特色小吃店与15个古建、街巷、城门、人文点位同图展示，边吃边逛更顺路。</p>
      </section>

      <section className="map-dashboard food-map-dashboard">
        <aside className="map-filter-card food-map-filter-card">
          <label className="map-search-box">
            <span>搜索</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="凉粉 / 北正街 / 夜宵 / 烧洋芋"
            />
          </label>

          <div className="map-filter-buttons food-map-filter-buttons" aria-label="地图点位筛选">
            {mapFilterItems.map((item) => {
              const color = item === "全部"
                ? "#8a613f"
                : item === "美食店铺"
                  ? "#d96332"
                  : (foodCategoryColor[item as FoodMapCategory] ?? cultureCategoryColor[item as CultureMapCategory]);
              return (
              <button
                className={filter === item ? "active" : ""}
                type="button"
                onClick={() => {
                  setFilter(item);
                  setQuery("");
                  const firstInCategory = item === "全部"
                    ? allSpots[0]
                    : item === "美食店铺"
                      ? allSpots.find((spot) => spot.kind === "food")
                      : allSpots.find((spot) => spot.categories.includes(item));
                  if (firstInCategory) setSelectedId(firstInCategory.id);
                }}
                key={item}
              >
                <i style={{ background: color }} />
                {item}
              </button>
            );})}
          </div>

          <div className="map-legend food-map-legend">
            <h2>点位图例</h2>
            {foodMapCategories.filter((item): item is FoodMapCategory => item !== "全部").map((item) => (
              <p key={item}><i className="legend-dot" style={{ background: foodCategoryColor[item] }} />{item}</p>
            ))}
            {cultureMapCategories.map((item) => (
              <p key={item}><i className="legend-dot" style={{ background: cultureCategoryColor[item] }} />{item}</p>
            ))}
          </div>

          <p className="map-filter-note">当前显示 <strong>{visibleMapSpots.length}</strong> 个点位。筛选后地图会自动缩放到可见点位范围。</p>
        </aside>

        <section className="map-canvas-card food-map-canvas-card" aria-label="昭通古城烟火美食高德地图">
          <AmapCanvas spots={visibleMapSpots} selectedId={selected.id} onSelect={setSelectedId} />
          {visibleMapSpots.length === 0 && (
            <div className="map-empty-state">
              <h2>没有找到对应点位</h2>
              <p>试试搜索“凉粉”“北正街”“文庙”“城门”或者切回全部。</p>
            </div>
          )}
        </section>

        <article className="map-side-card food-detail-card">
          <header>
            <h2>{selected.name}</h2>
            <div className="food-detail-tags">
              {selected.categories.map((item) => (
                <span
                  style={{ background: foodCategoryColor[item as FoodMapCategory] ?? cultureCategoryColor[item as CultureMapCategory] }}
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>
          </header>
          <p className="food-detail-address"><MapPin weight="fill" />{selected.address}</p>
          <p className="food-detail-feature">{selected.feature}</p>
          <ul>
            <li><span>◷</span><b>{selected.kind === "food" ? "营业时间" : "开放时间"}</b>{selected.openTime}</li>
            <li><span>◎</span><b>{selected.kind === "food" ? "推荐拍摄" : "推荐看点"}</b>{selected.photoTip}</li>
            <li><span>✎</span><b>{selected.kind === "food" ? "采访角度" : "文化线索"}</b>{selected.interview}</li>
            <li><span>⌁</span><b>停留时长</b>{selected.duration}</li>
          </ul>
          <div className="food-detail-actions">
            <button className="map-primary-action" type="button" onClick={() => setRouteNotice(`「${selected.name}」适合拍：${selected.photoTip}`)}>查看详情 <ArrowRight weight="bold" /></button>
            <button className="map-secondary-action" type="button" onClick={() => setRouteNotice(`已把「${selected.name}」加入你的烟火美食路线。`)}>加入路线 ＋</button>
            <button className="map-secondary-action" type="button" onClick={() => navigateToSpot(selected)}>导航到这里</button>
          </div>
        </article>
      </section>

      <section className="map-route-panel food-route-timeline-panel">
        <div className="route-title food-route-title">
          <span>一日路线</span>
          <h2>昭通古城烟火美食一日路线</h2>
          <p>{routeNotice}</p>
        </div>
        <div className="food-route-timeline" aria-label="昭通古城烟火美食一日路线">
          {foodRouteTimeline.map((item, index) => {
            const targetId = item.spotIds[0];
            const isActive = item.spotIds.includes(selected.id);
            return (
              <button
                className={isActive ? "active" : ""}
                type="button"
                onClick={() => chooseRouteSpot(targetId)}
                key={item.id}
              >
                <b>{String(index + 1).padStart(2, "0")}</b>
                <strong>{item.time}</strong>
                <span>{item.title}</span>
                <em style={{ background: foodCategoryColor[item.tag] }}>{item.tag}</em>
              </button>
            );
          })}
        </div>
      </section>

      <p className="map-tip food-map-tip">高德搜索/地理编码限定为云南省昭通市昭阳区；美食点位原数据保持不变，新增古建街巷点位匹配不到精确位置时使用对应街区备用坐标。</p>
    </main>
  );
}

function AmapCanvas({ spots, selectedId, onSelect }: { spots: MapDisplaySpot[]; selectedId: string; onSelect: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const amapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const userAccuracyCircleRef = useRef<any>(null);
  const locationWatchIdRef = useRef<number | null>(null);
  const infoWindowRef = useRef<any>(null);
  const expandedInfoIdRef = useRef<string | null>(null);
  const walkingRef = useRef<any>(null);
  const coordCacheRef = useRef<Record<string, ResolvedMapSpot>>({});
  const onSelectRef = useRef(onSelect);
  const [resolvedSpots, setResolvedSpots] = useState<ResolvedMapSpot[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing-key" | "error">("loading");
  const [locationStatus, setLocationStatus] = useState("地图加载后可点击定位，不会自动请求权限。");
  const [routeStatus, setRouteStatus] = useState("");
  const amapKey = import.meta.env.VITE_AMAP_KEY;

  const convertGpsToAmap = (position: [number, number]) => new Promise<[number, number]>((resolve) => {
    const AMap = amapRef.current;
    if (!AMap?.convertFrom) {
      resolve(position);
      return;
    }

    AMap.convertFrom(position, "gps", (convertStatus: string, result: any) => {
      const location = convertStatus === "complete" ? result?.locations?.[0] : null;
      if (!location) {
        resolve(position);
        return;
      }

      resolve([
        Number(location.lng ?? location.getLng?.()),
        Number(location.lat ?? location.getLat?.()),
      ]);
    });
  });

  const applyUserPosition = (
    position: [number, number],
    accuracy?: number,
    source: "browser" | "amap" = "browser",
  ) => {
    const AMap = amapRef.current;
    const map = mapRef.current;
    if (!AMap || !map) return;

    setUserLocation(position);
    const accuracyText = Number.isFinite(accuracy) ? `，精度约 ${Math.round(accuracy as number)} 米` : "";
    setLocationStatus(source === "browser" ? `已定位到当前位置${accuracyText}` : `已使用高德定位${accuracyText}`);

    if (!userMarkerRef.current) {
      userMarkerRef.current = new AMap.Marker({
        position,
        content: '<div class="amap-user-marker">你在这里</div>',
        offset: new AMap.Pixel(-36, -36),
        zIndex: 30,
      });
      map.add(userMarkerRef.current);
    } else {
      userMarkerRef.current.setPosition(position);
    }

    if (Number.isFinite(accuracy) && (accuracy as number) > 0) {
      if (!userAccuracyCircleRef.current) {
        userAccuracyCircleRef.current = new AMap.Circle({
          center: position,
          radius: accuracy,
          strokeColor: "#2f74d0",
          strokeOpacity: 0.35,
          strokeWeight: 1,
          fillColor: "#2f74d0",
          fillOpacity: 0.08,
          zIndex: 4,
        });
        map.add(userAccuracyCircleRef.current);
      } else {
        userAccuracyCircleRef.current.setCenter(position);
        userAccuracyCircleRef.current.setRadius(accuracy);
      }
    }

    map.setZoomAndCenter(accuracy && accuracy > 800 ? 15 : 17, position);
  };

  const locateWithBrowser = () => new Promise<{ position: [number, number]; accuracy?: number } | null>((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const gpsPosition: [number, number] = [coords.longitude, coords.latitude];
        const amapPosition = await convertGpsToAmap(gpsPosition);
        resolve({ position: amapPosition, accuracy: coords.accuracy });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  });

  const locateWithAmap = () => new Promise<{ position: [number, number]; accuracy?: number } | null>((resolve) => {
    const AMap = amapRef.current;
    if (!AMap) {
      resolve(null);
      return;
    }

    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 15000,
      zoomToAccuracy: false,
      showButton: false,
      showMarker: false,
    });

    geolocation.getCurrentPosition((geoStatus: string, result: any) => {
      if (geoStatus !== "complete" || !result?.position) {
        resolve(null);
        return;
      }

      const position: [number, number] = [
        Number(result.position.lng ?? result.position.getLng?.()),
        Number(result.position.lat ?? result.position.getLat?.()),
      ];
      resolve({ position, accuracy: Number(result.accuracy) || undefined });
    });
  });

  const locateUser = async () => {
    if (!amapRef.current || !mapRef.current) return null;
    setLocationStatus("正在定位...");

    const browserLocation = await locateWithBrowser();
    if (browserLocation) {
      applyUserPosition(browserLocation.position, browserLocation.accuracy, "browser");
      return browserLocation.position;
    }

    const amapLocation = await locateWithAmap();
    if (amapLocation) {
      applyUserPosition(amapLocation.position, amapLocation.accuracy, "amap");
      return amapLocation.position;
    }

    setLocationStatus("定位失败，请允许浏览器定位权限后重试。");
    return null;
  };

  const stopRealtimeLocation = () => {
    if (locationWatchIdRef.current === null || !navigator.geolocation) return;
    navigator.geolocation.clearWatch(locationWatchIdRef.current);
    locationWatchIdRef.current = null;
  };

  const startRealtimeLocation = () => {
    if (!amapRef.current || !mapRef.current) return;

    if (!navigator.geolocation) {
      locateUser();
      return;
    }

    stopRealtimeLocation();
    setLocationStatus("正在开启实时定位...");

    locationWatchIdRef.current = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        const gpsPosition: [number, number] = [coords.longitude, coords.latitude];
        const amapPosition = await convertGpsToAmap(gpsPosition);
        applyUserPosition(amapPosition, coords.accuracy, "browser");
      },
      async () => {
        const amapLocation = await locateWithAmap();
        if (amapLocation) {
          applyUserPosition(amapLocation.position, amapLocation.accuracy, "amap");
          return;
        }
        setLocationStatus("实时定位失败，请允许浏览器定位权限后重试。");
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 20000 },
    );
  };

  const zoomMap = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    const currentZoom = Number(map.getZoom?.() ?? 16);
    const nextZoom = Math.min(20, Math.max(3, currentZoom + delta));
    map.setZoom(nextZoom);
  };

  const startRoute = async (spot: ResolvedMapSpot) => {
    const AMap = amapRef.current;
    const map = mapRef.current;
    if (!AMap || !map) return;
    if (!Number.isFinite(spot.lng) || !Number.isFinite(spot.lat)) {
      setRouteStatus(`「${spot.name}」坐标待确认，暂时不能规划路线。`);
      return;
    }
    const origin = userLocation ?? await locateUser();
    if (!origin) {
      setRouteStatus("无法获取当前位置，暂时不能规划路线。");
      return;
    }

    walkingRef.current?.clear?.();
    walkingRef.current = new AMap.Walking({
      map,
      hideMarkers: true,
      isOutline: true,
      outlineColor: "#fff2d6",
    });
    setRouteStatus(`正在规划到「${spot.name}」的步行路线...`);
    walkingRef.current.search(origin, [spot.lng as number, spot.lat as number], (walkStatus: string) => {
      if (walkStatus === "complete") setRouteStatus(`已生成到「${spot.name}」的步行路线`);
      else setRouteStatus("路线规划失败，请稍后重试。");
    });
  };

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!amapKey) {
      setStatus("missing-key");
      return;
    }

    let cancelled = false;
    if (import.meta.env.VITE_AMAP_SECURITY_CODE) {
      window._AMapSecurityConfig = { securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE };
    }

    AMapLoader.load({
      key: amapKey,
      version: "2.0",
      plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.Geolocation", "AMap.Walking", "AMap.Geocoder", "AMap.PlaceSearch"],
    })
      .then((AMap) => {
        if (cancelled || !containerRef.current) return;
        amapRef.current = AMap;
        mapRef.current = new AMap.Map(containerRef.current, {
          center: [103.7185, 27.3382],
          zoom: 16,
          viewMode: "2D",
          scrollWheel: true,
          mapStyle: "amap://styles/fresh",
        });
        mapRef.current.addControl(new AMap.Scale());
        mapRef.current.addControl(new AMap.ToolBar({ position: { right: "14px", top: "14px" } }));
        infoWindowRef.current = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -34), isCustom: true });
        setStatus("ready");
      })
      .catch(() => setStatus("error"));

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      walkingRef.current?.clear?.();
      expandedInfoIdRef.current = null;
      stopRealtimeLocation();
      userAccuracyCircleRef.current?.setMap?.(null);
      userMarkerRef.current?.setMap?.(null);
      infoWindowRef.current?.close?.();
      mapRef.current?.destroy?.();
      mapRef.current = null;
      amapRef.current = null;
    };
  }, [amapKey]);

  useEffect(() => {
    const AMap = amapRef.current;
    if (!AMap || status !== "ready") return;

    const geocoder = new AMap.Geocoder({ city: "云南省昭通市昭阳区" });
    const placeSearch = new AMap.PlaceSearch({
      city: "昭通市",
      citylimit: true,
      pageSize: 10,
      extensions: "all",
    });
    let cancelled = false;
    const pendingSpots: ResolvedMapSpot[] = spots.map((spot) => (
      spot.kind === "food" && spot.fallback
        ? { ...spot, lng: spot.fallback[0], lat: spot.fallback[1], geocodeStatus: "fallback" }
        : { ...spot, geocodeStatus: "pending" }
    ));
    setResolvedSpots(pendingSpots);

    const pointToLngLat = (point: any): [number, number] | null => {
      const lng = Number(point?.lng ?? point?.getLng?.());
      const lat = Number(point?.lat ?? point?.getLat?.());
      return Number.isFinite(lng) && Number.isFinite(lat) ? [lng, lat] : null;
    };

    const isInZhaoyang = (item: any) => {
      const values = [
        item?.adcode,
        item?.adname,
        item?.district,
        item?.formattedAddress,
        item?.address,
        item?.pname,
        item?.cityname,
      ].map((value) => String(value ?? ""));
      return values.some((value) => value.includes("昭阳区") || value.startsWith("530602"));
    };

    const resolveByGeocoder = (spot: MapDisplaySpot) => new Promise<ResolvedMapSpot | null>((resolve) => {
      let settled = false;
      let timer = 0;
      const finish = (value: ResolvedMapSpot | null) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        resolve(value);
      };
      timer = window.setTimeout(() => finish(null), 4500);
      geocoder.getLocation(spot.geocodeKeyword, (geoStatus: string, result: any) => {
        const geocode = geoStatus === "complete" ? result?.geocodes?.[0] : null;
        const location = geocode?.location;
        const lngLat = pointToLngLat(location);
        if (!lngLat || !isInZhaoyang(geocode)) {
          finish(null);
          return;
        }
        finish({
          ...spot,
          lng: lngLat[0],
          lat: lngLat[1],
          geocodeStatus: "matched",
          resolvedAddress: geocode?.formattedAddress,
        });
      });
    });

    const resolveByPlaceSearch = (spot: MapDisplaySpot) => new Promise<ResolvedMapSpot | null>((resolve) => {
      const keywords = [spot.geocodeKeyword, `昭阳区${spot.name}`, `昭通${spot.name}`];
      let settled = false;
      const finish = (value: ResolvedMapSpot | null) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };
      let index = 0;
      const searchNext = () => {
        const keyword = keywords[index];
        if (!keyword) {
          finish(null);
          return;
        }
        index += 1;
        let callbackSettled = false;
        const timer = window.setTimeout(() => {
          if (callbackSettled || settled) return;
          callbackSettled = true;
          searchNext();
        }, 4500);
        placeSearch.search(keyword, (poiStatus: string, result: any) => {
          if (callbackSettled || settled) return;
          callbackSettled = true;
          window.clearTimeout(timer);
          const pois = poiStatus === "complete" ? (result?.poiList?.pois ?? []) : [];
          const poi = pois.find((item: any) => item?.location && isInZhaoyang(item));
          const lngLat = pointToLngLat(poi?.location);
          if (!poi || !lngLat) {
            searchNext();
            return;
          }
          finish({
            ...spot,
            lng: lngLat[0],
            lat: lngLat[1],
            geocodeStatus: "matched",
            resolvedAddress: poi.address || poi.name,
          });
        });
      };
      searchNext();
    });

    const resolveSpot = async (spot: MapDisplaySpot): Promise<ResolvedMapSpot> => {
      if (coordCacheRef.current[spot.id]) return coordCacheRef.current[spot.id];

      if (spot.kind === "culture") {
        const poiResult = await resolveByPlaceSearch(spot);
        const geocoderResult = poiResult ?? await resolveByGeocoder(spot);
        const resolved = geocoderResult ?? { ...spot, geocodeStatus: "pending" as const };
        coordCacheRef.current[spot.id] = resolved;
        return resolved;
      }

      const geocoderResult = await resolveByGeocoder(spot);
      if (geocoderResult) {
        coordCacheRef.current[spot.id] = geocoderResult;
        return geocoderResult;
      }

      const resolved = spot.fallback
        ? {
          ...spot,
          lng: spot.fallback[0],
          lat: spot.fallback[1],
          geocodeStatus: "fallback" as const,
        }
        : { ...spot, geocodeStatus: "pending" as const };
      coordCacheRef.current[spot.id] = resolved;
      return resolved;
    };

    Promise.all(spots.map(resolveSpot)).then((nextSpots) => {
      if (cancelled) return;
      setResolvedSpots(nextSpots);
      const culturePendingCount = nextSpots.filter((spot) => spot.kind === "culture" && spot.geocodeStatus === "pending").length;
      const cultureMatchedCount = nextSpots.filter((spot) => spot.kind === "culture" && spot.geocodeStatus === "matched").length;
      setRouteStatus(
        culturePendingCount
          ? `高德已定位 ${cultureMatchedCount} 个新增景点，${culturePendingCount} 个坐标待确认，未放置错误 marker。`
          : `15 个新增景点已通过高德 POI/地理编码定位。`,
      );
    });

    return () => {
      cancelled = true;
    };
  }, [spots, status]);

  useEffect(() => {
    const AMap = amapRef.current;
    const map = mapRef.current;
    if (!AMap || !map) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    const markerSpots = resolvedSpots.filter((spot) => Number.isFinite(spot.lng) && Number.isFinite(spot.lat));
    markersRef.current = markerSpots.map((spot) => {
      const markerNode = document.createElement("button");
      markerNode.type = "button";
      markerNode.className = `amap-spot-marker food-amap-marker ${spot.id === selectedId ? "active" : ""} ${expandedInfoIdRef.current === spot.id ? "expanded" : ""}`;
      markerNode.dataset.category = spot.primaryCategory;
      markerNode.dataset.name = `${spot.name}｜${spot.address}`;
      markerNode.style.setProperty(
        "--marker-color",
        foodCategoryColor[spot.primaryCategory as FoodMapCategory] ?? cultureCategoryColor[spot.primaryCategory as CultureMapCategory],
      );
      markerNode.innerHTML = `<span></span><b>${spot.name}</b>`;
      markerNode.addEventListener("click", () => {
        onSelectRef.current(spot.id);
        if (expandedInfoIdRef.current === spot.id) {
          expandedInfoIdRef.current = null;
          markerNode.classList.remove("expanded");
          infoWindowRef.current?.close?.();
          return;
        }
        expandedInfoIdRef.current = spot.id;
        markersRef.current.forEach((marker) => {
          const content = marker.getContent?.();
          if (content instanceof HTMLElement) content.classList.remove("expanded");
        });
        markerNode.classList.add("expanded");
        map.setZoomAndCenter(17, [spot.lng as number, spot.lat as number]);
        const content = document.createElement("div");
        content.className = "amap-route-popup food-amap-popup";
        content.innerHTML = `<strong>${spot.name}</strong><small>${spot.primaryCategory} · ${spot.street}</small><p>${spot.address}</p><button type="button">导航到这里</button>`;
        content.querySelector("button")?.addEventListener("click", () => startRoute(spot));
        infoWindowRef.current?.setContent(content);
        infoWindowRef.current?.open(map, [spot.lng as number, spot.lat as number]);
      });

      return new AMap.Marker({
        position: [spot.lng as number, spot.lat as number],
        content: markerNode,
        offset: new AMap.Pixel(0, 0),
        zIndex: spot.id === selectedId ? 25 : 10,
      });
    });

    if (markersRef.current.length) {
      map.add(markersRef.current);
      map.setFitView(markersRef.current, false, [70, 70, 90, 70], 16);
    }
  }, [resolvedSpots, selectedId, status]);

  useEffect(() => {
    const map = mapRef.current;
    const selected = resolvedSpots.find((spot) => spot.id === selectedId);
    if (!map || !selected || !Number.isFinite(selected.lng) || !Number.isFinite(selected.lat)) return;
    map.setZoomAndCenter(17, [selected.lng as number, selected.lat as number]);
  }, [resolvedSpots, selectedId]);

  return (
    <>
      <div className="map-amap" ref={containerRef} />
      {status === "loading" && (
        <div className="map-amap-placeholder">
          <h2>正在加载高德地图</h2>
          <p>正在把 37 个美食、古建、街巷、城门与人文点位定位到昭通市昭阳区古城街巷。</p>
        </div>
      )}
      {status === "missing-key" && (
        <div className="map-amap-placeholder">
          <h2>需要配置高德地图 Key</h2>
          <p>在项目根目录新建或编辑 <code>.env</code>，填入 <code>VITE_AMAP_KEY=你的高德Web端Key</code>，然后重启开发服务器。</p>
        </div>
      )}
      {status === "error" && (
        <div className="map-amap-placeholder">
          <h2>高德地图加载失败</h2>
          <p>请检查 Web Key、服务平台类型和安全密钥配置。</p>
        </div>
      )}
    </>
  );
}

function FoodPage() {
  const [activeId, setActiveId] = useState(foods[0].id);
  const active = foods.find((food) => food.id === activeId) ?? foods[0];
  const topFoods = foods.slice(0, 5);
  const routeFoods = [
    { time: "早餐时光", clock: "07:30-10:30", picks: [foods[0], foods[1]], note: "暖胃开启活力一天" },
    { time: "午间小憩", clock: "11:30-14:00", picks: [foods[3], foods[4]], note: "鲜香饱腹，补充能量" },
    { time: "下午茶", clock: "14:30-16:30", picks: [foods[4], foods[5]], note: "清凉解暑，惬意时光" },
    { time: "夜晚狂欢", clock: "18:00-22:30", picks: [foods[2], foods[6]], note: "烟火夜晚，尽享美味" },
  ];

  return (
    <main className="food-page">
      <header className="food-nav">
        <Link className="food-brand" to="/">
          <span>🏯</span>
          <strong>昭通古城<small>ZHAOTONG ANCIENT CITY</small></strong>
        </Link>
        <nav aria-label="昭通味道图鉴导航">
          <Link to="/">首页</Link>
          <Link className="active" to="/food">味道图鉴</Link>
          <Link to="/map">古城地图</Link>
        </nav>
        <div className="food-nav-actions">
          <button type="button">📍 我的位置</button>
          <Link to="/"><House weight="bold" />返回首页</Link>
        </div>
      </header>

      <section className="food-shell">
        <aside className="food-sidebar">
          <h2>美食分类</h2>
          <div className="food-category-list">
            {foodCategories.map((item) => (
              <button className={active.category === item.name ? "active" : ""} type="button" onClick={() => {
                const next = foods.find((food) => food.category === item.name);
                if (next) setActiveId(next.id);
              }} key={item.id}>
                <span>{item.icon}</span>
                <strong>{item.name}<small>{item.desc}</small></strong>
              </button>
            ))}
          </div>
          <article className="food-memory-card">
            <h3>舌尖上的昭通</h3>
            <p>山川滋味，烟火人间。每一口，都是古城的故事。</p>
          </article>
        </aside>

        <section className="food-hero-card">
          <article className="food-photo-stage">
            <span className="food-rec-badge">👍 今日推荐</span>
            <img src={cardPhoto(active.photo)} alt={active.name} />
            <div className="food-note">清晨的一碗热腾腾，开启昭通第一天。——本地人手记</div>
          </article>

          <article className="food-detail-panel">
            <header>
              <h1>{active.name}</h1>
              <span>{active.category}</span>
            </header>
            <div className="food-tags">{active.tags.map((tag) => <b key={tag}>{tag}</b>)}</div>
            <p>{active.text}</p>
            <ul>
              <li><b>推荐时段</b><span>{active.time}</span></li>
              <li><b>推荐吃法</b><span>{active.way}</span></li>
              <li><b>特色亮点</b><span>{active.highlight}</span></li>
            </ul>
            <div className="food-actions">
              <button type="button">📍 查看附近美食</button>
              <button type="button">♨ 加入今日路线</button>
            </div>
          </article>

          <aside className="food-top-list">
            <h2>🏆 必吃榜 TOP5</h2>
            {topFoods.map((food, index) => (
              <button className={active.id === food.id ? "active" : ""} type="button" onClick={() => setActiveId(food.id)} key={food.id}>
                <span>{index + 1}</span>
                <img src={cardPhoto(food.photo)} alt="" />
                <strong>{food.name}<small>{food.highlight}</small></strong>
              </button>
            ))}
            <a>查看完整榜单 →</a>
          </aside>
        </section>

        <section className="food-gallery-section">
          <header>
            <h2>美味图鉴</h2>
            <button type="button">查看全部美食 <ArrowRight /></button>
          </header>
          <div className="food-gallery">
            {foods.map((food) => (
              <article className={active.id === food.id ? "active" : ""} onClick={() => setActiveId(food.id)} key={food.id}>
                <img src={cardPhoto(food.photo)} alt={food.name} />
                <h3>{food.name}</h3>
                <p>{food.text}</p>
                <footer><span>{food.category}</span><b>♨ {food.likes}</b></footer>
              </article>
            ))}
          </div>
        </section>

        <section className="food-route-section">
          <header>
            <h2>味道路线 · 一日吃法</h2>
          </header>
          <div className="food-route-grid">
            {routeFoods.map((block, index) => (
              <article key={block.time}>
                <h3>{block.time}<span>{block.clock}</span></h3>
                <div className="route-food-pair">
                  {block.picks.map((food, foodIndex) => (
                    <button type="button" onClick={() => setActiveId(food.id)} key={food.id}>
                      <img src={cardPhoto(food.photo)} alt="" />
                      <span>{food.name}</span>
                      {foodIndex === 0 && <i>＋</i>}
                    </button>
                  ))}
                </div>
                <p>{block.note}</p>
                {index < routeFoods.length - 1 && <b className="route-arrow">→</b>}
              </article>
            ))}
          </div>
          <button className="food-generate-route" type="button">生成我的专属美食路线</button>
        </section>

        <section className="food-bottom-notes">
          <article>
            <h2>游览小贴士</h2>
            <p><b>推荐游玩时长</b> 半日游 / 一日游</p>
            <p><b>最佳品尝季节</b> 春秋皆宜，四季都有美味</p>
            <p><b>交通建议</b> 步行穿梭古城，美食更易邂逅</p>
            <Link to="/map">查看美食地图 <ArrowRight /></Link>
          </article>
          <article>
            <h2>本地人手记</h2>
            <p>“昭通的味道藏在早晨的热气里，也在夜晚的灯火下。慢慢走，慢慢吃，你会爱上这座古城的烟火气。”</p>
            <span>—— 阿城（昭通土生土长）</span>
          </article>
        </section>
      </section>
    </main>
  );
}

function ArchitecturePage() {
  const [activeId, setActiveId] = useState(architectureItems[0].id);
  const active = architectureItems.find((item) => item.id === activeId) ?? architectureItems[0];
  const placeById = useMemo(() => new Map(architectureItems.map((item) => [item.id, item])), []);
  const activeMapSpotId = architectureMapSpotIds[active.id];
  const routePlaces = ["gate", "old-street", "alley", "guild", "doujie"]
    .map((id) => placeById.get(id))
    .filter(Boolean) as ArchitecturePlace[];

  return (
    <main className="architecture-page">
      <header className="architecture-nav">
        <Link className="architecture-logo" to="/">
          <span>昭</span>
          <strong>昭通古城<small>ZHAOTONG ANCIENT CITY</small></strong>
        </Link>
        <Link className="arch-return" to="/"><House weight="bold" />返回首页</Link>
      </header>

      <section className="architecture-title">
        <h1>屋檐下的古城</h1>
        <p><span />从会馆、大院、老街和城门里，看见昭通的百年烟火。<span /></p>
      </section>

      <section className="arch-explorer">
        <aside className="arch-sidebar">
          {architectureGroups.map((group) => (
            <section key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((id) => {
                const item = placeById.get(id);
                if (!item) return null;
                return (
                  <button className={active.id === item.id ? "active" : ""} type="button" onClick={() => setActiveId(item.id)} key={item.id}>
                    {item.name}
                    {active.id === item.id && <ArrowRight weight="bold" />}
                  </button>
                );
              })}
            </section>
          ))}
        </aside>

        <div className="arch-hero-photo">
          <iframe
            title="昭通古城VR全景"
            src="https://www.720yun.com/vr/02cjtgtkkO8"
            allow="fullscreen; gyroscope; accelerometer; xr-spatial-tracking"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <article className="arch-detail-card">
          <span className="arch-badge">{active.group}</span>
          <h2>{active.name}</h2>
          <p>{active.description}</p>
          <div className="arch-tags">{active.tags.map((tag) => <b key={tag}>{tag}</b>)}</div>
          <hr />
          <h3>推荐玩法</h3>
          <p>{active.tip}</p>
          <div className="arch-actions">
            <Link to={`/map?spot=${activeMapSpotId}`}><MapPin weight="fill" />查看位置</Link>
            <button type="button">加入路线 ＋</button>
          </div>
        </article>
      </section>

      <section className="arch-route-section">
        <div className="route-intro">
          <h2>推荐漫游路线</h2>
          <p>半日精华线路<br />步行即可，轻松探访古城精华</p>
        </div>
        <div className="route-flow">
          {routePlaces.map((item, index) => (
            <button type="button" onClick={() => setActiveId(item.id)} key={item.id}>
              <img src={architectureAsset(item.photo)} alt="" />
              <span>{item.name}</span>
              {index < routePlaces.length - 1 && <i>→</i>}
            </button>
          ))}
        </div>
        <button className="full-route" type="button">查看完整路线</button>
      </section>
    </main>
  );
}

const MAX_STORED_IMAGE_BYTES = 650_000;
const MAX_STORED_POSTS_BYTES = 2_500_000;
const MAX_USER_POSTS = 24;

function readBoundedJson<T>(key: string, fallback: T, maxLength = 500_000): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  if (raw.length > maxLength) {
    localStorage.removeItem(key);
    return fallback;
  }
  return JSON.parse(raw) as T;
}

function writeStorageSoon(key: string, value: string) {
  const timer = window.setTimeout(() => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage can be full when visitors upload large photos.
    }
  }, 120);
  return () => window.clearTimeout(timer);
}

function resizeImageForStorage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const source = String(reader.result);
      if (source.length <= MAX_STORED_IMAGE_BYTES) {
        resolve(source);
        return;
      }

      const image = new Image();
      image.onerror = () => reject(new Error("image decode failed"));
      image.onload = () => {
        const maxSide = 1280;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.src = source;
    };
    reader.readAsDataURL(file);
  });
}

function CinemaPage() {
  const storagePrefix = "zhaotong-cinema-wall";
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<CinemaPost[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, string[]>>({});
  const [category, setCategory] = useState("全部");
  const [sortMode, setSortMode] = useState<"newest" | "popular" | "comments">("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [reason, setReason] = useState("");
  const [commentDraft, setCommentDraft] = useState("");
  const [notice, setNotice] = useState("");
  const categories = ["全部", "拍照点", "美食", "夜景", "小巷", "古建筑", "本地推荐"];
  const sortLabels = { newest: "最新发布", popular: "人气最高", comments: "评论最多" };
  const sortOptions = [
    { value: "newest", label: sortLabels.newest },
    { value: "popular", label: sortLabels.popular },
    { value: "comments", label: sortLabels.comments },
  ] as const;
  const allPosts = useMemo(() => [...userPosts, ...cinemaPosts], [userPosts]);
  const selectedPost = useMemo(() => allPosts.find((post) => post.id === selectedPostId) ?? null, [allPosts, selectedPostId]);
  const getLikeCount = (post: CinemaPost) => post.likes + (likedIds.includes(post.id) ? 1 : 0);
  const getCommentCount = (postId: string) => commentsByPost[postId]?.length ?? 0;
  const filteredPosts = useMemo(() => {
    const next = category === "全部" ? allPosts : allPosts.filter((post) => post.category === category);
    return [...next].sort((a, b) => {
      if (sortMode === "popular") return getLikeCount(b) - getLikeCount(a);
      if (sortMode === "comments") return getCommentCount(b.id) - getCommentCount(a.id);
      return Number(b.isNew) - Number(a.isNew);
    });
  }, [allPosts, category, sortMode, likedIds, commentsByPost]);
  const shownPosts = filteredPosts.slice(0, visibleCount);

  useEffect(() => {
    try {
      setUserPosts(readBoundedJson<CinemaPost[]>(`${storagePrefix}:posts`, [], MAX_STORED_POSTS_BYTES).slice(0, MAX_USER_POSTS));
      setLikedIds(readBoundedJson<string[]>(`${storagePrefix}:liked`, []));
      setSavedIds(readBoundedJson<string[]>(`${storagePrefix}:saved`, []));
      setCommentsByPost(readBoundedJson<Record<string, string[]>>(`${storagePrefix}:comments`, {}));
      const savedSort = localStorage.getItem(`${storagePrefix}:sort`);
      if (savedSort === "newest" || savedSort === "popular" || savedSort === "comments") setSortMode(savedSort);
      const savedCategory = localStorage.getItem(`${storagePrefix}:category`);
      if (savedCategory && categories.includes(savedCategory)) setCategory(savedCategory);
    } catch {
      setNotice("本地互动记录读取失败，已使用默认内容。");
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    const payload = JSON.stringify(userPosts.slice(0, MAX_USER_POSTS));
    if (payload.length > MAX_STORED_POSTS_BYTES) return;
    return writeStorageSoon(`${storagePrefix}:posts`, payload);
  }, [storageReady, userPosts]);

  useEffect(() => {
    if (!storageReady) return;
    return writeStorageSoon(`${storagePrefix}:liked`, JSON.stringify(likedIds));
  }, [storageReady, likedIds]);

  useEffect(() => {
    if (!storageReady) return;
    return writeStorageSoon(`${storagePrefix}:saved`, JSON.stringify(savedIds));
  }, [storageReady, savedIds]);

  useEffect(() => {
    if (!storageReady) return;
    return writeStorageSoon(`${storagePrefix}:comments`, JSON.stringify(commentsByPost));
  }, [storageReady, commentsByPost]);

  useEffect(() => {
    if (!storageReady) return;
    return writeStorageSoon(`${storagePrefix}:sort`, sortMode);
  }, [storageReady, sortMode]);

  useEffect(() => {
    if (!storageReady) return;
    return writeStorageSoon(`${storagePrefix}:category`, category);
  }, [storageReady, category]);

  const toggleLike = (postId: string) => {
    setLikedIds((ids) => ids.includes(postId) ? ids.filter((id) => id !== postId) : [...ids, postId]);
  };

  const toggleSave = (postId: string) => {
    setSavedIds((ids) => ids.includes(postId) ? ids.filter((id) => id !== postId) : [...ids, postId]);
  };

  const addComment = (postId: string) => {
    const content = commentDraft.trim();
    if (!content) return;
    setCommentsByPost((comments) => ({
      ...comments,
      [postId]: [...(comments[postId] ?? []), content],
    }));
    setCommentDraft("");
  };

  const chooseSort = (mode: "newest" | "popular" | "comments") => {
    setSortMode(mode);
    setVisibleCount(6);
    setSortOpen(false);
  };

  const handlePreview = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const previewSource = await resizeImageForStorage(file);
      setPreview(previewSource);
      setNotice("");
    } catch {
      setNotice("Image preview failed. Please try a smaller JPG or PNG.");
    }
  };

  const handlePublish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!preview) {
      setNotice("先选一张古城美照吧");
      return;
    }
    if (!title.trim()) {
      setNotice("给这张照片取个标题吧");
      return;
    }
    const newPost: CinemaPost = {
      id: `user-${Date.now()}`,
      title: title.trim(),
      place: place.trim() || "昭通古城游客分享",
      photo: preview,
      text: reason.trim() || "把这份古城里的美好记录下来，也推荐给更多来昭通散步的人。",
      category: "本地推荐",
      likes: 0,
      author: "我发布的安利",
      time: "刚刚",
      isNew: true,
    };
    setUserPosts((posts) => [newPost, ...posts].slice(0, MAX_USER_POSTS));
    setCategory("全部");
    setSortMode("newest");
    setVisibleCount(6);
    setSelectedPostId(newPost.id);
    setTitle("");
    setPlace("");
    setReason("");
    setPreview(null);
    setNotice("发布成功，已保存到本机浏览器。");
  };

  return (
    <div className="site-page cinema-page">
      <TopBar />
      <BookShell className="cinema-wall-shell">
        <section className="cinema-wall-hero">
          <div>
            <h1>游客便利贴</h1>
            <p>分享你的古城美照，把昭通的烟火气安利给更多人</p>
          </div>
          <span className="cinema-hero-camera"><Camera weight="duotone" /></span>
        </section>

        <section className="cinema-wall-layout">
          <div className="cinema-wall-main">
            <div className="cinema-toolbar">
              <div className="cinema-categories" aria-label="游客便利贴分类">
                {categories.map((item) => (
                  <button
                    className={category === item ? "active" : ""}
                    type="button"
                    onClick={() => {
                      setCategory(item);
                      setVisibleCount(6);
                    }}
                    key={item}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div
                className={`cinema-sort-menu ${sortOpen ? "is-open" : ""}`}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSortOpen(false);
                }}
              >
                <button
                  className="cinema-sort"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={sortOpen}
                  onClick={() => setSortOpen((open) => !open)}
                >
                  {sortLabels[sortMode]}⌄
                </button>
                {sortOpen && (
                  <div className="cinema-sort-dropdown" role="menu">
                    {sortOptions.map((option) => (
                      <button
                        className={sortMode === option.value ? "active" : ""}
                        type="button"
                        role="menuitemradio"
                        aria-checked={sortMode === option.value}
                        onClick={() => chooseSort(option.value)}
                        key={option.value}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <section className="cinema-post-flow" aria-label="游客安利卡片流">
              {shownPosts.map((post) => (
                <article className={`wall-post-card ${post.isNew ? "is-new" : ""}`} key={post.id}>
                  {post.top && <span className="top-ribbon">TOP<br />{String(post.top).padStart(2, "0")}</span>}
                  {post.isNew && <span className="new-ribbon">新</span>}
                  <button className="post-photo" type="button" onClick={() => setSelectedPostId(post.id)}>
                    <img src={post.photo.startsWith("data:") ? post.photo : cardPhoto(post.photo)} alt={post.title} />
                  </button>
                  <div className="post-body">
                    <button className="post-title-button" type="button" onClick={() => setSelectedPostId(post.id)}>{post.title}</button>
                    <p className="post-place"><MapPin weight="fill" />{post.place}</p>
                    <p className="post-text">{post.text}</p>
                    <footer>
                      <span className="post-author">{post.author}</span>
                      <button
                        className={`post-action post-like ${likedIds.includes(post.id) ? "is-active" : ""}`}
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        aria-pressed={likedIds.includes(post.id)}
                      >
                        <Heart weight={likedIds.includes(post.id) ? "fill" : "regular"} />{getLikeCount(post)}
                      </button>
                      <button className="post-action" type="button" onClick={() => {
                        setSelectedPostId(post.id);
                        setCommentDraft("");
                      }}>
                        <ChatCircle />{getCommentCount(post.id)}
                      </button>
                      <button
                        className={`post-action post-bookmark ${savedIds.includes(post.id) ? "is-active" : ""}`}
                        type="button"
                        onClick={() => toggleSave(post.id)}
                        aria-pressed={savedIds.includes(post.id)}
                      >
                        <BookmarkSimple weight={savedIds.includes(post.id) ? "fill" : "regular"} />
                      </button>
                    </footer>
                  </div>
                </article>
              ))}

              <article className="more-post-card" aria-label="更多游客安利等待发现">
                <ImageSquare weight="duotone" />
                <p>更多美照等你发现<br />快来分享你的古城故事吧</p>
              </article>
            </section>

            <button className="load-more-posts" type="button" onClick={() => setVisibleCount((count) => count + 3)}>
              加载更多
            </button>
          </div>

          <aside className="cinema-wall-side">
            <form className="upload-card" onSubmit={handlePublish}>
              <span className="paper-tape" />
              <h2>分享你的古城美照</h2>
              <label className={`upload-drop ${preview ? "has-preview" : ""}`}>
                {preview ? (
                  <img src={preview} alt="上传照片预览" />
                ) : (
                  <>
                    <Camera weight="duotone" />
                    <strong>上传照片</strong>
                    <small>支持 JPG / PNG 格式，单张≤10MB</small>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handlePreview} />
              </label>

              <label className="wall-field">
                <Camera />
                <input value={title} maxLength={30} onChange={(event) => setTitle(event.target.value)} placeholder="照片标题（如：夕阳下的古城）" />
                <small>{title.length}/30</small>
              </label>
              <label className="wall-field">
                <MapPin />
                <input value={place} maxLength={30} onChange={(event) => setPlace(event.target.value)} placeholder="拍摄地点（如：城隍庙旁的老巷子）" />
                <small>{place.length}/30</small>
              </label>
              <label className="wall-field wall-field-textarea">
                <Star />
                <textarea value={reason} maxLength={200} onChange={(event) => setReason(event.target.value)} placeholder="推荐理由（分享你的感受和推荐理由～）" />
                <small>{reason.length}/200</small>
              </label>

              <button className="publish-button" type="submit"><PaperPlaneTilt weight="fill" />发布安利</button>
              {notice && <p className="form-notice">{notice}</p>}
            </form>

            <article className="today-pick-card">
              <h2>今日精选 ✨</h2>
              <div>
                <img src={cardPhoto("night-market-street.jpg")} alt="古城的烟火气" />
                <section>
                  <h3>古城的烟火气</h3>
                  <p><MapPin weight="fill" />美食街</p>
                  <p>最爱这里的烟火气，人间值得！</p>
                  <span><Heart weight="fill" />236</span>
                </section>
              </div>
            </article>
          </aside>
        </section>
      </BookShell>
      {selectedPost && (
        <div className="lightbox cinema-detail-backdrop" onClick={() => setSelectedPostId(null)}>
          <section className="cinema-detail-modal" role="dialog" aria-modal="true" aria-label={`${selectedPost.title}详情`} onClick={(event) => event.stopPropagation()}>
            <button className="detail-close" aria-label="关闭" type="button" onClick={() => setSelectedPostId(null)}><X /></button>
            <img src={selectedPost.photo.startsWith("data:") ? selectedPost.photo : cardPhoto(selectedPost.photo)} alt={selectedPost.title} />
            <div className="cinema-detail-body">
              <span className="detail-category">{selectedPost.category}</span>
              <h2>{selectedPost.title}</h2>
              <p className="post-place"><MapPin weight="fill" />{selectedPost.place}</p>
              <p>{selectedPost.text}</p>
              <div className="detail-actions">
                <button
                  className={`post-action post-like ${likedIds.includes(selectedPost.id) ? "is-active" : ""}`}
                  type="button"
                  onClick={() => toggleLike(selectedPost.id)}
                  aria-pressed={likedIds.includes(selectedPost.id)}
                >
                  <Heart weight={likedIds.includes(selectedPost.id) ? "fill" : "regular"} />点赞 {getLikeCount(selectedPost)}
                </button>
                <button
                  className={`post-action post-bookmark ${savedIds.includes(selectedPost.id) ? "is-active" : ""}`}
                  type="button"
                  onClick={() => toggleSave(selectedPost.id)}
                  aria-pressed={savedIds.includes(selectedPost.id)}
                >
                  <BookmarkSimple weight={savedIds.includes(selectedPost.id) ? "fill" : "regular"} />{savedIds.includes(selectedPost.id) ? "已收藏" : "收藏"}
                </button>
              </div>
              <div className="detail-comments">
                <h3>评论 {getCommentCount(selectedPost.id)}</h3>
                <div className="comment-list">
                  {(commentsByPost[selectedPost.id] ?? []).map((comment, index) => (
                    <p key={`${selectedPost.id}-${index}`}>{comment}</p>
                  ))}
                  {getCommentCount(selectedPost.id) === 0 && <p className="empty-comment">还没有评论，来写第一句吧。</p>}
                </div>
                <label className="comment-box">
                  <input value={commentDraft} maxLength={80} onChange={(event) => setCommentDraft(event.target.value)} placeholder="写下你的感受..." />
                  <button type="button" onClick={() => addComment(selectedPost.id)}>发送</button>
                </label>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop">
      <section className="dialog-card" role="dialog" aria-modal="true">
        <button aria-label="关闭" onClick={onClose}><X /></button>
        <h2>{title}</h2>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}

function AdminPage() {
  const storagePrefix = "zhaotong-cinema-wall";
  const categories = ["拍照点", "美食", "夜景", "小巷", "古建筑", "本地推荐"];
  const [posts, setPosts] = useState<CinemaPost[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, string[]>>({});
  const [notice, setNotice] = useState("");
  const knownPosts = useMemo(() => new Map([...cinemaPosts, ...posts].map((post) => [post.id, post])), [posts]);
  const commentRows = useMemo(() => Object.entries(commentsByPost).flatMap(([postId, comments]) => (
    comments.map((comment, index) => ({ postId, comment, index, postTitle: knownPosts.get(postId)?.title ?? "已删除内容" }))
  )), [commentsByPost, knownPosts]);

  useEffect(() => {
    try {
      setPosts(JSON.parse(localStorage.getItem(`${storagePrefix}:posts`) || "[]"));
      setCommentsByPost(JSON.parse(localStorage.getItem(`${storagePrefix}:comments`) || "{}"));
    } catch {
      setNotice("后台数据读取失败，请检查浏览器本地存储。");
    }
  }, []);

  const savePosts = (nextPosts: CinemaPost[], message = "内容已保存") => {
    setPosts(nextPosts);
    localStorage.setItem(`${storagePrefix}:posts`, JSON.stringify(nextPosts));
    setNotice(message);
  };

  const saveComments = (nextComments: Record<string, string[]>, message = "评论已保存") => {
    setCommentsByPost(nextComments);
    localStorage.setItem(`${storagePrefix}:comments`, JSON.stringify(nextComments));
    setNotice(message);
  };

  const updatePost = (postId: string, patch: Partial<CinemaPost>) => {
    savePosts(posts.map((post) => post.id === postId ? { ...post, ...patch } : post));
  };

  const replacePhoto = (postId: string, file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePost(postId, { photo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const deletePost = (postId: string) => {
    savePosts(posts.filter((post) => post.id !== postId), "上传内容已删除");
    const nextComments = { ...commentsByPost };
    delete nextComments[postId];
    localStorage.setItem(`${storagePrefix}:comments`, JSON.stringify(nextComments));
    setCommentsByPost(nextComments);
    ["liked", "saved"].forEach((key) => {
      const storageKey = `${storagePrefix}:${key}`;
      const ids = JSON.parse(localStorage.getItem(storageKey) || "[]") as string[];
      localStorage.setItem(storageKey, JSON.stringify(ids.filter((id) => id !== postId)));
    });
  };

  const updateComment = (postId: string, index: number, value: string) => {
    const nextComments = { ...commentsByPost, [postId]: [...(commentsByPost[postId] ?? [])] };
    nextComments[postId][index] = value;
    saveComments(nextComments);
  };

  const deleteComment = (postId: string, index: number) => {
    const next = (commentsByPost[postId] ?? []).filter((_, commentIndex) => commentIndex !== index);
    const nextComments = { ...commentsByPost };
    if (next.length) nextComments[postId] = next;
    else delete nextComments[postId];
    saveComments(nextComments, "评论已删除");
  };

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div>
          <span>游客便利贴后台</span>
          <h1>内容管理</h1>
        </div>
        <nav>
          <Link to="/cinema">返回游客便利贴</Link>
          <Link to="/"><House weight="bold" />返回首页</Link>
        </nav>
      </header>

      {notice && <p className="admin-notice">{notice}</p>}

      <section className="admin-section">
        <header>
          <h2>用户上传图片</h2>
          <p>可编辑标题、地点、分类、推荐理由，并替换上传图片。</p>
        </header>
        {posts.length === 0 ? (
          <article className="admin-empty-card">
            <ImageSquare weight="duotone" />
            <p>暂时还没有用户上传内容。前往游客便利贴发布一条后，这里会出现可编辑卡片。</p>
          </article>
        ) : (
          <div className="admin-post-list">
            {posts.map((post) => (
              <article className="admin-post-editor" key={post.id}>
                <label className="admin-photo-editor">
                  <img src={post.photo.startsWith("data:") ? post.photo : cardPhoto(post.photo)} alt={post.title} />
                  <span><Camera />替换图片</span>
                  <input type="file" accept="image/*" onChange={(event) => replacePhoto(post.id, event.target.files?.[0])} />
                </label>
                <div className="admin-fields">
                  <label>标题<input value={post.title} maxLength={30} onChange={(event) => updatePost(post.id, { title: event.target.value })} /></label>
                  <label>地点<input value={post.place} maxLength={30} onChange={(event) => updatePost(post.id, { place: event.target.value })} /></label>
                  <label>分类<select value={post.category} onChange={(event) => updatePost(post.id, { category: event.target.value })}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label className="admin-wide-field">推荐理由<textarea value={post.text} maxLength={200} onChange={(event) => updatePost(post.id, { text: event.target.value })} /></label>
                </div>
                <button className="admin-danger-button" type="button" onClick={() => deletePost(post.id)}><X />删除这条上传</button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section">
        <header>
          <h2>评论管理</h2>
          <p>可编辑或删除游客在详情弹窗里留下的评论。</p>
        </header>
        {commentRows.length === 0 ? (
          <article className="admin-empty-card">
            <ChatCircle />
            <p>暂时还没有评论。</p>
          </article>
        ) : (
          <div className="admin-comment-list">
            {commentRows.map((row) => (
              <article className="admin-comment-editor" key={`${row.postId}-${row.index}`}>
                <span>{row.postTitle}</span>
                <textarea value={row.comment} maxLength={120} onChange={(event) => updateComment(row.postId, row.index, event.target.value)} />
                <button type="button" onClick={() => deleteComment(row.postId, row.index)}>删除评论</button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
