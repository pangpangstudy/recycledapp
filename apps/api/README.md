# 自定义siwe登录验证策略

定义策略？：passport-ethereum-siwe
siwe---->validate--verifySignature  
jwt策略? or cookie? nonce的获取--session？ or redis？
验证路由？ signin signout nonce profile
封装 ethereum模块 or 直接auth全部做完？

# 选择

不使用，策略模式。（passport）
选择cookie做登录验证 authModule直接做完验证逻辑 不做 ethereum封装

# module

auth module：

cookies：module
