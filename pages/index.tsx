import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { subscribeToContracts, subscribeToQuotes } from "./kindaServer";
import type { ContractBook } from "./types";
import styles from "../styles/Home.module.css";
import Link from "next/link";

let freezeFlag = false;

const Home: NextPage = () => {
  const cRef = useRef<ContractBook>({});
  const cLengthRef = useRef<number>(0);
  const [awpFlag, setAwpFlag] = useState(true);
  const [columnDefs] = useState([
    { field: "name" },
    { field: "price" },
    { field: "wma" },
  ]);

  useReRender(500); // reRender timeout

  useEffect(() => {
    subscribeToContracts((contractsArr) => {
      if (freezeFlag) return null;

      contractsArr.forEach((c) => {
        if ("removed" in c) {
          delete cRef.current[c.id];
          cLengthRef.current--;
        } else {
          if (!cRef.current[c.id]) {
            cRef.current[c.id] = {
              n: c.name,
              q: [{ p: 0, v: 0 }],
              pt: 0,
              cp: 0,
              wma: { p: 0, v: 0 },
            };
            cLengthRef.current++;
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    subscribeToQuotes((quotesArr) => {
      if (freezeFlag) return null;

      quotesArr.forEach((q) => {
        const i = q.contractId;
        if (!cRef.current[i]) return null;

        const p = cRef.current[i].pt;
        let wmaV = 0;
        let wmaP = 0;
        if (p < 999) {
          wmaV =
            q.quote.v +
            cRef.current[i].wma.v -
            (!!cRef.current[i].q[p + 1] ? cRef.current[i].q[p + 1].v : 0);
          wmaP =
            (q.quote.p * q.quote.v +
              cRef.current[i].wma.p * cRef.current[i].wma.v -
              (!!cRef.current[i].q[p + 1]
                ? cRef.current[i].q[p + 1].p * cRef.current[i].q[p + 1].v
                : 0)) /
            wmaV;
          cRef.current[i].q[p + 1] = q.quote;
          cRef.current[i].pt++;
        } else {
          wmaV = q.quote.v + cRef.current[i].wma.v - cRef.current[i].q[0].v;
          wmaP =
            (q.quote.p * q.quote.v +
              cRef.current[i].wma.p * cRef.current[i].wma.v -
              cRef.current[i].q[0].p * cRef.current[i].q[0].v) /
            wmaV;
          cRef.current[i].q[0] = q.quote;
          cRef.current[i].pt = 0;
        }
        cRef.current[i].wma.p = wmaP;
        cRef.current[i].wma.v = wmaV;
        cRef.current[i].cp = q.quote.p;
      });
    });
  }, []);

  function styleHandler() {
    setAwpFlag(() => !awpFlag);
  }

  function freezeHandler() {
    freezeFlag = !freezeFlag;
  }

  return (
    <>
      <Link href="/index-ag">AG-Greed page</Link>
      <div className={styles.right}>
        <label className={freezeFlag ? styles.freeze : styles.rb}>
          <input
            type="checkbox"
            onChange={() => {}}
            onClick={freezeHandler}
            className={styles.chk}
            hidden
            checked={freezeFlag}
          />
          <div className={styles.inputLabel}>Freeze</div>
        </label>
      </div>

      <div className={styles.tabloid}>
        <h3>TabData ({cLengthRef.current})</h3>
        {cRef.current === {} ? (
          <p>No data yet...</p>
        ) : (
          <>
            <div className={styles.right}>
              <label className={styles.rb}>
                <input
                  type="checkbox"
                  onChange={() => {}}
                  onClick={styleHandler}
                  className={styles.chk}
                  hidden
                  checked={awpFlag}
                />
                <div className={styles.inputLabel}>Style</div>
              </label>
            </div>

            <div>
              <ul>
                {Object.entries(cRef.current).map((c) => {
                  return (
                    <li key={c[1].n}>
                      <span className={styles.row}>
                        <span>{c[1].n}</span> <span>{c[1].cp.toFixed(4)}</span>
                      </span>
                      <span className={awpFlag ? styles.awp : styles.noAwp}>
                        {c[1].cp > 0
                          ? ((c[1].wma.p * 100) / c[1].cp).toFixed(2) + "%"
                          : "0"}
                        %
                      </span>
                      <span className={freezeFlag ? "" : styles.noAwp}>
                        {c[1].wma.p.toFixed(2)}, ({c[1].q.length})
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;

function useReRender(timeout: number) {
  const [_, setBool] = useState(true);
  const intervalId = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    intervalId.current = setInterval(
      () => setBool((prevValue) => !prevValue),
      timeout
    );
    return () =>
      clearInterval(intervalId as unknown as ReturnType<typeof setInterval>);
  }, [timeout]);
}
