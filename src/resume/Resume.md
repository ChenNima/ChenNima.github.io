---
path: "/resume"
date: 2019-09-10T10:23:40+08:00
title: "个人简历"
type: "resume"
lang: "zh"
---

# 个人信息
 - **陈逸斐**/男
 - 研究生/2017年毕业/华东理工大学 计算机科学与技术
 - 本科/2014年毕业/华东理工大学 环境工程
 - 博客：[https://chennima.github.io/blog](https://chennima.github.io/blog)
 - Github：[https://github.com/ChenNima](https://github.com/ChenNima)
 - LinkedIn：[https://www.linkedin.com/in/yifei-chen-990199110/](https://www.linkedin.com/in/yifei-chen-990199110/)
 - 邮箱：fennu637@sina.com<span class="d-none"> / 手机：18918561263</span>

# 工作经历

## SAP Labs China （ 2016年10月 ~  ）
Web应用(前后端)开发，DevOps以及数据工程师。
### **Senior Full Stack Developer**/<small>SAP Concur</small> （ 2021年1月 ~  ）
参与开发SAP Concur eFapiao，一个基于`NodeJS`和微信小程序的发票自动识别，校验系统

- DevOps: 项目在AWS以及`Kubernetes`上的运维和部署
- 后端开发: 基于`NodeJS`以及`NestJS`框架的后端Web服务。数据后端基于`DynamoDB`
- 数据工程:
  - 采集服务运行中产生的指标数据，并储存至`AWS S3`
  - 使用`AWS Glue Job`将采集到的数据经过ETL整合为`Parquet`格式，并进行各种聚合运算。
  - 使用`Grafana`以及`AWS Athena`查询并可视化采集到的数据
- 机器学习:
  - 部署基于`PaddleOCR`的OCR模型，辅助标注发票图片识别不准确的字段
  - 训练基于`SDMG-R`模型的关键信息提取模型，实现从图片中提取发票相关的关键字段

### **Senior DevOps**/<small>SAP Jam Collaboration</small> （ 2020年3月 ~ 2020年12月 ）

SAP Jam Collaboration(以下简称Jam)是一个基于`Ruby on Rails`后台/`React`，`BackboneJS`为前端的团队协作工具。


- 带领Devops团队改造现有运维架构，包括引入`Consul`与原有的`HAproxy`配合实现动态服务注册/发现和`Service Mesh`，在传统数据中心缺乏Kubernetes基础设施支持的情况下实现服务发现；使用`Prometheus`改造原有的日志系统与监控系统。
- 与跨国团队合作，实现多个时区不间断地共同支持DevOps工作

### **DevOps**/<small>SAP Jam Collaboration</small> （ 2019年3月 ~ 2020年3月 ）

- 将使用Docker部署在自有数据中心项目迁移至AWS上的`Kubernetes`环境
- 编写`Terraform`用以管理集群基础设施
- 将应用的各个微服务拆分为独立的`Helm Charts`并分别部署
- 使用`ArgoCD`实现`GitOps`流程；部署`Istio` Service Mesh并实现金丝雀部署，流量监控等功能。

### **Full Stack Developer**/<small>SAP Jam Collaboration</small> （ 2017年10月 ~ 2019年3月 ）

包括前端以及后端（`Ruby/NodeJS/Golang`）开发。

- 前端:
  - 编写抽象层将`BackboneJS`和`React`有机地结合在一起，实现新老代码的分隔维护与开发
  - 不影响老代码的情况下基本实现新功能向`React`/`Typescript`/`Styled-Component`迁移的工作。

- 后端:
  - 维护`Ruby on Rails`的后台服务
  - 开发基于NodeJS的微服务，包括实现React组件的`服务端渲染`服务以及基于`Puppeteer`的`SEO`预渲染服务
  - 开发基于`Golang`的文件存储微服务。主要提供一套通用接口，实现将文件存储至`NAS文件系统`，`AWS S3 Bucket`，`Azure Blob Storage`等存储介质。

### **Frontend Developer**/<small>SAP Jam Community</small> （ 2016年10月 ~  2017年10月 ）
SAP Jam Community是一款基于`EmberJS`/`Vue`和`Ruby on rails`的社交平台。在这段工作中主要担任前端开发，除编写`EmberJS`组件外，还使用`Vue`为项目编写前后端分离的管理工具。

## CareerBuilder China （ 2016年4月 ~  2016年10月 ）

### **Intern Web developer**

编写基于`AngularJS`/`Ruby on Rails`/`NodeJS`的web服务

# 认证
<p class="d-flex justify-content-between">
  <span style="width: 100px"><image style="width: 100px" src="./aws-certified-solutions-architect-associate.png" /></span>
</p>

# 技能

### 熟悉
- Web开发: Javascript `Typescript`/HTML/CSS `Styled-Component`/Webpack/NodeJS
- DevOps: Docker/Kubernetes/Terraform/iptables/Consul/HAproxy/AWS
- Web框架: React/Vue/NestJS
- 数据工程: AWS Athena, AWS DynamoDB

### 了解
- Web开发: Ruby on Rails/GraphQL/Golang/SEO
- DevOps: Jenkins `Groovy`/Service Mesh/AWS/Git Ops
- Kubernetes相关: Istio/EFK/Helm/ArgoCD
- 数据工程: AWS Glue(Spark), MySQL
- 机器学习: PaddlePaddle/CNN/SDMG-R