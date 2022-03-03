import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { CheckBtn } from "../components/CheckBtn";
import io, { Socket } from "Socket.IO-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export type ContractList = {
  id: string;
  name: string;
  removed?: boolean;
};

export type Contract = {
  contractId: string;
  quote: {
    price: number;
    volume: number;
  };
  awp?: number;
};

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const Home = () => {
  const ContractList0: ContractList = { id: "", name: "", removed: true };
  const Contract0: Contract = {
    contractId: "i-i",
    quote: { price: 0.101, volume: 1234 },
  };
  const [conList, setConList] = useState<ContractList[] | []>([]);
  const [ServEmitFlag, setServEmitFlag] = useState(false);
  const [awpFlag, setAwpFlag] = useState(true);
  const [tabData, setTabData] = useState<Contract[] | []>([]);
  console.log("\n\n* * * * initial tabData=", tabData);
  let tmpTD = [];

  useEffect(() => {
    async () => {
      await fetch("/api/socket").finally(() => {
        socket = io();

        socket.on("connect", () => {
          console.log("connected");
        });

        // socket.on("dataList", (msg) => {
        //   setConList(msg);
        //   console.log("received conList=", conList);
        // });

        socket.on("dataFlow", (msg) => {
          const mdata: Contract[] = JSON.parse(msg);
          // const mdata: Contract[] = msg;
          tmpTD = Array.from(tabData);
          console.log("\n......... tabData =", tabData);
          console.log("\n......... tmp =", tmpTD);
          console.log("+++++++++ received mData=", mdata);

          mdata.forEach((m) => {
            const mindex = tmpTD.findIndex(
              (t) => t.contractId === m.contractId
            );
            m.awp = m.quote.price;
            if (mindex === -1) {
              tmpTD.push(m);
            } else {
              tmpTD[mindex] = m;
            }
          });
          console.log("======== setTabData=", tmpTD);
          setTabData(() => tmpTD);
        });
      });
    };
  }, []);

  const servHandler = () => {
    setServEmitFlag(() => !ServEmitFlag);
    socket.emit("emitFlag", ServEmitFlag);
  };

  const Tabloid = () => {
    console.log("Tabloid - tabData=", tabData);
    if (tabData.length === 0) return <p>No data yet...</p>;
    return (
      <div className={styles.tabloid}>
        <h3>TabData:</h3>
        <div className={styles.right}>
          <CheckBtn
            text="Style"
            checked={awpFlag}
            onClick={setAwpFlag(() => !awpFlag)}
          />
        </div>

        <ul>
          {tabData.map((c: Contract) => (
            <li key={c.contractId}>
              <span className={styles.row}>
                <span>{c.contractId}</span>{" "}
                <span>{c.quote.price.toFixed(4)}</span>
              </span>
              <span className={awpFlag ? styles.awp : styles.noAwp}>
                {(c.awp || 0).toFixed(2) || "-"}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <div>
        <input type="checkbox" onChange={servHandler} checked={ServEmitFlag} />
        ServEmitFlag
      </div>
      {/* {conList.length > 0 ? (
        <ul>
          {conList.map((i) => (
            <li key={i.id}>
              {i.id} - {i.name} - {i.removed}
            </li>
          ))}
        </ul>
      ) : (
        ""
      )} */}
      <Tabloid />
    </div>
  );
};

export default Home;
