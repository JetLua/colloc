import {install} from '@pixi/unsafe-eval'

PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL
PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
PIXI.settings.SORTABLE_CHILDREN = true

/* 云开发 环境名 */
PIXI.settings.CLOUD_ENV = 'colloc-dev'

install(PIXI)