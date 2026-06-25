import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const base = "http://127.0.0.1:5173";

const results = [];
const check = async (name, action) => {
  try {
    await action();
    results.push({ name, passed: true });
  } catch (error) {
    results.push({ name, passed: false, error: String(error) });
  }
};

await check("首页四入口", async () => {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.locator(".entrance-card").first().waitFor();
  if (await page.locator(".entrance-card").count() !== 4) throw new Error("入口数量不为 4");
});
await check("首页弹窗与收藏", async () => {
  await page.getByRole("button", { name: "游玩贴士" }).click();
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "关闭" }).click();
  await page.getByRole("button", { name: /收藏本页|已收藏/ }).click();
});
await check("旧路线地址返回首页", async () => {
  await page.goto(`${base}/route`);
  await page.waitForURL(`${base}/`);
  if (await page.locator(".entrance-card").count() !== 4) throw new Error("旧路线地址未返回首页");
});
await check("地图筛选与点位", async () => {
  await page.goto(`${base}/map`);
  await page.getByRole("button", { name: "美食", exact: true }).click();
  await page.locator(".map-marker").nth(2).click();
  await page.getByRole("heading", { name: "陕西会馆" }).waitFor();
});
await check("美食详情切换", async () => {
  await page.goto(`${base}/food`);
  await page.locator(".food-story").nth(1).click();
  await page.locator(".food-detail").getByRole("heading", { name: "烧洋芋" }).waitFor();
});
await check("建筑详情切换", async () => {
  await page.goto(`${base}/architecture`);
  await page.getByRole("button", { name: "牌坊与门楼" }).click();
  await page.getByRole("heading", { name: "牌坊：古城的第一眼" }).waitFor();
});
await check("播放器筹备状态", async () => {
  await page.goto(`${base}/cinema`);
  await page.getByRole("button", { name: "播放" }).click();
  await page.getByText("古城影像正在筹备中").waitFor();
  await page.getByRole("button", { name: "关闭", exact: true }).click();
});
await check("照片灯箱键盘操作", async () => {
  await page.locator(".photo-wall button").first().click();
  await page.locator(".lightbox").waitFor();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  await page.locator(".lightbox").waitFor({ state: "detached" });
});
await check("手机端无横向溢出", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  const dims = await page.locator("body").evaluate((body) => ({ scroll: body.scrollWidth, client: body.clientWidth }));
  if (dims.scroll > dims.client + 1) throw new Error(`横向溢出 ${dims.scroll}/${dims.client}`);
});

await browser.close();
console.log(JSON.stringify(results, null, 2));
if (results.some((result) => !result.passed)) process.exit(1);
