import {install} from '@pixi/unsafe-eval'

PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL
PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
PIXI.settings.SORTABLE_CHILDREN = true

/*  */
PIXI.settings.DEV_MODE = false

install(PIXI)