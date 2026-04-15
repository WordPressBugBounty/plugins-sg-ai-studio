export interface DragConstraints {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function getWpAdminSidebarWidth(): number {
  const adminMenuBack = document.getElementById("adminmenuback");

  if (!adminMenuBack) {
    return 0;
  }

  const computedStyle = getComputedStyle(adminMenuBack);
  const width = parseInt(computedStyle.width, 10) || 0;

  return width;
}

export function getWpAdminBarHeight(): number {
  const adminBar = document.getElementById("wpadminbar");

  if (!adminBar) {
    return 0;
  }

  const computedStyle = getComputedStyle(adminBar);
  const height = parseInt(computedStyle.height, 10) || 0;

  return height;
}

export function calculateDragConstraints(chatWidth: number, chatHeight: number): DragConstraints {
  const sidebarWidth = getWpAdminSidebarWidth();
  const adminBarHeight = getWpAdminBarHeight();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const constraints: DragConstraints = {
    minX: 0,
    minY: 0,
    maxX: viewportWidth - chatWidth,
    maxY: viewportHeight - chatHeight,
  };

  if (sidebarWidth > 0) {
    constraints.minX = sidebarWidth;
    constraints.maxX = Math.max(sidebarWidth, viewportWidth - chatWidth);
  }

  if (adminBarHeight > 0) {
    constraints.minY = adminBarHeight;
    constraints.maxY = Math.max(adminBarHeight, viewportHeight - chatHeight);
  }

  constraints.minX = Math.max(0, constraints.minX);
  constraints.minY = Math.max(0, constraints.minY);
  constraints.maxX = Math.max(constraints.minX, constraints.maxX);
  constraints.maxY = Math.max(constraints.minY, constraints.maxY);

  return constraints;
}

export function wouldOverlapAdminUI(x: number, y: number): boolean {
  const sidebarWidth = getWpAdminSidebarWidth();
  const adminBarHeight = getWpAdminBarHeight();

  const overlapsSidebar = sidebarWidth > 0 && x < sidebarWidth;

  const overlapsAdminBar = adminBarHeight > 0 && y < adminBarHeight;

  return overlapsSidebar || overlapsAdminBar;
}
