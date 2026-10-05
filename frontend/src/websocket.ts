import { presentationState } from "./state";
import type { PresentationPosition } from "./types";

export const setupWebsocket = () => {
  console.debug("[Websocket] Connecting to server...");
  const socket = new WebSocket(`ws://${location.host}/ws`);

  socket.addEventListener("open", () => {
    console.debug("[Websocket] Connected");

    presentationState.subscribe((current, state) => {
      if (state === "remote") return;

      const currentPosition: PresentationPosition = {
        blockId: current.currentBlockId,
      };
      socket.send(JSON.stringify(currentPosition));
    });
  });

  socket.addEventListener("message", (event) => {
    console.debug("[Websocket] Received position update");

    const position: PresentationPosition = JSON.parse(event.data);
    presentationState.applyRemote(position.blockId);
  });
};
