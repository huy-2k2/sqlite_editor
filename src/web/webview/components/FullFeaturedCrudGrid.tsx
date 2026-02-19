import * as React from "react";
import { Table } from "./TableDataManager";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  gridEditRowsStateSelector,
  useGridSelector,
  useGridApiContext,
  GridActionsCell,
  GridRenderCellParams,
  GridActionsCellItem,
  GridFilterModel,
  GridSortModel,
  GridColType,
  GridValidRowModel,
} from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from "@mui/x-data-grid-generator";
import { SqliteUtil } from "../../webcore/sqlite";
import {} from "../../utilFuntion";

const roles = ["Market", "Finance", "Development"];
const randomRole = () => {
  return randomArrayItem(roles);
};

interface FullFeaturedCrudGridProps {
  listTable: Array<Table> | undefined;
  tableSelected: string | undefined;
  setListTableSelected(tables: Array<Table>): void;
}

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
}

interface ActionHandlers {
  handleCancelClick: (id: GridRowId) => void;
  handleEditClick: (id: GridRowId) => void;
  handleSaveClick: (id: GridRowId) => void;
}

const ActionHandlersContext = React.createContext<ActionHandlers>({
  handleCancelClick: () => {},
  handleEditClick: () => {},
  handleSaveClick: () => {},
});

function ActionsCell(props: GridRenderCellParams) {
  const apiRef = useGridApiContext();
  const rowModesModel = useGridSelector(apiRef, gridEditRowsStateSelector);
  const isInEditMode = typeof rowModesModel[props.id] !== "undefined";

  const { handleSaveClick, handleCancelClick, handleEditClick } =
    React.useContext(ActionHandlersContext);

  return (
    <GridActionsCell {...props}>
      {isInEditMode ? (
        <React.Fragment>
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            material={{ sx: { color: "primary.main" } }}
            onClick={() => handleSaveClick(props.id)}
          />
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={() => handleCancelClick(props.id)}
            color="inherit"
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditClick(props.id)}
            color="inherit"
          />
        </React.Fragment>
      )}
    </GridActionsCell>
  );
}

const FullFeaturedCrudGrid: React.FC<FullFeaturedCrudGridProps> = ({
  listTable,
  tableSelected,
  setListTableSelected,
}) => {
  const [columns, setColumns] = React.useState<GridColDef[]>([]);

  React.useEffect(() => {
    if (!tableSelected || !listTable?.length) return;

    const colsRaw = SqliteUtil.getTableSchema(tableSelected);

    const cols: GridColDef[] = [];

    colsRaw.forEach((c) => {
      cols.push({
        field: c.name,
        headerName: c.name,
        type: mapSqliteTypeToMuiType(c.type),
        editable: isSqliteTypeEditable(c.type),
      });
    });

    const rowsRaw = SqliteUtil.getFullRows(tableSelected);

    console.log(rowsRaw);

    if (rowsRaw?.values?.length) {
      const rowsConvert: GridValidRowModel[] = rowsRaw.values.map((row) => {
        if (typeof row !== "object" || row === null) {
          return {};
        }

        let rowConvert: any = {};
        rowsRaw.lc.forEach((l, i) => {
          rowConvert[l] = row[i];
        });

        if (
          rowConvert &&
          typeof rowConvert === "object" &&
          !("id" in rowConvert)
        ) {
          rowConvert.id = randomId();
        }

        return rowConvert as GridValidRowModel;
      });

      setRows(rowsConvert);
    }

    setColumns(cols);
  }, [tableSelected, listTable]);

  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const actionHandlers = React.useMemo<ActionHandlers>(
    () => ({
      handleEditClick: (id: GridRowId) => {
        setRowModesModel((prevRowModesModel) => ({
          ...prevRowModesModel,
          [id]: { mode: GridRowModes.Edit },
        }));
      },
      handleSaveClick: (id: GridRowId) => {
        setRowModesModel((prevRowModesModel) => ({
          ...prevRowModesModel,
          [id]: { mode: GridRowModes.View },
        }));
      },
      handleCancelClick: (id: GridRowId) => {
        setRowModesModel((prevRowModesModel) => {
          return {
            ...prevRowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
          };
        });

        setRows((prevRows) => {
          return prevRows;
        });
      },
    }),
    [],
  );

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)),
    );
    return updatedRow;
  };

  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <ActionHandlersContext.Provider value={actionHandlers}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </ActionHandlersContext.Provider>
    </Box>
  );
};

export default FullFeaturedCrudGrid;

function mapSqliteTypeToMuiType(sqliteType?: string | null): GridColType {
  if (!sqliteType) return "string";

  const type = sqliteType.toUpperCase();

  // number
  if (
    type.includes("INT") ||
    type.includes("REAL") ||
    type.includes("FLOAT") ||
    type.includes("DOUBLE") ||
    type.includes("NUMERIC") ||
    type.includes("DECIMAL")
  ) {
    return "number";
  }

  // boolean
  if (type.includes("BOOL")) {
    return "boolean";
  }

  // if (type.includes("DATETIME") || type.includes("TIMESTAMP")) {
  //   return "dateTime";
  // }

  // if (type === "DATE") {
  //   return "date";
  // }

  // long text
  if (type.includes("CLOB")) {
    return "longText";
  }

  // custom / blob / json
  if (type.includes("BLOB") || type.includes("JSON")) {
    return "custom";
  }

  // default string
  return "string";
}

function isSqliteTypeEditable(sqliteType?: string | null): boolean {
  if (!sqliteType) return false;

  const type = sqliteType.toUpperCase();

  // number
  if (
    type.includes("INT") ||
    type.includes("REAL") ||
    type.includes("FLOAT") ||
    type.includes("DOUBLE") ||
    type.includes("NUMERIC") ||
    type.includes("DECIMAL")
  ) {
    return true;
  }

  // string
  if (type.includes("TEXT") || type.includes("CHAR") || type.includes("CLOB")) {
    return true;
  }

  // if (
  //   type === "DATE" ||
  //   type.includes("DATETIME") ||
  //   type.includes("TIMESTAMP")
  // ) {
  //   return true;
  // }

  return false;
}

function calcItemWidth(count: number): number {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error("count must be a positive integer");
  }

  return (window.innerWidth - 280) / count;
}
