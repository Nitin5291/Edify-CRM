import React, { useRef, useState } from "react";
import Loader from "./Loader";
import { AgGridReact } from "ag-grid-react";
import { dataFilter } from "@/CommonData";
import { ColDef } from "ag-grid-community";

const Table = ({
  isLoader,
  initialColumnDefs,
  datas,
  searchValue,
  noDataFoundMsg,
  setSelectedCell,
  handelOnSet,
  pagination = true,
  heightDisable = false,
}: {
  isLoader?: boolean;
  initialColumnDefs?: any;
  datas?: any;
  searchValue?: string;
  noDataFoundMsg?: string;
  setSelectedCell?: any;
  handelOnSet?: any;
  pagination?: boolean;
  heightDisable?: boolean;
}) => {
  const tableRef = useRef<any>(null);
  const [columnDefs] = useState<ColDef[]>(initialColumnDefs);
  const filteredActivities = React.useMemo(() => {
    if (datas?.length > 0) {
      if (searchValue) {
        return dataFilter(
          datas?.map((item: any) => ({
            ...item,
          })),
          searchValue,
          ["name"]
        );
      } else {
        return datas;
      }
    } else {
      return [];
    }
  }, [datas, searchValue]);

  const defaultColDef = {
    sortable: true,
    flex: 1,
    headerComponentParams: { placeholder: "Enter Member ID" },
    resizable: true,
    suppressMovable: true,
    //cellClass: "uppercase",
    cellStyle: {
      color: "#181818",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "400",
      fontFamily: "Inter",
    },
    headerClass: "whitespace-normal",
    wrapText: true,
    autoHeight: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };
  const handleCellClicked = (param: any) => {
    if (param?.rowIndex !== null && param?.data !== undefined) {
      handelOnSet(param?.rowIndex, [param?.data]);
    }
  };

  const gridOptions = {
    rowClass: "custom-row-hover",
    // domLayout: 'autoHeight',
  };

  const handleSelectionChanged = (e: any) => {
    const selectedData = e.api.getSelectedRows();
    if (selectedData.length > 0) {
      //    setFieldStatus(false)
      setSelectedCell(selectedData);
    } else {
      //    setFieldStatus(true)
      setSelectedCell([]);
    }
  };

  const onGridReady = (params: { api: any }) => {
    tableRef.current = params.api;
  };

  return (
    <div className="w-full gap-6 xl:h-full">
      <div
        className={`flex ${heightDisable ? "h-full" : "min-h-[68vh] xl:min-h-[70vh] xl:h-full"}  w-${isLoader ? "[fit-content]" : "full"
          } mx-auto ag-theme-alpine`}
      >
        {isLoader ? (
          <Loader size={10} />
        ) : (
          <div className="relative overflow-auto" style={{ width: "100%" }}>
            <AgGridReact
              ref={tableRef}
              rowData={filteredActivities}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              enableBrowserTooltips={true}
              //tooltipShowDelay={{ tooltipShowDelay: 2 }}
              rowSelection="multiple"
              pagination={pagination}
              onCellClicked={handleCellClicked}
              gridOptions={gridOptions}
              paginationAutoPageSize={true}
              onSelectionChanged={(e) => handleSelectionChanged(e)}
              onGridReady={onGridReady}
              animateRows={true}
              suppressRowClickSelection={true}
              overlayNoRowsTemplate={
                noDataFoundMsg ? noDataFoundMsg : "data no found"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
