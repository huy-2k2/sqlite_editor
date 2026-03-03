import React, { useState } from "react";
import {
  randomId,
} from "@mui/x-data-grid-generator";
import SqlEditor from "./SqliteEditor";
type QueryInfo = {
  id: string,
  index: number,
  command: string,
  rows:  Array<any> | undefined,
  result: string
};

const initQueryInfo : QueryInfo  = {
  id: randomId(),
  index: 1,
  command: "",
  rows: undefined,
  result: ""
}

interface QueryProps {}

const Query: React.FC<QueryProps> = ({}) => {
  const [listQueryInfo, setListQueryInfo] = useState<QueryInfo[]>([initQueryInfo])
  const [idQuerySelected, setIdQuerySelected] = useState<string>(initQueryInfo.id)

  function handleAddNewQueryInfo(): void {  
    const newQueryInfo: QueryInfo = {
      id: randomId(),
      index: listQueryInfo.length? listQueryInfo[listQueryInfo.length - 1].index + 1: 1,
      command: "",
      rows: undefined,
      result: ""
    }

    setListQueryInfo([...listQueryInfo, newQueryInfo]);
    setIdQuerySelected(newQueryInfo.id)
  }

  function handleDeleteQueryInfo(queryId: string, event: React.MouseEvent): void {
    event.stopPropagation()
    if(listQueryInfo.length < 2)
      return

    const newListQueryInfo = listQueryInfo.filter(q => q.id != queryId)
    setListQueryInfo(newListQueryInfo)

    if(queryId == idQuerySelected)
      setIdQuerySelected(newListQueryInfo[newListQueryInfo.length - 1].id)


  }

  function handleSelectQueryInfo(queryId: string) {
    setIdQuerySelected(queryId)
  }

  return <div>
    <div style={styles.querylist} className="sidebar-scroll">
      <div onClick={() => handleAddNewQueryInfo()} style={{...styles.queryitem, backgroundColor: '#22c55e'}}>new query</div>
      {listQueryInfo.toReversed().map((qinf) => {
        return <div 
        onClick={() => handleSelectQueryInfo(qinf.id)}
        style={{
              ...styles.queryitem,
              ...(qinf.id == idQuerySelected ? styles.tableItemActive : {}),
            }}
        >
          {`query ${qinf.index}`}
           <div
              style={styles.closeItem}
            >
              <span onClick={(e) => handleDeleteQueryInfo(qinf.id, e)} style={styles.iconClose}>x</span>
            </div>
        </div>
      })}
    </div>
    <div>
      <SqlEditor></SqlEditor>
    </div>
  </div>;
};

const styles: { [key: string]: React.CSSProperties } = {
  querylist: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    gap: "10px",
    overflowX: "scroll",
  },
  queryitem: {
    borderRadius: "6px",
    padding: "8px 16px",
    backgroundColor: "#000",
    color: "#fff",
    cursor: "pointer",
    position: "relative",
    whiteSpace: "nowrap"
  },
  closeItem: {
    position: "absolute",
    top: "1px",
    right: "1px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: "rgb(255 0 0 / 50%)",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  iconClose: {
    marginBottom: "4px",
  },
  tableItemActive: {
    backgroundColor: "#08446c",
  },
  newQueryItem: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: "0.5px",
  },
};

export default Query;
