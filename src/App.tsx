import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
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

const optimizedAsset = (name: string) => `/assets/optimized/${name}`;

type Spot = {
  id: string;
  name: string;
  category: string;
  title: string;
  photo: string;
  x: number;
  y: number;
  desc: string;
  tags: string[];
  duration: string;
  openTime: string;
  audience: string;
};

const mapSpots: Spot[] = [
  { id: "guild", name: "广东会馆", category: "古建点", title: "商帮会馆", photo: "wooden-courtyard.jpg", x: 43, y: 48, desc: "始建于清乾隆年间，是昭通重要会馆，木雕精美，建筑格局严谨，见证了昔日商贸繁荣。", tags: ["古建点", "木雕", "会馆"], duration: "30–40分钟", openTime: "09:00–17:30", audience: "历史文化爱好者" },
  { id: "beizheng", name: "北正街", category: "拍照点", title: "老街烟火", photo: "old-street-walk.jpg", x: 48, y: 20, desc: "古城主街，店铺林立，灯笼与行人把老城日常铺开，是最适合扫街的一段。", tags: ["拍照点", "老街", "逛吃"], duration: "40分钟", openTime: "全天", audience: "街拍爱好者" },
  { id: "tiaoshui", name: "挑水巷", category: "拍照点", title: "青石小巷", photo: "stone-alley.jpg", x: 33, y: 35, desc: "老巷幽深，青石板路安静清爽，适合寻找古城慢生活。", tags: ["拍照点", "小巷"], duration: "20分钟", openTime: "全天", audience: "慢游旅人" },
  { id: "li", name: "李氏支祠", category: "古建点", title: "古建院落", photo: "wooden-courtyard.jpg", x: 68, y: 40, desc: "古朴院落与戏台相映，木柱、窗棂和灯笼保留着老城院落的温润气息。", tags: ["古建点", "祠堂"], duration: "25分钟", openTime: "09:00–17:30", audience: "古建爱好者" },
  { id: "square", name: "箭道广场", category: "拍照点", title: "城市节点", photo: "gate-street.jpg", x: 58, y: 57, desc: "古城街巷交汇的开阔节点，适合拍人文、路牌与古城日常。", tags: ["拍照点", "广场"], duration: "15分钟", openTime: "全天", audience: "亲子与游客" },
  { id: "wenmiao", name: "文庙", category: "古建点", title: "文脉地标", photo: "ancient-building-night.jpg", x: 56, y: 72, desc: "看斗拱、红墙与星门，感受昭通古城的人文气息。", tags: ["古建点", "人文"], duration: "40分钟", openTime: "09:00–17:30", audience: "历史文化爱好者" },
  { id: "quma", name: "趣马门", category: "古建点", title: "城门开场", photo: "stone-paifang.jpg", x: 76, y: 67, desc: "城门楼阁舒展，飞檐层叠，是进入古城气韵的一眼开场。", tags: ["古建点", "城门"], duration: "20分钟", openTime: "全天", audience: "第一次来古城的游客" },
  { id: "doujie", name: "陡街", category: "夜游点", title: "夜色老街", photo: "lantern-street.jpg", x: 30, y: 70, desc: "夜色亮起时，灯笼和屋檐会把画面变得很柔，适合傍晚以后慢慢逛。", tags: ["夜游点", "灯笼"], duration: "30分钟", openTime: "18:00–22:30", audience: "夜游与拍照爱好者" },
  { id: "food", name: "美食街", category: "美食点", title: "地道烟火", photo: "food-oil-cake-pea-paste.jpg", x: 52, y: 50, desc: "油糕稀豆粉、烧洋芋、小肉串都能在这里找到，一路逛一路吃。", tags: ["美食点", "烟火"], duration: "45分钟", openTime: "07:30–22:00", audience: "吃货与家庭游客" },
];

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
  { id: "rice", name: "油糕稀豆粉", category: "早餐必吃", photo: "food-oil-cake-pea-paste.jpg", tags: ["酥香", "绵滑", "暖胃"], time: "07:30—10:30", way: "趁热掰开油糕，蘸着稀豆粉吃", highlight: "本地黄豆磨浆，手工油糕现炸，香气浓郁", text: "油糕泡进稀豆粉，一酥一滑，是昭通清晨最舒服的暖意。", likes: "8.2k" },
  { id: "potato", name: "烧洋芋", category: "街边小吃", photo: "food-fried-potato.jpg", tags: ["软糯", "蘸料香"], time: "10:00—21:00", way: "炭火慢烤后蘸辣椒面吃", highlight: "外焦里糯，越吃越香", text: "炭火烤得焦香，蘸一口辣椒面，越吃越有味。", likes: "7.9k" },
  { id: "skewer", name: "昭通小肉串", category: "夜宵推荐", photo: "food-meat-skewer.jpg", tags: ["炭火", "鲜辣"], time: "18:00—23:00", way: "刚出炉时配一杯冰饮", highlight: "现烤现卖，油香和辣香一起冒出来", text: "小串现烤，油香和辣香一起冒出来，是夜晚最热闹的味道。", likes: "7.5k" },
  { id: "rice-noodle", name: "豆花米线", category: "早餐必吃", photo: "food-rice-noodle.jpg", tags: ["豆花细嫩", "米线爽滑"], time: "07:00—11:00", way: "先拌辣椒，再喝一口汤", highlight: "豆花细嫩，米线爽滑，汤鲜味美", text: "豆花细嫩、米线爽滑，汤鲜味美。", likes: "6.5k" },
  { id: "cool", name: "凉粉", category: "街边小吃", photo: "food-oil-cake-pea-paste.jpg", tags: ["冰凉爽口", "酸辣开胃"], time: "14:00—17:00", way: "加醋加辣，拌匀后入口", highlight: "清凉解暑，低脂时光", text: "冰凉爽口，酸辣开胃，夏日必备。", likes: "6.8k" },
  { id: "tofu", name: "烤豆腐", category: "街边小吃", photo: "food-meat-skewer.jpg", tags: ["外焦里嫩", "蘸料香"], time: "15:00—22:00", way: "蘸折耳根辣椒蘸水", highlight: "外焦里嫩，秘制蘸料香气扑鼻", text: "外焦里嫩，秘制蘸料香气扑鼻。", likes: "6.2k" },
  { id: "hotpot", name: "小锅串串", category: "夜宵推荐", photo: "food-fried-potato.jpg", tags: ["麻辣鲜香", "越煮越入味"], time: "18:00—23:30", way: "荤素搭配，慢慢涮", highlight: "锅多味，麻辣鲜香", text: "锅多味，麻辣鲜香，越煮越入味。", likes: "5.9k" },
  { id: "cold", name: "蘸凉粉", category: "本地经典", photo: "food-rice-noodle.jpg", tags: ["清爽", "咸香"], time: "11:00—18:00", way: "蘸汁浓一点更香", highlight: "清香爽滑，独特的山风风味", text: "奔爽凉粉，清香爽滑，独特的山风风味。", likes: "5.3k" },
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
  { title: "会馆与大院", items: ["guild", "li", "square"] },
  { title: "老街与巷子", items: ["old-street", "doujie", "alley"] },
  { title: "城门与人文", items: ["gate", "quma", "wenmiao"] },
];

