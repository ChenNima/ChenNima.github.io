---
path: "/nest-js-source-code-reading-dependency-injection"
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

可以看到，`NestContainer`作为一个最外层的容器，本身的主要作用就是用来存放配置以及各个模块的，可以说是容器的容器。

![nest-contaienr](nest-contaienr.png)

**Module**

在NestJS中，用户编写的各类`Controller`和`Service`都组织在一个[Module](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/module.ts#L48)容器中。该容器不仅承载了我们编写的代码，也包含着模块与模块之间的依赖关系。

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

可能有同学会有疑问，为什么实例化的对象需要使用一层封装而不是直接储存该对象呢？主要出自于几个方面考虑:

- 存放元数据: 其中最简单直接的原因是除了实例外，`InstanceWrapper`容器还存放了诸如`metaType`，即可注入对象的Class，用以创建对象，以及`subtype`，用以标记可注入对象是否为一个`guard`, `interceptor`, `pipe`或者`filter`这样的元数据。
- 循环依赖问题: 为了解决循环依赖问题，整个NestJS将可注入对象的实例化分为了两步。第一步先通过原型链创建出该对象的实例，但不注入任何依赖，所以这一步我们可以获得所有服务的实例引用而不需要担心循环依赖的问题。第二步再向各个半成品实例注入依赖，此时服务的所有依赖不管有没有循环依赖的问题，均已有实例引用可以直接注入。而`InstanceWrapper`就是一个存放半成品实例和最终实例的容器。
- Scope隔离问题: NestJS支持在[不同Scope创建可注入对象](https://docs.nestjs.com/fundamentals/injection-scopes)。其中Scope又分为三种：
  - Default: 全局的单例，生命周期和整个nestApp一样长
  - Request: 每个request生成一个单例，该单例在request结束后被销毁
  - Transient: 每次注入时产生一个新的实例

所以当依赖注入的时候，需要根据当前Scope，注入一个对应的实例。`InstanceWrapper`中对象的实例实际储存在一个`WeakMap`中，将实例与他对应的`ContextId`做一一映射。

**InstanceLinksHost**

NestJS除了普通的依赖注入外，还提供了一个[Standalone](https://docs.nestjs.com/standalone-applications)模式，即绕过依赖注入的流程，直接从NestApp中获取依赖的实例
```js
const app = await NestFactory.createApplicationContext(AppModule);
const tasksService = app.get(TasksService);
```
从上文中我们知道，Nest的依赖结构是一个树状结构，从根Module开始，不断地向imports Module的方向延伸。这是否意味着我们每次通过Standalone模式获取依赖都需要遍历一遍整颗依赖树来搜索呢？实际上Nest将整颗依赖树拍平，把所有可注入对象的引用放到了[InstanceLinksHost](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/instance-links-host.ts#L16)的Map中，这样就可以在O(1)时间复杂度内找到对应的依赖了。

# 2. 启动流程

在对NestJS内部使用的容器有了初步的认识后，我们就可以开始跟随其启动过程阅读NestJS的源码了。当我们使用形如
```js
await NestFactory.create(AppModule)
```
的代码启动NestJS时，调用了[NestFactoryStatic.create](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/nest-factory.ts#LL69)方法。该方法的关键代码如下
```js
public async create(...){
    ...
    // 创建配置和容器的实例
    const applicationConfig = new ApplicationConfig();
    const container = new NestContainer(applicationConfig);
    ...

    // 初始化模块，实例化对象，完成依赖注入
    await this.initialize(
      moduleCls,
      container,
      graphInspector,
      applicationConfig,
      appOptions,
      httpServer,
    );

    // 创建NestApp实例并为其创建代理
    const instance = new NestApplication(
      container,
      httpServer,
      applicationConfig,
      graphInspector,
      appOptions,
    );
    const target = this.createNestInstance(instance);
    return this.createAdapterProxy<T>(target, httpServer);
  }
```
可以看到该方法主要是将一些基础的容器创建出来后，进入了下一步初始化。而整个依赖树的解析，实例化和依赖注入，都包含在这个[initialize](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/nest-factory.ts#L191)方法中。核心代码如下
```js
private async initialize(...) {
    ...

    const injector = new Injector({ preview: options.preview });
    const instanceLoader = new InstanceLoader(...);
    const metadataScanner = new MetadataScanner();
    const dependenciesScanner = new DependenciesScanner(...);
    ...
    try {
      // 用过模块间的依赖关系，创建出依赖树
      await dependenciesScanner.scan(module);
      // 实例化模块中的可注入对象，并进行依赖注入
      await instanceLoader.createInstancesOfDependencies();
      // 应用全局enhancer
      dependenciesScanner.applyApplicationProviders();
    } catch (e) {
      this.handleInitializationError(e);
    }
  }
```
可以看到这里主要做了两件事，实例化一些工具并执行真正的依赖树创建和依赖注入。首先，我们解释一下这里创建的四个工具实例分别是用来做什么的

- **Injector**: 依赖注入工具，几乎没有成员变量，主要的工作是根据将代码中注册在各个module中的Class进行实例化，注入该类的依赖。Injector本身只负责依赖注入，并不负责依赖关系的扫描。
- **InstanceLoader**: 调用上述的Injector,对一个Nest module的`providers`, `injectables`和`controllers`进行实例化和依赖注入.
- **MetadataScanner**: 扫描一个类型的整个原型链，返回所有的方法名。
- **DependenciesScanner**: 从root module开始，深度优先扫描整个依赖树，将扫描到的模块注册在NestContainer中。

直接看着四个工具类的描述可能相当不直观，没办法一下子理解他们各自的功能。接下来我们就重点关注一下[dependenciesScanner.scan](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/scanner.ts#L75)和[instanceLoader.createInstancesOfDependencies](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/instance-loader.ts#L25)这两个方法，梳理一下依赖注入的过程吧。

## 2.1 依赖树构造
[dependenciesScanner.scan](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/scanner.ts#L75)方法非常简单：
```js
public async scan(module: Type<any>) {
    // 注册核心模块
    await this.registerCoreModule();
    // 深度优先扫描模块，构造模块依赖树
    await this.scanForModules(module);
    // 扫描模块的依赖，向容器注册
    await this.scanModulesForDependencies();
    this.calculateModulesDistance();

    this.addScopedEnhancersMetadata();
    this.container.bindGlobalScope();
  }
```

**registerCoreModule**

在注册其余模块前，Nest需要先初始化核心模块。其主要包括`ExternalContextCreator`, `ModulesContainer`, `HttpAdapterHost`等Providers。由于这次的重点是依赖注入的实现，对于核心模块的功能先不赘述。

### 2.1.1 模块的递归扫描
**scanForModules**

从[scanForModules](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/scanner.ts#L85)开始，终于进入了模块依赖树的扫描阶段。下面仅列出关键代码，并省略了dynamic module的处理。

```js
public async scanForModules(...): Promise<Module[]> {
    // 实例化module并将module加入全局容器NestContainer中
    const moduleInstance = await this.insertModule(moduleDefinition, scope);
    ...
    // ctxRegistry用于记录已扫描的module
    ctxRegistry.push(moduleDefinition);
    ...
    // 从reflect metadata中取出当前module依赖的所有module
    const modules = this.reflectMetadata(
          MODULE_METADATA.IMPORTS,
          moduleDefinition as Type<any>,
        )

    let registeredModuleRefs = [];
    // 遍历当前模块所依赖的所有模块
    for (const [index, innerModule] of modules.entries()) {
      ...
      if (ctxRegistry.includes(innerModule)) {
        // 遇到已经扫描过的module，则跳过
        continue;
      }
      // 递归调用自身
      const moduleRefs = await this.scanForModules(
        innerModule,
        [].concat(scope, moduleDefinition),
        ctxRegistry,
      );
      registeredModuleRefs = registeredModuleRefs.concat(moduleRefs);
    }
    if (!moduleInstance) {
      return registeredModuleRefs;
    }
    return [moduleInstance].concat(registeredModuleRefs);
  }
```

该方法一开始调用了[insertModule](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/scanner.ts#L144)，该方法比较简单，实际上进一步调用了[NestContainer.addModule](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/container.ts#L67)实例化module并将module加入全局容器NestContainer中。其中比较关键的代码是:
```js
...
const { type, dynamicMetadata, token } = await this.moduleCompiler.compile(
      metatype,
    );
...
const moduleRef = new Module(type, this);
...
this.modules.set(token, moduleRef);
...
```
这段代码也相对好理解，首先使用[ModuleCompiler.compile](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/compiler.ts#L17)将Module class转换为`type`(Module class本身), `dynamicMetadata`(dynamic module的imports, providers等)以及`token`(用来储存或获取一个Module实例的key)。随后为该模块创建一个仅包含class信息的`Module`容器，并使用`token`注册在NestContainer中。

在获取到当前Module的容器后，使用常量`MODULE_METADATA.IMPORTS`从reflectMetadata中获取当前模块所依赖的所有模块。也就是我们通过装饰器`@Module`定义模块时
```js
@Module({
  imports: [...],
  providers: [...],
  exports: [...],
})
export class CatModule {}
```
装饰器向模块Class写入的信息。最后对于这些当前模块的依赖模块逐一进行递归调用[scanForModules](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/scanner.ts#L85)，就能将从根模块出发所能搜索到的所有模块都创建好对应容器，并注入到注册在NestContainer中了。

### 2.1.2 模块依赖扫描

[scanModulesForDependencies](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/scanner.ts#L163)的方法体很简单:
```js
public async scanModulesForDependencies(
    modules: Map<string, Module> = this.container.getModules(),
  ) {
    for (const [token, { metatype }] of modules) {
      await this.reflectImports(metatype, token, metatype.name);
      this.reflectProviders(metatype, token);
      this.reflectControllers(metatype, token);
      this.reflectExports(metatype, token);
    }
  }
```
遍历上一步扫描出来的所有Module并反射出每个Module的`imports`, `providers`, `controllers`以及`exports`。

我们先来看[reflectImports](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/scanner.ts#L174)。这个方法再次利用反射获取了一个模块的所有依赖模块，并对这些依赖模块，也就是`imports`里声明的模块调用了[NestContainer.addImport](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/container.ts#L148)
```js
public async addImport(
    relatedModule: Type<any> | DynamicModule,
    token: string,
  ) {
    if (!this.modules.has(token)) {
      return;
    }
    const moduleRef = this.modules.get(token);
    const { token: relatedModuleToken } = await this.moduleCompiler.compile(
      relatedModule,
    );
    // 当前处理的模块
    const related = this.modules.get(relatedModuleToken);
    moduleRef.addRelatedModule(related);
  }
```
这段代码中`relatedModule`代表被依赖的模块，而`related`则代表当前正在处理的模块。通过调用[Module.addRelatedModule](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/module.ts#L543)将被依赖模块的实力加入到当前模块的`_imports`集合中。这样，当所有模块都处理完成后，每个模块以及其`_imports`集合就形成了一个模块的依赖树。

对于剩余的三个方法，处理手法均大同小异。与上述`addImport`不同的是，所有的Module在上一轮的扫描中均已创建了对应的容器。而Provider们则是第一次被处理。所以在最终调用[Module.addProvider](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/module.ts#L274)时，需要先将Provider的容器`InstanceWrapper`创建出来。
```js
...
this._providers.set(
      provider,
      new InstanceWrapper({
        token: provider,
        name: (provider as Type<Injectable>).name,
        metatype: provider as Type<Injectable>,
        instance: null,
        isResolved: false,
        scope: getClassScope(provider),
        durable: isDurable(provider),
        host: this,
      }),
    );
...
```
此时`InstanceWrapper`相当于一个空容器，仅记录了一些元数据，并没有任何实例。

另一个不点是，对于`Controller`，我们可以使用诸如`@UsePipes`, `@UseInterceptors`, `@Post`等装饰器注入一些`enhancer`或者定义一些路由规则。对于这一部分的处理存在于[reflectDynamicMetadata](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/scanner.ts#L219)
```js
public reflectDynamicMetadata(cls: Type<Injectable>, token: string) {
    if (!cls || !cls.prototype) {
      return;
    }
    this.reflectInjectables(cls, token, GUARDS_METADATA);
    this.reflectInjectables(cls, token, INTERCEPTORS_METADATA);
    this.reflectInjectables(cls, token, EXCEPTION_FILTERS_METADATA);
    this.reflectInjectables(cls, token, PIPES_METADATA);
    this.reflectParamInjectables(cls, token, ROUTE_ARGS_METADATA);
  }
```
通过对应的常量反射出这些额外的注解，并注册到`NestContainer`中等待被注入。

至此，整个模型依赖树的扫描就完成了。

## 2.2 可注入对象的实例化与依赖注入

扫描完整个模块的依赖树后，就可以把模块中定义的各种可注入对象实例化了。平时我们实例化对象时使用`new`关键字即可，但是当我们实现一个依赖注入工具时，由于这些对象之间又有依赖关系，同时也会存在循环依赖的问题，所以很可能没办法找到一个合理的顺序，将这些对象一个一个调用`new`关键字实例化出来。为了解决这个问题，NestJS将对象的实例化拆成的两个部分，第一步使用`Object.create`先从原型链创建出每个对象的实例，此时由于没有调用对象的构造函数，不需要担心对象之间的依赖关系。当获得所有对象的实例后，就可以再为这些对象寻找到它们的依赖并进行依赖注入了。整个依赖注入的实例化和注入过程入口在[InstanceLoader.createInstancesOfDependencies](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/instance-loader.ts#L25)方法中。
```js
public async createInstancesOfDependencies(
    modules: Map<string, Module> = this.container.getModules(),
  ) {
    // 使用原型链创建空实例
    this.createPrototypes(modules);
    // 装填实例
    await this.createInstances(modules);
    ...
  }
```
其实整个过程也并不复杂，一共分为从Prototype创建实例与依赖注入两个部分。

### 2.2.1 从原型创建实例

该过程的代码位于[InstanceLoader.createPrototypes](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/instance-loader.ts#L35)，其实就是分别对一个module中的`Providers`, `Injectables`和`Controllers`分别从可注入Class的原型链创建实例。我们从`createPrototypesOfProviders`的角度观察，发现其核心代码位于[Injector.loadPrototype](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/injector.ts#L83)。

```js
  public loadPrototype<T>(
    { token }: InstanceWrapper<T>,
    collection: Map<InstanceToken, InstanceWrapper<T>>,
    contextId = STATIC_CONTEXT,
  ) {
    if (!collection) {
      return;
    }
    // 获取InstanceWrapper
    const target = collection.get(token);
    // 使用原型链创建空实例
    const instance = target.createPrototype(contextId);
    if (instance) {
      // 将新的InstanceWrapper写回
      const wrapper = new InstanceWrapper({
        ...target,
        instance,
      });
      collection.set(token, wrapper);
    }
  }
```

在2.1节中，NestJS在扫描模块依赖树的过程中，为每个对象创建了`InstanceWrapper`对象作为容器，在实例化的步骤中就是将这些容器一一取出，由于容器中储存了目标对象的构造函数，这里可以很方便地调用[InstanceWrapper.createPrototype](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/instance-wrapper.ts#L327)创建对象实例了。而该方法的本质就是调用`Object.create`来创建对象实例。

在获得实例后，将该实例储存在`InstanceWrapper`容器中并写回Module容器里。

### 2.2.2 依赖注入

至此为止，NestJS终于要开始执行依赖注入了。该过程的入口在[InstanceLoader.createInstances](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/instance-loader.ts#L43)中，依然是分别对`Providers`, `Injectables`和`Controllers`进行依赖注入。我们依然跟随`createInstancesOfProviders`的视角观察这一过程吧。与创建实例一样，依赖注入的核心代码位于[Injector.loadInstance](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/injector.ts#L102)中。

该方法的结构比较复杂下面列出简化版的代码
```js
public async loadInstance<T>(
    wrapper: InstanceWrapper<T>,
    collection: Map<InstanceToken, InstanceWrapper>,
    moduleRef: Module,
    contextId = STATIC_CONTEXT,
    inquirer?: InstanceWrapper,
  ) {
    ...
    const token = wrapper.token || wrapper.name;

    const { inject } = wrapper;
    const targetWrapper = collection.get(token);
    ...
    // 定义callback，该hook在解析出对象的所有依赖后被调用，用以执行
    const callback = async (instances: unknown[]) => {
      ...
    };
    // 从对象构造函数中提取依赖
    await this.resolveConstructorParams<T>(
      wrapper,
      moduleRef,
      inject,
      callback,
      contextId,
      wrapper,
      inquirer,
    );
  }
```

在这段代码中，Nest先通过分析构造函数，提取当前对象的依赖，即分析出需要注入哪些依赖给当前对象。在提取完成后，利用一个callback来执行真正的依赖注入。这个callback我们一会再说，先来看看Nest是如何提取对象依赖的。

提取依赖的过程位于[Injector.resolveConstructorParams](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/injector.ts#L251)。这里又分为了两步：先获取对象的依赖列表，然后在查询出这些依赖对应的实例对象。

**获取依赖列表**

代码位于[Injector.getClassDependencies](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/injector.ts#L317)。该方法提取了对象在构造函数中声明的依赖以及可选的依赖。其中构造函数的依赖通过[Injector.reflectConstructorParams](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/injector.ts#L358)反射出来。该方法主要从对象的`reflectMetadata`中获取了键为`design:paramtypes`以及`self:paramtypes`的数据。

其中`design:paramtypes`是Typescript原生支持的reflectMetadata。当你的代码以下面的形式声明依赖时
```js
@Injectable()
class AppService {
  constructor(private readonly CatService) {}
}
```
打开tsconfig配置中`emitDecoratorMetadata`这个选项后，代码经过`tsc`转移成js时，就会被转换为如下的形式
```js
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CatService])
], AppService);
```
此时NestJS就可以从这个`design:paramtypes`来提取你声明依赖的Class了。详细的说明可以参考[这篇文档](https://www.typescriptlang.org/tsconfig)

而`self:paramtypes`这项reflectMetadata则是NestJS自己声明的，当你的依赖是通过`@Inject(token?)`形式注入时，依赖的token就会被写入到当前Class的`self:paramtypes`中。

**查询依赖实例**

获取到当前对象声明依赖的Class或者token后，就需要获取对应的实例了。具体的过程位于[injector.lookupComponent](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/injector.ts#L494)。可注入的对象来源分为两种，第一个是与当前对象同Module的`providers`，或者是被当前模块通过`imports`引入模块的`exports`当中。对于第一种依赖比较简单，直接在当前的Module内搜索即可。对于第二种依赖，由于可能是通过层层`import`引入的依赖，则需要在依赖树上递归地寻找。具体的递归寻找过程位于[injector.lookupComponentInImports](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/injector.ts#L555)。

经过以上两步，[Injector.resolveConstructorParams](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/injector/injector.ts#L251)方法就搜索到当前对象所声明依赖的所有实例了。此时调用callback来进行具体的依赖注入过程。

```js
const callback = async (instances: unknown[]) => {
  // 获取属性依赖
  const properties = await this.resolveProperties(
    wrapper,
    moduleRef,
    inject as InjectionToken[],
    contextId,
    wrapper,
    inquirer,
  );
  // 装填实例
  const instance = await this.instantiateClass(
    instances,
    wrapper,
    targetWrapper,
    contextId,
    inquirer,
  );
  // 装填属性
  this.applyProperties(instance, properties);
  wrapper.initTime = this.getNowTimestamp() - t0;
  done();
};
```
该回调的输入参数`instances`即上一步搜索到的依赖实例。最后的注入过程分为了三步：

**寻找可被注入的属性(resolveProperties)**

除了上述两种依赖注入的方式外，NestJS还支持属性注入[Property-based injection](https://docs.nestjs.com/providers#property-based-injection)。例如其官网上的例子：
```js
@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}
```
此时属性`httpClient`的依赖注入并不在构造函数上申明，而是单独调用了`@Inject(token?)`装饰器注入。此时这条注入信息被写入到了Class的reflectMetadata中的键`self:properties_metadata中。`resolveProperties`方法就是根据这个键去提取并寻找出当前对象的属性依赖。

**创建实例(instantiateClass)**

在获取了构造函数所声明的依赖的实例后，就可以将这些依赖注入到实例中了。实际上非常简单，直接调用`new`关键字就好了
```js
instanceHost.instance = new (metatype as Type<any>)(...instances)
```
那么在2.2.1节中从原型链上创建出来的对象还有什么用呢？答案是如果是循环依赖的情况，不能新建对象，而是应该保留2.2.1节中创建好对象的引用。因为在循环依赖的情况下，在当前对象依赖注入之前，当前对象可能已经作为依赖被注入给别的对象了。在这种情况下新建对象就需要换一个方式来保持实例的引用不变:
```js
instanceHost.instance = Object.assign(
  instanceHost.instance,
  new (metatype as Type<any>)(...instances),
)
```

**将属性依赖赋予实例(applyProperties)**

上一步中创建出的实例已经通过`new`关键字注入了构造函数声明的依赖，这一步也非常简单直接:
```js
iterate(properties)
  .filter(item => !isNil(item.instance))
  .forEach(item => (instance[item.key] = item.instance));
```

至此，整个依赖树的实例化以及依赖注入也完成了。而一些如`loadEnhancersPerContext`注入`enhancer`的过程这里就不再赘述了。

# 3. 总结
好了，我们这次以[NestFactoryStatic.create](https://github.com/nestjs/nest/blob/v9.3.9/packages/core/nest-factory.ts#LL69)为切入点，通过阅读源码学习了NestJS是如何实现依赖注入的。简单的说，总共分为这么几步

- 从根模块出发，深度优先遍历模块的`imports`数组，构造一个模块的依赖树，同时为可注入对象创建容器
- 遍历可注入对象，使用构造函数的原型在不使用`new`关键字的情况下创建实例(提前创建引用以解决循环依赖问题)
- 对于每个可注入对象，通过分析`reflectMetadata`，获取其申明依赖的Class或者注入token
- 获取当前对象依赖的实例
- 使用构造函数创建出对象实例，并进一步装填对象

相信在了解了整个过程后，你已经对基于`Typescript`的依赖注入原理以及思路有了比较全面的认识，也许你也可以试试写一个自己的小型依赖注入库。

# 参考链接

1. https://github.com/nestjs/nest
2. https://github.com/spring-projects/spring-framework
3. https://github.com/angular/angular
4. https://monorepo.tools/
5. https://docs.nestjs.com
6. https://www.typescriptlang.org/tsconfig