// @ts-ignore isolatedModules
import $ from 'jquery'
import { setLocalStorage, getLocalStorage, formatLog, randomInt } from './utils'
import { NOT_LIST_TYPE_VIDEO } from './constant'



declare function getEventListeners(el: Element): Record<string, ArrayLike<{
  useCapture: boolean;
  passive: boolean;
  once: boolean;
  type: string;
  listener: EventListenerOrEventListenerObject;
}>>

const SET_TIMEOUT_TIME = 500
let isRandom = 'false'
let totalPage = 0
let curIndex = 0
let randomList: number[] = []
let videoList: HTMLAnchorElement[] = []
let isHEVC: boolean = false

function init() {
  [, totalPage] = getPageInfo()

  if (totalPage === 0) {
    formatLog(NOT_LIST_TYPE_VIDEO)
    return
  }



  getIsHEVC()

  initVideoList()

}

function handleRandomOn() {
  closeAutoPlay()
  checkPlayerConfig()
  initRandomList()
  bindVideoEvent()
}

function handleRandomOff() {

}

function closeAutoPlay() {
  const autoPlayButton = document.querySelector('#multi_page > div.head-con > div.head-right > span:nth-child(2) > span.switch-button') as HTMLSpanElement
  if (autoPlayButton?.classList.contains('on')) {
    autoPlayButton.click()
  }
}

function getIsHEVC() {
  setTimeout(() => {
    const isHEVCInput = document.querySelector('div.bpx-player-ctrl-setting-codec input[value="0"]') as HTMLInputElement
    if (isHEVCInput) {
      isHEVC = isHEVCInput.checked || (document.querySelector('div.bpx-player-ctrl-setting-codec input[value="1"]') as HTMLInputElement).checked
    } else {
      getIsHEVC()
    }
  }, SET_TIMEOUT_TIME)
}

function checkPlayerConfig() {
  if (isHEVC) {
    isHEVC = false;
    (document.querySelector('div.bpx-player-ctrl-setting-codec div.bui-area')!.querySelector('input[value="3"]') as HTMLInputElement).click()
    location.reload()
  }
}

function playNext(distance: number = 1) {
  curIndex = (curIndex + distance + totalPage) % randomList.length
  const nextPage = randomList[curIndex]
  videoList[nextPage - 1].click()
}

function bindVideoEvent() {
  setTimeout(() => {
    const video = document.querySelector('div.bpx-player-video-wrap > video')
    if (video) {
      video.addEventListener('ended', event => {
        event.stopImmediatePropagation()
        playNext()
      })
    } else {
      bindVideoEvent()
    }
  }, SET_TIMEOUT_TIME)
}


function getPageInfo() {
  const pageInfoSpan = document.querySelector('span.cur-page')
  if (!pageInfoSpan)
    return [0, 0]
  return pageInfoSpan.innerHTML.replace(/\(|\)/, '').split('/').map(item => parseInt(item))
}

function initVideoList() {
  setTimeout(() => {
    videoList = Array.from(document.querySelectorAll('ul.list-box > li > a > div.clickitem'))
    if (videoList.length === 0) {
      initVideoList()
    } else {
      // create random button
      // 插入按钮会导致页面重绘，需要在获取到资源并渲染完成页面后在执行
      createRandomButton()
    }
  }, SET_TIMEOUT_TIME)
}

function createRandomButton() {
  const path = document.querySelector('#multi_page > div.head-con > div.head-right')!
  path.insertAdjacentHTML("afterbegin", `
  <span class="next-button" id="random-button">
    <span class="txt">随机</span>
    <span class="switch-button"></span>
  </span>
  `)
  // bind event
  document.querySelector('span#random-button')!.addEventListener('click', () => {
    if (isRandom === 'true') {
      isRandom = 'false'
      setLocalStorage('isRandom', 'false')
      updateRandomButtonType(false)
      handleRandomOn()
    } else {
      isRandom = 'true'
      setLocalStorage('isRandom', 'true')
      updateRandomButtonType(true)
      handleRandomOff()
    }
  })

  isRandom = getLocalStorage('isRandom') || 'false'
  if (isRandom === 'true') {
    updateRandomButtonType(true)
    handleRandomOn()
  } else {
    updateRandomButtonType(false)
  }
}

function updateRandomButtonType(on: boolean) {
  const randomButton = document.querySelector('span#random-button .switch-button')!
  if (on) {
    randomButton.classList.add('on')
  } else {
    randomButton.classList.remove('on')
  }
}


function initRandomList() {
  randomList = new Array(totalPage).fill(0).map((_, index) => index + 1)
  // shuffle
  for (let i = randomList.length - 1; i >= 0; i--) {
    const randomIndex = randomInt(0, i)
      ;[randomList[i], randomList[randomIndex]] = [randomList[randomIndex], randomList[i]]
  }
  const [curPage] = getPageInfo()
  randomList.unshift(curPage)
  randomList.splice(randomList.indexOf(curPage), 1)
  curIndex = 0
}

init()