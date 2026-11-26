/// <reference types="@figma/plugin-typings" />

import { FRAME_PADDING, FRAME_RADIUS } from './layout';

figma.showUI(__html__, { width: 360, height: 520, themeColors: true });

interface InsertMessage {
  type: 'insert';
  svg: string;
  url: string;
  qrSize: number;
  presetLabel: string;
  bgColor: string;
}

interface CancelMessage {
  type: 'cancel';
}

type UIMessage = InsertMessage | CancelMessage;

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

figma.ui.onmessage = (msg: UIMessage) => {
  if (msg.type === 'cancel') {
    figma.closePlugin();
    return;
  }

  if (msg.type === 'insert') {
    try {
      insertQR(msg);
      figma.notify('QR inserted');
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      figma.notify('Failed to insert: ' + message, { error: true });
    }
  }
};

function insertQR(msg: InsertMessage) {
  const { svg, qrSize, presetLabel, bgColor } = msg;

  const qrNode = figma.createNodeFromSvg(svg);
  qrNode.name = 'QR';
  qrNode.resize(qrSize, qrSize);

  // Container frame: padding 24, radius 48, preset background.
  // container size = qrSize + padding*2 (auto via layout).
  const frame = figma.createFrame();
  frame.name = 'Mycar QR — ' + presetLabel;
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.counterAxisAlignItems = 'CENTER';
  frame.paddingTop = FRAME_PADDING;
  frame.paddingBottom = FRAME_PADDING;
  frame.paddingLeft = FRAME_PADDING;
  frame.paddingRight = FRAME_PADDING;
  frame.cornerRadius = FRAME_RADIUS;
  frame.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  frame.appendChild(qrNode);

  const center = figma.viewport.center;
  frame.x = Math.round(center.x - frame.width / 2);
  frame.y = Math.round(center.y - frame.height / 2);

  figma.currentPage.appendChild(frame);
  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);
}
