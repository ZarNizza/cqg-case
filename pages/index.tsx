import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { CheckBtn } from "../components/CheckBtn";
import io, { Socket } from "Socket.IO-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
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
  awp?: number;
};

const Home = () => {
  const ContractList0: ContractList = { id: "", name: "", removed: true };
  const Contract0: Contract = {
    contractId: "i-i",
    quote: { price: 0.101, volume: 1234 },
  };
  const [conList, setConList] = useState<ContractList[]>([ContractList0]);
  const [ServEmitFlag, setServEmitFlag] = useState(false);
  const [awpFlag, setAwpFlag] = useState(true);
  const [tabData, setTabData] = useState<Contract[]>([Contract0]);

  useEffect(() => socketInitializer(), []);

  const socketInitializer: any = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("dataFlow", (msg) => {
      const mdata: Contract[] = JSON.parse(msg);
      console.log("--------- received mData=", mdata);
      let tmpTD = Array.from(tabData);

      mdata.forEach((m) => {
        const mindex = tabData.findIndex((t) => t.contractId === m.contractId);
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
  };

  const servHandler = () => {
    setServEmitFlag(() => !ServEmitFlag);
    socket.emit("emitFlag", ServEmitFlag);
  };

  function awpHandler() {
    setAwpFlag(() => !awpFlag);
  }

  const Tabloid = (props) => {
    console.log("props.data=", props.data);
    return (
      <div className={styles.tabloid}>
        <h3>TabData:</h3>
        <div className={styles.right}>
          <CheckBtn text="Style" checked={awpFlag} onClick={awpHandler} />
        </div>

        <ul>
          {props.data.map((c: Contract) => (
            <li key={c.contractId}>
              <span className={styles.row}>
                <span>{c.contractId}</span> <span>{c.quote.price}</span>
              </span>
              <span className={awpFlag ? styles.awp : styles.noAwp}>
                {c.awp || "-"}%
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
      <Tabloid data={tabData} />
    </div>
  );
};

export default Home;
