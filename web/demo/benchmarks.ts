import { PAGInit } from '../src/pag';
import { PAGComposition } from '../src/pag-composition';
import { PAGFile } from '../src/pag-file';
import { PAGImage } from '../src/pag-image';
import { PAGLayer } from '../src/pag-layer';
import * as types from '../src/types';

let PAG: types.PAG;

window.onload = async () => {
  PAG = await PAGInit({ locateFile: (file: string) => '../lib/' + file });
  console.log('====== wasm loaded! ======', PAG);
  console.log('====== PAGImage test ======');
  await PAGImageTest();
  console.log('====== PAGFile test ======');
  await PAGFileTest();
  console.log('====== PAGComposition test ======');
  await PAGCompositionTest();
  console.log('====== PAGLayer test ======');
  await PAGLayerTest();
};

let pagImage: PAGImage;
const PAGImageTest = async () => {
  const imageBlob = await fetch('./assets/cat.png').then((res) => res.blob());
  pagImage = await PAG.PAGImage.fromFile(new File([imageBlob], 'cat.png'));
  if (!!pagImage.wasmIns) {
    console.log('PAGImage load succeed!');
  } else {
    throw new Error('PAGImage load failed!');
  }
  console.log('PAGImage width:', pagImage.width());
  console.log('PAGImage height:', pagImage.height());
  console.log('PAGImage scaleMode:', pagImage.scaleMode());
  pagImage.setScaleMode(types.PAGScaleMode.Zoom);
  if (pagImage.scaleMode() === types.PAGScaleMode.Zoom) {
    console.log(`PAGImage setScaleMode succeed!`);
  } else {
    console.error('PAGImage setScaleMode failed!');
  }
  const matrix = pagImage.matrix();
  console.log('PAGImage matrix: ', matrix);
  matrix.set(types.MatrixIndex.a, 2);
  pagImage.setMatrix(matrix);
  if (pagImage.matrix().a === 2) {
    console.log(`PAGImage setMatrix succeed!`);
  } else {
    console.error(`PAGImage setMatrix failed!`);
  }
};

