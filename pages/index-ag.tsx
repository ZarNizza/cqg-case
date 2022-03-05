import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { subscribeToContracts, subscribeToQuotes } from "./kindaServer";
import type { ContractBook } from "./types";
import styles from "../styles/Home.module.css";
import { GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import Link from "next/link";

const Home: NextPage = () => {
  const cRef = useRef<ContractBook>({});
  const gridRef = useRef<GridReadyEvent | null>(null);
  const cLengthRef = useRef<number>(0);
  const [awpFlag, setAwpFlag] = useState(true);
  const [columnDefs] = useState([
    { field: "name" },
    {
      field: "price",
      type: "rightAligned",
    },
    { field: "wma", type: "rightAligned" },
  ]);

  useEffect(() => {
    subscribeToContracts((contractsArr) => {
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
      if (gridRef.current === null) return;

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
      gridRef.current.api.setRowData(
        Object.entries(cRef.current).map((c) => {
          return {
            name: c[1].n,
            price: c[1].cp.toFixed(4),
            wma:
              c[1].cp > 0
                ? ((c[1].wma.p * 100) / c[1].cp).toFixed(2) + "%"
                : "0",
          };
        })
      );
    });
  }, []);

  return (
    <div className={styles.main}>
      <Link href="/index-ag">longTable page</Link>
      <h3>TabData</h3>

      <div className="ag-theme-alpine" style={{ height: 400, width: 650 }}>
        <AgGridReact
          onGridReady={(gridReadyEvent) => (gridRef.current = gridReadyEvent)}
          rowData={Object.entries(cRef.current).map((c) => {
            return {
              name: c[1].n,
              price: c[1].cp.toFixed(4),
              wma:
                c[1].cp > 0
                  ? ((c[1].wma.p * 100) / c[1].cp).toFixed(2) + "%"
                  : "0",
            };
          })}
          columnDefs={columnDefs}
          suppressScrollOnNewData={true}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default Home;
