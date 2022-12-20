// index.js

import {
  createIndexElement,
  createMemberElement,
  createNotFoundElement,
} from "./element.js";

export const MEMBERS = ["alice", "bob", "carol"];
export const ALLOW_PAGE_URL_LIST = [
  "/",
  ...MEMBERS.map((member) => `/${member}`),
];

function hasAppHistory() {
  return globalThis && "appHistory" in globalThis;
}

async function router(pathname) {
  if (!ALLOW_PAGE_URL_LIST.includes(pathname)) {
    renderApp(createNotFoundElement());
    return;
  }

  if (pathname === "/") {
    renderApp(createIndexElement());
    return;
  }

  const json = await (await fetch(`/api${pathname}`)).json();
  const { id, name } = json;
  renderApp(createMemberElement(id, name));
}

function renderApp(dom) {
  const app = document.querySelector("#app");
  app.textContent = "";
  app.appendChild(dom);
}

function main() {
  if (!hasAppHistory()) return;

  router(window.location.pathname);

  appHistory.addEventListener("navigate", (e) => {
    const myNavigation = () => {
      const { pathname } = new URL(e.destination.url);
      return router(pathname);
    };

    e.transitionWhile(myNavigation());
  });
}

main();