const architectureItems: ArchitecturePlace[] = [
  { id: "guild", name: "广东会馆", group: "会馆与大院", photo: "arch-guildhall.jpg", description: "清代商帮集资所建，木雕石刻精美，戏楼飞檐恢宏，见证昭通商脉与文化交融。", tags: ["商帮文化", "戏楼", "木雕", "石刻"], tip: "看建筑细节、拍屋檐和会馆门楼，感受商帮文化与精湛工艺。", cardText: "会馆庭院，雕梁画栋，气度不凡。" },
  { id: "li", name: "李氏支祠", group: "会馆与大院", photo: "arch-li-family.jpg", description: "古朴院落与戏台相映，木柱、窗棂和灯笼保留着老城院落的温润气息。", tags: ["祠堂", "戏台", "院落"], tip: "适合拍对称构图，阳光落在戏台时最有层次。", cardText: "古建戏台，灯笼映光，院落安静。" },
  { id: "square", name: "辕门口", group: "会馆与大院", photo: "arch-square.jpeg", description: "老城中心的开阔节点，街巷、人流与牌坊在这里交汇。", tags: ["广场", "街巷", "人文"], tip: "傍晚来这里看人来人往，最能感受古城日常。", cardText: "城市中心，烟火往来，适合扫街。" },
  { id: "old-street", name: "北正街", group: "老街与巷子", photo: "arch-old-street.jpg", description: "古城主街，店铺林立，烟火气十足，街面透着昭通人的日常节奏。", tags: ["拍照", "夜游", "逛吃"], tip: "沿街慢走，拍门头、灯笼和行人，画面更有故事感。", cardText: "古城主街，店铺林立，烟火气十足。" },
  { id: "doujie", name: "陡街", group: "老街与巷子", photo: "arch-doujie.jpg", description: "石阶古街，曲折上行，老建筑与街招一起构成复古街景。", tags: ["拍照", "慢逛", "街景"], tip: "低机位顺着坡度拍，纵深感最强。", cardText: "石阶古街，曲折上行，别有韵味。" },
  { id: "alley", name: "挑水巷", group: "老街与巷子", photo: "tiaoshuixiang-stone-alley.jpg", description: "青石板路与窄巷相连，安静、清爽，适合寻找古城慢生活。", tags: ["小巷", "青石", "慢行"], tip: "雨后或清晨光线柔和，巷子更有层次。", cardText: "老巷幽深，青石板路，静谧清幽。" },
  { id: "gate", name: "抚镇门", group: "城门与人文", photo: "arch-gate.jpg", description: "古城城门与石牌坊相接，线条稳重，是城市记忆的重要入口。", tags: ["城门", "牌坊", "历史"], tip: "正面取景，把城门、道路和天空一起纳入画面。", cardText: "古城阙门，城楼巍峨，登楼望城。" },
  { id: "quma", name: "趣马门", group: "城门与人文", photo: "arch-quma-gate.jpeg", description: "城门楼阁舒展，飞檐层叠，城墙厚重，是进入古城气韵的一眼开场。", tags: ["城门", "楼阁", "拍照"], tip: "适合正面取景，把城门、道路和天空一起纳入画面，气势最完整。", cardText: "楼阁巍峨，城门开阔，第一眼很震撼。" },
  { id: "wenmiao", name: "文庙", group: "城门与人文", photo: "arch-wenmiao.jpg", description: "红墙、飞檐与文脉空间相连，是古城里最有书卷气的建筑片段。", tags: ["文庙", "红墙", "人文"], tip: "拍红墙与飞檐的局部，画面干净又有古意。", cardText: "近代学堂故居，书香门第，文脉悠长。" },
];

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
  { id: "rice", title: "油糕稀豆粉真香！", place: "昭通古城小吃店", photo: "food-oil-cake-pea-paste.jpg", text: "一口油糕，一口稀豆粉，暖心又满足～", category: "美食", likes: 412, author: "豆豆爱吃", time: "1天前" },
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
            <h2>古城手绘地图</h2>
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
          建议上午逛老街和建筑，下午吃小吃、拍照，傍晚留给灯火亮起后的古城夜游。
        </Modal>
      )}
    </main>
  );
}

