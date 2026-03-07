---
path: "/resume"
date: 2026-03-07T10:00:00+08:00
title: "个人简历"
type: "resume"
lang: "zh"
---

# 个人信息
 - **陈逸斐**/男
 - 硕士/2017年毕业/华东理工大学 计算机科学与技术
 - 博客：[https://chennima.github.io/blog](https://chennima.github.io/blog)
 - Github：[https://github.com/ChenNima](https://github.com/ChenNima)
 - LinkedIn：[https://www.linkedin.com/in/yifei-chen-990199110/](https://www.linkedin.com/in/yifei-chen-990199110/)
 - 邮箱：fennu637@sina.com<span class="d-none"> / 手机：18918561263</span>

# 开源项目

- [Chorus](https://github.com/Chorus-AIDLC/chorus)：基于[AI-DLC](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)方法论的Agent harness框架，采用Reversed Conversation模式（AI提案，人类审核），让AI Agent与人类协作完成从Idea到Proposal到Task的产品交付流程
  - [Claude Code插件](https://github.com/Chorus-AIDLC/Chorus/tree/main/public/chorus-plugin)：通过Hooks机制实现Agent Teams (Swarm)场景下Sub-Agent的自动Session管理与上下文注入
  - [OpenClaw插件](https://www.npmjs.com/package/@chorus-aidlc/chorus-openclaw-plugin)：通过SSE + MCP双通道架构实现AI Agent 24小时在线自动感知任务并推进产品交付流程

# 工作经历

## Amazon Web Services （ 2023年6月 ~ 至今 ）

### **Solutions Builder**/<small>AWS Solutions</small> （ 2023年6月 ~ 至今 ）
设计并开发基于AWS的行业解决方案，专注于医疗健康与AI Agent领域

- 解决方案开发:
  - 开发MCS (Marketing & Commercial Set)，基于[Strands Agents](https://strandsagents.com/latest/)和`Amazon Bedrock`的医药销售AI知识管理与培训助手。使用`Amazon Neptune`+`OpenSearch Serverless`构建GraphRAG知识图谱，支持STAR案例方法论、AI驱动的销售策略推荐与模拟训练
  - 开发[Medical Deep Insights](https://mp.weixin.qq.com/s/ony8yF8s_gP7NAcLeU9r6w)，基于[Strands Agents](https://strandsagents.com/latest/)的医疗内容生成助手。支持通过YAML配置和AI编程助手(Skill)快速生成Agent与Tool，集成PubMed/临床试验/专利检索等15+工具，通过MCP协议扩展外部能力，部署于`Bedrock AgentCore`
  - 开发[Medical Insights Hub](https://www.amazonaws.cn/en/solutions/industry/health/medical-insights-hub/)，基于AWS的医疗内容生成解决方案。基于GenAI实现专业医疗文档翻译，通过`OpenSearch Percolate`支持百万级术语表匹配；支持对接PubMed等外部知识库协作生成医疗内容，并提供Word插件集成

## SAP Labs China （ 2016年10月 ~ 2023年6月 ）
架构师，Web应用(前后端)开发，DevOps以及数据工程师。
### **Architect**/<small>SAP Concur</small> （ 2021年1月 ~ 2023年6月 ）
设计并开发SAP Concur eFapiao，一个基于`NodeJS`和微信小程序的发票自动识别，校验解决方案

- DevOps:
  - 项目在AWS以及`Kubernetes`上的运维和部署
  - 服务注册与发现基于Concur定制化的`Istio`+`Envoy`服务网格
- 后端开发:
  - 基于`NodeJS`以及`NestJS`框架的后端Web服务
  - 数据后端基于AWS的分布式数据库`DynamoDB`
- 数据工程:
  - 采集服务运行中产生的指标数据，通过`AWS S3`以及`AWS Kinesis`流式传输与数据管道对接
  - 使用`AWS Glue Job`实现基于`Spark`的批处理/流处理ETL任务
  - 使用`Grafana`以及`AWS Athena`查询并可视化采集到的数据
- 机器学习:
  - 部署基于`PaddleOCR`的OCR模型，辅助标注发票图片识别不准确的字段
  - 训练基于`SDMG-R`模型的关键信息提取模型，实现从图片中提取发票相关的关键字段

### **Senior DevOps**/<small>SAP Jam Collaboration</small> （ 2019年3月 ~ 2020年12月 ）

SAP Jam Collaboration是一个基于`Ruby on Rails`/`React`的团队协作工具。

- 带领DevOps团队将项目从自有数据中心迁移至AWS `Kubernetes`环境，使用`Terraform`/`Helm`/`ArgoCD`管理基础设施与GitOps流程
- 引入`Consul`+`HAproxy`实现服务发现，部署`Istio` Service Mesh实现金丝雀部署与流量监控
- 与跨国团队协作，支持多时区不间断DevOps运维

### **Full Stack Developer**/<small>SAP Jam Collaboration</small> （ 2017年10月 ~ 2019年3月 ）

- 前端：编写`BackboneJS`→`React`/`TypeScript`迁移抽象层，实现新老代码共存
- 后端：开发基于`NodeJS`的SSR服务、基于`Golang`的多存储介质文件服务（S3/Azure Blob/NAS）

### **Frontend Developer**/<small>SAP Jam Community</small> （ 2016年10月 ~ 2017年10月 ）

基于`EmberJS`/`Vue`/`Ruby on Rails`的社交平台前端开发

# 认证
<p class="d-flex justify-content-between">
  <span style="width: 100px"><image style="width: 100px" src="./AWS-Certified-Machine-Learning-Engineer.png" alt="AWS Certified Machine Learning Engineer" /></span>
  <span style="width: 100px"><image style="width: 100px" src="./aws-certified-solutions-architect-associate.png" alt="AWS Certified Solutions Architect Associate" /></span>
  <span style="width: 100px"><image style="width: 100px" src="./AWS-Certified-Developer.png" alt="AWS Certified Developer Associate" /></span>
  <span style="width: 100px"><image style="width: 100px" src="./AWS-Certified-SysOps-Administrator.png" alt="AWS Certified SysOps Administrator Associate" /></span>
  <span style="width: 100px"><image style="width: 100px" src="./AWS-Industry-Healthcare-Intermediate.png" alt="AWS Industry Healthcare Intermediate" /></span>
</p>

# 技能

### 熟悉
- AI/Agent: Strands Agents/Claude Code Plugin/OpenClaw Plugin/LangChain/Amazon Bedrock/MCP/SSE
- Web开发: TypeScript/JavaScript/Python/HTML/CSS/Webpack/NodeJS
- DevOps: AWS/Docker/Kubernetes/Terraform
- Web框架: React/Next.js/FastAPI/Vue/NestJS
- 数据工程: AWS Athena/AWS DynamoDB

### 了解
- Web开发: Ruby on Rails/GraphQL/Golang/SEO
- DevOps: Jenkins/Service Mesh/Istio/Helm/ArgoCD/GitOps
- 数据工程: AWS Glue(Spark)/MySQL
- 机器学习: PaddlePaddle/CNN/SDMG-R