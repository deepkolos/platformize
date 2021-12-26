/// <reference types="minigame-api-typings" />

import { WechatGamePlatform, PlatformManager } from 'platformize-playcanvas';
import { glb } from './glb';

function Main() {
  const canvas = wx.createCanvas();
  PlatformManager.set(new WechatGamePlatform(canvas));

  glb(canvas);
}

Main();