let pagFile: PAGFile;
const PAGFileTest = async () => {
  console.log('PAGFile MaxSupportedTagLevel: ', PAGFile.maxSupportedTagLevel());
  const arrayBuffer = await fetch('./assets/test2.pag').then((res) => res.arrayBuffer());
  pagFile = (await PAGFile.load(arrayBuffer)) as PAGFile;
  console.log('PAGFile: ', pagFile);
  console.log('PAGFile tagLevel: ', pagFile.tagLevel());
  console.log('PAGFile numTexts: ', pagFile.numTexts());
  console.log('PAGFile numImages: ', pagFile.numImages());
  console.log('PAGFile numVideos: ', pagFile.numVideos());
  let textData = pagFile.getTextData(0);
  console.log('PAGFile getTextData: ', textData);
  textData.text = 'test';
  pagFile.replaceText(0, textData);
  // Todo(zenoslin) C++ get replaced text data
  // textData = pagFile.getTextData(0);
  // console.log(textData);
  // if (textData.text === 'test') {
  //   console.log(`PAGFile replaceText succeed!`);
  // } else {
  //   console.error(`PAGFile replaceText failed!`);
  // }
  // Todo(zenoslin) test
  // pagFile.replaceImage(0, pagImage);
  console.log('PAGFile getLayersByEditableIndex: ', pagFile.getLayersByEditableIndex(0, types.LayerType.Text));
  console.log('PAGFile timeStretchMode: ', pagFile.timeStretchMode());
  pagFile.setTimeStretchMode(types.PAGTimeStretchMode.Repeat);
  if (pagFile.timeStretchMode() === types.PAGTimeStretchMode.Repeat) {
    console.log(`PAGFile setTimeStretchMode succeed!`);
  } else {
    console.error(`PAGFile setTimeStretchMode failed!`);
  }
  pagFile.setDuration(1000000);
  if (pagFile.duration() === 1000000) {
    console.log(`PAGFile setDuration succeed!`);
  } else {
    console.error(`PAGFile setDuration failed!`);
  }
  console.log('PAGFile copyOriginal: ', pagFile.copyOriginal());
};
let pagComposition: PAGComposition;
const PAGCompositionTest = async () => {
  console.log('PAGComposition Make:', PAGComposition.Make(100, 100));
  const arrayBuffer = await fetch('./assets/AudioMarker.pag').then((res) => res.arrayBuffer());
  pagComposition = (await PAGFile.load(arrayBuffer)) as PAGComposition;
  console.log('PAGComposition: ', pagComposition);
  console.log('PAGComposition width: ', pagComposition.width());
  console.log('PAGComposition height: ', pagComposition.height());
  pagComposition.setContentSize(1000, 1000);
  if (pagComposition.width() === 1000 && pagComposition.height() === 1000) {
    console.log(`PAGComposition setContentSize succeed!`);
  } else {
    console.error(`PAGComposition setContentSize failed!`);
  }
  let numChildren = pagComposition.numChildren();
  console.log('PAGComposition numChildren: ', numChildren);
  let pagLayer = pagComposition.getLayerAt(0);
  console.log('PAGComposition getLayerAt: ', pagLayer);
  console.log('PAGComposition getLayerIndex: ', pagComposition.getLayerIndex(pagLayer));
  pagComposition.setLayerIndex(pagLayer, 1);
  if (pagComposition.getLayerIndex(pagLayer) === 1) {
    console.log(`PAGComposition setLayerIndex succeed!`);
  } else {
    console.error(`PAGComposition setLayerIndex failed!`);
  }
  let pagLayer_delete: PAGLayer | null = pagComposition.removeLayer(pagLayer);
  pagLayer_delete.destroy();
  pagLayer_delete = null;
  if (pagComposition.numChildren() === numChildren - 1) {
    console.log(`PAGComposition removeLayer succeed!`);
  } else {
    console.error(`PAGComposition removeLayer failed!`);
  }
  pagComposition.addLayer(pagLayer);
  if (pagComposition.numChildren() === numChildren) {
    console.log(`PAGComposition addLayer succeed!`);
  } else {
    console.error(`PAGComposition addLayer failed!`);
  }
  pagLayer_delete = pagComposition.removeLayerAt(2);
  pagLayer_delete.destroy();
  pagLayer_delete = null;
  if (pagComposition.numChildren() === numChildren - 1) {
    console.log(`PAGComposition removeLayerAt succeed!`);
  } else {
    console.error(`PAGComposition removeLayerAt failed!`);
  }
  pagComposition.addLayerAt(pagLayer, 1);
  if (pagComposition.numChildren() === numChildren) {
    console.log(`PAGComposition addLayerAt succeed!`);
  } else {
    console.error(`PAGComposition addLayerAt failed!`);
  }
  console.log('PAGComposition contains: ', pagComposition.contains(pagLayer));
  let pagLayer_1: PAGLayer | null = pagComposition.getLayerAt(0);
  let pagLayer_2: PAGLayer | null = pagComposition.getLayerAt(1);
  pagComposition.swapLayer(pagLayer_1, pagLayer_2);
  if (pagComposition.getLayerIndex(pagLayer_1) === 1 && pagComposition.getLayerIndex(pagLayer_2) === 0) {
    console.log(`PAGComposition swapLayer succeed!`);
  } else {
    console.error(`PAGComposition swapLayer failed!`);
  }
  pagComposition.swapLayerAt(0, 1);
  if (pagComposition.getLayerIndex(pagLayer_1) === 0 && pagComposition.getLayerIndex(pagLayer_2) === 1) {
    console.log(`PAGComposition swapLayer succeed!`);
  } else {
    console.error(`PAGComposition swapLayer failed!`);
  }
  pagLayer_1.destroy();
  pagLayer_1 = null;
  pagLayer_2.destroy();
  pagLayer_2 = null;
  console.log('PAGComposition audioBytes: ', pagComposition.audioBytes());
  console.log('PAGComposition audioMarkers: ', pagComposition.audioMarkers());
  console.log('PAGComposition audioStartTime: ', pagComposition.audioStartTime());
  console.log('PAGComposition getLayersByName: ', pagComposition.getLayersByName(''));
  console.log('PAGComposition getLayersUnderPoint: ', pagComposition.getLayersUnderPoint(1, 1));
  pagComposition.removeAllLayers();
  if (pagComposition.numChildren() === 0) {
    console.log(`PAGComposition removeAllLayers succeed!`);
  } else {
    console.error(`PAGComposition removeAllLayers failed!`);
  }
};

