### 使用 docker 运行 noname

/docker/index.js.deprecated 来自[noname-server](https://github.com/nonameShijian/noname-server)

1.克隆存储库

```shell
git clone -b master --depth=1 https://github.com/libccy/noname.git
cd noname
```

2. 构建

```shell
docker build -t noname .
```

3. 启动

```shell
docker run -dit --name noname --restart=unless-stopped -p 8734:8089 -p 8324:8080  noname
```

web 游戏界面: `8734`
联机大厅: `8324`
端口可以自己修改
