const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const https = require("https");

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response
            .pipe(fs.createWriteStream(filepath))
            .on("error", reject)
            .once("close", () => resolve(filepath));
        } else {
          response.resume();
          reject(new Error(`请求失败: ${response.statusCode}`));
        }
      })
      .on("error", reject);
  });
}

async function scrapeBaiduImages() {
  const searchWord = "图片";
  const saveDir = "./downloaded_images";
  const maxImages = 20;

  try {
    // 创建保存目录
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir);
    }

    // 启动浏览器，使用系统已安装的 Chrome
    const browser = await puppeteer.launch({
      headless: "new",
      channel: "chrome", // 使用已安装的 Chrome
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
      ignoreDefaultArgs: ["--enable-automation"], // 避免被检测为自动化工具
    });

    const page = await browser.newPage();

    // 设置视窗大小
    await page.setViewport({ width: 1920, height: 1080 });

    // 设置用户代理
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    );

    console.log("正在访问百度图片...");

    // 访问百度图片
    await page.goto(
      `https://image.baidu.com/search/index?tn=baiduimage&word=${encodeURIComponent(
        searchWord
      )}`,
      {
        waitUntil: "networkidle0",
        timeout: 60000, // 增加超时时间到60秒
      }
    );

    console.log("等待图片加载...");

    // 等待图片加载
    await page.waitForSelector(".main_img", { timeout: 10000 });

    // 获取图片链接
    const images = await page.evaluate(() => {
      const imgElements = document.querySelectorAll(".main_img");
      return Array.from(imgElements).map((img) => {
        return {
          src: img.src,
          title: img.alt || "未命名",
        };
      });
    });

    console.log(`找到 ${images.length} 张图片`);

    // 下载图片
    let downloadCount = 0;
    for (let i = 0; i < Math.min(images.length, maxImages); i++) {
      const image = images[i];
      if (image.src && image.src.startsWith("http")) {
        const filename = `${i + 1}_${image.title.replace(
          /[\/\\:*?"<>|]/g,
          ""
        )}.jpg`;
        const filepath = path.join(saveDir, filename);

        try {
          await downloadImage(image.src, filepath);
          console.log(`成功下载: ${filename}`);
          downloadCount++;
        } catch (err) {
          console.error(`下载失败 ${filename}:`, err.message);
        }

        // 添加延迟，避免请求过快
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    console.log(`下载完成! 成功下载 ${downloadCount} 张图片`);
    await browser.close();
  } catch (error) {
    console.error("爬取失败:", error);
  }
}

// 执行爬虫
scrapeBaiduImages();
