# :sparkles: Стартовый шаблон для бота

В планах сделать функционал: товары, админка, платежка, рассылка, промокоды

## Технологии

NestJS, PostgreSQL, Prisma, nestjs-telegraf, telegram-keyboard

## Структура проекта

```
.env
package.json

src
└── admin/assortiment/product ── scene modules
    ├── product.module.ts
    ├── product.service.ts
	└── product.scene.ts

	└── translate ── i18n logic
		├── translate.service.ts
		├── translate.scene.ts
		├── translate.generated.ts
		└── locales
			├── en...
			└── ru...
libs
└── shared
    └── src
		├── shared.module.ts
		├── constants
		└── interfaces
└── providers
    └── src
		├── providers.module.ts
		└── prisma
└── contracts
    └── src
		├── ...
		└── ...
```

---

## Настройка окружения

```
DATABASE_URL = "postgresql://user:password@localhost:5432/database"
BOT_TOKEN = токен полученный с @BotFather

# I18n
FALLBACK_LANGUAGE = en

# Telegraf session
DATABASE_NAME = database
DATABASE_HOST = localhost
DATABASE_USER = user
DATABASE_PASS = password
```
