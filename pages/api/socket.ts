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

const c: [string, string, number][] = [
  ["i-A", "AAAA", 1.1],
  ["i-B", "BBBB", 2.2],
  ["i-C", "CCCC", 3.3],
  ["i-D", "DDDD", 4.4],
  ["i-E", "EEEE", 5.5],
  ["i-F", "FFFF", 6.6],
  ["i-G", "GGGG", 7.7],
  ["i-H", "HHHH", 8.8],
  ["i-I", "IIII", 9.9],
  ["i-J", "JJJJ", 10.1],
  ["i-K", "KKKK", 11.1],
];

function genPool() {
  let arr: Contract[] = [];
  const j = Math.round(3 * Math.random()) + 1;
  while (j) {
    const k = Math.round(10 * Math.random());
    console.log("generate k=", k);

    arr.push({
      contractId: c[k][0],
      quote: {
        price: c[k][2] + 0.5 - Math.random(),
        volume: Math.round(100000 * Math.random()),
      },
    });
  }
  return arr;
}

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("emitFlag", () => {
        let i = 2;
        // while (i) {
        //   let msg = JSON.stringify(genPool());
        //   console.log("socket.emit = ", msg);
        //   socket.emit("dataFlow", msg);
        //   setTimeout(() => console.log, 1000);
        //   i--;
        // }
      });
    });
  }
  res.end();
};

export default SocketHandler;