function MapPage() {
  const [filter, setFilter] = useState("全部");
  const [selectedId, setSelectedId] = useState("guild");
  const filters = ["全部", "美食点", "古建点", "拍照点", "夜游点"];
  const visible = filter === "全部" ? mapSpots : mapSpots.filter((spot) => spot.category === filter);
  const selected = useMemo(() => mapSpots.find((spot) => spot.id === selectedId) ?? mapSpots[0], [selectedId]);
  const routeSpots = ["beizheng", "guild", "wenmiao", "quma", "doujie"]
    .map((id) => mapSpots.find((spot) => spot.id === id))
    .filter(Boolean) as Spot[];

  return (
    <main className="map-page">
      <header className="map-top-nav">
        <Link className="map-logo" to="/">
          <strong>昭通古城</strong>
          <span>印象昭通</span>
        </Link>
        <nav aria-label="古城手绘地图导航">
          <Link to="/">首页</Link>
          <Link className="active" to="/map">古城导览</Link>
          <Link to="/architecture">游玩推荐</Link>
          <Link to="/cinema">实用攻略</Link>
          <Link to="/food">关于我们</Link>
        </nav>
      </header>

      <section className="map-page-title">
        <h1>古城手绘地图</h1>
        <p>美食点、古建点、拍照点、夜游点，一图掌握，导览不迷路。</p>
      </section>

      <section className="map-dashboard">
        <aside className="map-filter-card">
          <div className="map-filter-buttons">
            {filters.map((item) => (
              <button className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)} key={item}>
                <span>{item === "全部" ? "🏯" : item === "美食点" ? "♨" : item === "古建点" ? "▦" : item === "拍照点" ? "📷" : "☾"}</span>
                {item}
              </button>
            ))}
          </div>
          <div className="map-legend">
            <h2>图例说明</h2>
            <p><i className="legend-dot building" />古建点</p>
            <p><i className="legend-dot food" />美食点</p>
            <p><i className="legend-dot photo" />拍照点</p>
            <p><i className="legend-dot night" />夜游点</p>
            <p><i className="legend-line" />主干道</p>
          </div>
        </aside>

        <section className="map-canvas-card" aria-label="昭通古城手绘地图">
          <img className="map-illustration" src={mapAsset("zhaotong-handdrawn-map-base.svg")} alt="昭通古城导览地图" />
          <img className="map-compass-deco" src={mapAsset("map-compass.png")} alt="" />
          {visible.map((spot) => (
            <button
              className={`map-pin ${selected.id === spot.id ? "active" : ""}`}
              data-category={spot.category}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              type="button"
              onClick={() => setSelectedId(spot.id)}
              key={spot.id}
            >
              <MapPin weight="fill" />
              <span>{spot.name}</span>
            </button>
          ))}
        </section>

        <article className="map-side-card">
          <header>
            <h2>{selected.name}</h2>
            <span>{selected.category}</span>
          </header>
          <img src={cardPhoto(selected.photo)} alt={selected.name} />
          <p>{selected.desc}</p>
          <ul>
            <li><span>◷</span><b>推荐时长</b>{selected.duration}</li>
            <li><span>◴</span><b>开放时间</b>{selected.openTime}</li>
            <li><span>♙</span><b>适合人群</b>{selected.audience}</li>
          </ul>
          <button className="map-primary-action" type="button">查看详情 <ArrowRight weight="bold" /></button>
          <button className="map-secondary-action" type="button">加入路线 ＋</button>
        </article>
      </section>

      <section className="map-route-panel">
        <div className="map-route-stone">
          <strong>昭通<br />古城</strong>
          <span>千年文脉 · 滇川明珠</span>
        </div>
        <div className="route-title">
          <h2>推荐路线</h2>
        </div>
        <div className="map-route-list">
          {routeSpots.map((spot, index) => (
            <button type="button" onClick={() => setSelectedId(spot.id)} key={spot.id}>
              <b>{index + 1}</b>
              <img src={cardPhoto(spot.photo)} alt="" />
              <span>{spot.name}</span>
              {index < routeSpots.length - 1 && <i>→</i>}
            </button>
          ))}
        </div>
        <button className="map-full-route" type="button">查看完整路线</button>
      </section>

      <p className="map-tip">小贴士：点击地图上的标记点，可查看详情；筛选左侧类别可快速定位想去的地点。</p>
    </main>
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
          <Link to="/map">古城漫游</Link>
          <Link to="/architecture">文化体验</Link>
          <Link className="active" to="/food">味道图鉴</Link>
          <Link to="/cinema">旅宿攻略</Link>
          <Link to="/cinema">活动资讯</Link>
          <Link to="/map">实用信息</Link>
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
  const funPlaces = ["old-street", "doujie", "alley", "gate", "li", "wenmiao"]
    .map((id) => placeById.get(id))
    .filter(Boolean) as ArchitecturePlace[];
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
          <img src={architectureAsset(active.photo)} alt={active.name} />
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
            <button type="button"><MapPin weight="fill" />查看位置</button>
            <button type="button">加入路线 ＋</button>
          </div>
        </article>
      </section>

      <section className="arch-fun-section">
        <header>
          <h2>比较好玩的地点</h2>
          <button type="button">查看更多地点 <ArrowRight /></button>
        </header>
        <div className="arch-place-grid">
          {funPlaces.map((item) => (
            <article className={active.id === item.id ? "active" : ""} key={item.id}>
              <img src={architectureAsset(item.photo)} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.cardText}</p>
              <div>{item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
              <button type="button" onClick={() => setActiveId(item.id)}>查看详情 <ArrowRight /></button>
            </article>
          ))}
        </div>
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
      setUserPosts(JSON.parse(localStorage.getItem(`${storagePrefix}:posts`) || "[]"));
      setLikedIds(JSON.parse(localStorage.getItem(`${storagePrefix}:liked`) || "[]"));
      setSavedIds(JSON.parse(localStorage.getItem(`${storagePrefix}:saved`) || "[]"));
      setCommentsByPost(JSON.parse(localStorage.getItem(`${storagePrefix}:comments`) || "{}"));
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
    localStorage.setItem(`${storagePrefix}:posts`, JSON.stringify(userPosts));
  }, [storageReady, userPosts]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(`${storagePrefix}:liked`, JSON.stringify(likedIds));
  }, [storageReady, likedIds]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(`${storagePrefix}:saved`, JSON.stringify(savedIds));
  }, [storageReady, savedIds]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(`${storagePrefix}:comments`, JSON.stringify(commentsByPost));
  }, [storageReady, commentsByPost]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(`${storagePrefix}:sort`, sortMode);
  }, [storageReady, sortMode]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(`${storagePrefix}:category`, category);
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

  const handlePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(String(reader.result));
      setNotice("");
    };
    reader.readAsDataURL(file);
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
    setUserPosts((posts) => [newPost, ...posts]);
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
        <p>{children}</p>
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
