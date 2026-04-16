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

- [Chorus](https://github.com/Chorus-AIDLC/chorus)：基于[AI-DLC](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)方法论的Agent harness框架，为AI Agent构建Skills、MCP工具集与任务管理环境，驱动Agent自主完成从Idea→方案设计→任务拆分→代码实现→验收的端到端软件工程工作流
  - [Claude Code插件](https://github.com/Chorus-AIDLC/Chorus/tree/main/public/chorus-plugin)：通过Hooks与自定义Agent机制实现多Agent协作，自动注入Agent上下文并启动独立Agent进行任务审查与质量验收
  - [OpenClaw插件](https://www.npmjs.com/package/@chorus-aidlc/chorus-openclaw-plugin)：通过SSE + MCP双通道架构实现AI Agent 7×24自动感知工程任务并驱动交付

# 工作经历

## Amazon Web Services （ 2023年6月 ~ 至今 ）

### **Solutions Builder**/<small>AWS Solutions</small> （ 2023年6月 ~ 至今 ）
设计并开发基于AWS的行业解决方案，专注于医疗健康与AI Agent领域

- AI Agent解决方案:
  - 开发MCS (Marketing & Commercial Set)，基于[Strands Agents](https://strandsagents.com/latest/)和`Amazon Bedrock`的多Agent知识管理平台。使用`Amazon Neptune`+`OpenSearch Serverless`构建GraphRAG知识图谱，实现基于图检索的精准知识问答与策略推荐
  - 开发[Medical Deep Insights](https://mp.weixin.qq.com/s/ony8yF8s_gP7NAcLeU9r6w)，基于[Strands Agents](https://strandsagents.com/latest/)的可配置Agent平台。通过YAML配置快速生成Agent与Tool，集成15+外部工具，通过MCP协议扩展能力，部署于`Bedrock AgentCore`
- 数据与搜索:
  - 开发[Medical Insights Hub](https://www.amazonaws.cn/en/solutions/industry/health/medical-insights-hub/)，通过`OpenSearch Percolate`实现百万级术语表实时匹配，基于GenAI实现专业文档翻译，提供Word插件集成

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

### **Full Stack Developer**/<small>SAP Jam</small> （ 2016年10月 ~ 2019年3月 ）

- 基于`NodeJS`的SSR服务、基于`Golang`的多存储介质文件服务（S3/Azure Blob/NAS）
- `BackboneJS`→`React`/`TypeScript`前端框架迁移

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