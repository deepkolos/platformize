/// <reference types="minigame-api-typings" />

import { WechatGamePlatform, PlatformManager } from 'platformize-oasis';
import { FlappyBird } from './FlappyBird';

function Main() {
  const canvas = wx.createCanvas();
  PlatformManager.set(new WechatGamePlatform(canvas));

  FlappyBird(canvas);
}

Main();
