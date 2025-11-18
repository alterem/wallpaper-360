# 一个基于360壁纸接口的壁纸网站


## 服务端 Nginx 配置解决跨域

![](images/Snipaste_2023-04-05_13-22-35.png)

```sh
location /search {
    proxy_pass http://wallpaper.apc.360.cn/index.php;
}

location /imglist {
    proxy_pass http://wallpaper.apc.360.cn/index.php;
}
```

## caddy

```
:90 {
    root * /usr/share/caddy/wallpaperCollection
    
    route {
        # /imglist 代理
        handle /imglist* {
            uri strip_prefix /imglist
            uri path_regexp ^(.*)$ /index.php$1
            reverse_proxy http://wallpaper.apc.360.cn {
                header_up Host wallpaper.apc.360.cn
                header_down Access-Control-Allow-Origin *
            }
        }
        
        # /search 代理  
        handle /search* {
            uri strip_prefix /search
            uri path_regexp ^(.*)$ /index.php$1
            reverse_proxy http://wallpaper.apc.360.cn {
                header_up Host wallpaper.apc.360.cn
                header_down Access-Control-Allow-Origin *
            }
        }
        
        # 静态文件
        handle {
            try_files {path} {path}/index.html /index.html
            file_server
        }
    }
}
```