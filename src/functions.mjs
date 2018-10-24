import THREE from 'three'
import { TweenLite } from 'gsap/TweenMax'

export function createRenderer (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  return renderer
}

export function createCamera (fov = 45, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 150) {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.y = 400
  camera.position.z = 400
  return camera
}

export function createScene (color = 0x000000, near = 20, far = 150) {
  let scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  scene.fog = new THREE.Fog(color, near, far)
  return scene
}

export function createLight (color = 0xffffff, intensity = 20, distance = 200, decay = 100) {
  return new THREE.PointLight(color, intensity, distance, decay)
}

export function createPath () {
  // Array of points
  const points = [
    [68.5, 185.5],
    [50, 262.5],
    [270.9, 281.9],
    [345.5, 212.8],
    [178, 155.7],
    [240.3, 72.3],
    [153.4, 20.6],
    [52.6, 53.3],
    [68.5, 185.5]
  ]

  // Convert the array of points into vertices
  for (let i = 0; i < points.length; i++) {
    const [x, z] = points[i]
    const y = Math.random() * 100
    points[i] = new THREE.Vector3(x, y, z)
  }

  // Create a path from the points
  const path = new THREE.CatmullRomCurve3(points)
  path.closed = true
  return path
}

/**
 * @param path THREE path object
 * @param tubeDetail The precision of the finale tube, the amount of divisions
 * @param circlesDetail The precision of the circles
 * @param radius The radius of the tube
 */
export function createTubeGeometry (path, scene, tubeDetail = 100, circlesDetail = 500, radius = 15) {
  // Get all the circles that will compose the tube
  const frames = path.computeFrenetFrames(tubeDetail, true)
  const geometry = new THREE.Geometry()

  // First loop through all the circles
  for (let i = 0; i < tubeDetail; i++) {
    // Get the normal values for each circle
    const normal = frames.normals[i]
    // Get the binormal values
    const binormal = frames.binormals[i]

    // Calculate the index of the circle (from 0 to 1)
    const index = i / tubeDetail
    // Get the coordinates of the point in the center of the circle
    const p = path.getPointAt(index)

    // Loop for the amount of particles we want along each circle
    for (let j = 0; j < circlesDetail; j++) {
      // Clone the position of the point in the center
      const position = p.clone()

      // Calculate the angle for each particle along the circle (from 0 to Pi*2)
      const angle = (j / circlesDetail) * Math.PI * 2 + (index * Math.PI * 5)
      // Calculate the sine of the angle
      const sin = Math.sin(angle)
      // Calculate the cosine from the angle
      const cos = -Math.cos(angle)

      // Calculate the normal of each point based on its angle
      const normalPoint = new THREE.Vector3(0, 0, 0)
      normalPoint.x = (cos * normal.x + sin * binormal.x)
      normalPoint.y = (cos * normal.y + sin * binormal.y)
      normalPoint.z = (cos * normal.z + sin * binormal.z)
      // Multiple the normal by the radius
      normalPoint.multiplyScalar(radius)

      // We add the normal values for each point
      position.add(normalPoint)
      const color = new THREE.Color('hsl(' + (index * 360 * 4) + ', 100%, 50%)')
      geometry.colors.push(color)
      geometry.vertices.push(position)
    }
  }
  return geometry
}

export function createTube (geometry, size = 0.2, sizeAttenuation = true) {
  const material = new THREE.PointsMaterial({
    vertexColors: THREE.VertexColors,
    size,
    sizeAttenuation
  })
  return new THREE.Points(geometry, material)
}

export function tweenTube (geometry, transformBy) {
  for (const [i, { x, y }] of geometry.vertices.entries()) {
    TweenLite.to(geometry.vertices[i], 1, {
      x: transformBy(x),
      y: transformBy(y),
      ease: window.Back.easeInOut
    })
  }
}

export function start (camera, path, light, geometry, renderer, scene) {
  let percentage = 0

  const render = () => {
    percentage += 0.0005

    const p1 = path.getPointAt(percentage % 1)
    const p2 = path.getPointAt((percentage + 0.01) % 1)

    camera.position.set(p1.x, p1.y, p1.z)
    camera.lookAt(p2)
    light.position.set(p2.x, p2.y, p2.z)

    geometry.verticesNeedUpdate = true
    renderer.render(scene, camera)

    window.requestAnimationFrame(render)
  }

  window.requestAnimationFrame(render)
}

export function fullScreen (element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
}
