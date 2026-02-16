import React, { useEffect, useState } from "react";
import { TableColumn } from "../../webcore/types/TableColumn";
import { SqliteUtil } from "../../webcore/sqlite";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: "#b8b8b8",
    borderBottom: "1px solid #303030",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    color: "#b8b8b8",
    backgroundColor: "#232323",
    borderBottom: "1px solid #303030",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

interface TableSchemaProps {
  activeTable: string | undefined;
}

const TableSchema: React.FC<TableSchemaProps> = ({ activeTable }) => {
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([]);

  useEffect(() => {
    if (activeTable) {
      const columns = SqliteUtil.getTableSchema(activeTable);
      setTableColumns(columns);
      console.log(columns);
    }
  }, [activeTable]);

  useEffect(() => {}, [tableColumns]);

  return (
    <div style={styles.container} className="sidebar-scroll">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Column ID</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Data type</StyledTableCell>
              <StyledTableCell align="center">Not null</StyledTableCell>
              <StyledTableCell align="center">Defaut value</StyledTableCell>
              <StyledTableCell align="center">Primary key</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableColumns.map((tbCol) => (
              <StyledTableRow key={tbCol.cid}>
                <StyledTableCell align="left">{tbCol.cid}</StyledTableCell>
                <StyledTableCell align="center">{tbCol.name}</StyledTableCell>
                <StyledTableCell align="center">{tbCol.type}</StyledTableCell>
                <StyledTableCell align="center">
                  {tbCol.notNull ? "yes" : "no"}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {tbCol.defaultValue ?? ""}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {tbCol.primaryKey ? "yes" : "no"}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const styles: { [k: string]: React.CSSProperties } = {
  container: {
    width: "calc(100vw - 280px)",
    height: "calc(100vh - 71px)",
    boxSizing: "border-box",
    position: "relative",
    overflowY: "auto",
  },
};

export default TableSchema;
