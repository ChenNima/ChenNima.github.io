---
path: "/nest-js-source-code-reading-bootstrap"
date: 2023-03-09T11:12:03+08:00
title: "NestJS源码精读(1): 启动与依赖注入"
type: "blog"
---

如果要说近几年NodeJS开发者中最流行和热门的MVC框架，那非[NestJS](https://github.com/nestjs/nest)莫属了。下图是2012年至2023年Github上各个知名NodeJS Web框架的Star数趋势：
![node-framework-star-history](node-framework-star-history.png)

我们可以直观得看出，从2018年以来，`NestJS`就异军突起，力压`Egg`，`Hapi`和`Sails`，仅用两年时间就稳居最受环境的NodeJS框架至今。

![nest-banner](nest-banner.png)

NestJS作为一个受[Spring](https://github.com/spring-projects/spring-framework)和[Angular](https://github.com/angular/angular)启发的框架，实现了非常优秀的依赖注入功能。那我们今天就从NestJS的启动过程开始，了解一下他是如何做好依赖注入这一件“小”事的吧。

*本文基于NestJS的[v9.3.9](https://github.com/nestjs/nest/tree/v9.3.9)版本*

# 1. 名词解释

在我们开始读源码之前，不妨先梳理一下源码中出现的许多类的概念吧。这样在源码中遇到各式各样的变量和类，也能做到心中有数他们是用来做什么的。

## 1.1 代码结构

作为一个[Monorepo](https://monorepo.tools/)，Nest各个模块的源码在[packages](https://github.com/nestjs/nest/tree/v9.3.9/packages)这个文件夹内。

```
packages
├── common
├── core
├── microservices
├── platform-express
├── platform-fastify
├── platform-socket.io
├── platform-ws
├── testing
└── websockets
```
其中有许多诸如[@nestjs/testing](https://www.npmjs.com/package/@nestjs/testing)和[@nestjs/testing](https://www.npmjs.com/package/@nestjs/microservices)包。但我们今天将重点放在最核心的[@nestjs/core](https://www.npmjs.com/package/@nestjs/core)和[@nestjs/common](https://www.npmjs.com/package/@nestjs/common)上。

## 1.2 容器类

**NestContainer**

容器是实现依赖注入的关键，而[NestContainer](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/container.ts#L24)是整个NestApp最外层的容器。其中除了几个类似于`ModuleCompiler`的工具外，主要包含了几个指向配置和具体模块的容器集合。
- globalModules: 存放全局模块
- modules: 存放用户定义的模块
- internalCoreModule: 存放内置模块
- _applicationConfig: 存放配置，主要包括`globalPipes`，`globalFilters`，`globalInterceptors`等等的全局配置

![nest-contaienr](nest-contaienr.png)

**Module**

在NestJS中，用户编写的代码和依赖关系都是通过[Module](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/module.ts#L48)管理的。

![nest-module](nest-module.png)

该容器的结构与我们在NestJS代码中定义一个Module的方式高度一致，
```js
@Module({
  imports: [...],
  controllers: [...],
  providers: [...],
  exports: [...].
})
export class CatsModule {}
```
其中`_imports`中存放的是对其他模块的引用，`exports`中存放的[InstanceToken](https://github.com/nestjs/nest/blob/v9.3.9/packages/common/interfaces/modules/injection-token.interface.ts#L7)(即方便其他模块用来注入依赖的Token，而不是服务实例本身)之外，其他的`_providers`, `_injectables`, `_middlewares`和`_controllers`均指向了`InstanceWrapper`集合，即指向了真实的实例。

**InstanceWrapper**

[InstanceWrapper](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/instance-wrapper.ts#L59)是对可注入对象实例的封装。
![nest-instance-wrapper](nest-instance-wrapper.png)
使用一层封装而不是直接储存实例化的对象主要出自于两方面考虑:

1. 循环依赖问题: 为了解决循环依赖问题，整个NestJS将可注入对象的实例化分为了两步。第一步先通过原型链创建出该对象的实例，但不注入任何依赖，所以这一步我们可以获得所有服务的实例引用而不需要担心循环依赖的问题。第二步再向各个半成品实例注入依赖，此时服务的所有依赖不管有没有循环依赖的问题，均已有实例引用可以直接注入。而`InstanceWrapper`就是一个存放半成品实例和最终实例的容器。
2. Scope隔离问题: NestJS支持在不[不同Scope创建可注入对象](https://docs.nestjs.com/fundamentals/injection-scopes)。其中Scope又分为三种：
- Default: 全局的单例，生命周期和整个nestApp一样长
- Request: 每个request生成一个单例，该单例在request结束后被销毁
- Transient: 每次注入时产生一个新的实例

所以当依赖注入的时候，需要根据当前Scope，注入一个对应的实例。`InstanceWrapper`中对象的实例实际储存在一个`WeakMap`中，将实例与他对应的`ContextId`做一一映射。

此外`InstanceWrapper`中还储存了诸如`metaType`，即可注入对象的Class，用以创建对象，以及`subtype`，用以标记可注入对象是否为一个`guard`, `interceptor`, `pipe`或者`filter`这样的元数据。

**InstanceLinksHost**

NestJS除了普通的依赖注入外，还提供了一个[Standalone](https://docs.nestjs.com/standalone-applications)模式，即绕过依赖注入的流程，直接从NestApp中获取依赖的实例
```js
const app = await NestFactory.createApplicationContext(AppModule);
const tasksService = app.get(TasksService);
```
从上文中我们知道，Nest的依赖结构是一个树状结构，从根Module开始，不断地向imports Module的方向延伸。这是否意味着我们每次通过Standalone模式获取依赖都需要遍历一遍整颗依赖树来搜索呢？实际上Nest将整颗依赖树拍平，把所有可注入对象的引用放到了[InstanceLinksHost](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/instance-links-host.ts#L16)的Map中，这样就可以在O(1)时间复杂度内找到对应的依赖了。
