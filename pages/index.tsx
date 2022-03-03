import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { CheckBtn } from "../components/CheckBtn";

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

function getData() {
  let arr: Contract[] = [];
  let j = Math.round(5 * Math.random()) + 1;
  while (j) {
    const k = Math.round(10 * Math.random());
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

const Home = () => {
  const [conList, setConList] = useState<ContractList[] | []>([]);
  const [flowFlag, setFlowFlag] = useState(false);
  const [awpFlag, setAwpFlag] = useState(true);
  const [tabData, setTabData] = useState<Contract[] | []>([
    { contractId: "aaa", quote: { price: 123, volume: 456 } },
  ]);
  console.log("\n\n* * * * initial tabData=", tabData);

  let incomeData: Contract[] | [] = [];
  useEffect(() => {
    incomeData = getData();
    let interval: any;

    // useEffect(() => {
    let tmpTD = [];

    tmpTD = Array.from(tabData);
    console.log("+++++++++ received mData=", incomeData);

    incomeData.forEach((m) => {
      const mid = tmpTD.findIndex((t) => t.contractId === m.contractId);
      m.awp = m.quote.price;
      if (mid === -1) {
        tmpTD.push(m);
      } else {
        tmpTD[mid] = m;
      }
    });
    console.log("======== setTabData=", tmpTD);
    setTabData(() => tmpTD);
    // }, [incomeData]);
  }, []);

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
      </div>
      <Tabloid />
    </div>
  );
};
export default Home;
