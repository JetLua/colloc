import {download, mkdir, read, ROOT} from '../modules/wx'
import {fetch} from '../modules/util'

const {factory} = dragonBones.PixiFactory

export default async function() {

  await mkdir('fonts')
  await mkdir('animes')
  await mkdir('sounds')
  await mkdir('textures')

  const items = await Promise.all([
    download(`${BASE}/textures/ui.png`, 'textures/ui.5.png'),
    download(`${BASE}/textures/ui.json`, 'textures/ui.5.json'),
    download(`${BASE}/textures/item.png`, 'textures/item.png'),
    download(`${BASE}/textures/item.json`, 'textures/item.json'),
    download(`${BASE}/animes/guide_tex.png`, 'animes/guide_tex.png'),
    download(`${BASE}/animes/guide_tex.json`, 'animes/guide_tex.json'),
    download(`${BASE}/animes/guide_ske.json`, 'animes/guide_ske.json'),
    download(`${BASE}/fonts/RalewaySemiBold`, 'fonts/RalewaySemiBold'),
    // 音效
    download(`${BASE}/sounds/win.mp3`, 'sounds/win.mp3'),
    download(`${BASE}/sounds/tap.mp3`, 'sounds/tap.mp3'),
    download(`${BASE}/sounds/bgm.mp3`, 'sounds/bgm.mp3'),
    download(`${BASE}/sounds/back.mp3`, 'sounds/back.mp3'),
    download(`${BASE}/sounds/fail.mp3`, 'sounds/fail.mp3'),
    download(`${BASE}/sounds/reset.mp3`, 'sounds/reset.mp3'),
    download(`${BASE}/sounds/collide.mp3`, 'sounds/collide.mp3'),
    download(`${BASE}/sounds/transfer.mp3`, 'sounds/transfer.mp3'),
    download(`${BASE}/sounds/collide.arrow.mp3`, 'sounds/collide.arrow.mp3'),
    download(`${BASE}/sounds/collide.gear.mp3`, 'sounds/collide.gear.mp3'),
    download(`${BASE}/sounds/collide.green.mp3`, 'sounds/collide.green.mp3'),
    download(`${BASE}/sounds/collide.once.mp3`, 'sounds/collide.once.mp3')
  ])

  GameGlobal.font = wx.loadFont(`${ROOT}/fonts/RalewaySemiBold`)

  factory.parseDragonBonesData(JSON.parse(await read('animes/guide_ske.json')))
  factory.parseTextureAtlasData(
    JSON.parse(await read('animes/guide_tex.json')),
    PIXI.Texture.from(`${ROOT}/animes/guide_tex.png`),
  )

  await Promise.all([
    parse(items[0], items[1]),
    parse(items[2], items[3]),
  ])
}

function parse(a, b) {
  return new Promise(async resolve => {
    const data = JSON.parse(await read(b, 'utf-8', false).catch(() => null))
    if (!data) throw null
    new PIXI.Spritesheet(
      PIXI.BaseTexture.from(a),
      data,
    ).parse(resolve)
  })
}