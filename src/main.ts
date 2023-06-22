// @ts-ignore isolatedModules
import $ from 'jquery'
import { setLocalStorage, getLocalStorage, formatLog, randomInt } from './utils'
import { NOT_LIST_TYPE_VIDEO } from './constant'



declare function getEventListeners(el:Element):Record<string,ArrayLike<{
  useCapture: boolean;
  passive: boolean;
  once: boolean;
  type: string;
  listener: EventListenerOrEventListenerObject;
}>>

declare global{
  interface Window{
    playNext:Function
    bindVideoEvent:Function
  }
}

const SET_TIMEOUT_TIME = 500
let isRandom = 'false'
let totalPage = 0
let curPage = 0
let curIndex = 0
let randomList: number[] = []
let videoList: HTMLAnchorElement[] = []

async function init() {
  [curPage, totalPage] = getPageInfo()

  if (totalPage === 0) {
    formatLog(NOT_LIST_TYPE_VIDEO)
    return
  }

  // create random button
  createRandomButton()

  initVideoList()

  isRandom = getLocalStorage('isRandom') || 'false'
  if (isRandom === 'true') {
    updateRandomButtonType(true)
    handleRandomOn()
  } else {
    updateRandomButtonType(false)
  }

  window.playNext = playNext
  window.bindVideoEvent = bindVideoEvent
}

function handleRandomOn(){
  initRandomList()
  bindVideoEvent()
}

function handleRandomOff(){

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
      video.addEventListener('ended', event=>{
        event.stopImmediatePropagation()
        playNext()
      })
    }else{
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

function initVideoList(){
    setTimeout(() => {
      videoList = Array.from(document.querySelectorAll('ul.list-box > li > a > div.clickitem'))
      if(videoList.length === 0){
        initVideoList()
      }
    },SET_TIMEOUT_TIME)
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
  randomList = new Array(totalPage).fill(0).map((_, index) => index+1)
  // shuffle
  for (let i = randomList.length - 1; i >= 0; i--) {
    const randomIndex = randomInt(0, i)
      ;[randomList[i], randomList[randomIndex]] = [randomList[randomIndex], randomList[i]]
  }
  randomList.unshift(curPage)
  randomList.splice(randomList.indexOf(curPage), 1)
  curIndex = 0
}

(function () {
  init()
})()