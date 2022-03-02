import { Server } from "Socket.IO";

type ContractList = {
  id: string;
  name: string;
  removed?: boolean;
};
type Contract = {
  contractId: string;
  quote: {
    price: number;
    volume: number;
  };
};

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const ContractList: ContractList[] = [
      { id: "i-A", name: "AAAA", removed: false },
      { id: "i-B", name: "BBBB", removed: false },
      { id: "i-C", name: "CCCC", removed: false },
      { id: "i-D", name: "DDDD", removed: true },
      { id: "i-E", name: "EEEE", removed: false },
    ];
    const Contract0: Contract[] = [
      {
        contractId: "i-A",
        quote: { price: 1.1111, volume: 1111 },
      },
      {
        contractId: "i-C",
        quote: { price: 333.33, volume: 3333 },
      },
      {
        contractId: "i-D",
        quote: { price: 4444.4, volume: 4444 },
      },
      {
        contractId: "i-B",
        quote: { price: 22.222, volume: 2222 },
      },
      {
        contractId: "i-E",
        quote: { price: 55555.5, volume: 5555 },
      },
    ];

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("emitFlag", () => {
        let msg = JSON.stringify(Contract0);
        console.log("socket.emit = ", msg);
        socket.emit("dataFlow", msg);
      });
    });
  }
  res.end();
};

export default SocketHandler;
