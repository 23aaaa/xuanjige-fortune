#!/usr/bin/env python3
"""
算命网站HTTP服务器
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from datetime import datetime

class FortuneHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自定义HTTP请求处理器"""
    
    def do_GET(self):
        # 记录访问日志
        client_ip = self.client_address[0]
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {client_ip} - {self.path}")
        
        # 调用父类方法处理请求
        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def log_message(self, format, *args):
        # 自定义日志格式
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {self.address_string()} - {format % args}")

def start_server(port=8080):
    """启动HTTP服务器"""
    
    # 切换到网站目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # 检查必要文件
    required_files = ['index.html', 'fortune.html', 'css/style.css', 'css/login.css', 'js/login.js']
    for file in required_files:
        if not os.path.exists(file):
            print(f"错误: 缺少必要文件 {file}")
            return False
    
    print("=" * 60)
    print("玄机阁 - 算命网站服务器")
    print("=" * 60)
    print(f"网站目录: {os.getcwd()}")
    print(f"服务器运行在: http://localhost:{port}")
    print(f"访问地址: http://localhost:{port}/index.html")
    print("=" * 60)
    print("按 Ctrl+C 停止服务器")
    print("=" * 60)
    
    try:
        # 创建服务器
        handler = FortuneHTTPRequestHandler
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"服务器已启动，正在监听端口 {port}...")
            
            # 尝试自动打开浏览器
            try:
                webbrowser.open(f"http://localhost:{port}")
                print("已尝试在浏览器中打开网站...")
            except:
                print("无法自动打开浏览器，请手动访问以上地址")
            
            # 启动服务器
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n服务器正在关闭...")
        return True
    except Exception as e:
        print(f"启动服务器时出错: {e}")
        return False

def check_dependencies():
    """检查依赖"""
    try:
        import http.server
        import socketserver
        return True
    except ImportError as e:
        print(f"缺少必要依赖: {e}")
        return False

def main():
    # 检查依赖
    if not check_dependencies():
        print("请确保Python环境完整")
        return
    
    # 获取端口参数
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
            if port < 1 or port > 65535:
                print("端口号必须在1-65535之间")
                return
        except ValueError:
            print("端口号必须是数字")
            return
    
    # 启动服务器
    start_server(port)

if __name__ == "__main__":
    main()