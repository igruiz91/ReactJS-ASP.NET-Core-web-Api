import React, { useEffect, useState } from "react";
import { variables } from "../lib/Variables";
import { IconDelete, IconEdit } from "./Department";

const Employee = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeesUnfiltered, setEmployeesUnfiltered] = useState([]);

  const [employeeId, setEmployeeId] = useState("");
  const [employeeIdFilter, setEmployeeIdFilter] = useState();
  const [employeeName, setEmployeeName] = useState("");
  const [employeeNameFilter, setEmployeeNameFilter] = useState("");
  const [department, setDepartment] = useState();
  const [departmentFilter, setDepartmentFilter] = useState(0);
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [photoFileName, setPhotoFileName] = useState("anonymous.png");
  const [edit, setEdit] = useState(false);
  const [apiCall, setApiCall] = useState(true);
  const [param, setParam] = useState("");
  const [asc, setAsc] = useState(true);

  useEffect(() => {
    setApiCall(false);
    const controller = new AbortController();
    const signal = controller.signal;

    const constFetchEmployees = async () => {
      try {
        await fetch(variables.API_URL + "/employee", { signal })
          .then((res) => res.json())
          .then((data) => {
            setEmployees(data);
            setEmployeesUnfiltered(data);
          });
      } catch (err) {
        console.log(err);
      }
    };

    const constFetchDepartments = async () => {
      try {
        await fetch(variables.API_URL + "/department", { signal })
          .then((res) => res.json())
          .then((data) => {
            setDepartments(data);
          });
      } catch (err) {
        console.log(err);
      }
    };

    constFetchEmployees();
    constFetchDepartments();

    return () => {
      controller.abort();
    };
  }, [apiCall]);

  const clearData = () => {
    setEmployeeId(0);
    setEmployeeName("");
    setDepartment(0);
    setDateOfJoining("");
    setPhotoFileName("anonymous.png");
    setEdit(false);
  };

  const getEmployee = async (id) => {
    await fetch(variables.API_URL + "/employee/" + id)
      .then((res) => res.json())
      .then((data) => {
        data = data[0];
        setEmployeeId(data.EmployeeId);
        setEmployeeName(data.EmployeeName);
        setDepartment(data.Department);
        setDateOfJoining(data.DateOfJoining);
        setPhotoFileName(data.PhotoFileName);
        setEdit(true);
        setApiCall(true);
      })
      .catch((err) => console.log(err));
  };

  const addEmployee = async (employee) => {
    await fetch(variables.API_URL + "/employee", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(employee),
    })
      .then((res) => {
        res.json({ employee });
        setEdit(false);
        setApiCall(true);
        clearData();
      })
      .catch((err) => console.log(err));
  };

  const editEmployee = async (employee) => {
    await fetch(variables.API_URL + "/employee", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(employee),
    })
      .then((res) => {
        res.json({ body: JSON.stringify({ employeeId, employeeName }) });
        clearData();
        setEdit(false);
        setApiCall(true);
      })
      .catch((err) => console.log(err));
  };

  const deleteEmployee = async (id) => {
    await fetch(variables.API_URL + "/employee/" + id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then(() => {
        setApiCall(true);
      })
      .catch((err) => console.log(err));
  };

  const imageUpload = (e) => {
    console.log(e.target);
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);

    fetch(variables.API_URL + "/employee/savefile", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPhotoFileName(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sortData = (key, asc) => {
    var sortData = [...employeesUnfiltered].sort((a, b) => {
      if (asc) {
        return a[key].toString().toLowerCase() > b[key].toString().toLowerCase()
          ? 1
          : a[key].toString().toLowerCase() < b[key].toString().toLowerCase()
          ? -1
          : 0;
      } else {
        return b[key].toString().toLowerCase() > a[key].toString().toLowerCase()
          ? 1
          : b[key].toString().toLowerCase() < a[key].toString().toLowerCase()
          ? -1
          : 0;
      }
    });
    setEmployees(sortData);
  };

  const handleFilterEmployeeId = (e) => {
    setEmployeeIdFilter(e.target.value);
  };

  const handleFilterEmployeeName = (e) => {
    setEmployeeNameFilter(e.target.value);
  };

  const handleFilterDepartment = (e) => {
    setDepartmentFilter(e.target.value);
  };

  const handleSortEmployees = (prop, asc) => {
    setParam(prop);
    setAsc(asc);
  };

  useEffect(() => {
    filterBy();
  }, [employeeIdFilter, employeeNameFilter, departmentFilter]);

    useEffect(() => {
      sortData(param, asc);
    }, [param,asc]);

  const filterBy = () => {
    let filterId = employeeIdFilter || "";
    let filterName = employeeNameFilter || "";
    let filterDepartment = departmentFilter || "";
    let filteredEmployees = employeesUnfiltered;
    filteredEmployees = filteredEmployees.filter((employee) => {
      return (
        employee.EmployeeId.toString()
          .toLowerCase()
          .includes(filterId.toString().trim()) &&
        employee.EmployeeName.toString()
          .toLowerCase()
          .includes(filterName.toString().trim().toLowerCase()) &&
        employee.Department.toString()
          .toLowerCase()
          .includes(filterDepartment.toString().trim().toLowerCase())
      );
    });
    setEmployees(filteredEmployees);
  };

  return (
    <div className="container">
      <button
        className="btn btn-primary float-end mt-3"
        data-bs-toggle="modal"
        data-bs-target="#modal"
        onClick={() => setEdit(false)}
      >
        Add employee
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <div className="">Employee Id</div>
                <div className="d-flex flex-column mx-3">
                  <a
                    href
                    onClick={() => handleSortEmployees("EmployeeId", true)}
                  >
                    <IconUpArrow />
                  </a>
                  <a
                    href
                    onClick={() => handleSortEmployees("EmployeeId", false)}
                  >
                    <IconDownArrow />
                  </a>
                </div>
              </div>
            </th>
            <th>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <div className="">Employee Name</div>
                <div className="d-flex flex-column mx-3">
                  <a
                    href
                    onClick={() => handleSortEmployees("EmployeeName", true)}
                  >
                    <IconUpArrow />
                  </a>
                  <a
                    href
                    onClick={() => handleSortEmployees("EmployeeName", false)}
                  >
                    <IconDownArrow />
                  </a>
                </div>
              </div>
            </th>
            <th>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <div className="">Department</div>
                <div className="d-flex flex-column mx-3">
                  <a
                    href
                    onClick={() => handleSortEmployees("Department", true)}
                  >
                    <IconUpArrow />
                  </a>
                  <a
                    href
                    onClick={() => handleSortEmployees("Department", false)}
                  >
                    <IconDownArrow />
                  </a>
                </div>
              </div>
            </th>
            <th>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <div className="">Date of joining</div>
                <div className="d-flex flex-column mx-3">
                  <a
                    href
                    onClick={() => handleSortEmployees("DateOfJoining", true)}
                  >
                    <IconUpArrow />
                  </a>
                  <a
                    href
                    onClick={() => handleSortEmployees("DateOfJoining", false)}
                  >
                    <IconDownArrow />
                  </a>
                </div>
              </div>
            </th>
            <th>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <div className="">Image</div>
                <div className="d-flex flex-column mx-3">
                  <a
                    href
                    onClick={() => handleSortEmployees("PhotoFileName", true)}
                  >
                    <IconUpArrow />
                  </a>
                  <a
                    href
                    onClick={() => handleSortEmployees("PhotoFileName", false)}
                  >
                    <IconDownArrow />
                  </a>
                </div>
              </div>
            </th>
            <th>
              <div className="d-flex flex-row justify-content-center align-items-start">
                <div className="">Options</div>
                <div className="d-flex flex-column mx-3"></div>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee, index) => {
            const {
              EmployeeId,
              EmployeeName,
              Department,
              DateOfJoining,
              PhotoFileName,
            } = employee;
            return (
              <tr key={index}>
                <td>{EmployeeId}</td>
                <td>{EmployeeName}</td>
                <td>{Department}</td>
                <td>{DateOfJoining}</td>
                <td>{PhotoFileName}</td>
                <td>
                  <button
                    className="btn btn-light mr-1"
                    onClick={() => getEmployee(EmployeeId)}
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                  >
                    <IconEdit />
                    Edit
                  </button>

                  <button
                    className="btn btn-light mr-1"
                    onClick={() => deleteEmployee(EmployeeId)}
                  >
                    <IconDelete />
                    Delete
                  </button>
                  <a
                    className="btn btn-light mr-1"
                    href={variables.PHOTO_URL + PhotoFileName}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconImage />
                    Image
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="filter by id"
                onChange={handleFilterEmployeeId}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="filter by name"
                onChange={handleFilterEmployeeName}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="filter by department"
                onChange={handleFilterDepartment}
              />
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div className="modal fade" id="modal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {edit ? `Edit Employee: ${employeeName}` : "Add Employee"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setEdit(false);
                  clearData();
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex flex-row bd-highlight mb-3">
                <div className="p-2 w-50 bd-highlight">
                  <div className="col input-group mb-3">
                    <span className="input-group-text">Name:</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Employee name"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                    />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Department:</span>
                    <select
                      class="form-select"
                      aria-label="Default select example"
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option selected value={0}>
                        Select Department
                      </option>
                      {departments.map((department, index) => {
                        const { DepartmentId, DepartmentName } = department;
                        return (
                          <option value={DepartmentName}>
                            {DepartmentId}- {DepartmentName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text">Date of join:</span>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Date of joining"
                      value={dateOfJoining}
                      onChange={(e) => setDateOfJoining(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-3" onChange={imageUpload}>
                    <input type="file" className="form-control" />
                    <label className="input-group-text">{photoFileName}</label>
                  </div>
                </div>
                <div className="p-2 w-50 bd-highlight">
                  <img
                    alt="employee-avatar"
                    width="150px"
                    height="150px"
                    src={variables.PHOTO_URL + photoFileName}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => clearData()}
                >
                  Close
                </button>
                {edit ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={() =>
                      editEmployee({
                        employeeId,
                        employeeName,
                        department,
                        dateOfJoining,
                        photoFileName,
                      })
                    }
                  >
                    Save changes
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={() =>
                      addEmployee({
                        employeeName,
                        department,
                        dateOfJoining,
                        photoFileName,
                      })
                    }
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const IconImage = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fillRule="currentColor"
    className="bi bi-card-image"
    viewBox="0 0 16 16"
  >
    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
  </svg>
);

export const IconUpArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-caret-up-square-fill"
    viewBox="0 0 16 16"
  >
    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4 9h8a.5.5 0 0 0 .374-.832l-4-4.5a.5.5 0 0 0-.748 0l-4 4.5A.5.5 0 0 0 4 11z" />
  </svg>
);

export const IconDownArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-caret-down-square-fill"
    viewBox="0 0 16 16"
  >
    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4 4a.5.5 0 0 0-.374.832l4 4.5a.5.5 0 0 0 .748 0l4-4.5A.5.5 0 0 0 12 6H4z" />
  </svg>
);

export default Employee;
