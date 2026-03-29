import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridFilterModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { UnknowQueryResult } from "../../webcore/types/UnknowQueryResult";

type Props = {
  results: UnknowQueryResult[];
};

export default function SqlResultViewer({ results }: Props) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [paginationModel, setPaginationModel] = React.useState<
    GridPaginationModel | undefined
  >(undefined);
  const [filterModel, setFilterModel] = React.useState<
    GridFilterModel | undefined
  >(undefined);
  const [sortModel, setSortModel] = React.useState<GridSortModel | undefined>(
    undefined,
  );

  const activeResult = results[activeIndex];

  // ========= build datagrid data =========
  const { rows, columns } = useMemo(() => {
    if (!activeResult || activeResult.type !== "select") {
      return { rows: [], columns: [] };
    }

    const cols: GridColDef[] = activeResult.columns.map((col) => ({
      field: col,
      headerName: col,
      flex: 1,
    }));

    const rows = activeResult.rows.map((r, index) => {
      const obj: any = { id: index };

      activeResult.columns.forEach((col, i) => {
        obj[col] = r[i];
      });

      return obj;
    });

    return { rows, columns: cols };
  }, [activeResult]);

  useEffect(() => {
    if (!results.length) {
      return;
    }
    setActiveIndex(0);
  }, [results]);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {results.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            borderBottom: "1px solid #333",
            p: 1,
            flexWrap: "wrap",
          }}
        >
          {results.map((r, index) => (
            <Button
              key={index}
              size="small"
              variant={index === activeIndex ? "contained" : "outlined"}
              onClick={() => setActiveIndex(index)}
              sx={{
                minWidth: 0,
                px: 0.75,
                py: 0.25,
                fontSize: "11px",
                lineHeight: 1.2,
                textTransform: "none",
              }}
            >
              {r.type.toUpperCase()} #{index + 1}
            </Button>
          ))}
        </Box>
      )}
      {/* ===== EMPTY ===== */}
      {results.length === 0 && (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
          }}
        >
          <Typography>No result</Typography>
        </Box>
      )}

      {/* ===== HAS RESULT ===== */}
      {results.length > 0 && activeResult && (
        <>
          {/* SELECT */}
          {activeResult.type === "select" && (
            <Box
              sx={{
                height: window.innerHeight - 280,
                width: "100%",
              }}
            >
              <DataGrid
                sx={{
                  "--DataGrid-t-header-background-base": "#000 !important",
                  "--DataGrid-t-color-foreground-base": "#b8b8b8 !important",
                  "--DataGrid-t-color-border-base": "#303030 !important",
                  "--DataGrid-t-color-background-base": "#232323 !important",
                  "--DataGrid-t-color-background-overlay": "#1e1e1e !important",
                }}
                rows={rows}
                columns={columns}
                showToolbar
                filterModel={filterModel}
                paginationModel={paginationModel}
                sortModel={sortModel}
                slotProps={{
                  toolbar: {
                    // setRows,
                    // setRowModesModel,
                    csvOptions: { fileName: "queryresult" },
                    printOptions: {
                      disableToolbarButton: true, // This disables the Print button
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* CHANGE */}
          {activeResult.type === "change" && (
            <Box sx={{ p: 2 }}>
              <Typography>
                ✅ {activeResult.rowsAffected} row(s) affected
              </Typography>
            </Box>
          )}

          {/* ERROR */}
          {activeResult.type === "error" && (
            <Box sx={{ p: 2 }}>
              <Typography color="error">❌ {activeResult.message}</Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
