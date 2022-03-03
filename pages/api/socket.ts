import { Server } from "Socket.IO";
import type { Contract, ContractList } from "../index";

const conList: ContractList[] = [
  { id: "i-A", name: "AAAA", removed: false },
  { id: "i-B", name: "BBBB", removed: false },
  { id: "i-C", name: "CCCC", removed: false },
  { id: "i-D", name: "DDDD", removed: true },
  { id: "i-E", name: "EEEE", removed: false },
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
  let j = Math.round(3 * Math.random()) + 1;
  while (j) {
    const k = Math.round(10 * Math.random());
    console.log("j=", j, " generate k=", k);

    arr.push({
      contractId: c[k][0],
      quote: {
        price: c[k][2] + 0.5 - Math.random(),
        volume: Math.round(100000 * Math.random()),
      },
    });
    j--;
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
      // let listMsg = JSON.stringify(conList);
      socket.on("emitFlag", (f) => {
        let i = 3;
        // if (f) {
        //   socket.emit("dataList", conList);
        //   console.log("OK, conList sended to frontend");
        // }
        console.log("inside S.emit, flag=", f, " i=", i);

        while (f && i) {
          i--;
          let msg = JSON.stringify(genPool());
          console.log("...tick...", i, f);
          // let msg = genPool();
          setTimeout(() => {
            console.log("send bit of Flow");
            socket.emit("dataFlow", msg);
          }, 2000);
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
