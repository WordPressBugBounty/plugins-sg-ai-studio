import { CHAT_MIN_WIDTH, CHAT_HEIGHT, CHAT_WIDTH, CHAT_MAX_WIDTH, CHAT_MIN_HEIGHT } from "@/chat/constants/chat";
import { getStore } from "../../../store";
import { updatePosition } from "../../../store/slices/chat/chatSlice";

const minSizeWidth = CHAT_MIN_WIDTH;
const minSizeHeight = CHAT_MIN_HEIGHT;
let chatWidth = CHAT_WIDTH;
let chatHeight = CHAT_HEIGHT;
let chatPositionX = 0;
let chatPositionY = 0;
let mouseX = 0;
let mouseY = 0;
let resizer: Element | null = null;
let element: HTMLElement | null = null;
let screenWidth: number = 0;
let screenHeight: number = 0;

export function resizeChatHandler(el: HTMLDivElement | null): void {
  if (!el) {
    return;
  }
  element = el;

  element.querySelectorAll(".wp-ai-studio-chat__resizer").forEach((currentResizer) => {
    currentResizer.addEventListener("mousedown", (e: Event) => {
      const mouseEvent = e as MouseEvent;
      mouseEvent.preventDefault();

      disableScroll();

      resizer = currentResizer;
      if (!element) return;

      // Disable transitions during resize to prevent lag
      element.classList.add("wp-ai-studio-chat--dragging");

      chatWidth = parseFloat(getComputedStyle(element, null).getPropertyValue("width"));
      chatHeight = parseFloat(getComputedStyle(element, null).getPropertyValue("height"));
      chatPositionX = element.getBoundingClientRect().left;
      chatPositionY = element.getBoundingClientRect().top;
      mouseX = mouseEvent.pageX;
      mouseY = mouseEvent.pageY;

      const body = document.getElementsByTagName("body")[0];
      screenHeight = window.innerHeight || document.documentElement.clientHeight || (body ? body.clientHeight : 0);
      screenWidth = window.innerWidth || document.documentElement.clientWidth || (body ? body.clientWidth : 0);

      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResize);
    });
  });
}

function resize(event: MouseEvent): void {
  if (!resizer) return;

  const resizePoint = resizer.getAttribute("data-resizer");

  switch (resizePoint) {
    case "resize-left":
      resizeLeft(event);
      break;
    case "resize-right":
      resizeRight(event);
      break;
    case "resize-bottom":
      resizeBottom(event);
      break;
    case "resize-top":
      resizeTop(event);
      break;
    case "resize-top-left":
      resizeTopLeft(event);
      break;
    case "resize-top-right":
      resizeTopRight(event);
      break;
    case "resize-bottom-left":
      resizeBottomLeft(event);
      break;
    case "resize-bottom-right":
      resizeBottomRight(event);
      break;
    default:
      break;
  }
}

function resizeTopLeft(event: MouseEvent): void {
  if (!element) return;

  const width = chatWidth - (event.pageX - mouseX);
  const height = chatHeight - (event.pageY - mouseY);

  if (width > minSizeWidth && width < CHAT_MAX_WIDTH && event.clientX > 0) {
    element.style.width = `${width}px`;
    element.style.left = `${chatPositionX + (event.pageX - mouseX)}px`;
  }
  if (height > minSizeHeight && event.clientY > 0) {
    element.style.height = `${height}px`;
    element.style.top = `${chatPositionY + (event.pageY - mouseY)}px`;
  }
}

function resizeTopRight(event: MouseEvent): void {
  if (!element) return;

  const width = chatWidth + (event.pageX - mouseX);
  const height = chatHeight - (event.pageY - mouseY);

  if (width > minSizeWidth && width < CHAT_MAX_WIDTH && event.clientX < screenWidth) {
    element.style.width = `${width}px`;
  }
  if (height > minSizeHeight && event.clientY > 0) {
    element.style.height = `${height}px`;
    element.style.top = `${chatPositionY + (event.pageY - mouseY)}px`;
  }
}

function resizeBottomLeft(event: MouseEvent): void {
  if (!element) return;

  const height = chatHeight + (event.pageY - mouseY);
  const width = chatWidth - (event.pageX - mouseX);

  if (height > minSizeHeight && event.clientY < screenHeight) {
    element.style.height = `${height}px`;
  }
  if (width > minSizeWidth && width < CHAT_MAX_WIDTH && event.clientX > 0) {
    element.style.width = `${width}px`;
    element.style.left = `${chatPositionX + (event.pageX - mouseX)}px`;
  }
}

function resizeBottomRight(event: MouseEvent): void {
  if (!element) return;

  const width = chatWidth + (event.pageX - mouseX);
  const height = chatHeight + (event.pageY - mouseY);

  if (width > minSizeWidth && width < CHAT_MAX_WIDTH && event.clientX < screenWidth) {
    element.style.width = `${width}px`;
  }
  if (height > minSizeHeight && event.clientY < screenHeight) {
    element.style.height = `${height}px`;
  }
}

function resizeTop(event: MouseEvent): void {
  if (!element) return;

  const height = chatHeight - (event.pageY - mouseY);

  if (height > minSizeHeight && event.clientY > 0) {
    element.style.height = `${height}px`;
    element.style.top = `${chatPositionY + (event.pageY - mouseY)}px`;
  }
}

function resizeBottom(event: MouseEvent): void {
  if (!element) return;

  const height = chatHeight + (event.pageY - mouseY);

  if (height > minSizeHeight && event.clientY < screenHeight) {
    element.style.height = `${height}px`;
  }
}

function resizeLeft(event: MouseEvent): void {
  if (!element) return;

  const width = chatWidth - (event.pageX - mouseX);

  if (width > minSizeWidth && width < CHAT_MAX_WIDTH && event.clientX > 0) {
    element.style.width = `${width}px`;
    element.style.left = `${chatPositionX + (event.pageX - mouseX)}px`;
  }
}

function resizeRight(event: MouseEvent): void {
  if (!element) return;

  const width = chatWidth + (event.pageX - mouseX);

  if (width > minSizeWidth && width < CHAT_MAX_WIDTH && event.clientX < screenWidth) {
    element.style.width = `${width}px`;
  }
}

function disableScroll(): void {
  window.onscroll = stopResize;
}

function enableScroll(): void {
  window.onscroll = null;
}

export function stopResize(): void {
  enableScroll();
  window.removeEventListener("mousemove", resize);
  window.removeEventListener("mouseup", stopResize);

  if (element) {
    element.classList.remove("wp-ai-studio-chat--dragging");

    const rect = element.getBoundingClientRect();
    const computedStyle = getComputedStyle(element);

    getStore().dispatch(
      updatePosition({
        width: parseFloat(computedStyle.width),
        height: parseFloat(computedStyle.height),
        left: Math.max(0, rect.left),
        top: Math.max(0, rect.top),
      })
    );
  }
}