let pagLayer: PAGLayer;
const PAGLayerTest = async () => {
  const arrayBuffer = await fetch('./assets/test2.pag').then((res) => res.arrayBuffer());
  const pagFile = PAGFile.loadFromBuffer(arrayBuffer);
  pagLayer = pagFile.getLayerAt(0);
  console.log('PAGLayer: ', pagLayer);
  console.log('PAGLayer uniqueID: ', pagLayer.uniqueID());
  console.log('PAGLayer layerType: ', pagLayer.layerType());
  console.log('PAGLayer layerName: ', pagLayer.layerName());
  const matrix = pagLayer.matrix();
  console.log('PAGLayer matrix: ', matrix);
  matrix.set(types.MatrixIndex.a, 2);
  pagLayer.setMatrix(matrix);
  if (pagLayer.matrix().a === 2) {
    console.log(`PAGLayer setMatrix succeed!`);
  } else {
    console.error(`PAGLayer setMatrix failed!`);
  }
  pagLayer.resetMatrix();
  if (pagLayer.matrix().a === 1) {
    console.log(`PAGLayer resetMatrix succeed!`);
  } else {
    console.error(`PAGLayer resetMatrix failed!`);
  }
  console.log('PAGLayer getTotalMatrix: ', pagLayer.getTotalMatrix());
  console.log('PAGLayer alpha: ', pagLayer.alpha());
  pagLayer.setAlpha(0);
  if (pagLayer.alpha() === 0) {
    console.log(`PAGLayer setAlpha succeed!`);
  } else {
    console.error(`PAGLayer setAlpha failed!`);
  }
  console.log('PAGLayer visible: ', pagLayer.visible());
  pagLayer.setVisible(false);
  if (pagLayer.visible() === false) {
    console.log(`PAGLayer setVisible succeed!`);
  } else {
    console.error(`PAGLayer setVisible failed!`);
  }
  console.log('PAGLayer editableIndex: ', pagLayer.editableIndex());
  console.log('PAGLayer parent: ', pagLayer.parent());
  console.log('PAGLayer markers: ', pagLayer.markers());
  console.log('PAGLayer localTimeToGlobal: ', pagLayer.localTimeToGlobal(0));
  console.log('PAGLayer globalToLocalTime: ', pagLayer.globalToLocalTime(0));
  console.log('PAGLayer duration: ', pagLayer.duration());
  console.log('PAGLayer frameRate: ', pagLayer.frameRate());
  console.log('PAGLayer startTime: ', pagLayer.startTime());
  pagLayer.setStartTime(1000000);
  if (pagLayer.startTime() === 1000000) {
    console.log(`PAGLayer setStartTime succeed!`);
  } else {
    console.error(`PAGLayer setStartTime failed!`);
  }
  console.log('PAGLayer currentTime: ', pagLayer.currentTime());
  pagLayer.setCurrentTime(1000000);
  if (pagLayer.currentTime() === 1000000) {
    console.log(`PAGLayer setCurrentTime succeed!`);
  } else {
    console.error(`PAGLayer setCurrentTime failed!`);
  }
  console.log('PAGLayer getProgress: ', pagLayer.getProgress());
  pagLayer.setProgress(0.5008333333333334);
  if (pagLayer.getProgress() === 0.5008333333333334) {
    console.log(`PAGLayer setProgress succeed!`);
  } else {
    console.error(`PAGLayer setProgress failed!`);
  }
  pagLayer.preFrame();
  if (pagLayer.getProgress() === 0.4925) {
    console.log(`PAGLayer preFrame succeed!`);
  } else {
    console.error(`PAGLayer preFrame failed!`);
  }
  pagLayer.nextFrame();
  if (pagLayer.getProgress() === 0.5008333333333334) {
    console.log(`PAGLayer nextFrame succeed!`);
  } else {
    console.error(`PAGLayer nextFrame failed!`);
  }
  console.log('PAGLayer getBounds: ', pagLayer.getBounds());
  console.log('PAGLayer trackMatteLayer: ', pagLayer.trackMatteLayer());
  console.log('PAGLayer excludedFromTimeline: ', pagLayer.excludedFromTimeline());
  pagLayer.setExcludedFromTimeline(true);
  if (pagLayer.excludedFromTimeline() === true) {
    console.log(`PAGLayer excludedFromTimeline succeed!`);
  } else {
    console.error(`PAGLayer excludedFromTimeline failed!`);
  }
  console.log('PAGLayer isPAGFile: ', pagLayer.isPAGFile());
};
