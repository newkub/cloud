import { createAnimate } from "../modules/animation/application/usecases/core/use-animate";
import { createStaggerFactory } from "../modules/animation/application/usecases/core/use-stagger";
import { createTimelineFactory } from "../modules/animation/application/usecases/core/use-timeline";
import { createCanvasFactory } from "../modules/animation/application/usecases/utilities/use-canvas";
import { createDraggableFactory } from "../modules/animation/application/usecases/utilities/use-draggable";
import { createScrollObserverFactory } from "../modules/animation/application/usecases/utilities/use-scroll-observer";
import { createSVGFactory } from "../modules/animation/application/usecases/utilities/use-svg";
import { createTextSplitFactory } from "../modules/animation/application/usecases/utilities/use-text-split";

export const animate = createAnimate();
export const createTimeline = createTimelineFactory();
export const stagger = createStaggerFactory();
export const onScroll = createScrollObserverFactory();
export const createDraggable = createDraggableFactory();
export const splitText = createTextSplitFactory();
export const svg = createSVGFactory();
export const canvas = createCanvasFactory();
