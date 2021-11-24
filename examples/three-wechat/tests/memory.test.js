const automator = require('miniprogram-automator')

const sleep = (t) => new Promise(r => setTimeout(r, t))

automator.connect({
  wsEndpoint: 'ws://localhost:9421'
}).then(async miniProgram => {
  await miniProgram.remote()
  // await miniProgram.redirectTo('/pages/empty/index')
  await sleep(500)

  const payload = async () => {
    miniProgram.navigateBack()
    await sleep(500)
    const page = await miniProgram.navigateTo('/pages/index/index')
    await sleep(500)
    const menu = await page.$$('.menu-item')
    menu[0]?.tap()
    // await sleep(1000)
    // payload()
  }

  payload()
})

