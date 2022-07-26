import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
    width: '100px'
  },
  {
    name: "Coverimage",
    selector: (row) => row.coverimage,
    cell: row => <img src={row.coverimage} width={100} alt={row.name}></img>
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: '150px'
  },
  {
    name: "Detail",
    selector: (row) => row.detail,
    sortable: true,
    width: '750px'
  },
  {
    name: "Latitude",
    selector: (row) => row.latitude,
    sortable: true,
    width: '150px'
  },
  {
    name: "longtitude",
    selector: (row) => row.longtitude,
    sortable: true,
  },
];

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState("");
  const [sortColumnDir, setSortColumnDir] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);

    var url = `http://localhost:5000/api/attractions?page=${page}&per_page=${perPage}`;

    if(search){
      url += `&search=${search}`;
    }

    if (sortColumn) {
      url += `&sort_column=${sortColumn}&sort_direction=${sortColumnDir}`;
    }

    const response = await axios.get(url);

    setData(response.data.data);
    setTotalRows(response.data.total);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const handleSort = (column, sortDirection) => {
    console.log(column, sortDirection);
    setSortColumn(column.name);
    setSortColumnDir(sortDirection);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  useEffect(() => {
    fetchData(); // fetch page 1 of users
  }, [page, perPage, sortColumn, sortColumnDir]);

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <label>
          Search:
          <input type="text" name="search" onChange={handleSearchChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <DataTable
        title="Attractions"
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onSort={handleSort}
      />
    </div>
  );
}

export default App;
