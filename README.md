# 贪吃蛇游戏

一个使用 HTML5 Canvas 和 JavaScript 实现的贪吃蛇游戏。

## 部署到 GitHub Pages

1. 在 GitHub 上创建一个新的仓库
2. 将代码克隆到本地：
   ```bash
   git clone <你的仓库URL>
   ```
3. 将游戏文件复制到仓库目录中
4. 提交代码到 GitHub：
   ```bash
   git add .
   git commit -m "初始提交：贪吃蛇游戏"
   git push origin main
   ```
5. 在仓库设置中启用 GitHub Pages：
   - 进入仓库的 Settings 页面
   - 找到 Pages 选项
   - 在 Source 中选择 main 分支
   - 点击 Save

几分钟后，你的游戏就可以通过 GitHub Pages 提供的 URL 访问了。

## 本地运行

你可以使用任何 Web 服务器在本地运行游戏。例如，使用 Python 的内置服务器：

```bash
python -m http.server 8000
```

然后在浏览器中访问 http://localhost:8000