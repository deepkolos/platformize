/// <reference types="minigame-api-typings" />

import { WechatGamePlatform, PlatformManager } from 'platformize-pixi';
import * as PIXI from './pixi';
import { Slots } from './slots';

function Main() {
  const canvas = wx.createCanvas();
  const platform = new WechatGamePlatform(canvas);
  PlatformManager.set(platform);
  platform.init(PIXI, wx.createCanvas());
  Slots(canvas);
}

Main();
