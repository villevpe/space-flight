import {
  start,
  createCamera,
  createScene,
  createLight,
  createPath,
  createTubeGeometry,
  createTube,
  tweenTube,
  createRenderer
} from './functions.mjs'
import offline from 'offline-plugin/runtime'

offline.install()

const renderer = createRenderer(document.querySelector('canvas'))

let scene = createScene()
let camera = createCamera()
const path = createPath()
const light = createLight()
scene.add(light)

const geometry = createTubeGeometry(path, scene)
createTube(geometry).then((tube) => {
  scene.add(tube)

  tweenTube(geometry, (position) => position - 5 + Math.random() * 20)

  start(camera, path, light, geometry, renderer, scene)
})
