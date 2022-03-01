import { Server } from "Socket.IO";

type ContractList = {
  id: string;
  name: string;
  removed?: boolean;
};

type ContractData = {
  contractId: string;
  quote: { price: number; volume: number };
};

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("input-change", (msg) => {
        socket.broadcast.emit("update-input", msg);
      });
    });

    io.on("connection", (socket) => {
      socket.on("emitFlag", () => {
        // let msg = JSON.stringify({
        //   contractId: "i-a",
        //   quote: { price: 77, volume: 88 },
        // });
        let msg = "gogogo";
        socket.emit("dataFlow", msg);
      });
    });
  }
  res.end();
};

export default SocketHandler;
